import axios from "axios";
export async function addFavorites(data: any) {
  try {
    const response = await axios.post(
      "http://localhost:5000/api/favorites/",
      data
    );
    return response.data; // Return the created department data
  } catch (error) {
    console.error("Error adding department:", error);
    throw error; // Rethrow the error for handling
  }
}

export async function getUserFavorites(id: string) {
  try {
    const response = await axios(`http://localhost:5000/api/favorites/${id}`);
    return response.data; // Return the created department data
  } catch (error) {
    console.error("Error adding department:", error);
    throw error; // Rethrow the error for handling
  }
}

export async function removeFavorites(data: any) {
  try {
    const response = await axios.delete(
      `http://localhost:5000/api/favorites/${data.userId}/${data.thesisId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error removing favorites:", error);
    throw error;
  }
}
