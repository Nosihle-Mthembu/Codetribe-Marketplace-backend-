require('dotenv').config();
const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `https://${process.env.private_key_id}.firebaseio.com`
});

const db = admin.firestore();

module.exports = { admin, db };
