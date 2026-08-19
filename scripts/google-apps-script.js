// Paste this into script.google.com as a script bound to your Google Sheet,
// then deploy it as a web app (see setup steps in the project README/chat).
// The Sheet should have a header row: Timestamp | Name | Email | Phone | Attending | Guests | Message

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    data.submittedAt || new Date().toISOString(),
    data.name || "",
    data.email || "",
    data.phone || "",
    data.attending || "",
    data.guests || "",
    data.message || "",
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
