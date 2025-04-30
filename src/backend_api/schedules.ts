import axios from "axios";
const baseAPI = import.meta.env.VITE_BACKEND_API_ENDPOINT;
export async function generateSchedule(data: any) {
  try {
    const response = await axios.post(
      `${baseAPI}/schedules/generateThesisSchedule/data`,
      data
    );
    return response.data; // Return the created department data
  } catch (error) {
    console.error("Error adding department:", error);
    throw error; // Rethrow the error for handling
  }
}

export async function getUserSchedules(id: string) {
  try {
    const response = await axios.get(`${baseAPI}/schedules/${id}`);

    return response.data; // Return the retrieved data
  } catch (error) {
    console.error("Error fetching colleges:", error);
    throw error; // Rethrow the error for handling
  }
}

export async function deleteUserSchedule(id: string) {
  try {
    const response = await axios.delete(`${baseAPI}/schedules/${id}`);
    return response.data; // Return the retrieved data
  } catch (error) {
    console.error("Error fetching colleges:", error);
    throw error; // Rethrow the error for handling
  }
}

export async function getUserThesisDocuments(id: string) {
  try {
    const response = await axios.get(
      `${baseAPI}/thesisDocuments/specificThesisModel/data/${id}`
    );
    console.log("response.data:", response.data);
    return response.data; // Return the retrieved data
  } catch (error) {
    console.error("Error fetching colleges:", error);
    throw error; // Rethrow the error for handling
  }
}

export async function updateUserSchedule(id: any, data: any) {
  try {
    const response = await axios.put(`${baseAPI}/schedules/${id}`, data);
    return response.data; // Return the updated data
  } catch (error) {
    console.error("Error updating schedule:", error);
    throw error; // Rethrow the error for handling
  }
}
