import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs-extra';
// import path from 'path';
import * as driverServices from './../services/driverServices';
import {v2 as cloudinary} from 'cloudinary';
import { Driver } from '../types';
          
cloudinary.config({ 
  cloud_name: 'dpjnmd62g', 
  api_key: '415735428159965', 
  api_secret: 'Z3t_Aj_1PIjQ2V4owi6D2ocqMEg' 
});

const router = express.Router();

router.get('/', async (_, res) => {
    try {
        const drivers = await driverServices.getDrivers();
        res.send(drivers);
    } catch (error) {
        // Manejar el error
        res.status(500).send('Error al obtener conductores');
    }
});

router.get('/:id', async (req, res) => {
    try {
        const driver = await driverServices.getDriverById(req.params.id);

        if (driver) {
            res.send(driver);
        } else {
            res.status(404).send('Conductor no encontrado');
        }
    } catch (error) {
        res.status(500).send('Error al obtener conductor por id');
    }
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
                const filePath = `${__dirname}/../../uploads/drivers/Default.jpg`;
                await file.mv(filePath, async (err: any) => {
                    if (err) {
                        res.json(`No se pudo subir el archivo, ${err}`);
                    } else {
                        const response = await cloudinary.uploader.upload(filePath);
                        driverServices.addDriver({
                            id,
                            image: response.secure_url
                        });
                        
                        res.json('Se ha subido el archivo Default');
                    }
                });
            } else {
                const image = `${uuidv4()}.${file.mimetype.split('/')[1]}`;
                const filePath = `${__dirname}/../../uploads/drivers/${image}`;
                await file.mv(filePath, async (err: any) => {
                    if (err) {
                        res.json(`No se pudo subir el archivo, ${err}`);
                    } else {
                        const response = await cloudinary.uploader.upload(filePath);
                        const newDriver = driverServices.addDriver({
                            id,
                            image: response.secure_url
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

// router.put('/', async (req, res) => {
//     const { id } = req.body;

//     if (!req.files || Object.keys(req.files).length === 0) {
//         res.json('No se subió un archivo');
//     } else {
//         const file: any = req.files.image;

//         if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
//             const image = `${uuidv4()}.${file.mimetype.split('/')[1]}`;
//             const driver = driverServices.getDriverById(id);

//             await fs.ensureDir(`${__dirname}/../../uploads/drivers`);
//             await file.mv(`${__dirname}/../../uploads/drivers/${image}`, (err: any) => {
//                 if (err) {
//                     res.json(`No se pudo subir el archivo, ${err}`);
//                 } else {
//                     fs.unlink(`${__dirname}/../../uploads/drivers/${driver?.image}`);
//                     const updateDriver = driverServices.updateDriver({
//                         id,
//                         image
//                     });

//                     res.json(updateDriver);
//                 }
//             });

//         } else {
//             res.json('El archivo no es una imagen');
//         }
//     }
// });

router.get('/:id/image', async (req, res) => {
    try {
        const driver = await driverServices.getDriverById(req.params.id);

        if (driver) {
            res.redirect(driver.image);
        } else {
            const def = await driverServices.getDriverById('default') as Driver;
            res.redirect(def.image);
        }
    } catch (error) {
        res.status(500).send('Error al obtener conductor por id');
    }
});

export default router;