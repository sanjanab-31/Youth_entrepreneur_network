import 'dotenv/config';
import admin from 'firebase-admin';

const buildCredentialFromEnv = () => {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    const parsed = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

    if (parsed.private_key) {
      parsed.private_key = parsed.private_key.replace(/\\n/g, '\n');
    }

    return admin.credential.cert(parsed);
  }

  if (
    process.env.FIREBASE_PROJECT_ID
    && process.env.FIREBASE_CLIENT_EMAIL
    && process.env.FIREBASE_PRIVATE_KEY
  ) {
    return admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    });
  }

  return null;
};

const credential = buildCredentialFromEnv();

if (!admin.apps.length) {
  if (credential) {
    admin.initializeApp({
      credential,
    });
  } else {
    admin.initializeApp();
  }
}

export default admin;
