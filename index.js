import express, { json } from 'express';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
const swaggerDocument = JSON.parse(fs.readFileSync('./src/config/documentation.json', 'utf8'));
import router from './src/routes/livres.route.js'
import cors from 'cors';
import morgan from 'morgan';

const swaggerOptions = {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "Bibliotheques API"
};

const app = express();
dotenv.config();

// Middleware
app.use(express.json());
app.use(cors());

// Morgan
const errorLogStream = fs.createWriteStream('./errors.log', { flags: 'a' });
app.use(morgan('combined', {
  stream: errorLogStream,
  skip: (req, res) => res.statusCode !== 500
}));

// Visuel documentation
app.use('/api/docs',
        swaggerUi.serve,
        swaggerUi.setup(swaggerDocument, swaggerOptions));

// Routes
app.use('/api/bibliotheque', router);

app.listen(process.env.PORT || 3030, () => {
    console.log(`Le serveur tourne sur le port ${process.env.PORT}`);
});
