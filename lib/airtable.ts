// Server-only. Never import this from a "use client" component — the
// Airtable token must stay off the browser bundle entirely.

const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME;

export function airtableConfigured() {
  return Boolean(AIRTABLE_TOKEN && AIRTABLE_BASE_ID && AIRTABLE_TABLE_NAME);
}

function airtableUrl(query?: string) {
  const base = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME!)}`;
  return query ? `${base}?${query}` : base;
}

function authHeaders(json = false): Record<string, string> {
  const headers: Record<string, string> = { Authorization: `Bearer ${AIRTABLE_TOKEN}` };
  if (json) headers["Content-Type"] = "application/json";
  return headers;
}

// Escapes double quotes for safe interpolation into an Airtable formula string.
export function escapeFormulaValue(value: string) {
  return value.replace(/"/g, '\\"');
}

export interface AirtableRecord {
  id: string;
  createdTime: string;
  fields: Record<string, unknown>;
}

export async function findRecordByFormula(formula: string): Promise<AirtableRecord | null> {
  const res = await fetch(airtableUrl(`filterByFormula=${encodeURIComponent(formula)}&maxRecords=1`), {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(`Airtable lookup failed with status ${res.status}`);
  const body = (await res.json()) as { records: AirtableRecord[] };
  return body.records[0] ?? null;
}

export async function listRecordsByFormula(formula: string): Promise<AirtableRecord[]> {
  const records: AirtableRecord[] = [];
  let offset: string | undefined;

  do {
    const query = [`filterByFormula=${encodeURIComponent(formula)}`];
    if (offset) query.push(`offset=${encodeURIComponent(offset)}`);
    const res = await fetch(airtableUrl(query.join("&")), { headers: authHeaders() });
    if (!res.ok) throw new Error(`Airtable list failed with status ${res.status}`);
    const body = (await res.json()) as { records: AirtableRecord[]; offset?: string };
    records.push(...body.records);
    offset = body.offset;
  } while (offset);

  return records;
}

export async function createRecord(fields: Record<string, unknown>): Promise<AirtableRecord> {
  const res = await fetch(airtableUrl(), {
    method: "POST",
    headers: authHeaders(true),
    body: JSON.stringify({ records: [{ fields }], typecast: true }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Airtable create failed with status ${res.status}: ${body}`);
  }
  const data = (await res.json()) as { records: AirtableRecord[] };
  return data.records[0];
}

export async function updateRecord(recordId: string, fields: Record<string, unknown>): Promise<AirtableRecord> {
  const res = await fetch(airtableUrl(), {
    method: "PATCH",
    headers: authHeaders(true),
    body: JSON.stringify({ records: [{ id: recordId, fields }], typecast: true }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Airtable update failed with status ${res.status}: ${body}`);
  }
  const data = (await res.json()) as { records: AirtableRecord[] };
  return data.records[0];
}

export interface Invite {
  recordId: string;
  name: string;
  maxGuests: number;
}

// Looks up a pre-seeded invite row by its "Invite code" column. The Name on
// that row (set by the couple when the invite was generated) is the guest's
// fixed, non-editable display name — they can't change it when RSVPing.
export async function findInviteByCode(code: string): Promise<Invite | null> {
  const record = await findRecordByFormula(`{Invite code} = "${escapeFormulaValue(code)}"`);
  if (!record) return null;

  const name = typeof record.fields["Name"] === "string" ? (record.fields["Name"] as string) : "";
  if (!name) return null;

  const maxGuestsRaw = record.fields["Max guests"];
  const maxGuests = typeof maxGuestsRaw === "number" && maxGuestsRaw >= 1 ? Math.floor(maxGuestsRaw) : 1;

  return { recordId: record.id, name, maxGuests };
}

const INVITE_CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const INVITE_CODE_LENGTH = 6;
const MAX_INVITE_CODE_ATTEMPTS = 8;

function generateInviteCode(): string {
  const bytes = new Uint8Array(INVITE_CODE_LENGTH);
  crypto.getRandomValues(bytes);
  let code = "";
  for (let i = 0; i < INVITE_CODE_LENGTH; i++) {
    code += INVITE_CODE_ALPHABET[bytes[i] % INVITE_CODE_ALPHABET.length];
  }
  return code;
}

async function generateUniqueInviteCode(): Promise<string> {
  for (let attempt = 0; attempt < MAX_INVITE_CODE_ATTEMPTS; attempt++) {
    const code = generateInviteCode();
    if (!(await findInviteByCode(code))) return code;
  }
  throw new Error("Could not generate a unique invite code after several attempts.");
}

export interface CreatedInvite {
  recordId: string;
  inviteCode: string;
  maxGuests: number;
  label: string;
}

// Creates a new pre-seeded invite row. `label` becomes the guest's fixed,
// non-editable display name on the RSVP form and in their confirmation email
// — it's guest-facing, so the caller (the admin API) requires it to be set.
export async function createInvite(maxGuests: number, label: string): Promise<CreatedInvite> {
  const inviteCode = await generateUniqueInviteCode();
  const record = await createRecord({
    Name: label,
    "Max guests": maxGuests,
    "Invite code": inviteCode,
  });
  return { recordId: record.id, inviteCode, maxGuests, label };
}

export interface InviteListItem {
  recordId: string;
  createdTime: string;
  label: string;
  maxGuests: number;
  inviteCode: string;
  attending: "yes" | "no" | null;
  guestsConfirmed: number | null;
}

// Lists every row that has an Invite code set — i.e. every invite the couple
// has generated, whether or not the guest has responded yet.
export async function listInvites(): Promise<InviteListItem[]> {
  const records = await listRecordsByFormula(`NOT({Invite code} = "")`);
  return records
    .map((record): InviteListItem => {
      const fields = record.fields;
      const attendingRaw = fields["Will you attend?"];
      const attending = attendingRaw === "Yes" ? "yes" : attendingRaw === "No" ? "no" : null;
      const guestsRaw = fields["Number of guests"];

      return {
        recordId: record.id,
        createdTime: record.createdTime,
        label: typeof fields["Name"] === "string" ? (fields["Name"] as string) : "",
        maxGuests: typeof fields["Max guests"] === "number" ? (fields["Max guests"] as number) : 0,
        inviteCode: typeof fields["Invite code"] === "string" ? (fields["Invite code"] as string) : "",
        attending,
        guestsConfirmed: typeof guestsRaw === "number" ? guestsRaw : null,
      };
    })
    .sort((a, b) => b.createdTime.localeCompare(a.createdTime));
}
