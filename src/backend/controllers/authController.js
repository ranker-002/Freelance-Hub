import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js'; // Assurez-vous que le chemin est correct
import 'dotenv/config';

const register = async (req, res) => {
  const { email, password, userType, name, skills, hourlyRate } = req.body;

  try {
      const [userResult] = await pool.query(
          "INSERT INTO users (email, password, user_type) VALUES (?, ?, ?)",
          [email, password, userType]
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

      res.status(201).json({ userId });
  } catch (error) {
      console.error("Erreur d'inscription :", error);
      res.status(500).json({ message: "Erreur lors de l'inscription" });
  }
};


const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const connection = await pool.getConnection();
    const [users] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
    connection.release();

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
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export { register, login };