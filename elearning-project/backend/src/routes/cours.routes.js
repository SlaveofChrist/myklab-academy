const express = require('express');
const router = express.Router();

const coursController = require('../controllers/cours.controller');
const inscriptionController = require('../controllers/inscription.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const requireRole = require('../middlewares/role.middleware');

// Consultation du catalogue — accessible sans connexion (public)
router.get('/', coursController.list);
router.get('/:id', coursController.detail);

// Création d'un cours — réservé aux utilisateurs connectés avec role REFERENT
router.post('/', authMiddleware, requireRole('REFERENT'), coursController.create);

// Inscription et suivi de progression — réservés aux Apprenants
router.post('/:id/inscription', authMiddleware, requireRole('APPRENANT'), inscriptionController.inscrire);
router.get('/:id/progression', authMiddleware, requireRole('APPRENANT'), inscriptionController.getProgression);

module.exports = router;
