const admin = require("firebase-admin");

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

if (!serviceAccount.projectId || !serviceAccount.privateKey || !serviceAccount.clientEmail || serviceAccount.privateKey.includes("YOUR_PRIVATE_KEY_HERE")) {
  console.error("❌ Firebase Admin SDK error: Missing or placeholder environment variables in .env");
  console.error("👉 Please add your Firebase Service Account details to the .env file to enable authentication.");
} else {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("✅ Firebase Admin SDK initialized successfully.");
  } catch (error) {
    console.error("❌ Firebase Admin SDK initialization failed:", error.message);
  }
}

module.exports = admin;
