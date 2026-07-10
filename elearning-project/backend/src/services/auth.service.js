const bcrypt = require('bcrypt');
const prisma = require('../config/db');
const { generateToken } = require('../utils/jwt.util');

const SALT_ROUNDS = 10;

/**
 * Inscrit un nouvel utilisateur (Referent ou Apprenant).
 * - Vérifie que l'email n'est pas déjà utilisé
 * - Hash le mot de passe avant stockage
 * - Retourne l'utilisateur créé (sans le mdp) + un token
 */
async function register({ nom, email, mdp, role }) {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    const error = new Error("Cet email est déjà utilisé");
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(mdp, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      nom,
      email,
      mdp: hashedPassword,
      role, // "REFERENT" ou "APPRENANT"
    },
  });

  const token = generateToken(user);

  return { user: sanitizeUser(user), token };
}

/**
 * Connecte un utilisateur existant.
 * - Vérifie que l'email existe
 * - Compare le mdp fourni avec le hash stocké
 */
async function login({ email, mdp }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    const error = new Error("Email ou mot de passe incorrect");
    error.statusCode = 401;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(mdp, user.mdp);
  if (!isPasswordValid) {
    const error = new Error("Email ou mot de passe incorrect");
    error.statusCode = 401;
    throw error;
  }

  const token = generateToken(user);

  return { user: sanitizeUser(user), token };
}

/**
 * Retire le champ mdp avant de renvoyer l'utilisateur au client.
 * Ne jamais renvoyer le hash, même si c'est "juste" un hash.
 */
function sanitizeUser(user) {
  const { mdp, ...safeUser } = user;
  return safeUser;
}

module.exports = { register, login };
