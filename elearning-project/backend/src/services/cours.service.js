const prisma = require('../config/db');

/**
 * Liste les cours, avec filtre optionnel par catégorie.
 * Utilisé pour la page "Catalogue".
 */
async function getAllCours(categorie) {
  const where = categorie ? { categorie } : {};

  return prisma.cours.findMany({
    where,
    include: {
      referent: {
        select: { id_user: true, nom: true }, // on n'expose jamais mdp/email ici
      },
    },
    orderBy: { created_at: 'desc' },
  });
}

/**
 * Récupère un cours avec ses chapitres (pour la page détail / "suivre un module").
 */
async function getCoursById(id_cours) {
  const cours = await prisma.cours.findUnique({
    where: { id_cours: Number(id_cours) },
    include: {
      referent: { select: { id_user: true, nom: true } },
      chapitres: { orderBy: { ordre_lecture: 'asc' } },
      quiz: { include: { questions: true } },
    },
  });

  if (!cours) {
    const error = new Error("Cours introuvable");
    error.statusCode = 404;
    throw error;
  }

  return cours;
}

/**
 * Crée un cours, avec ses chapitres en une seule opération (nested write Prisma).
 * Seul un utilisateur avec role REFERENT peut appeler ce service (vérifié en amont
 * par le middleware requireRole, pas ici).
 */
async function createCours({ titre, description, url_video, prix, categorie, referent_id, chapitres }) {
  return prisma.cours.create({
    data: {
      titre,
      description,
      url_video,
      prix: prix ?? 0,
      categorie,
      referent_id,
      // Si des chapitres sont fournis à la création, on les crée en même temps.
      // Sinon, l'array est vide et le cours est créé sans chapitre (ajoutés plus tard).
      chapitres: {
        create: (chapitres || []).map((chap, index) => ({
          titre: chap.titre,
          ordre_lecture: chap.ordre_lecture ?? index + 1,
          contenu_textuel: chap.contenu_textuel || null,
        })),
      },
    },
    include: { chapitres: true },
  });
}

module.exports = { getAllCours, getCoursById, createCours };
