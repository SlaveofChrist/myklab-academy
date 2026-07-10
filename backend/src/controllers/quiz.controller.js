const quizService = require('../services/quiz.service');

async function soumettreTentative(req, res) {
  try {
    const { id } = req.params; // id du quiz
    const { reponses } = req.body;
    const apprenant_id = req.user.id_user;

    const resultat = await quizService.soumettreTentative(apprenant_id, id, reponses);
    return res.status(201).json(resultat);

  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message || "Erreur serveur" });
  }
}

module.exports = { soumettreTentative };
