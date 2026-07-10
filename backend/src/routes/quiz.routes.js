const express = require('express');
const router = express.Router();

const quizController = require('../controllers/quiz.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const requireRole = require('../middlewares/role.middleware');

// Soumettre les réponses d'un quiz — réservé aux Apprenants
router.post('/:id/tentative', authMiddleware, requireRole('APPRENANT'), quizController.soumettreTentative);

module.exports = router;
