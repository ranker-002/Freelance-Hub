import express from 'express';
const router = express.Router();
import db from '../config/db.js';


// Récupérer tous les utilisateurs
router.get('/', async (req, res) => {
    try {
        const [users] = await db.query('SELECT id, email, created_at FROM users');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ajouter un utilisateur
router.post('/', async (req, res) => {
    const { id, email, password_hash } = req.body;
    try {
        await db.query('INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)', [id, email, password_hash]);
        res.status(201).json({ message: 'Utilisateur ajouté' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
