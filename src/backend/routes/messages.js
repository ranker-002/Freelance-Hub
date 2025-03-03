import express from 'express';
const router = express.Router();
import db from'../config/db.js';

// Récupérer tous les messages
router.get('/', async (req, res) => {
    try {
        const [messages] = await db.query('SELECT * FROM messages');
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Récupérer un message par ID
router.get('/:id', async (req, res) => {
    try {
        const [message] = await db.query('SELECT * FROM messages WHERE id = ?', [req.params.id]);
        if (message.length === 0) return res.status(404).json({ error: 'Message non trouvé' });
        res.json(message[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Ajouter un nouveau message
router.post('/', async (req, res) => {
    const { id, sender_id, receiver_id, content, read } = req.body;
    try {
        await db.query('INSERT INTO messages (id, sender_id, receiver_id, content, read) VALUES (?, ?, ?, ?, ?)',
            [id, sender_id, receiver_id, content, read]);
        res.status(201).json({ message: 'Message envoyé avec succès' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Mettre à jour un message (ex: le marquer comme lu)
router.put('/:id', async (req, res) => {
    const { read } = req.body;
    try {
        await db.query('UPDATE messages SET read = ? WHERE id = ?', [read, req.params.id]);
        res.json({ message: 'Message mis à jour' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Supprimer un message
router.delete('/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM messages WHERE id = ?', [req.params.id]);
        res.json({ message: 'Message supprimé' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;

