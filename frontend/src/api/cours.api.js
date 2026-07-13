import axiosClient from './axiosClient';

/**
 * Récupère la liste des cours, avec filtre optionnel par catégorie.
 * categorie = 'NUMERIQUE' | 'ARTISANAT' | 'AGRICULTURE' | undefined (= tous)
 */
export async function getAllCours(categorie) {
  const params = categorie ? { categorie } : {};
  const response = await axiosClient.get('/cours', { params });
  return response.data;
}

export async function getCoursById(id) {
  const response = await axiosClient.get(`/cours/${id}`);
  return response.data;
}
