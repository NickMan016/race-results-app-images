import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs-extra';
import path from 'path';
import * as teamServices from './../services/teamServices';

const router = express.Router();

router.get('/', (_, res) => {
    res.send(teamServices.getTeams())
});

router.get('/:id', (req, res) => {
    res.send(teamServices.getTeamById(req.params.id))
});

router.post('/', async (req, res) => {
    const id = req.body.id;

    if (!req.files || Object.keys(req.files).length === 0) {
        res.json('No se subió un archivo');
    } else {
        const file: any = req.files.image;
        
        if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
            const image = `${uuidv4()}.${file.mimetype.split('/')[1]}`;
            
            await fs.ensureDir(`${__dirname}/../../uploads/teams`);
            await file.mv(`${__dirname}/../../uploads/teams/${image}`, (err: any) => {
                if (err){
                    res.json(`No se pudo subir el archivo, ${ err }`);
                } else {
                    const newTeam = teamServices.addTeam({
                        id,
                        image
                    });
                    
                    res.json(newTeam);
                }
            });

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
            
            await fs.ensureDir(`${__dirname}/../../uploads/teams`);
            await file.mv(`${__dirname}/../../uploads/teams/${image}`, (err: any) => {
                if (err){
                    res.json(`No se pudo subir el archivo, ${ err }`);
                } else {

                    const updateTeam = teamServices.updateTeam({
                        id,
                        image
                    });
                
                    res.json(updateTeam);
                }
            });

        } else {
            res.json('El archivo no es una imagen');
        }
    }
});

router.get('/:id/image', (req, res) => {
    const { id } = req.params;
    const imageTeam = teamServices.getImage(id);
    const pathImage = path.resolve(__dirname, `../../uploads/teams/${imageTeam}`);
    
    if (fs.existsSync(pathImage)) {
        res.sendFile(pathImage);
    } else {
        const pathNoImage = path.resolve(__dirname, '../../uploads/teams/Default.png');
        res.sendFile(pathNoImage);
    }
});

export default router;