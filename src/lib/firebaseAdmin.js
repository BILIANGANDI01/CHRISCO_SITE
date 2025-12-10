import admin from "firebase-admin";

if (!admin.apps.length) {
  const credJson = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!credJson) {
    console.warn("FIREBASE_SERVICE_ACCOUNT not set (needed for server API routes).");
  } else {
    const serviceAccount = JSON.parse(credJson);
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
  }
}

const db = admin.firestore ? admin.firestore() : null;
export { admin, db };
