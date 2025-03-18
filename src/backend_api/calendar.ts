import axios from "axios";

export async function addNewSchedule(data: any) {
  try {
    const response = await axios.post(
      "http://localhost:5000/api/schedules",
      data
    );

    return response;
  } catch (error) {
    console.error("Error during login:", error);
    throw error; // Rethrow for handling in UI
  }
}
