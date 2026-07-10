const chapitreService = require('../services/chapitre.service');

async function marquerVu(req, res) {
  try {
    const { id } = req.params; // id du chapitre
    const apprenant_id = req.user.id_user;

    const resultat = await chapitreService.marquerCommeVu(apprenant_id, id);
    return res.status(200).json(resultat);

  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message || "Erreur serveur" });
  }
}

module.exports = { marquerVu };
