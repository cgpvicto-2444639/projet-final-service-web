import {getListeLivres, getLivreById, modifierStatusLivre, ajouterLivre, modifierLivre, supprimerLivre, modifierStatusPret, getPretsByLivreId, ajouterPret, modifierPret, supprimerPret} from '../models/livres.model.js';

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
        if (!livre) {
            return res.status(404).json({ erreur: `Le livre avec l'id ${id} n'existe pas` });
        }
        const prets = await getPretsByLivreId(id);
        res.status(200).json({bibliotheque_id: livre.bibliotheque_id, titre: livre.titre, auteur: livre.auteur, description: livre.description, isbn: livre.isbn, date_ajout: livre.date_ajout, disponible: livre.disponible, prets:prets});
    } catch (erreur) {
        console.log(`Erreur PostgreSQL - Code: ${erreur.code} | Message: ${erreur.message} | Détail: ${erreur.detail}`);
         res.status(500).json({ erreur: "Erreur lors de la récupération du livre avec id " + req.params.id });
    }
};

export const modifierDisponibleLivre = async (req, res) => {
    const id = req.params.id;
    const { disponible } = req.body;

    try {
        const affectedRows = await modifierStatusLivre(id, disponible);
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
        //console.log(`Erreur SQL - code: ${erreur.code} message: ${erreur.message}`);
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
        console.log(`Erreur SQL - code: ${erreur.code} message: ${erreur.message}`);
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

export const modifierDisponiblePret = async (req, res) => {
    const id = req.params.id;
    const { disponible } = req.body;

    try {
        const affectedRows = await modifierStatusPret(id, disponible);
        if(affectedRows === 0){
            return res.status(404).json({ erreur: `Le pret avec l'id ${id} n'existe pas dans la base de données` });
        }
        res.status(200).json({ message: `Le pret avec l'id ${id} a été modifié avec succès` });
    } catch (erreur) {
        console.error(erreur); 
        res.status(500).json({ erreur: `Echec lors de la modification du pret ${id}` });
    }
};

export const ajouterUnPret = async (req, res) => {
    const {livre_id, emprunteur, date_retour, disponible} = req.body;

    const champsRequis = ['livre_id', 'emprunteur', 'date_retour', 'disponible'];
    const champManquants = champsRequis.filter(champ => req.body[champ] === undefined);

    if (champManquants.length > 0) {
        return res.status(400).json({
            erreur: 'Le format des données est invalide',
            champs_manquants: champManquants
        });
    }

    try {
        const pret = await ajouterPret(livre_id, emprunteur, date_retour, disponible);
        res.status(201).json({
            message: `Le pret ${pret.id} a été ajouté avec succès`,
            pret
        });
    } catch (erreur) {
        if (erreur.code === 'LIVRE_INTROUVABLE') {
            return res.status(404).json({ erreur: erreur.message });
        }
        res.status(500).json({ erreur: `Echec lors de l'ajout du pret` });
    }
};

export const modifierUnPret = async (req, res) => {
    const id = req.params.id;
    const {livre_id, emprunteur, date_retour, disponible} = req.body;

    const champsRequis = ['livre_id', 'emprunteur', 'date_retour', 'disponible'];
    const champManquants = champsRequis.filter(champ => req.body[champ] === undefined);

    if (champManquants.length > 0) {
        return res.status(400).json({
            erreur: 'Le format des données est invalide',
            champs_manquants: champManquants
        });
    }

    try {
        const affectedRows = await modifierPret(id, livre_id, emprunteur, date_retour, disponible);
        
        if (affectedRows === 0){
            return res.status(404).json({ erreur: `Le pret avec l'id ${id} n'existe pas dans la base de données` });
        }
        res.status(200).json({ message: `Le pret avec l'id ${id} a été modifié avec succès` });
    } catch (erreur) {
        res.status(500).json({ erreur: `Echec lors de la modification du pret avec l'id ${id}` });
    }
};

export const supprimerUnPret = async (req, res) => {
    const id = req.params.id;

    try {
        const affectedRows = await supprimerPret(id);

        if(affectedRows === 0){
            return res.status(404).json({ erreur: `Le pret avec l'id ${id} n'existe pas dans la base de données` });
        }

        res.status(200).json({ message: `Le prêt avec l'id ${id} a été supprimé avec succès` });
    } catch (erreur) {
        res.status(500).json({ erreur: `Echec lors de la suppression du pret avec l'id ${id}` });
    }
};