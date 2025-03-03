const db = require('../config/db');

// Controller pour les utilisateurs
const usersController = {
    getAllUsers: async (req, res) => {
        try {
            const [users] = await db.query('SELECT id, email, created_at FROM users');
            res.json(users);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getUserById: async (req, res) => {
        try {
            const { id } = req.params;
            const [user] = await db.query('SELECT id, email, created_at FROM users WHERE id = ?', [id]);
            if (user.length === 0) return res.status(404).json({ message: 'Utilisateur non trouvé' });
            res.json(user[0]);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};