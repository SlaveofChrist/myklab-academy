const coursService = require('../services/cours.service');

const CATEGORIES_VALIDES = ['NUMERIQUE', 'ARTISANAT', 'AGRICULTURE'];

async function list(req, res) {
  try {
    const { categorie } = req.query; // ex: /api/cours?categorie=NUMERIQUE

    if (categorie && !CATEGORIES_VALIDES.includes(categorie)) {
      return res.status(400).json({ message: `Catégorie invalide. Valeurs acceptées : ${CATEGORIES_VALIDES.join(', ')}` });
    }

    const cours = await coursService.getAllCours(categorie);
    return res.status(200).json(cours);

  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message || "Erreur serveur" });
  }
}

async function detail(req, res) {
  try {
    const { id } = req.params;
    const cours = await coursService.getCoursById(id);
    return res.status(200).json(cours);

  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message || "Erreur serveur" });
  }
}

async function create(req, res) {
  try {
    const { titre, description, url_video, prix, categorie, chapitres } = req.body;

    if (!titre || !description || !categorie) {
      return res.status(400).json({ message: "titre, description et categorie sont requis" });
    }
    if (!CATEGORIES_VALIDES.includes(categorie)) {
      return res.status(400).json({ message: `Catégorie invalide. Valeurs acceptées : ${CATEGORIES_VALIDES.join(', ')}` });
    }

    // req.user vient du authMiddleware (voir routes) : on sait déjà qui est connecté
    const referent_id = req.user.id_user;

    const cours = await coursService.createCours({
      titre, description, url_video, prix, categorie, referent_id, chapitres,
    });

    return res.status(201).json(cours);

  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message || "Erreur serveur" });
  }
}

module.exports = { list, detail, create };
