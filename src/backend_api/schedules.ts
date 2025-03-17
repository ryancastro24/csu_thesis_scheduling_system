import axios from "axios";

export async function generateSchedule(data: any) {
  try {
    const response = await axios.post(
      "http://localhost:5000/api/schedules/generateThesisSchedule/data",
      data
    );
    return response.data; // Return the created department data
  } catch (error) {
    console.error("Error adding department:", error);
    throw error; // Rethrow the error for handling
  }
}
