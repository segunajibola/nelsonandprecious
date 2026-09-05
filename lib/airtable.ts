// Server-only. Never import this from a "use client" component — the
// Airtable token must stay off the browser bundle entirely.

const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME;
const AIRTABLE_GUESTBOOK_TABLE = process.env.AIRTABLE_GUESTBOOK_TABLE;
const AIRTABLE_SONGS_TABLE = process.env.AIRTABLE_SONGS_TABLE;
const AIRTABLE_PHOTOS_TABLE = process.env.AIRTABLE_PHOTOS_TABLE;

export function airtableConfigured() {
  return Boolean(AIRTABLE_TOKEN && AIRTABLE_BASE_ID && AIRTABLE_TABLE_NAME);
}

export function guestbookConfigured() {
  return Boolean(AIRTABLE_TOKEN && AIRTABLE_BASE_ID && AIRTABLE_GUESTBOOK_TABLE);
}

export function songsConfigured() {
  return Boolean(AIRTABLE_TOKEN && AIRTABLE_BASE_ID && AIRTABLE_SONGS_TABLE);
}

export function photosConfigured() {
  return Boolean(AIRTABLE_TOKEN && AIRTABLE_BASE_ID && AIRTABLE_PHOTOS_TABLE);
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

export async function getRecord(recordId: string): Promise<AirtableRecord | null> {
  const res = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_NAME!)}/${recordId}`, {
    headers: authHeaders(),
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Airtable get failed with status ${res.status}`);
  return (await res.json()) as AirtableRecord;
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

export interface GuestRecord {
  recordId: string;
  name: string;
  email: string;
  attending: "yes" | "no" | null;
  guests: number | null;
  accessCode: string | null;
  qrToken: string | null;
  checkedIn: boolean;
  checkInTime: string | null;
}

function mapGuestRecord(record: AirtableRecord): GuestRecord {
  const fields = record.fields;
  const attendingRaw = fields["Will you attend?"];
  const guestsRaw = fields["Number of guests"];

  return {
    recordId: record.id,
    name: typeof fields["Name"] === "string" ? (fields["Name"] as string) : "",
    email: typeof fields["Email"] === "string" ? (fields["Email"] as string) : "",
    attending: attendingRaw === "Yes" ? "yes" : attendingRaw === "No" ? "no" : null,
    guests: typeof guestsRaw === "number" ? guestsRaw : null,
    accessCode: typeof fields["Access code"] === "string" ? (fields["Access code"] as string) : null,
    qrToken: typeof fields["QR code"] === "string" ? (fields["QR code"] as string) : null,
    checkedIn: fields["Checked In"] === true,
    checkInTime: typeof fields["Check-In time"] === "string" ? (fields["Check-In time"] as string) : null,
  };
}

// Richer lookup than findInviteByCode — used by the "resend my confirmation"
// flow, which needs the email on file and whatever the guest already
// answered (if anything) rather than just the invite's cap.
export async function findGuestByInviteCode(code: string): Promise<GuestRecord | null> {
  const record = await findRecordByFormula(`{Invite code} = "${escapeFormulaValue(code)}"`);
  return record ? mapGuestRecord(record) : null;
}

