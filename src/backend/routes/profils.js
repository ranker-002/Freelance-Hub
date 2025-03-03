
import express from 'express';
const router = express.Router();
import pool from '../config/db.js';

// Récupérer tous les profils
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM profiles');
        res.json(result.rows);
    } catch (err) {
        console.error('Erreur lors de la récupération des profils:', err.message);
        res.status(500).json({ error: 'Erreur serveur lors de la récupération des profils' });
    }
});

// Récupérer un profil par user_id
router.get('/:user_id', async (req, res) => {
    try {
        const { user_id } = req.params;
        const result = await pool.query('SELECT * FROM profiles WHERE user_id = ?', [user_id]);

        if (!Array.isArray(result.rows) || result.rows.length === 0) {
            return res.status(404).json({ error: 'Profil non trouvé' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Erreur lors de la récupération du profil:', err.message);
        res.status(500).json({ error: 'Erreur serveur lors de la récupération du profil' });
    }
});

// Ajouter un profil
router.post('/', async (req, res) => {
    try {
        const { user_id, name, user_type, description, portfolio_url, hourly_rate } = req.body;

        // Validation des champs obligatoires
        if (!user_id || !name || !user_type) {
            return res.status(400).json({ error: 'Les champs user_id, name et user_type sont obligatoires' });
        }

        const result = await pool.query(
            'INSERT INTO profiles (user_id, name, user_type, description, portfolio_url, hourly_rate) VALUES (?, ?, ?, ?, ?, ?) RETURNING *',
            [user_id, name, user_type, description, portfolio_url, hourly_rate]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Erreur lors de la création du profil:', err.message);
        res.status(500).json({ error: 'Erreur serveur lors de la création du profil' });
    }
});

// Supprimer un profil
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM profiles WHERE id = ? RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Profil non trouvé' });
        }

        res.json({ message: 'Profil supprimé', deletedProfile: result.rows[0] });
    } catch (err) {
        console.error('Erreur lors de la suppression du profil:', err.message);
        res.status(500).json({ error: 'Erreur serveur lors de la suppression du profil' });
    }
});

export default router;
