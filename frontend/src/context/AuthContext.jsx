import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore login when the application starts
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get("/auth/me");

        setUser(response.data);
      } catch (error) {
        console.error("Session expired:", error);

        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login
  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", {
        email: email.trim(),
        password,
      });

      const token = response.data.access_token;

      if (!token) {
        throw new Error(
          "Login succeeded but no access token was returned."
        );
      }

      // Save JWT
      localStorage.setItem("token", token);

      // Get logged-in user's details and role
      const meResponse = await api.get("/auth/me");

      const loggedInUser = meResponse.data;

      setUser(loggedInUser);

      return loggedInUser;
    } catch (error) {
      console.error("Login error:", error);

      const detail = error.response?.data?.detail;

      let message =
        "Login failed. Please check your credentials.";

      if (typeof detail === "string") {
        message = detail;
      } else if (Array.isArray(detail)) {
        message = detail
          .map(
            (item) =>
              item?.msg || "Invalid input"
          )
          .join(", ");
      } else if (
        detail &&
        typeof detail === "object"
      ) {
        message =
          detail.msg ||
          detail.message ||
          "Invalid login request.";
      }

      throw new Error(message);
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}