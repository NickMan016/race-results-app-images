import { Driver } from '../types';
import fs from 'fs-extra';

const data = fs.readJSONSync(`${ __dirname }/drivers.json`);
let drivers: Driver[] = data as Driver[];

export const getDrivers = (): Driver[] => drivers;

export const getDriverById = (id: string): Driver | undefined => {
    return drivers.find(d => d.id === id);
}

export const addDriver = (newDriverEntry: Driver): Driver => {
    const newDriver = {
        ...newDriverEntry
    }

    drivers.push(newDriver);
    fs.writeJSONSync(`${ __dirname }/drivers.json`, drivers);
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