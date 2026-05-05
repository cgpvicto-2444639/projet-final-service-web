import * as controller from '../controllers/livres.controller.js';
import authentification from '../middlewares/authentification.middleware.js';
import express from 'express';
const router = express.Router();


router.get('/liste', authentification, controller.afficherListeLivres);
router.get('/livre/:id', controller.afficherLivre);
router.put('/modifier_status_livre/:id', controller.modifierDisponibleLivre);
router.post('/', controller.ajouterUnLivre);
router.put('/modifier_livre/:id', controller.modifierUnLivre);
router.delete('/:id', controller.supprimerUnLivre);

router.put('/modifier_status_pret/:id', controller.modifierDisponiblePret);
router.post('/ajout_pret', controller.ajouterUnPret);
router.put('/modifier_pret/:id', controller.modifierUnPret);
export default router;