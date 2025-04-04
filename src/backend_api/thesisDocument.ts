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

export async function deleteThesisDocument(id: string | undefined) {
  try {
    const response = await axios.delete(
      `http://localhost:5000/api/thesisDocuments/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting thesis document:", error);
    throw error;
  }
}

export async function updateThesisDocument(
  thesisId: any,
  panelId: any,
  data: any
) {
  try {
    const response = await axios.put(
      `http://localhost:5000/api/thesisDocuments/thesis/${thesisId}/panelApproval/${panelId}`,
      data
    );
    return response.data; // Return the updated thesis document data
  } catch (error) {
    console.error("Error updating thesis document:", error);
    throw error; // Rethrow the error for handling
  }
}
