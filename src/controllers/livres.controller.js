import {getListeLivres} from '../models/livres.model.js';

export const afficherListeLivres = async (req, res) => {
    const afficherTout = req.query.tous === 'true';
    const bibliotheque_id = req.bibliothequeId;

    try {
        const livres = await getListeLivres(afficherTout, bibliotheque_id);

        res.status(200).json({
            livres
        });
    } catch (erreur) {
        res.status(500).json({ erreur: 'Echec lors de la récupération de la liste des livres' });
    }
};