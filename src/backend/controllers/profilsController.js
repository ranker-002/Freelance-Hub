
const db = require('../config/db.js');

const profilesController = {
    getAllProfiles: async (req, res) => {
        try {
            const [profiles] = await db.query('SELECT * FROM profiles');
            res.json(profiles);
        } catch (error) {
            console.error("Erreur lors de la récupération des profils:", error.message);
            res.status(500).json({ error: "Erreur serveur" });
        }
    },

    getProfileById: async (req, res) => {
        try {
            let { id } = req.params;
            id = parseInt(id, 10); // Convertit en nombre entier
    
            if (isNaN(id)) {
                return res.status(400).json({ error: "ID invalide" });
            }
    
            const [rows] = await db.query('SELECT * FROM profiles WHERE user_id = ?', [id]);
    
            // Vérifiez que rows est défini et est un tableau
            if (!Array.isArray(rows) || rows.length === 0) {
                return res.status(404).json({ message: 'Profil non trouvé' });
            }
    
            res.json(rows[0]);
        } catch (error) {
            console.error("Erreur lors de la récupération du profil:", error.message);
            res.status(500).json({ error: "Erreur serveur" });
        }
    }
    
};

module.exports = profilesController;
