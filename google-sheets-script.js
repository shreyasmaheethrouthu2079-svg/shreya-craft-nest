/**
 * =====================================================================
 * Shreya Crafts Nest - Google Sheets Order Recording Script
 * =====================================================================
 *
 * How to setup:
 * 1. Create a new Google Spreadsheet (e.g. named "Shreya Crafts Nest Orders").
 * 2. In Google Sheets menu, click: Extensions -> Apps Script.
 * 3. Delete existing code in Code.gs and paste this entire file.
 * 4. Click the blue "Deploy" button at top right -> "New deployment".
 * 5. Click the gear icon next to "Select type" and select "Web app".
 * 6. Description: "Shreya Crafts Nest Orders Webhook".
 * 7. Execute as: "Me" (your email).
 * 8. Who has access: "Anyone".
 * 9. Click "Deploy", authorize permissions when prompted, and COPY the Web App URL.
 * 10. Add that URL to your .env.local file:
 *     GOOGLE_SHEETS_WEBHOOK_URL="https://script.google.com/macros/s/AKfycb.../exec"
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = doc.getActiveSheet();

    // If sheet is completely new/empty, insert stylish header columns
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Date & Time",
        "Order ID",
        "Payment ID",
        "Customer Name",
        "WhatsApp Phone",
        "Delivery Address",
        "Item Ordered",
        "Category",
        "Amount (₹)",
        "Payment Status"
      ]);

      // Style header row
      var headerRange = sheet.getRange(1, 1, 1, 10);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#F4EFE8");
      headerRange.setFontColor("#292524");
      sheet.setFrozenRows(1);
    }

    var data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      data.timestamp || new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      data.orderId || "N/A",
      data.paymentId || "N/A",
      data.customerName || "N/A",
      "'" + (data.phoneNumber || ""),
      data.deliveryAddress || "N/A",
      data.productName || "N/A",
      data.category || "N/A",
      data.totalAmount || 0,
      data.paymentStatus || "CONFIRMED"
    ]);

    return ContentService.createTextOutput(
      JSON.stringify({ status: "success", message: "Order logged successfully" })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: "error", error: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
