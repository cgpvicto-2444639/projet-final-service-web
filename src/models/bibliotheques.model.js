import pool from '../config/db_pg.js';

export const ajoutBibliotheque = async (nom, courriel, hash) => {
    const cle_api = crypto.randomUUID();
    const requete = `INSERT INTO bibliotheques (nom, courriel, password, cle_api) VALUES ($1, $2, $3, $4) RETURNING id, nom, courriel, cle_api;`;
    const params = [nom, courriel, hash, cle_api];

    try {
        const resultat = await pool.query(requete, params);
        return resultat.rows[0];
    } catch (erreur) {
        console.log(`Erreur ${erreur.code} : ${erreur.message}`);
        throw erreur;
    }
};

export const getBibliothequeParCourriel = async (courriel) => {
    const requete = `SELECT id, nom, courriel, password, cle_api FROM bibliotheques WHERE courriel = $1;`;

    try {
        const resultat = await pool.query(requete, [courriel]);
        if (resultat.rows.length === 0) return null;
        return resultat.rows[0];
    } catch (erreur) {
        console.log(`Erreur ${erreur.code} : ${erreur.message}`);        
        throw erreur;
    }
};

export const updateCleApi = async (id) => {
    const nouvelle_cle = crypto.randomUUID();
    const requete = `UPDATE bibliotheques SET cle_api = $1 WHERE id = $2 RETURNING cle_api;`;

    try {
        const resultat = await pool.query(requete, [nouvelle_cle, id]);
        return resultat.rows[0].cle_api;
    } catch (erreur) {
        console.log(`Erreur ${erreur.code} : ${erreur.message}`);        
        throw erreur;
    }
};