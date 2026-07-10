const authService = require('../services/auth.service');

async function register(req, res) {
  try {
    const { nom, email, mdp, role } = req.body;

    // Validation basique — à renforcer si le temps le permet (ex: express-validator)
    if (!nom || !email || !mdp || !role) {
      return res.status(400).json({ message: "Tous les champs sont requis (nom, email, mdp, role)" });
    }
    if (!['REFERENT', 'APPRENANT'].includes(role)) {
      return res.status(400).json({ message: "Le rôle doit être REFERENT ou APPRENANT" });
    }

    const { user, token } = await authService.register({ nom, email, mdp, role });
    return res.status(201).json({ user, token });

  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message || "Erreur serveur" });
  }
}

async function login(req, res) {
  try {
    const { email, mdp } = req.body;

    if (!email || !mdp) {
      return res.status(400).json({ message: "Email et mot de passe requis" });
    }

    const { user, token } = await authService.login({ email, mdp });
    return res.status(200).json({ user, token });

  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message || "Erreur serveur" });
  }
}

module.exports = { register, login };
