const prisma = require('../config/db');

/**
 * Inscrit un apprenant à un cours.
 * Grâce à la contrainte @@unique([apprenant_id, cours_id]) dans le schéma,
 * Prisma lèvera une erreur si l'inscription existe déjà (code P2002).
 */
async function inscrire(apprenant_id, cours_id) {
  const cours = await prisma.cours.findUnique({ where: { id_cours: Number(cours_id) } });
  if (!cours) {
    const error = new Error("Cours introuvable");
    error.statusCode = 404;
    throw error;
  }

  try {
    return await prisma.inscription.create({
      data: { apprenant_id, cours_id: Number(cours_id) },
    });
  } catch (error) {
    if (error.code === 'P2002') { // violation de contrainte unique Prisma
      const err = new Error("Vous êtes déjà inscrit à ce cours");
      err.statusCode = 409;
      throw err;
    }
    throw error;
  }
}

/**
 * Calcule la progression réelle d'un apprenant sur un cours :
 * nombre de chapitres vus / nombre total de chapitres du cours.
 * Calculé à la volée plutôt que stocké, pour éviter les incohérences.
 */
async function getProgression(apprenant_id, cours_id) {
  const chapitres = await prisma.chapitre.findMany({
    where: { cours_id: Number(cours_id) },
    select: { id_chap: true },
  });

  const totalChapitres = chapitres.length;
  const chapitreIds = chapitres.map((c) => c.id_chap);

  const nbVus = await prisma.chapitreVu.findMany({
    where: {
      apprenant_id,
      chapitre_id: { in: chapitreIds },
    },
    select: { chapitre_id: true },
  });

  const chapitresVusIds = nbVus.map((v) => v.chapitre_id);
  const pourcentage = totalChapitres === 0 ? 0 : Math.round((chapitresVusIds.length / totalChapitres) * 100);

  return {
    cours_id: Number(cours_id),
    total_chapitres: totalChapitres,
    chapitres_vus: chapitresVusIds.length,
    chapitres_vus_ids: chapitresVusIds, // permet au frontend de savoir PRÉCISÉMENT lesquels sont vus
    pourcentage,
  };
}

module.exports = { inscrire, getProgression };
