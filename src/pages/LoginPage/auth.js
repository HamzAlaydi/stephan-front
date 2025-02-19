// auth.js
export const mockAuth = (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email === "user@example.com" && password === "password123") {
        resolve({ token: "fake-jwt-token", user: { email } });
      } else {
        reject(new Error("Invalid email or password"));
      }
    }, 1000); // Simulate network delay
  });
};
