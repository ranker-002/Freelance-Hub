import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js'; // Assurez-vous que le chemin est correct
import 'dotenv/config';

const register = async (req, res) => {
  const { email, password, userType, name, skills, hourlyRate } = req.body;

  try {
      // Vérifier si l'utilisateur existe déjà
      const [existingUsers] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
      if (existingUsers.length > 0) {
          return res.status(400).json({ message: "L'email est déjà utilisé." });
      }

      // Hasher le mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insérer l'utilisateur
      const [userResult] = await pool.query(
          "INSERT INTO users (email, password, user_type) VALUES (?, ?, ?)",
          [email, hashedPassword, userType]
      );

      const userId = userResult.insertId; // Récupération de l'ID inséré

      let profileQuery, profileValues;
      
      if (userType === 'freelance') {
          profileQuery = "INSERT INTO profiles (user_id, name, skills, hourly_rate) VALUES (?, ?, ?, ?)";
          profileValues = [userId, name, skills, hourlyRate];
      } else {
          profileQuery = "INSERT INTO profiles (user_id, name) VALUES (?, ?)";
          profileValues = [userId, name];
      }

      await pool.query(profileQuery, profileValues);

      res.status(201).json({ userId, message: "Inscription réussie." });
  } catch (error) {
      console.error("Erreur d'inscription :", error);
      res.status(500).json({ message: "Erreur lors de l'inscription" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ message: 'Identifiants incorrects' });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Identifiants incorrects' });
    }

    const token = jwt.sign({ userId: user.id, userType: user.user_type }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, userId: user.id, userType: user.user_type });
  } catch (error) {
    console.error("Erreur lors de la connexion :", error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export { register, login };
