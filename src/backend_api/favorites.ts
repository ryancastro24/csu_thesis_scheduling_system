import axios from "axios";
const baseAPI = import.meta.env.VITE_BACKEND_API_ENDPOINT;
export async function addFavorites(data: any) {
  try {
    const response = await axios.post(`${baseAPI}/favorites/`, data);
    return response.data; // Return the created department data
  } catch (error) {
    console.error("Error adding department:", error);
    throw error; // Rethrow the error for handling
  }
}

export async function getUserFavorites(id: string) {
  try {
    const response = await axios(`${baseAPI}/favorites/${id}`);
    return response.data; // Return the created department data
  } catch (error) {
    console.error("Error adding department:", error);
    throw error; // Rethrow the error for handling
  }
}

export async function removeFavorites(data: any) {
  try {
    const response = await axios.delete(
      `${baseAPI}/favorites/${data.userId}/${data.thesisId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error removing favorites:", error);
    throw error;
  }
}
