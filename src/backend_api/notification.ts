import axios from "axios";
const baseAPI = import.meta.env.VITE_BACKEND_API_ENDPOINT;
export async function getAllnotifications() {
  try {
    const response = await axios.get(`${baseAPI}/notifications`);

    return response.data; // Return the retrieved data
  } catch (error) {
    console.error("Error fetching colleges:", error);
    throw error; // Rethrow the error for handling
  }
}

export async function getAllnotificationsReaded() {
  try {
    const response = await axios.get(`${baseAPI}/notifications/readed`);

    return response.data; // Return the retrieved data
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error; // Rethrow the error for handling
  }
}

export async function updateNotifications(id: any) {
  try {
    const response = await axios.put(`${baseAPI}/notifications/${id}`);
    return response.data; // Return the response data
  } catch (error) {
    console.error("Error updating notifications:", error);
    throw error; // Rethrow the error for handling
  }
}
