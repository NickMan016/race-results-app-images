import express from 'express';
import driverRouter from './routes/drivers';
import teamRouter from './routes/teams';
import circuitRouter from './routes/circuits';
import fileUpload from 'express-fileupload';

const PORT = process.env.PORT || 5000;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

app.get('/test', (_, res) => {
    res.send('App running')
});

app.use('/api/drivers', driverRouter);
app.use('/api/teams', teamRouter);
app.use('/api/circuits', circuitRouter);

app.listen(PORT, () => {
    console.log(`App running in port ${PORT}`);
    
}) 