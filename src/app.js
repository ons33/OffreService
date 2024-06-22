// src/app.js
import express from 'express';
import bodyParser from 'body-parser';
import connectDataBase from "./config/MongoDb.js";
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import offreDemploiRoutes from './routes/offreDemploiRoutes.js';
import jobApplicationRoutes from './routes/candidatureRoutes.js';
import MatchingRoutes from './routes/matchingRoutes.js';

const app = express();
const port = process.env.PORT || 3003;

connectDataBase();

app.use(bodyParser.json());
app.use(cors());

app.use('/api/offre', offreDemploiRoutes);
app.use('/api/candidature', jobApplicationRoutes);
app.use('/api', MatchingRoutes);

app.get('/', (req, res) => {
    res.send('Mouna && Ons Project PFE!');
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Serveur écoutant sur le port ${port}`);
  });
}

export default app;
