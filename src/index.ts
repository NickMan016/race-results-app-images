import express from 'express';
import driverRouter from './routes/drivers';

const PORT = 3000;
const app = express();
app.use(express.json());

app.get('/test', (_, res) => {
    res.send('App running')
});

app.use('/api/drivers', driverRouter)

app.listen(PORT, () => {
    console.log(`App running in port ${PORT}`);
    
})