import path from 'path';
import { Circuit } from '../types';
import fs from 'fs-extra';
import { db } from '../config';

const pathJSON = path.resolve(__dirname, './circuits.json');
let data:any = [];

if (!fs.existsSync(pathJSON)) {
    fs.writeJSON(`${__dirname}/circuits.json`, []);
} else {
    data = fs.readJSONSync(`${ __dirname }/circuits.json`);
}

let circuits: Circuit[] = data as Circuit[];

export const getCircuits = async (): Promise<Circuit[]> => {
    const snapshot = await db.ref('circuits').once('value');
    const circuits: Circuit[] = snapshot.val();
    return circuits;
};

export const getCircuitById = async (id: string): Promise<Circuit | null> => {
    try {
        const circuitsRef = db.ref('circuits');

        // Realiza la consulta para obtener el objeto con el id específico
        const snapshot = await circuitsRef.orderByChild('id').equalTo(id).once('value');
        // Verifica si hay datos en el resultado
        if (snapshot.exists()) {
            const circuitKey = Object.keys(snapshot.val())[0];
            // Obtiene el primer hijo (debería ser único porque estamos buscando por id)
            const circuit = snapshot.val()[circuitKey] as Circuit;
            return circuit;
        } else {
            return null; // No se encontró ningún conductor con el id especificado
        }
    } catch (error) {
        // console.error('Error:', error);
        // Manejar el error
        throw error;
    }
}

export const addCircuit = (newCircuitEntry: Circuit): Circuit => {
    const newCircuit = {
        ...newCircuitEntry
    }

    db.ref('circuits').push(newCircuit);
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