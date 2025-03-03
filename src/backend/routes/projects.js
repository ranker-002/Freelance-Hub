import express from 'express';
const router = express.Router();
import db from '../config/db.js';

// Récupérer tous les projets
router.get('/', async (req, res) => {
    try {
        const [projects] = await db.query('SELECT * FROM projects');
        res.json(projects);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Récupérer un projet par ID
router.get('/:id', async (req, res) => {
    try {
        const [project] = await db.query('SELECT * FROM projects WHERE id = ?', [req.params.id]);
        if (project.length === 0) return res.status(404).json({ error: 'Projet non trouvé' });
        res.json(project[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ajouter un nouveau projet
router.post('/', async (req, res) => {
    const { id, title, description, budget, status, client_id, freelance_id } = req.body;
    try {
        await db.query('INSERT INTO projects (id, title, description, budget, status, client_id, freelance_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [id, title, description, budget, status, client_id, freelance_id]);
        res.status(201).json({ message: 'Projet ajouté avec succès' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Mettre à jour un projet
router.put('/:id', async (req, res) => {
    const { title, description, budget, status, client_id, freelance_id } = req.body;
    try {
        await db.query('UPDATE projects SET title = ?, description = ?, budget = ?, status = ?, client_id = ?, freelance_id = ? WHERE id = ?',
            [title, description, budget, status, client_id, freelance_id, req.params.id]);
        res.json({ message: 'Projet mis à jour' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Supprimer un projet
router.delete('/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM projects WHERE id = ?', [req.params.id]);
        res.json({ message: 'Projet supprimé' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
