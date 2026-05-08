import { ajoutBibliotheque, getBibliothequeParCourriel, updateCleApi } from "../models/bibliotheques.model.js";
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

export const getCleApiController = async (req, res) => {
    const { courriel, password } = req.body;
    const nouvelleCle = req.query.nouvelle === 'true';

    if (!courriel || !password) {
        return res.status(400).json({ erreur: 'Les champs courriel et password sont obligatoires' });
    }

    try {
        const bibliotheque = await getBibliothequeParCourriel(courriel);
        if (!bibliotheque) {
            return res.status(404).json({ erreur: 'Aucune bibliothèque trouvée avec ce courriel' });
        }

        const motDePasseValide = await bcrypt.compare(password, bibliotheque.password);
        if (!motDePasseValide) {
            return res.status(401).json({ erreur: 'Password invalide' });
        }

        let cle_api = bibliotheque.cle_api;
        if (nouvelleCle) {
            cle_api = await updateCleApi(bibliotheque.id);
        }

        res.status(200).json({ cle_api });
    } catch (erreur) {
        console.log(erreur);
        res.status(500).json({ erreur: `Erreur lors de la récupération de la clé API` });
    }
};
