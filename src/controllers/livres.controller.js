import {getListeLivres} from '../models/livres.model.js';

export const afficherListeLivres = async (req, res) => {
    const afficherTout = req.query.tous === 'true';

    try {
        const livres = await getListeLivres(afficherTout);

        res.status(200).json({
            livres
        });
    } catch (erreur) {
        res.status(500).json({ erreur: 'Echec lors de la récupération de la liste des livres' });
    }
};