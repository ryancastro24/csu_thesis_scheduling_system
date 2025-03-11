import axios from "axios";

export async function getDepartments() {
  try {
    const response = await axios.get("http://localhost:5000/api/departments");
    return response.data; // Return the retrieved data
  } catch (error) {
    console.error("Error fetching colleges:", error);
    throw error; // Rethrow the error for handling
  }
}

export async function addUsertData(data: any) {
  try {
    const response = await axios.post("http://localhost:5000/api/users", data);
    return response.data; // Return the created department data
  } catch (error) {
    console.error("Error adding department:", error);
    throw error; // Rethrow the error for handling
  }
}

export async function getUsers() {
  try {
    const response = await axios.get("http://localhost:5000/api/users");
    return response.data; // Return the retrieved data
  } catch (error) {
    console.error("Error fetching colleges:", error);
    throw error; // Rethrow the error for handling
  }
}

export async function deleteUserData(id: string) {
  try {
    const response = await axios.delete(
      `http://localhost:5000/api/users/${id}`
    );
    console.log("delete function response", response.data);
    return response.data; // Return the created department data
  } catch (error) {
    console.error("Error adding department:", error);
    throw error; // Rethrow the error for handling
  }
}
