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

async function create(req, res) {
  try {

    const { titre, score_min_reussite, temps_limite, cours_id, questions, tentatives } = req.body;
    
        if (!titre || !score_min_reussite) {
          return res.status(400).json({ message: "titre, score_min_reussite sont requis" });
        }
    
        const quiz = await quizService.createQuiz({
          titre, score_min_reussite, temps_limite, cours_id, questions, tentatives
        });
    
        return res.status(201).json(quiz);

  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message || "Erreur serveur" });
  }
}
async function getDetail(req, res) {
  try {
    const { id } = req.params;
    const quiz = await quizService.getQuizById(id);
    return res.status(200).json(quiz);
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message || "Erreur serveur" });
  }
}

async function getTentatives(req, res) {
  try {
    const { id } = req.params;
    const apprenant_id = req.user.id_user;

    const tentatives = await quizService.getTentatives(apprenant_id, id);
    return res.status(200).json(tentatives);
  } catch (error) {
    return res.status(error.statusCode || 500).json({ message: error.message || "Erreur serveur" });
  }
}

module.exports = { soumettreTentative, create, getDetail, getTentatives };


