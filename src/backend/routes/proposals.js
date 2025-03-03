import express from 'express';
const router = express.Router();
import db from '../config/db.js';


// Récupérer toutes les propositions
router.get('/', async (req, res) => {
    try {
        const [proposals] = await db.query('SELECT * FROM proposals');
        res.json(proposals);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Récupérer une proposition par ID
router.get('/:id', async (req, res) => {
    try {
        const [proposal] = await db.query('SELECT * FROM proposals WHERE id = ?', [req.params.id]);
        if (proposal.length === 0) return res.status(404).json({ error: 'Proposition non trouvée' });
        res.json(proposal[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ajouter une nouvelle proposition
router.post('/', async (req, res) => {
    const { id, project_id, freelance_id, price, description, status } = req.body;
    try {
        await db.query('INSERT INTO proposals (id, project_id, freelance_id, price, description, status) VALUES (?, ?, ?, ?, ?, ?)',
            [id, project_id, freelance_id, price, description, status]);
        res.status(201).json({ message: 'Proposition ajoutée avec succès' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Mettre à jour une proposition
router.put('/:id', async (req, res) => {
    const { project_id, freelance_id, price, description, status } = req.body;
    try {
        await db.query('UPDATE proposals SET project_id = ?, freelance_id = ?, price = ?, description = ?, status = ? WHERE id = ?',
            [project_id, freelance_id, price, description, status, req.params.id]);
        res.json({ message: 'Proposition mise à jour' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Supprimer une proposition
router.delete('/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM proposals WHERE id = ?', [req.params.id]);
        res.json({ message: 'Proposition supprimée' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
