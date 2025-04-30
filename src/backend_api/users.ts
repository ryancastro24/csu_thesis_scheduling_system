import axios from "axios";
const baseAPI = import.meta.env.VITE_BACKEND_API_ENDPOINT;
export async function getDepartments() {
  try {
    const response = await axios.get(`${baseAPI}/departments`);
    return response.data; // Return the retrieved data
  } catch (error) {
    console.error("Error fetching colleges:", error);
    throw error; // Rethrow the error for handling
  }
}

export async function addUsertData(data: any) {
  try {
    const response = await axios.post(`${baseAPI}/users`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data; // Return the created department data
  } catch (error) {
    console.error("Error adding department:", error);
    throw error; // Rethrow the error for handling
  }
}

export async function getUsers() {
  try {
    const response = await axios.get(`${baseAPI}/users`);
    return response.data; // Return the retrieved data
  } catch (error) {
    console.error("Error fetching colleges:", error);
    throw error; // Rethrow the error for handling
  }
}

export async function getStudents() {
  try {
    const response = await axios.get(`${baseAPI}/users/students/data`);
    return response.data; // Return the retrieved data
  } catch (error) {
    console.error("Error fetching colleges:", error);
    throw error; // Rethrow the error for handling
  }
}

export async function getfaculty() {
  try {
    const response = await axios.get(`${baseAPI}/users/faculty/data`);
    return response.data; // Return the retrieved data
  } catch (error) {
    console.error("Error fetching colleges:", error);
    throw error; // Rethrow the error for handling
  }
}

export async function getChairpersons() {
  try {
    const response = await axios.get(`${baseAPI}/users/chairpersons/data`);
    return response.data; // Return the retrieved data
  } catch (error) {
    console.error("Error fetching colleges:", error);
    throw error; // Rethrow the error for handling
  }
}
export async function deleteUserData(id: string) {
  try {
    const response = await axios.delete(`${baseAPI}/users/${id}`);
    console.log("delete function response", response.data);
    return response.data; // Return the created department data
  } catch (error) {
    console.error("Error adding department:", error);
    throw error; // Rethrow the error for handling
  }
}

export async function updateUserData(id: any, data: any) {
  console.log("user id", id);
  try {
    const response = await axios.put(`${baseAPI}/users/${id}`, data);
    console.log("delete function response", response.data);
    return response.data; // Return the created department data
  } catch (error) {
    console.error("Error adding department:", error);
    throw error; // Rethrow the error for handling
  }
}

export async function approvedUser(id: any) {
  console.log("user id", id);
  try {
    const response = await axios.put(`${baseAPI}/users/approvedUser/${id}`);
    console.log("delete function response", response.data);
    return response.data; // Return the created department data
  } catch (error) {
    console.error("Error adding department:", error);
    throw error; // Rethrow the error for handling
  }
}

export async function updateUserProfile(id: any, data: FormData) {
  console.log("user id", id);
  try {
    const response = await axios.put(
      `${baseAPI}/users/updateUserProfile/${id}`,
      data,
      {}
    );
    console.log("update profile response", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
}

export async function getUserProfile(id: any) {
  try {
    const response = await axios.get(
      `${baseAPI}/users/getUserProfile/data/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
}
