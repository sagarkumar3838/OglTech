import admin from 'firebase-admin';
import config from './env';

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: config.firebase.projectId,
  });
}

export const db = admin.firestore();
export default admin;
