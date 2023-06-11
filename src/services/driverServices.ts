import { Driver } from '../types';
import driverData from './drivers.json';

const drivers: Driver[] = driverData as Driver[]

export const getDrivers = (): Driver[] => drivers;

export const getDriverById = (id: string): Driver | undefined => {
    return drivers.find(d => d.id === id);
}

export const addDriver = (newDriverEntry: Driver): Driver => {
    const newDriver = {
        ...newDriverEntry
    }

    drivers.push(newDriver);
    return newDriver;
}

// export const updateDriver = (updateDriverEntry: Driver, id: string)