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

export async function getUserSchedules(id: string) {
  try {
    const response = await axios.get(
      `http://localhost:5000/api/schedules/${id}`
    );
    return response.data; // Return the retrieved data
  } catch (error) {
    console.error("Error fetching colleges:", error);
    throw error; // Rethrow the error for handling
  }
}

export async function deleteUserSchedule(id: string) {
  try {
    const response = await axios.delete(
      `http://localhost:5000/api/schedules/${id}`
    );
    return response.data; // Return the retrieved data
  } catch (error) {
    console.error("Error fetching colleges:", error);
    throw error; // Rethrow the error for handling
  }
}

export async function getUserThesisDocuments(id: string) {
  try {
    const response = await axios.get(
      `
http://localhost:5000/api/thesisDocuments/specificThesisModel/data/${id}`
    );

    console.log(response.data);
    return response.data; // Return the retrieved data
  } catch (error) {
    console.error("Error fetching colleges:", error);
    throw error; // Rethrow the error for handling
  }
}
