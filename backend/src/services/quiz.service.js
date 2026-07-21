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

  // Vérification de la limite de 3 tentatives
  const countTentatives = await prisma.tentativeQuiz.count({
    where: {
      apprenant_id,
      quiz_id: Number(quiz_id),
    },
  });

  if (countTentatives >= 3) {
    const error = new Error("Vous avez atteint la limite maximale de 3 tentatives pour ce quiz.");
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

async function getQuizById(id_quiz) {
  const quiz = await prisma.quiz.findUnique({
    where: { id_quiz: Number(id_quiz) },
    include: { questions: true },
  });

  if (!quiz) {
    const error = new Error("Quiz introuvable");
    error.statusCode = 404;
    throw error;
  }

  return quiz;
}

async function createQuiz({ titre, score_min_reussite, temps_limite, cours_id, questions }) {
  return prisma.quiz.create({
    data: {
      titre,
      score_min_reussite: Number(score_min_reussite) || 50,
      temps_limite: temps_limite ? Number(temps_limite) : null,
      cours_id: Number(cours_id),
      questions: {
        create: (questions || []).map((quest) => ({
          enonce: quest.enonce,
          options_reponses: quest.options_reponses || [],
          reponse_correcte: quest.reponse_correcte || '',
        })),
      },
    },
    include: { questions: true },
  });
}

async function getTentatives(apprenant_id, quiz_id) {
  return prisma.tentativeQuiz.findMany({
    where: {
      apprenant_id: Number(apprenant_id),
      quiz_id: Number(quiz_id),
    },
    orderBy: { date_passage: 'desc' },
  });
}

module.exports = { soumettreTentative, createQuiz, getQuizById, getTentatives };

