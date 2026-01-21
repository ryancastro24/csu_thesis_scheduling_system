import axios from "axios";
const baseAPI = import.meta.env.VITE_BACKEND_API_ENDPOINT;
export async function panelApprovalRequest(data: any) {
  console.log("accepting data:", data);
  try {
    const response = await axios.post(`${baseAPI}/panelApproval`, data);

    return response.data; // Return the created department data
  } catch (error) {
    console.error("Error adding department:", error);
    throw error; // Rethrow the error for handlinghttp://localhost:5000/api/thesisDocuments
  }
}

export async function getUserPanelApprovals(id: any) {
  try {
    const response = await axios(`${baseAPI}/panelApproval/${id}`);

    return response.data; // Return the response data
  } catch (error) {
    console.error("Error updating notifications:", error);
    throw error; // Rethrow the error for handling
  }
}

export async function changePanel(id: any, oldPanelId: any, data: any) {
  try {
    const response = await axios.put(
      `${baseAPI}/panelApproval/change-panel/${id}/panel/${oldPanelId}`,
      data
    );
    return response.data; // Return the response data
  } catch (error) {
    console.error("Error updating notifications:", error);
    throw error; // Rethrow the error for handling
  }
}

export async function getPanelApprovals(id: any) {
  try {
    const response = await axios(
      `${baseAPI}/panelApproval/panelApprovalData/${id}`
    );

    console.log("panel approvals:", response.data);
    return response.data; // Return the response data
  } catch (error) {
    console.error("Error updating notifications:", error);
    throw error; // Rethrow the error for handling
  }
}

export async function panelApproval(id: any, data: any) {
  try {
    const response = await axios.put(
      `${baseAPI}/panelApproval/panelApprovalStatus/${id}`,
      data
    );
    return response.data; // Return the response data
  } catch (error) {
    console.error("Error updating notifications:", error);
    throw error; // Rethrow the error for handling
  }
}
