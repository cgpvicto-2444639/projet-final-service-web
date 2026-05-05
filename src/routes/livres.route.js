import * as controller from '../controllers/livres.controller.js';
import authentification from '../middlewares/authentification.middleware.js';
import express from 'express';
const router = express.Router();


router.get('/liste', authentification, controller.afficherListeLivres);
router.get('/livre/:id', controller.afficherLivre);
router.put('/modifier_status/:id', controller.modifierDisponible);
router.post('/', controller.ajouterUnLivre);
router.put('/modifier_livre/:id', controller.modifierUnLivre);

export default router;