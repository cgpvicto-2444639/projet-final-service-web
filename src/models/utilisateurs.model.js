import pool from '../config/db_pg.js';

export const validationCle = async (cle_api) => {
    const requete = `SELECT * FROM bibliotheques WHERE cle_api = $1`;
    const params = [cle_api];

    try{
        const resultat = await pool.query(requete, params);
        if(resultat.rows.length > 0) {
            return resultat.rows[0];
        }
        
    } catch {
        console.error(`Erreur ${erreur.code} : ${erreur.message}`);
        throw erreur;
    }
};