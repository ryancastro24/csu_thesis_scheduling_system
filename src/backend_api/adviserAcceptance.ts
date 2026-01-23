const baseAPI = import.meta.env.VITE_BACKEND_API_ENDPOINT;
import axios from "axios";
export async function addAdviserAcceptanceRequest(data: any) {
  console.log("accepting data:", data);
  try {
    const response = await axios.post(`${baseAPI}/adviserAcceptance`, data);
    return response.data; // Return the created department data
  } catch (error) {
    console.error("Error adding department:", error);
    throw error;
  }
}

export async function getUserAdviserAcceptanceRequest(id: any) {
  try {
    const response = await axios(`${baseAPI}/adviserAcceptance/${id}`);

    console.log("adviser acceptance response data:", response.data);
    return response.data; // Return the response data
  } catch (error) {
    console.error("Error updating notifications:", error);
    throw error; // Rethrow the error for handling
  }
}

export async function getAdviserAcceptanceRequests(id: any) {
  try {
    const response = await axios(
      `${baseAPI}/adviserAcceptance/adviserApporvals/${id}`,
    );
    return response.data; // Return the response data
  } catch (error) {
    console.error("Error updating notifications:", error);
    throw error; // Rethrow the error for handling
  }
}

export async function approvedProposal(id: any, data: any) {
  console.log("updating approval");
  try {
    const response = await axios.put(
      `${baseAPI}/adviserAcceptance/approveProposal/${id}`,
      data,
    );
    return response.data; // Return the response data
  } catch (error) {
    console.error("Error updating notifications:", error);
    throw error; // Rethrow the error for handling
  }
}

export async function changeAdviserRequest(id: any, adviserId: any) {
  console.log("id", id);

  console.log("adviserId", adviserId);
  try {
    const response = await axios.put(
      `${baseAPI}/adviserAcceptance/changedAdviserRequest/${id}/${adviserId}`,
    );
    return response.data; // Return the created department data
  } catch (error) {
    console.error("Error adding department:", error);
    throw error;
  }
}
