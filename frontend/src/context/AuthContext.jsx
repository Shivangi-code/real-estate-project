import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  // ================= LOGIN =================
  const login = (userData, accessToken, refreshToken) => {
    localStorage.setItem("token", accessToken);

    if (refreshToken) {
      localStorage.setItem(
        "refreshToken",
        refreshToken
      );
    }

    localStorage.setItem(
      "user",
      JSON.stringify(userData)
    );

    setToken(accessToken);
    setUser(userData);
  };

  // ================= LOGOUT =================
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
  };

  // ================= AUTO RESTORE =================
  useEffect(() => {
    const storedToken =
      localStorage.getItem("token");

    const storedUser =
      localStorage.getItem("user");

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch {
        logout();
      }
    }

    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        login,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

// ================= CUSTOM HOOK =================
export const useAuth = () =>
  useContext(AuthContext);