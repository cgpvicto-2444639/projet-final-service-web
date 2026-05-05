import * as controller from '../controllers/livres.controller.js';
import authentification from '../middlewares/authentification.middleware.js';
import express from 'express';
const router = express.Router();


router.get('/liste', authentification, controller.afficherListeLivres);
router.get('/livre/:id', controller.afficherLivre);

export default router;