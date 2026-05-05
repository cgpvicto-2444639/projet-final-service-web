import {getListeLivres, getLivreById, modifierStatus, ajouterLivre, modifierLivre, supprimerLivre} from '../models/livres.model.js';

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

export const afficherLivre = async (req, res) => {
    const id = req.params.id;

    try {
        const livre = await getLivreById(id);
        res.status(200).json(livre);
    } catch (erreur) {
         res.status(500).json({ erreur: "Erreur lors de la récupération du livre avec id " + req.params.id });
    }
};

export const modifierDisponible = async (req, res) => {
    const id = req.params.id;
    const { disponible } = req.body;

    try {
        const affectedRows = await modifierStatus(id, disponible);
        if(affectedRows === 0){
            return res.status(404).json({ erreur: `Le livre avec l'id ${id} n'existe pas dans la base de données` });
        }
        res.status(200).json({ message: `Le livre avec l'id ${id} a été modifié avec succès` });
    } catch (erreur) {
        console.error(erreur); 
        res.status(500).json({ erreur: `Echec lors de la modification du livre ${id}` });
    }
};

export const ajouterUnLivre = async (req, res) => {
    const {bibliotheque_id, titre, auteur, description, isbn, date_ajout, disponible} = req.body;

    const champsRequis = ['bibliotheque_id', 'titre', 'auteur', 'description', 'isbn', 'date_ajout', 'disponible'];
    const champManquants = champsRequis.filter(champ => req.body[champ] === undefined);

    if (champManquants.length > 0) {
        return res.status(400).json({
            erreur: 'Le format des données est invalide',
            champs_manquants: champManquants
        });
    }

    try {
        const livre = await ajouterLivre(bibliotheque_id, titre, auteur, description, isbn, date_ajout, disponible);

        res.status(201).json({
            message: `Le livre ${titre} a été ajouté avec succès`,
            livre
        });
    } catch (erreur) {
        res.status(500).json({ erreur: `Echec lors de l'ajout du livre ${titre}` });
    }
};

export const modifierUnLivre = async (req, res) => {
    const id = req.params.id;
    const {bibliotheque_id, titre, auteur, description, isbn, date_ajout, disponible} = req.body;

    const champsRequis = ['bibliotheque_id', 'titre', 'auteur', 'description', 'isbn', 'date_ajout', 'disponible'];
    const champManquants = champsRequis.filter(champ => req.body[champ] === undefined);

    if (champManquants.length > 0) {
        return res.status(400).json({
            erreur: 'Le format des données est invalide',
            champs_manquants: champManquants
        });
    }

    try {
        const affectedRows = await modifierLivre(id, bibliotheque_id, titre, auteur, description, isbn, date_ajout, disponible);
        
        if (affectedRows === 0){
            return res.status(404).json({ erreur: `Le livre avec l'id ${id} n'existe pas dans la base de données` });
        }
        res.status(200).json({ message: `Le livre avec l'id ${id} a été modifié avec succès` });
    } catch (erreur) {
        res.status(500).json({ erreur: `Echec lors de la modification du livre avec l'id ${id}` });
    }
};

export const supprimerUnLivre = async (req, res) => {
    const id = req.params.id;

    try {
        const affectedRows = await supprimerLivre(id);

        if(affectedRows === 0){
            return res.status(404).json({ erreur: `Le livre avec l'id ${id} n'existe pas dans la base de données` });
        }

        res.status(200).json({ message: `Le livre avec l'id ${id} a été supprimé avec succès` });
    } catch (erreur) {
        res.status(500).json({ erreur: `Echec lors de la suppression du livre avec l'id ${id}` });
    }
};