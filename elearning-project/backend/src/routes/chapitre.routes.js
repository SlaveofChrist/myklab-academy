const express = require('express');
const router = express.Router();

const chapitreController = require('../controllers/chapitre.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const requireRole = require('../middlewares/role.middleware');

// Marquer un chapitre comme vu — réservé aux Apprenants
router.post('/:id/vu', authMiddleware, requireRole('APPRENANT'), chapitreController.marquerVu);

module.exports = router;
