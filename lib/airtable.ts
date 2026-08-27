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

// Looks up a pre-seeded invite row by its "Invite code" column. The couple
// adds these rows manually in Airtable ahead of time (Name + Invite code +
// Max guests), then shares each family's personal /rsvp/[code] link.
export async function findInviteByCode(code: string): Promise<Invite | null> {
  const record = await findRecordByFormula(`{Invite code} = "${escapeFormulaValue(code)}"`);
  if (!record) return null;

  const name = typeof record.fields["Name"] === "string" ? (record.fields["Name"] as string) : "";
  if (!name) return null;

  const maxGuestsRaw = record.fields["Max guests"];
  const maxGuests = typeof maxGuestsRaw === "number" && maxGuestsRaw >= 1 ? Math.floor(maxGuestsRaw) : 1;

  return { recordId: record.id, name, maxGuests };
}
