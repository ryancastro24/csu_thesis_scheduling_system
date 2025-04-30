import axios from "axios";
const baseAPI = import.meta.env.VITE_BACKEND_API_ENDPOINT;
export async function login(data: any) {
  try {
    const response = await axios.post(`${baseAPI}/auth/login`, data);

    const userData = response.data; // Extract user data
    const authToken = userData.token; // Assuming token is included in response

    // Store user data and token in localStorage only if token exists
    if (authToken) {
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("authToken", authToken);
    }
    console.log(userData);

    return userData;
  } catch (error) {
    console.error("Error during login:", error);
    throw error; // Rethrow for handling in UI
  }
}
