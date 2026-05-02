import express, { json } from 'express';
import dotenv from 'dotenv';
import fs from 'fs';
import router from './src/routes/livres.route.js'

const app = express();
dotenv.config();

// Middleware
app.use(express.json());

// Routes
app.use('/api/bibliotheque', router);

app.listen(process.env.PORT || 3030, () => {
    console.log(`Le serveur tourne sur le port ${process.env.PORT}`);
});
