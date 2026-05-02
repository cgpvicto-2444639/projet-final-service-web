import * as controller from '../controllers/livres.controller.js';

import express from 'express';
const router = express.Router();

router.get('/liste', controller.afficherListeLivres);

export default router;