import axiosClient from './axiosClient';

/**
 * Chaque fonction ici correspond exactement à une route du backend.
 * Elle renvoie directement response.data pour simplifier l'usage côté composants.
 */

export async function loginRequest({ email, mdp }) {
  const response = await axiosClient.post('/auth/login', { email, mdp });
  return response.data; // { user, token }
}

export async function registerRequest({ nom, email, mdp, role }) {
  const response = await axiosClient.post('/auth/register', { nom, email, mdp, role });
  return response.data; // { user, token }
}
