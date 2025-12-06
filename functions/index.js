const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { GoogleSpreadsheet } = require("google-spreadsheet");
const creds = require("./serviceAccountKey.json");

admin.initializeApp();

const SPREADSHEET_ID = "14WRhbueolOBtEeQvcYGQeAHp9gDpuUggbHygbTohnwo";

exports.exportOrdersToSheet = functions.https.onCall(async (data, context) => {
  try {
    const db = admin.firestore();
    const ordersSnapshot = await db.collection("orders").get();

    const doc = new GoogleSpreadsheet(SPREADSHEET_ID);
    await doc.useServiceAccountAuth({
      client_email: creds.client_email,
      private_key: creds.private_key,
    });

    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];

    await sheet.clearRows();
    await sheet.setHeaderRow([
      "Name", "Email", "Phone", "City", "State", "Pincode", "Address",
      "Products", "Amount", "Payment ID", "Status", "Created At"
    ]);

    const rows = ordersSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        Name: data.name || '',
        Email: data.email || '',
        Phone: data.phone || '',
        City: data.city || '',
        State: data.state || '',
        Pincode: data.pincode || '',
        Address: `${data.doorNumber || ''}, ${data.street || ''}`,
        Products: (data.products || []).join(", "),
        Amount: data.amount || 0,
        "Payment ID": data.paymentId || '',
        Status: data.status || '',
        "Created At": data.createdAt?.toDate().toLocaleString() || '',
      };
    });

    await sheet.addRows(rows);

    return { message: "Exported successfully", count: ordersSnapshot.size };
  } catch (err) {
    console.error("Error exporting orders:", err);
    throw new functions.https.HttpsError('internal', 'Export failed');
  }
});
