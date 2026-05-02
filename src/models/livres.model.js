import pool from '../config/db_pg.js';

export const getListeLivres = async (indisponible) => {
    let requeteListe = `SELECT * from livres`;
    const params = [];

    if(!indisponible){
        requeteListe += ` WHERE disponible = $1;`
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