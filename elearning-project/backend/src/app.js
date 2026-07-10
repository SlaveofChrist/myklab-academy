const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const coursRoutes = require('./routes/cours.routes');
const chapitreRoutes = require('./routes/chapitre.routes');
const quizRoutes = require('./routes/quiz.routes');

const app = express();

// --- Middlewares globaux ---
app.use(cors()); // autorise le front React (autre port) à appeler l'API
app.use(express.json()); // parse les body JSON des requêtes

// --- Route de santé (utile pour vérifier que le serveur tourne) ---
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API e-learning opérationnelle' });
});

// --- Routes de l'application ---
app.use('/api/auth', authRoutes);
app.use('/api/cours', coursRoutes);
app.use('/api/chapitres', chapitreRoutes);
app.use('/api/quiz', quizRoutes);

// --- Gestion des routes non trouvées ---
app.use((req, res) => {
  res.status(404).json({ message: 'Route non trouvée' });
});

module.exports = app;
