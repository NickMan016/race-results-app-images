import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs-extra';
import path from 'path';
import * as teamServices from './../services/teamServices';
import { Team } from '../types';

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
            await fs.ensureDir(`${__dirname}/../../uploads/teams`);

            if (id === 'default') {
                await file.mv(`${__dirname}/../../uploads/teams/Default.png`, (err: any) => {
                    if (err) {
                        res.json(`No se pudo subir el archivo, ${err}`);
                    } else {
                        res.json('Se ha subido el archivo Default');
                    }
                });
            } else {
                const image = `${uuidv4()}.${file.mimetype.split('/')[1]}`;
                await file.mv(`${__dirname}/../../uploads/teams/${image}`, (err: any) => {
                    if (err) {
                        res.json(`No se pudo subir el archivo, ${err}`);
                    } else {
                        const newTeam = teamServices.addTeam({
                            id,
                            fullImage: {
                                light: ''
                            },
                            miniImage: {
                                light: image
                            }
                        });

                        res.json(newTeam);
                    }
                });
            }
        } else {
            res.json('El archivo no es una imagen');
        }
    }
});

router.put('/', async (req, res) => {
    const { id, typeImage, theme } = req.body;

    if (!req.files || Object.keys(req.files).length === 0) {
        res.json('No se subió un archivo');
    } else {
        const file: any = req.files.image;

        if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
            const image = `${uuidv4()}.${file.mimetype.split('/')[1]}`;

            await fs.ensureDir(`${__dirname}/../../uploads/teams`);
            await file.mv(`${__dirname}/../../uploads/teams/${image}`, (err: any) => {
                if (err) {
                    res.json(`No se pudo subir el archivo, ${err}`);
                } else {
                    const team = teamServices.getTeamById(id) as Team;
                    if (typeImage === 'fullImage') {
                        if (theme === 'light') {
                            team ? team.fullImage.light = image : '';
                        } else if (theme === 'dark') {
                            team ? team.fullImage.dark = image : '';
                        }
                    } else if (typeImage === 'miniImage') {
                        if (theme === 'light') {
                            team ? team.miniImage.light = image : '';
                        } else if (theme === 'dark') {
                            team ? team.miniImage.dark = image : '';
                        }
                    }

                    const updateTeam = teamServices.updateTeam(team);

                    res.json(updateTeam);
                }
            });

        } else {
            res.json('El archivo no es una imagen');
        }
    }
});

router.get('/:id/image/:typeImage/:theme?', (req, res) => {
    const { id, typeImage, theme } = req.params;
    const team = teamServices.getImage(id);

    let image;

    if (typeImage === 'fullImage') {
        if (theme === 'light' || theme === undefined) {
            image = team?.fullImage.light;
        } else if (theme === 'dark') {
            if (team?.fullImage.dark === undefined) {
                image = team?.fullImage.light;
            } else {
                image = team?.fullImage.dark;
            }
        }
    } else if (typeImage === 'miniImage') {
        if (theme === 'light' || theme === undefined) {
            image = team?.miniImage.light;
        } else if (theme === 'dark') {
            if (team?.miniImage.dark === undefined) {
                image = team?.miniImage.light;
            } else {
                image = team?.miniImage.dark;
            }
        }
    }

    const pathImage = path.resolve(__dirname, `../../uploads/teams/${image}`);
    // const pathImage = path.resolve(__dirname, `../../uploads/teams/${imageTeam}`);

    if (fs.existsSync(pathImage)) {
        res.sendFile(pathImage);
    } else {
        const pathNoImage = path.resolve(__dirname, '../../uploads/teams/Default.png');
        res.sendFile(pathNoImage);
    }
});

export default router;