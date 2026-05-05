import { ajoutBibliotheque } from "../models/bibliotheques.model.js";
import bcrypt from 'bcrypt';
const costFactor = 10;

export const ajouterBibliothequeController = async (req, res) => {
    const {nom, courriel, password} = req.body;

    const champsRequis = ['nom', 'courriel', 'password'];
    const champManquants = champsRequis.filter(champ => req.body[champ] === undefined);

    if (champManquants.length > 0) {
        return res.status(400).json({
            erreur: 'Le format des données est invalide',
            champs_manquants: champManquants
        });
    }

    const hash = await bcrypt.hash(password, costFactor);

    try {
        const bibliotheque = await ajoutBibliotheque(nom, courriel, hash);

        res.status(201).json({
            message: `La bibliothèque ${bibliotheque.id} a été ajouté avec succès`,
            cle_api: bibliotheque.cle_api
        });
    } catch (erreur) {
        console.log(erreur.message);
        res.status(500).json({ erreur: `Echec lors de l'ajout de la bibliothèque ${nom}` });
    }
};
