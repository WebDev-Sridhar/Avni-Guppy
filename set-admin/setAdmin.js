const admin = require("firebase-admin");

// Replace with the path to your service account key
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function setAdmin(uid) {
  await admin.auth().setCustomUserClaims(uid, { admin: true });
  console.log(`✅ Admin role assigned to UID: ${uid}`);
}

// Replace with the UID of the user you want to make admin
setAdmin("fHtOzURvE0bsiwwqCloFOepqCBu1");
