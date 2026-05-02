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