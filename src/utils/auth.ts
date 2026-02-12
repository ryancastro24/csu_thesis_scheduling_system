// utils/auth.ts
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem("authToken");
  return token !== null;
};

export const getUserData = (): any => {
  const userDataString = localStorage.getItem("user");

  const userData = userDataString ? JSON.parse(userDataString) : null;

  return userData;
};
