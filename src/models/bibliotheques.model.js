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