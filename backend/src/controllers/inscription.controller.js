const inscriptionService = require('../services/inscription.service');

async function inscrire(req, res) {
  try {
    const { id } = req.params; // id du cours
    const apprenant_id = req.user.id_user;

    const inscription = await inscriptionService.inscrire(apprenant_id, id);
    return res.status(201).json(inscription);

  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message || "Erreur serveur" });
  }
}

async function getProgression(req, res) {
  try {
    const { id } = req.params; // id du cours
    const apprenant_id = req.user.id_user;

    const progression = await inscriptionService.getProgression(apprenant_id, id);
    return res.status(200).json(progression);

  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message || "Erreur serveur" });
  }
}

module.exports = { inscrire, getProgression };
