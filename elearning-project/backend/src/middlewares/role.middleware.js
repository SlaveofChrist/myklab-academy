/**
 * Middleware factory : vérifie que req.user.role fait partie des rôles autorisés.
 * À utiliser APRÈS authMiddleware (qui attache req.user).
 *
 * Exemple d'utilisation :
 *   router.post('/cours', authMiddleware, requireRole('REFERENT'), coursController.create);
 */
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Non authentifié" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Accès refusé : rôle insuffisant" });
    }

    next();
  };
}

module.exports = requireRole;
