import axios from "axios";
const baseAPI = import.meta.env.VITE_BACKEND_API_ENDPOINT;
export async function createThesisSchedule(data: any) {
  try {
    const response = await axios.post(
      `${baseAPI}/thesisDocuments/thesisDocumentData/data`,
      data
    );
    return response.data; // Return the created department data
  } catch (error) {
    console.error("Error adding department:", error);
    throw error; // Rethrow the error for handlinghttp://localhost:5000/api/thesisDocuments
  }
}

export async function createFinalThesisSchedule(data: any) {
  try {
    const response = await axios.post(
      `${baseAPI}/thesisDocuments/thesisFinalDocumentData/data`,
      data
    );
    return response.data; // Return the created department data
  } catch (error) {
    console.error("Error adding department:", error);
    throw error; // Rethrow the error for handlinghttp://localhost:5000/api/thesisDocuments
  }
}

export async function getThesisDocuments(department: string) {
  try {
    const response = await axios.get(`${baseAPI}/thesisDocuments`, {
      params: { department }, // sends ?department=BSCS
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching thesis documents:", error);
    throw error;
  }
}

export async function getApprovedThesisDocuments() {
  try {
    const response = await axios.get(
      `${baseAPI}/thesisDocuments/getAllApprovedThesis/data`
    );
    return response.data; // Return the retrieved data
  } catch (error) {
    console.error("Error fetching colleges:", error);
    throw error; // Rethrow the error for handling
  }
}

export async function deleteThesisDocument(id: string | undefined) {
  try {
    const response = await axios.delete(`${baseAPI}/thesisDocuments/${id}`);
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
      `${baseAPI}/thesisDocuments/thesis/${thesisId}/panelApproval/${panelId}`,
      data
    );
    return response.data; // Return the updated thesis document data
  } catch (error) {
    console.error("Error updating thesis document:", error);
    throw error; // Rethrow the error for handling
  }
}

export async function getUserApprovedThesisDocuments(id: string) {
  try {
    const response = await axios.get(
      `${baseAPI}/thesisDocuments/specificApprovedThesisModel/data/${id}`
    );
    console.log("response.data:", response.data);
    return response.data; // Return the retrieved data
  } catch (error) {
    console.error("Error fetching colleges:", error);
    throw error; // Rethrow the error for handling
  }
}

export async function rescheduleThesis(thesisId: any, data: any) {
  try {
    const response = await axios.put(
      `${baseAPI}/thesisDocuments/rescheduleThesisSchedule/thesis/${thesisId}`,
      data
    );
    return response.data; // Return the updated thesis document data
  } catch (error) {
    console.error("Error updating thesis document:", error);
    throw error; // Rethrow the error for handling
  }
}

export async function getUserThesisModel(id: string | undefined) {
  try {
    const response = await axios(
      `${baseAPI}/thesisDocuments/getUserThesisModelData/data/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting thesis document:", error);
    throw error;
  }
}

export async function getUserFinalThesisModel(id: string | undefined) {
  try {
    const response = await axios(
      `${baseAPI}/thesisDocuments/getUserFinalThesisModelData/data/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting thesis document:", error);
    throw error;
  }
}

export async function updateThesisScheduleApproval(thesisId: any, data: any) {
  try {
    const response = await axios.put(
      `${baseAPI}/thesisDocuments/updateThesisScheduleApprovalData/thesis/${thesisId}`,
      data
    );
    return response.data; // Return the updated thesis document data
  } catch (error) {
    console.error("Error updating thesis document:", error);
    throw error; // Rethrow the error for handling
  }
}

export async function getThesisByAdviser(id: string | undefined) {
  try {
    const response = await axios.get(
      `${baseAPI}/thesisDocuments/getThesisByAdviserData/data/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching colleges:", error);
    throw error; // Rethrow the error for handling
  }
}

export async function updateThesisDefended(id: any) {
  try {
    const response = await axios.put(
      `${baseAPI}/thesisDocuments/thesisModel/${id}/defended`
    );
    return response.data;
  } catch (error) {
    console.error("Error updating thesis defended:", error);
    throw error;
  }
}
