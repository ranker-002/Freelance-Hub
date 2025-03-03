const db = require('../config/db');

// Récupérer tous les projets
exports.getAllProjects = async (req, res) => {
    try {
        const [projects] = await db.query("SELECT * FROM projects");
        res.json(projects);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Récupérer un projet par ID
exports.getProjectById = async (req, res) => {
    const { id } = req.params;
    try {
        const [project] = await db.query("SELECT * FROM projects WHERE id = ?", [id]);
        if (project.length === 0) {
            return res.status(404).json({ message: "Projet non trouvé" });
        }
        res.json(project[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Créer un projet
exports.createProject = async (req, res) => {
    const { title, description, budget, status, client_id, freelance_id } = req.body;
    try {
        const [result] = await db.query(
            "INSERT INTO projects (id, title, description, budget, status, client_id, freelance_id) VALUES (UUID(), ?, ?, ?, ?, ?, ?)",
            [title, description, budget, status, client_id, freelance_id]
        );
        res.status(201).json({ message: "Projet créé avec succès", projectId: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Mettre à jour un projet
exports.updateProject = async (req, res) => {
    const { id } = req.params;
    const { title, description, budget, status, client_id, freelance_id } = req.body;
    try {
        await db.query(
            "UPDATE projects SET title = ?, description = ?, budget = ?, status = ?, client_id = ?, freelance_id = ? WHERE id = ?",
            [title, description, budget, status, client_id, freelance_id, id]
        );
        res.json({ message: "Projet mis à jour" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Supprimer un projet
exports.deleteProject = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query("DELETE FROM projects WHERE id = ?", [id]);
        res.json({ message: "Projet supprimé" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
