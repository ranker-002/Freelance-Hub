const db = require('../config/db');

// Récupérer toutes les évaluations
exports.getAllReviews = async (req, res) => {
    try {
        const [reviews] = await db.query("SELECT * FROM reviews");
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Récupérer une évaluation par ID
exports.getReviewById = async (req, res) => {
    const { id } = req.params;
    try {
        const [review] = await db.query("SELECT * FROM reviews WHERE id = ?", [id]);
        if (review.length === 0) {
            return res.status(404).json({ message: "Évaluation non trouvée" });
        }
        res.json(review[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Ajouter une évaluation
exports.createReview = async (req, res) => {
    const { project_id, reviewer_id, reviewed_id, rating, comment } = req.body;
    try {
        const [result] = await db.query(
            "INSERT INTO reviews (id, project_id, reviewer_id, reviewed_id, rating, comment) VALUES (UUID(), ?, ?, ?, ?, ?)",
            [project_id, reviewer_id, reviewed_id, rating, comment]
        );
        res.status(201).json({ message: "Évaluation ajoutée", reviewId: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Mettre à jour une évaluation
exports.updateReview = async (req, res) => {
    const { id } = req.params;
    const { rating, comment } = req.body;
    try {
        await db.query(
            "UPDATE reviews SET rating = ?, comment = ? WHERE id = ?",
            [rating, comment, id]
        );
        res.json({ message: "Évaluation mise à jour" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Supprimer une évaluation
exports.deleteReview = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query("DELETE FROM reviews WHERE id = ?", [id]);
        res.json({ message: "Évaluation supprimée" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