// Looks up a guest by the QR token embedded in their check-in QR code (see
// /checkin/[token]). Public-facing by design — same trust model as the
// invite link and the resend flow: the token is a long random secret only
// the guest ever sees (via their confirmation email/QR image), so
// possessing it is the authorization. This lets any door staff member's
// ordinary phone camera scan-and-verify a guest without an admin login.
export async function findGuestByQrToken(token: string): Promise<GuestRecord | null> {
  const record = await findRecordByFormula(`{QR code} = "${escapeFormulaValue(token)}"`);
  return record ? mapGuestRecord(record) : null;
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
// `email`, if given, pre-fills the same Email column the RSVP form later
// writes to — it's what lets the "remind guests who haven't RSVP'd" feature
// reach someone before they've ever submitted the form themselves.
export async function createInvite(
  maxGuests: number,
  label: string,
  email?: string,
): Promise<CreatedInvite> {
  const inviteCode = await generateUniqueInviteCode();
  const fields: Record<string, unknown> = {
    Name: label,
    "Max guests": maxGuests,
    "Invite code": inviteCode,
  };
  if (email) fields["Email"] = email;
  const record = await createRecord(fields);
  return { recordId: record.id, inviteCode, maxGuests, label };
}

export interface InviteListItem {
  recordId: string;
  createdTime: string;
  label: string;
  maxGuests: number;
  inviteCode: string;
  email: string | null;
  attending: "yes" | "no" | null;
  guestsConfirmed: number | null;
  accessCode: string | null;
  qrToken: string | null;
  checkedIn: boolean;
  checkInTime: string | null;
}

// Lists every row that has an Invite code set — i.e. every invite the couple
// has generated, whether or not the guest has responded yet. Powers both the
// invite-generation admin page and the check-in dashboard (which does all of
// its searching/matching client-side against this one fetched list).
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
        email: typeof fields["Email"] === "string" ? (fields["Email"] as string) : null,
        attending,
        guestsConfirmed: typeof guestsRaw === "number" ? guestsRaw : null,
        accessCode: typeof fields["Access code"] === "string" ? (fields["Access code"] as string) : null,
        qrToken: typeof fields["QR code"] === "string" ? (fields["QR code"] as string) : null,
        checkedIn: fields["Checked In"] === true,
        checkInTime: typeof fields["Check-In time"] === "string" ? (fields["Check-In time"] as string) : null,
      };
    })
    .sort((a, b) => b.createdTime.localeCompare(a.createdTime));
}

export interface CheckInResult {
  recordId: string;
  name: string;
  guests: number;
  alreadyCheckedIn: boolean;
  checkInTime: string;
}

// Idempotent: if the guest was already checked in, this returns their
// original check-in time untouched rather than overwriting it — the
// "prevent double entry" behavior the whole system exists for.
export async function checkInGuest(recordId: string): Promise<CheckInResult> {
  const record = await getRecord(recordId);
  if (!record) throw new Error("Guest record not found.");

  const fields = record.fields;
  const name = typeof fields["Name"] === "string" ? (fields["Name"] as string) : "";
  const guests = typeof fields["Number of guests"] === "number" ? (fields["Number of guests"] as number) : 0;
  const alreadyCheckedIn = fields["Checked In"] === true;

  if (alreadyCheckedIn) {
    const existingTime = typeof fields["Check-In time"] === "string" ? (fields["Check-In time"] as string) : "";
    return { recordId, name, guests, alreadyCheckedIn: true, checkInTime: existingTime };
  }

  const checkInTime = new Date().toISOString();
  await updateRecord(recordId, { "Checked In": true, "Check-In time": checkInTime });
  return { recordId, name, guests, alreadyCheckedIn: false, checkInTime };
}

// --- Generic multi-table helpers -------------------------------------------
// The functions above are all implicitly bound to AIRTABLE_TABLE_NAME (the
// invites table). Guestbook/songs/photos live in their own tables in the
// same base, so these take an explicit table name instead of hardcoding one.

function tableUrl(table: string, query?: string) {
  const base = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(table)}`;
  return query ? `${base}?${query}` : base;
}

async function listTableRecords(table: string, formula?: string): Promise<AirtableRecord[]> {
  const records: AirtableRecord[] = [];
  let offset: string | undefined;

  do {
    const query: string[] = [];
    if (formula) query.push(`filterByFormula=${encodeURIComponent(formula)}`);
    if (offset) query.push(`offset=${encodeURIComponent(offset)}`);
    const res = await fetch(tableUrl(table, query.join("&")), { headers: authHeaders() });
    if (!res.ok) throw new Error(`Airtable list failed with status ${res.status}`);
    const body = (await res.json()) as { records: AirtableRecord[]; offset?: string };
    records.push(...body.records);
    offset = body.offset;
  } while (offset);

  return records;
}

async function createTableRecord(table: string, fields: Record<string, unknown>): Promise<AirtableRecord> {
  const res = await fetch(tableUrl(table), {
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

async function updateTableRecord(
  table: string,
  recordId: string,
  fields: Record<string, unknown>,
): Promise<void> {
  const res = await fetch(tableUrl(table), {
    method: "PATCH",
    headers: authHeaders(true),
    body: JSON.stringify({ records: [{ id: recordId, fields }], typecast: true }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Airtable update failed with status ${res.status}: ${body}`);
  }
}

