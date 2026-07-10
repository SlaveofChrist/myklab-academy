const { verifyToken } = require('../utils/jwt.util');

/**
 * Vérifie la présence et la validité du token JWT dans le header Authorization.
 * Format attendu : "Authorization: Bearer <token>"
 * Si valide, attache les infos décodées (id_user, email, role) à req.user.
 */
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: "Token d'authentification manquant" });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);
    req.user = decoded; // { id_user, email, role }
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token invalide ou expiré" });
  }
}

module.exports = authMiddleware;
