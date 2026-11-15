import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check whether a user is already logged in
  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get("/auth/me");

        const loggedInUser = response.data.user;

        setUser({
          id: loggedInUser._id || loggedInUser.id,
          name: loggedInUser.name,
          email: loggedInUser.email
        });

      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("mini_user");
        setUser(null);

      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  // Register user
  const register = async (name, email, password) => {
    try {
      const response = await api.post("/auth/register", {
        name,
        email,
        password
      });

      return {
        success: true,
        message: response.data.message
      };

    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Registration failed. Please try again."
      };
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", {
        email,
        password
      });

      const { token, user: loggedInUser } = response.data;

      localStorage.setItem("token", token);

      const formattedUser = {
        id: loggedInUser.id || loggedInUser._id,
        name: loggedInUser.name,
        email: loggedInUser.email
      };

      localStorage.setItem(
        "mini_user",
        JSON.stringify(formattedUser)
      );

      setUser(formattedUser);

      return {
        success: true,
        message: response.data.message
      };

    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Login failed. Please try again."
      };
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("mini_user");

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