async function deleteTableRecord(table: string, recordId: string): Promise<void> {
  const res = await fetch(`${tableUrl(table)}/${recordId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(`Airtable delete failed with status ${res.status}`);
}

// --- Guestbook ---------------------------------------------------------
// Required columns in the guestbook table: Name, Message, Approved (checkbox).
// Public submissions default to Approved=false so the couple can moderate
// before a message shows up on the public /guestbook page.

export interface GuestbookEntry {
  recordId: string;
  createdTime: string;
  name: string;
  message: string;
  approved: boolean;
}

function mapGuestbookEntry(record: AirtableRecord): GuestbookEntry {
  return {
    recordId: record.id,
    createdTime: record.createdTime,
    name: typeof record.fields["Name"] === "string" ? (record.fields["Name"] as string) : "Anonymous",
    message: typeof record.fields["Message"] === "string" ? (record.fields["Message"] as string) : "",
    approved: record.fields["Approved"] === true,
  };
}

export async function listGuestbookEntries(onlyApproved: boolean): Promise<GuestbookEntry[]> {
  const records = await listTableRecords(
    AIRTABLE_GUESTBOOK_TABLE!,
    onlyApproved ? "{Approved} = TRUE()" : undefined,
  );
  return records.map(mapGuestbookEntry).sort((a, b) => b.createdTime.localeCompare(a.createdTime));
}

export async function createGuestbookEntry(name: string, message: string): Promise<void> {
  await createTableRecord(AIRTABLE_GUESTBOOK_TABLE!, { Name: name, Message: message, Approved: false });
}

export async function approveGuestbookEntry(recordId: string): Promise<void> {
  await updateTableRecord(AIRTABLE_GUESTBOOK_TABLE!, recordId, { Approved: true });
}

export async function deleteGuestbookEntry(recordId: string): Promise<void> {
  await deleteTableRecord(AIRTABLE_GUESTBOOK_TABLE!, recordId);
}

// --- Song requests -------------------------------------------------------
// Required columns in the songs table: Name, Song, Artist. Internal-only
// (feeds the MC/DJ) — no public listing, just create + an admin read-only
// view. Only the song title is required from the guest — Artist is a
// separate, optional field since guests often know a song without knowing
// (or agreeing on) who performs it.

export interface SongRequest {
  recordId: string;
  createdTime: string;
  name: string;
  song: string;
  artist: string;
}

export async function listSongRequests(): Promise<SongRequest[]> {
  const records = await listTableRecords(AIRTABLE_SONGS_TABLE!);
  return records
    .map((record): SongRequest => ({
      recordId: record.id,
      createdTime: record.createdTime,
      name: typeof record.fields["Name"] === "string" ? (record.fields["Name"] as string) : "Anonymous",
      song: typeof record.fields["Song"] === "string" ? (record.fields["Song"] as string) : "",
      artist: typeof record.fields["Artist"] === "string" ? (record.fields["Artist"] as string) : "",
    }))
    .sort((a, b) => b.createdTime.localeCompare(a.createdTime));
}

export async function createSongRequest(name: string, song: string, artist: string): Promise<void> {
  const fields: Record<string, unknown> = { Name: name, Song: song };
  if (artist) fields["Artist"] = artist;
  await createTableRecord(AIRTABLE_SONGS_TABLE!, fields);
}

// --- Shared photos ---------------------------------------------------------
// Required columns in the photos table: Name, Message, Photo (attachment).
// Uses Airtable's separate content-upload endpoint, which takes the file
// inline as base64 rather than a public URL — the record is created first,
// then the attachment is uploaded onto it.

export async function uploadPhoto(
  name: string,
  message: string,
  file: { contentType: string; filename: string; base64: string },
): Promise<void> {
  const record = await createTableRecord(AIRTABLE_PHOTOS_TABLE!, { Name: name, Message: message });

  const res = await fetch(
    `https://content.airtable.com/v0/${AIRTABLE_BASE_ID}/${record.id}/Photo/uploadAttachment`,
    {
      method: "POST",
      headers: authHeaders(true),
      body: JSON.stringify({
        contentType: file.contentType,
        filename: file.filename,
        file: file.base64,
      }),
    },
  );
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Airtable attachment upload failed with status ${res.status}: ${body}`);
  }
}
