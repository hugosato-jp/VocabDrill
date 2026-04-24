// =====================================================
//  VocabDrill — Google Apps Script バックエンド
//  スプレッドシートの A1 セルに JSON を丸ごと保存する
// =====================================================

const SHEET_NAME = "VocabData";   // シート名（変えてもOK）
const DATA_CELL  = "A1";          // データを置くセル

// ── GET: データ取得 ───────────────────────────────────
function doGet(e) {
  try {
    const sheet = getOrCreateSheet();
    const raw   = sheet.getRange(DATA_CELL).getValue();
    const data  = raw ? JSON.parse(raw) : { folders: [] };
    return respond({ ok: true, data });
  } catch (err) {
    return respond({ ok: false, error: err.message });
  }
}

// ── POST: データ保存 ──────────────────────────────────
function doPost(e) {
  try {
    const body  = JSON.parse(e.postData.contents);
    const sheet = getOrCreateSheet();
    sheet.getRange(DATA_CELL).setValue(JSON.stringify(body.data));
    return respond({ ok: true });
  } catch (err) {
    return respond({ ok: false, error: err.message });
  }
}

// ── ユーティリティ ────────────────────────────────────
function getOrCreateSheet() {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  let   sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  return sheet;
}

function respond(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
