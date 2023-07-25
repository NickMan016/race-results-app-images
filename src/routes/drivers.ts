import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs-extra';
import path from 'path';
import * as driverServices from './../services/driverServices';

const router = express.Router();

router.get('/', (_, res) => {
    res.send(driverServices.getDrivers())
});

router.get('/:id', (req, res) => {
    res.send(driverServices.getDriverById(req.params.id))
});

router.post('/', async (req, res) => {
    const id = req.body.id;

    if (!req.files || Object.keys(req.files).length === 0) {
        res.json('No se subió un archivo');
    } else {
        const file: any = req.files.image;

        if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
            await fs.ensureDir(`${__dirname}/../../uploads/drivers`);

            if (id === 'default') {
                await file.mv(`${__dirname}/../../uploads/drivers/Default.jpg`, (err: any) => {
                    if (err) {
                        res.json(`No se pudo subir el archivo, ${err}`);
                    } else {
                        res.json('Se ha subido el archivo Default');
                    }
                });
            } else {
                const image = `${uuidv4()}.${file.mimetype.split('/')[1]}`;
                await file.mv(`${__dirname}/../../uploads/drivers/${image}`, (err: any) => {
                    if (err) {
                        res.json(`No se pudo subir el archivo, ${err}`);
                    } else {
                        const newDriver = driverServices.addDriver({
                            id,
                            image
                        });

                        res.json(newDriver);
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

            await fs.ensureDir(`${__dirname}/../../uploads/drivers`);
            await file.mv(`${__dirname}/../../uploads/drivers/${image}`, (err: any) => {
                if (err) {
                    res.json(`No se pudo subir el archivo, ${err}`);
                } else {

                    const updateDriver = driverServices.updateDriver({
                        id,
                        image
                    });

                    res.json(updateDriver);
                }
            });

        } else {
            res.json('El archivo no es una imagen');
        }
    }
});

router.get('/:id/image', (req, res) => {
    const { id } = req.params;
    const imageDriver = driverServices.getImage(id);
    const pathImage = path.resolve(__dirname, `../../uploads/drivers/${imageDriver}`);

    if (fs.existsSync(pathImage)) {
        res.sendFile(pathImage);
    } else {
        const pathNoImage = path.resolve(__dirname, '../../uploads/drivers/Default.jpg');
        res.sendFile(pathNoImage);
    }
});

export default router;