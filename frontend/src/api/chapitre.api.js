import axiosClient from './axiosClient';

export async function marquerChapitreVu(chapitreId) {
  const response = await axiosClient.post(`/chapitres/${chapitreId}/vu`);
  return response.data;
}
