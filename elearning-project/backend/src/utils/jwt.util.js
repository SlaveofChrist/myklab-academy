const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '7d'; // durée de validité du token

/**
 * Génère un token JWT contenant l'id et le rôle de l'utilisateur.
 * On évite d'y mettre des infos sensibles (mdp) ou trop volumineuses.
 */
function generateToken(user) {
  return jwt.sign(
    {
      id_user: user.id_user,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

/**
 * Vérifie et décode un token JWT.
 * Lève une erreur si le token est invalide ou expiré (à catcher par l'appelant).
 */
function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

module.exports = { generateToken, verifyToken };
