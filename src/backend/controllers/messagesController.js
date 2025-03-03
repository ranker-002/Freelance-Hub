const db = require('../config/db');

// Récupérer tous les messages
exports.getAllMessages = async (req, res) => {
    try {
        const [messages] = await db.query("SELECT * FROM messages");
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Récupérer un message par ID
exports.getMessageById = async (req, res) => {
    const { id } = req.params;
    try {
        const [message] = await db.query("SELECT * FROM messages WHERE id = ?", [id]);
        if (message.length === 0) {
            return res.status(404).json({ message: "Message non trouvé" });
        }
        res.json(message[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Envoyer un message
exports.createMessage = async (req, res) => {
    const { sender_id, receiver_id, content, read } = req.body;
    try {
        const [result] = await db.query(
            "INSERT INTO messages (id, sender_id, receiver_id, content, read) VALUES (UUID(), ?, ?, ?, ?)",
            [sender_id, receiver_id, content, read]
        );
        res.status(201).json({ message: "Message envoyé", messageId: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Mettre à jour un message (ex: marquer comme lu)
exports.updateMessage = async (req, res) => {
    const { id } = req.params;
    const { read } = req.body;
    try {
        await db.query("UPDATE messages SET read = ? WHERE id = ?", [read, id]);
        res.json({ message: "Message mis à jour" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Supprimer un message
exports.deleteMessage = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query("DELETE FROM messages WHERE id = ?", [id]);
        res.json({ message: "Message supprimé" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
