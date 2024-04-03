import admin, { ServiceAccount } from "firebase-admin";
import dotenv from 'dotenv';

dotenv.config();

const clientEmail = process.env.CLIENT_EMAIL;
const privateKey = process.env.PRIVATE_KEY;
const projectId = process.env.PROJECT_ID;

if (!clientEmail || !privateKey || !projectId) {
  console.error("Faltan algunas variables de entorno necesarias.");
  process.exit(1);
}

const serviceAccount: ServiceAccount = {
  clientEmail,
  privateKey,
  projectId
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DATABASE_URL,
});

export const db = admin.database();
