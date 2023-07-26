import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs-extra';
import path from 'path';
import * as circuitServices from '../services/circuitServices';

const router = express.Router();

router.get('/', (_, res) => {
    res.send(circuitServices.getCircuits())
});

router.get('/:id', (req, res) => {
    res.send(circuitServices.getCircuitById(req.params.id))
});

router.post('/', async (req, res) => {
    const id = req.body.id;

    if (!req.files || Object.keys(req.files).length === 0) {
        res.json('No se subió un archivo');
    } else {
        const file: any = req.files.image;

        if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
            await fs.ensureDir(`${__dirname}/../../uploads/circuits`);

            if (id === 'default') {
                await file.mv(`${__dirname}/../../uploads/circuits/Default.png`, (err: any) => {
                    if (err) {
                        res.json(`No se pudo subir el archivo, ${err}`);
                    } else {
                        res.json('Se ha subido el archivo Default');
                    }
                });
            } else {
                const image = `${uuidv4()}.${file.mimetype.split('/')[1]}`;
                await file.mv(`${__dirname}/../../uploads/circuits/${image}`, (err: any) => {
                    if (err) {
                        res.json(`No se pudo subir el archivo, ${err}`);
                    } else {
                        const newCircuit = circuitServices.addCircuit({
                            id,
                            image
                        });

                        res.json(newCircuit);
                    }
                });
            }


        } else {
            res.json('El archivo no es una imagen');
        }
    }
});

router.put('/', async (req, res) => {
    const { id } = req.body;

    if (!req.files || Object.keys(req.files).length === 0) {
        res.json('No se subió un archivo');
    } else {
        const file: any = req.files.image;

        if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
            const image = `${uuidv4()}.${file.mimetype.split('/')[1]}`;
            const circuit = circuitServices.getCircuitById(id);
            
            await fs.ensureDir(`${__dirname}/../../uploads/circuits`);
            await file.mv(`${__dirname}/../../uploads/circuits/${image}`, (err: any) => {
                if (err) {
                    res.json(`No se pudo subir el archivo, ${err}`);
                } else {
                    fs.unlink(`${__dirname}/../../uploads/drivers/${circuit?.image}`);
                    const updateCircuit = circuitServices.updateCircuit({
                        id,
                        image
                    });

                    res.json(updateCircuit);
                }
            });

        } else {
            res.json('El archivo no es una imagen');
        }
    }
});

router.get('/:id/image', (req, res) => {
    const { id } = req.params;
    const imageCircuit = circuitServices.getImage(id);
    const pathImage = path.resolve(__dirname, `../../uploads/circuits/${imageCircuit}`);

    if (fs.existsSync(pathImage)) {
        res.sendFile(pathImage);
    } else {
        const pathNoImage = path.resolve(__dirname, '../../uploads/circuits/Default.png');
        res.sendFile(pathNoImage);
    }
});

export default router;