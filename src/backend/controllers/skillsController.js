const db = require('../config/db');
// Controller pour les compétences
const skillsController = {
    getAllSkills: async (req, res) => {
        try {
            const [skills] = await db.query('SELECT * FROM skills');
            res.json(skills);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = { usersController, profilesController, skillsController };
