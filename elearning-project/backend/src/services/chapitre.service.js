const prisma = require('../config/db');

/**
 * Marque un chapitre comme vu par un apprenant.
 * Utilise upsert : si l'apprenant a déjà vu ce chapitre, ne fait rien
 * (grâce à la contrainte unique apprenant_id + chapitre_id), sinon crée l'entrée.
 * Idempotent : appeler cette fonction plusieurs fois n'a pas d'effet de bord.
 */
async function marquerCommeVu(apprenant_id, chapitre_id) {
  const chapitre = await prisma.chapitre.findUnique({ where: { id_chap: Number(chapitre_id) } });
  if (!chapitre) {
    const error = new Error("Chapitre introuvable");
    error.statusCode = 404;
    throw error;
  }

  return prisma.chapitreVu.upsert({
    where: {
      apprenant_id_chapitre_id: {
        apprenant_id,
        chapitre_id: Number(chapitre_id),
      },
    },
    update: {}, // rien à mettre à jour si ça existe déjà
    create: {
      apprenant_id,
      chapitre_id: Number(chapitre_id),
    },
  });
}

module.exports = { marquerCommeVu };
