// Controller pour les profils
const db = require('../config/db');

const profilesController = {
    getAllProfiles: async (req, res) => {
        try {
            const [profiles] = await db.query('SELECT * FROM profiles');
            res.json(profiles);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getProfileById: async (req, res) => {
        try {
            const { id } = req.params;
            const [profile] = await db.query('SELECT * FROM profiles WHERE id = ?', [id]);
            if (profile.length === 0) return res.status(404).json({ message: 'Profil non trouvé' });
            res.json(profile[0]);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};