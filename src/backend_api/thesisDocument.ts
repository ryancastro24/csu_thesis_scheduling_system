import axios from "axios";
export async function createThesisSchedule(data: any) {
  try {
    const response = await axios.post(
      "http://localhost:5000/api/thesisDocuments",
      data
    );
    return response.data; // Return the created department data
  } catch (error) {
    console.error("Error adding department:", error);
    throw error; // Rethrow the error for handlinghttp://localhost:5000/api/thesisDocuments
  }
}

export async function getThesisDocuments() {
  try {
    const response = await axios.get(
      "http://localhost:5000/api/thesisDocuments"
    );
    return response.data; // Return the retrieved data
  } catch (error) {
    console.error("Error fetching colleges:", error);
    throw error; // Rethrow the error for handling
  }
}
