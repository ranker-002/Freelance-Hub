const db = require('../config/db');

// Récupérer toutes les propositions
exports.getAllProposals = async (req, res) => {
    try {
        const [proposals] = await db.query("SELECT * FROM proposals");
        res.json(proposals);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Récupérer une proposition par ID
exports.getProposalById = async (req, res) => {
    const { id } = req.params;
    try {
        const [proposal] = await db.query("SELECT * FROM proposals WHERE id = ?", [id]);
        if (proposal.length === 0) {
            return res.status(404).json({ message: "Proposition non trouvée" });
        }
        res.json(proposal[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Créer une proposition
exports.createProposal = async (req, res) => {
    const { project_id, freelance_id, price, description, status } = req.body;
    try {
        const [result] = await db.query(
            "INSERT INTO proposals (id, project_id, freelance_id, price, description, status) VALUES (UUID(), ?, ?, ?, ?, ?)",
            [project_id, freelance_id, price, description, status]
        );
        res.status(201).json({ message: "Proposition créée avec succès", proposalId: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Mettre à jour une proposition
exports.updateProposal = async (req, res) => {
    const { id } = req.params;
    const { price, description, status } = req.body;
    try {
        await db.query(
            "UPDATE proposals SET price = ?, description = ?, status = ? WHERE id = ?",
            [price, description, status, id]
        );
        res.json({ message: "Proposition mise à jour" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Supprimer une proposition
exports.deleteProposal = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query("DELETE FROM proposals WHERE id = ?", [id]);
        res.json({ message: "Proposition supprimée" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
