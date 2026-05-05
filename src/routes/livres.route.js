import * as controller from '../controllers/livres.controller.js';
import authentification from '../middlewares/authentification.middleware.js';
import express from 'express';
import { supprimerPret } from '../models/livres.model.js';
const router = express.Router();

// Routes pour les livres
router.get('/liste', authentification, controller.afficherListeLivres);
router.get('/livre/:id', authentification, controller.afficherLivre);
router.put('/modifier_status_livre/:id', authentification, controller.modifierDisponibleLivre);
router.post('/', authentification, controller.ajouterUnLivre);
router.put('/modifier_livre/:id', authentification, controller.modifierUnLivre);
router.delete('/:id', authentification, controller.supprimerUnLivre);

// Routes pour les prêts
router.put('/modifier_status_pret/:id', authentification, controller.modifierDisponiblePret);
router.post('/ajout_pret', authentification, controller.ajouterUnPret);
router.put('/modifier_pret/:id', authentification, controller.modifierUnPret);
router.delete('/supp_pret/:id', authentification, controller.supprimerUnPret);

// Routes pour l'utilisateur



export default router;