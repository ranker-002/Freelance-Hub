import express from 'express';
const router = express.Router();
import db from '../config/db.js';


// Récupérer toutes les évaluations
router.get('/', async (req, res) => {
    try {
        const [reviews] = await db.query('SELECT * FROM reviews');
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Récupérer une évaluation par ID
router.get('/:id', async (req, res) => {
    try {
        const [review] = await db.query('SELECT * FROM reviews WHERE id = ?', [req.params.id]);
        if (review.length === 0) return res.status(404).json({ error: 'Évaluation non trouvée' });
        res.json(review[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ajouter une nouvelle évaluation
router.post('/', async (req, res) => {
    const { id, project_id, reviewer_id, reviewed_id, rating, comment } = req.body;
    try {
        await db.query('INSERT INTO reviews (id, project_id, reviewer_id, reviewed_id, rating, comment) VALUES (?, ?, ?, ?, ?, ?)',
            [id, project_id, reviewer_id, reviewed_id, rating, comment]);
        res.status(201).json({ message: 'Évaluation ajoutée avec succès' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Mettre à jour une évaluation
router.put('/:id', async (req, res) => {
    const { rating, comment } = req.body;
    try {
        await db.query('UPDATE reviews SET rating = ?, comment = ? WHERE id = ?',
            [rating, comment, req.params.id]);
        res.json({ message: 'Évaluation mise à jour' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Supprimer une évaluation
router.delete('/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM reviews WHERE id = ?', [req.params.id]);
        res.json({ message: 'Évaluation supprimée' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default  router;
