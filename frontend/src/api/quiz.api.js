import axiosClient from './axiosClient';

export async function soumettreTentative(quizId, reponses) {
  const response = await axiosClient.post(`/quiz/${quizId}/tentative`, { reponses });
  return response.data; // { score_obtenu, est_reussi, nb_bonnes_reponses, total_questions, score_min_requis }
}
