const express = require('express');
const router = express.Router();

const quizController = require('../controllers/quiz.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const requireRole = require('../middlewares/role.middleware');

router.get('/:id', authMiddleware, quizController.getDetail);
router.get('/:id/tentatives', authMiddleware, requireRole('APPRENANT'), quizController.getTentatives);
router.post('/:id/tentative', authMiddleware, requireRole('APPRENANT'), quizController.soumettreTentative);
router.post('/', authMiddleware, requireRole('REFERENT'), quizController.create);

module.exports = router;


