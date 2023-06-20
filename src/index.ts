import express from 'express';
import driverRouter from './routes/drivers';
import fileUpload from 'express-fileupload';

const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

app.get('/test', (_, res) => {
    res.send('App running')
});

app.use('/api/drivers', driverRouter)

app.listen(PORT, () => {
    console.log(`App running in port ${PORT}`);
    
}) 