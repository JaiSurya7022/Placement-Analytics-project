import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import placementRoutes from './routes/placementRoutes.js';

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api', placementRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Placement Backend Server active on port ${PORT}`));