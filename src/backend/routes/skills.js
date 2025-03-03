import express from 'express';
const router = express.Router();
import db from '../config/db.js';


// Récupérer toutes les compétences
router.get('/', async (req, res) => {
    try {
        const [skills] = await db.query('SELECT * FROM skills');
        res.json(skills);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Récupérer une compétence par ID
router.get('/:id', async (req, res) => {
    try {
        const [skill] = await db.query('SELECT * FROM skills WHERE id = ?', [req.params.id]);
        if (skill.length === 0) return res.status(404).json({ error: 'Compétence non trouvée' });
        res.json(skill[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ajouter une nouvelle compétence
router.post('/', async (req, res) => {
    const { id, name } = req.body;
    try {
        await db.query('INSERT INTO skills (id, name) VALUES (?, ?)', [id, name]);
        res.status(201).json({ message: 'Compétence ajoutée avec succès' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Mettre à jour une compétence
router.put('/:id', async (req, res) => {
    const { name } = req.body;
    try {
        await db.query('UPDATE skills SET name = ? WHERE id = ?', [name, req.params.id]);
        res.json({ message: 'Compétence mise à jour' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Supprimer une compétence
router.delete('/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM skills WHERE id = ?', [req.params.id]);
        res.json({ message: 'Compétence supprimée' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
