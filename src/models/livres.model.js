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
     const requete = `
        SELECT
            l.titre,
            l.auteur,
            l.isbn,
            l.description,
            l.disponible,
            p.id AS pret_id,
            p.emprunteur,
            p.date_retour,
            CASE WHEN p.date_retour >= CURRENT_DATE THEN true ELSE false END AS en_cours
        FROM livres l
        LEFT JOIN prets p ON p.livre_id = l.id
        WHERE l.id = $1
        ORDER BY p.date_retour DESC;
    `;
    const params = [id];

    try {
        const resultat = await pool.query(requete, params);
        if (resultat.rows.length === 0) return null;
        const { titre, auteur, isbn, description, disponible } = resultat.rows[0];

        const prets = resultat.rows[0].pret_id === null ? [] : resultat.rows;

        return { titre, auteur, isbn, description, disponible, prets };
    } catch (erreur) {
        console.error(`Erreur ${erreur.code} : ${erreur.message}`);
        throw erreur;
    }
};

export const modifierStatus = async (id, disponible) => {
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