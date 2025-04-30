import axios from "axios";
const baseAPI = import.meta.env.VITE_BACKEND_API_ENDPOINT;
export async function addNewSchedule(data: any) {
  try {
    const response = await axios.post(`${baseAPI}/schedules`, data);

    return response;
  } catch (error) {
    console.error("Error during login:", error);
    throw error; // Rethrow for handling in UI
  }
}
