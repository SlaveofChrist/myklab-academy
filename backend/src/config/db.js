const { PrismaClient } = require('@prisma/client');

// Singleton : une seule instance de PrismaClient pour toute l'app,
// évite d'ouvrir trop de connexions à la base (utile en dev avec hot-reload)
const prisma = new PrismaClient();

module.exports = prisma;
