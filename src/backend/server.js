import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import usersRoutes from './routes/users.js';
import profilesRoutes from'./routes/profils.js';
import skillsRoutes  from './routes/skills.js';
import projectsRoutes from'./routes/projects.js';
import proposalsRoutes from'./routes/proposals.js';
import messagesRoutes from'./routes/messages.js';
import reviewsRoutes from'./routes/reviews.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', usersRoutes);
app.use('/api/profiles', profilesRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/proposals', proposalsRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/auth', authRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.send('API Freelance Platform is running');
});

// Middleware pour gérer les erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Erreur serveur' });
});

// Middleware pour gérer les routes non trouvées
app.use((req, res) => {
  res.status(404).json({ message: 'Route non trouvée' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});