import admin, { ServiceAccount } from "firebase-admin";

import serviceAccount from "../race-results-api-images-firebase-adminsdk-uym0i-e5471ed4c7.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as ServiceAccount),
  databaseURL: "https://race-results-api-images-default-rtdb.firebaseio.com/",
});

export const db = admin.database();
