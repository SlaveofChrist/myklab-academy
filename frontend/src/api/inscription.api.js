import axiosClient from './axiosClient';

export async function inscrireCours(coursId) {
  const response = await axiosClient.post(`/cours/${coursId}/inscription`);
  return response.data;
}

export async function getProgression(coursId) {
  const response = await axiosClient.get(`/cours/${coursId}/progression`);
  return response.data; // { total_chapitres, chapitres_vus, pourcentage }
}
