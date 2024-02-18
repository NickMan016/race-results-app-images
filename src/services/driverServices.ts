import path from 'path';
import { Driver } from '../types';
import fs from 'fs-extra';
import admin, { ServiceAccount } from 'firebase-admin';

import serviceAccount from "../../race-results-api-images-firebase-adminsdk-uym0i-e5471ed4c7.json";

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as ServiceAccount),
    databaseURL: 'https://race-results-api-images-default-rtdb.firebaseio.com/'
});

const db = admin.database();

const pathJSON = path.resolve(__dirname, './drivers.json');
let data:any = [];

if (!fs.existsSync(pathJSON)) {
    fs.writeJSON(`${__dirname}/drivers.json`, []);
} else {
    data = fs.readJSONSync(`${ __dirname }/drivers.json`);
}

let drivers: Driver[] = data as Driver[];

export const getDrivers = async (): Promise<Driver[]> => {
    const snapshot = await db.ref('drivers').once('value');
    const drivers: Driver[] = snapshot.val();
    return drivers;
};

export const getDriverById = async (id: string): Promise<Driver | null> => {
    try {
        const driversRef = db.ref('drivers');

        // Realiza la consulta para obtener el objeto con el id específico
        const snapshot = await driversRef.orderByChild('id').equalTo(id).once('value');
        // Verifica si hay datos en el resultado
        if (snapshot.exists()) {
            const driverKey = Object.keys(snapshot.val())[0];
            // Obtiene el primer hijo (debería ser único porque estamos buscando por id)
            const driver = snapshot.val()[driverKey] as Driver;
            return driver;
        } else {
            return null; // No se encontró ningún conductor con el id especificado
        }
    } catch (error) {
        // console.error('Error:', error);
        // Manejar el error
        throw error;
    }
    // return drivers.find(d => d.id === id);
}

export const addDriver = (newDriverEntry: Driver): Driver => {
    const newDriver = {
        ...newDriverEntry
    }

    db.ref('drivers').push(newDriver);
    // drivers.push(newDriver);
    // fs.writeJSONSync(`${ __dirname }/drivers.json`, drivers);
    return newDriver;
}

export const updateDriver = (updateDriverEntry: Driver): Driver => {
    const driversUpdate = drivers.map((driver) =>
        driver.id === updateDriverEntry.id
            ? { ...driver, image: updateDriverEntry.image }
            : driver
    );

    drivers = driversUpdate;
    fs.writeJSONSync(`${ __dirname }/drivers.json`, driversUpdate);
    return updateDriverEntry;
}

export const getImage = (id: string): string | undefined => {
    const driver = drivers.find(d => d.id === id);

    return driver?.image || undefined;
}