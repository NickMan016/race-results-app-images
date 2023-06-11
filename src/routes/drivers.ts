import express from 'express';
import * as driverServices from './../services/driverServices';

const router = express.Router();

router.get('/', (_, res) => {
    res.send(driverServices.getDrivers())
});

router.get('/:id', (req, res) => {
    res.send(driverServices.getDriverById(req.params.id))
});

router.post('/', (req, res) => {
    const { id, image } = req.body;
    const newDriver = driverServices.addDriver({
        id,
        image
    });
    
    res.json(newDriver);
});

// router.put('/', (req, res) => {
//     const { id, image } = req.body;


// });

export default router;