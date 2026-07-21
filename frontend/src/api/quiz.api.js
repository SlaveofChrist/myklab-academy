import axiosClient from './axiosClient';

export async function soumettreTentative(quizId, reponses) {
  const response = await axiosClient.post(`/quiz/${quizId}/tentative`, { reponses });
  return response.data; // { score_obtenu, est_reussi, nb_bonnes_reponses, total_questions, score_min_requis }
}

export async function createQuiz(data){
  const response = await axiosClient.post('/quiz', data);
  return response.data;
}

export async function getQuizById(quizId) {
  const response = await axiosClient.get(`/quiz/${quizId}`);
  return response.data;
}

export async function getTentatives(quizId) {
  const response = await axiosClient.get(`/quiz/${quizId}/tentatives`);
  return response.data;
}


