import path from 'path';
import { Circuit } from '../types';
import fs from 'fs-extra';

const pathJSON = path.resolve(__dirname, './circuits.json');
let data:any = [];

if (!fs.existsSync(pathJSON)) {
    fs.writeJSON(`${__dirname}/circuits.json`, []);
} else {
    data = fs.readJSONSync(`${ __dirname }/circuits.json`);
}

let circuits: Circuit[] = data as Circuit[];

export const getCircuits = (): Circuit[] => circuits;

export const getCircuitById = (id: string): Circuit | undefined => {
    return circuits.find(d => d.id === id);
}

export const addCircuit = (newCircuitEntry: Circuit): Circuit => {
    const newCircuit = {
        ...newCircuitEntry
    }

    circuits.push(newCircuit);
    fs.writeJSONSync(`${ __dirname }/circuits.json`, circuits);
    return newCircuit;
}

export const updateCircuit = (updateCircuitEntry: Circuit): Circuit => {
    const circuitsUpdate = circuits.map((circuit) =>
        circuit.id === updateCircuitEntry.id
            ? { ...circuit, image: updateCircuitEntry.image }
            : circuit
    );

    circuits = circuitsUpdate;
    fs.writeJSONSync(`${ __dirname }/circuits.json`, circuitsUpdate);
    return updateCircuitEntry;
}

export const getImage = (id: string): string | undefined => {
    const circuit = circuits.find(d => d.id === id);

    return circuit?.image || undefined;
}