const prisma = require('../config/db');

/**
 * Traite la soumission d'un quiz par un apprenant.
 * @param {number} apprenant_id
 * @param {number} quiz_id
 * @param {Array} reponses - ex: [{ id_quest: 1, reponse: "Option A" }, ...]
 */
async function soumettreTentative(apprenant_id, quiz_id, reponses) {
  const quiz = await prisma.quiz.findUnique({
    where: { id_quiz: Number(quiz_id) },
    include: { questions: true },
  });

  if (!quiz) {
    const error = new Error("Quiz introuvable");
    error.statusCode = 404;
    throw error;
  }

  if (!Array.isArray(reponses) || reponses.length === 0) {
    const error = new Error("Le champ 'reponses' doit être un tableau non vide");
    error.statusCode = 400;
    throw error;
  }

  // Calcul du score : on compare chaque réponse donnée à la bonne réponse stockée
  let nbBonnesReponses = 0;

  for (const question of quiz.questions) {
    const reponseApprenant = reponses.find((r) => r.id_quest === question.id_quest);
    if (reponseApprenant && reponseApprenant.reponse === question.reponse_correcte) {
      nbBonnesReponses++;
    }
  }

  const totalQuestions = quiz.questions.length;
  const score_obtenu = totalQuestions === 0 ? 0 : Math.round((nbBonnesReponses / totalQuestions) * 100);
  const est_reussi = score_obtenu >= quiz.score_min_reussite;

  const tentative = await prisma.tentativeQuiz.create({
    data: {
      apprenant_id,
      quiz_id: Number(quiz_id),
      score_obtenu,
      est_reussi,
    },
  });

  return {
    ...tentative,
    nb_bonnes_reponses: nbBonnesReponses,
    total_questions: totalQuestions,
    score_min_requis: quiz.score_min_reussite,
  };
}

module.exports = { soumettreTentative };
