import pool from '../config/db_pg.js';

export const getListeLivres = async (indisponible, bibliotheque_id) => {
    let requeteListe = `SELECT * from livres WHERE bibliotheque_id = $1`;
    const params = [bibliotheque_id];

    if(!indisponible){
        requeteListe += ` AND disponible = $2;`
        params.push(true);
    }

    try {
        const resultat = await pool.query(requeteListe, params);
        return resultat.rows;
    } catch (erreur) {
        console.error(`Erreur ${erreur.code} : ${erreur.message}`);
        throw erreur;
    }
}

export const getLivreById = async (id) => {
    const requete = `SELECT bibliotheque_id, titre, auteur, isbn, date_ajout, description, disponible FROM livres WHERE id = $1;`;
    const params = [id];

    try {
        const resultat = await pool.query(requete, params);
        if (resultat.rows.length === 0) return null;
        return resultat.rows[0];
    } catch (erreur) {
        console.error(`Erreur ${erreur.code} : ${erreur.message}`);
        throw erreur;
    }
};

export const getPretsByLivreId = async (id) => {
    const requete = `SELECT livre_id, emprunteur, date_retour, disponible FROM prets WHERE livre_id = $1;`;
    const params = [id];

    try {
        const resultat = await pool.query(requete, params);
        if(resultat.rows.length === 0) return null;
        return resultat.rows;
    } catch (erreur) {
        console.error(`Erreur ${erreur.code} : ${erreur.message}`);
        throw erreur;
    }
};

export const modifierStatusLivre = async (id, disponible) => {
    const requete = `UPDATE livres SET disponible = $1 WHERE id = $2;`;
    const params = [disponible, id];

    try {
        const resultat = await pool.query(requete, params);
        return resultat.rowCount;
    } catch (erreur) {
        console.error(`Erreur ${erreur.code} : ${erreur.message}`);
        throw erreur;
    }
};

export const ajouterLivre = async (bibliotheque_id, titre, auteur, description, isbn, date_ajout, disponible) => {
    const requete = `INSERT INTO livres (bibliotheque_id, titre, auteur, description, isbn, date_ajout, disponible) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id;`;
    const params = [bibliotheque_id, titre, auteur, description, isbn, date_ajout, disponible];

    try {
        const resultat = await pool.query(requete, params);
        return { id: resultat.insertId, bibliotheque_id, titre, auteur, description, isbn, date_ajout, disponible};
    } catch (erreur) {
        console.log(`Erreur ${erreur.code} : ${erreur.message}`);
        throw erreur;
    }
};

export const modifierLivre = async (id, bibliotheque_id, titre, auteur, description, isbn, date_ajout, disponible) => {
    const requete = `UPDATE livres SET bibliotheque_id = $1, titre = $2, auteur = $3, description = $4, isbn = $5, date_ajout = $6, disponible = $7 WHERE id = $8 RETURNING id;`;
    const params = [bibliotheque_id, titre, auteur, description, isbn, date_ajout, disponible, id];

    try {
        const resultat = await pool.query(requete, params);
        return resultat.rowCount;
    } catch (erreur) {
        console.log(`Erreur ${erreur.code} : ${erreur.message}`);
        throw erreur;
    }
};

export const supprimerLivre = async (id) => {
    try {
        await pool.query(`DELETE FROM prets WHERE livre_id = $1`, [id]);
        const resultat = await pool.query(`DELETE FROM livres WHERE id = $1`, [id]);
        return resultat.rowCount;
    } catch (erreur) {
        console.log(`Erreur ${erreur.code} : ${erreur.message}`);
        throw erreur;
    }
};

export const modifierStatusPret = async (id, disponible) => {
    const requete = `UPDATE prets SET disponible = $1 WHERE id = $2;`;
    const params = [disponible, id];

    try {
        const resultat = await pool.query(requete, params);
        return resultat.rowCount;
    } catch (erreur) {
        console.error(`Erreur ${erreur.code} : ${erreur.message}`);
        throw erreur;
    }
};

export const ajouterPret = async (livre_id, emprunteur, date_retour, disponible) => {
    const livreExiste = await pool.query('SELECT id FROM livres WHERE id = $1', [livre_id]);
    if (livreExiste.rows.length === 0) {
        const erreur = new Error(`Aucun livre trouvé avec l'id ${livre_id}`);
        erreur.code = 'LIVRE_INTROUVABLE';
        throw erreur;
    }

    const requete = `INSERT INTO prets (livre_id, emprunteur, date_retour, disponible) VALUES ($1, $2, $3, $4) RETURNING id;`;
    const params = [livre_id, emprunteur, date_retour, disponible];

    try {
        const resultat = await pool.query(requete, params);
        return { id: resultat.rows[0].id, livre_id, emprunteur, date_retour, disponible};
    } catch (erreur) {
        console.log(`Erreur ${erreur.code} : ${erreur.message}`);
        throw erreur;
    }
};

export const modifierPret = async (id, livre_id, emprunteur, date_retour, disponible) => {
    const requete = `UPDATE prets SET livre_id = $1, emprunteur = $2, date_retour = $3, disponible = $4 WHERE id = $5 RETURNING id;`;
    const params = [livre_id, emprunteur, date_retour, disponible, id];

    try {
        const resultat = await pool.query(requete, params);
        return resultat.rowCount;
    } catch (erreur) {
        console.log(`Erreur ${erreur.code} : ${erreur.message}`);
        throw erreur;
    }
};

export const supprimerPret = async (id) => {
    const requete = `DELETE FROM prets WHERE id = $1`;
    const params = [id];

    try {
        const resultat = await pool.query(requete, params);
        return resultat.rowCount;
    } catch (erreur) {
        console.log(`Erreur ${erreur.code} : ${erreur.message}`);
        throw erreur;
    }
};
