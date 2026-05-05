import * as controller from '../controllers/livres.controller.js';
import authentification from '../middlewares/authentification.middleware.js';
import express from 'express';
import { supprimerLivre } from '../models/livres.model.js';
const router = express.Router();


router.get('/liste', authentification, controller.afficherListeLivres);
router.get('/livre/:id', controller.afficherLivre);
router.put('/modifier_status/:id', controller.modifierDisponible);
router.post('/', controller.ajouterUnLivre);
router.put('/modifier_livre/:id', controller.modifierUnLivre);
router.delete('/:id', controller.supprimerUnLivre);

export default router;