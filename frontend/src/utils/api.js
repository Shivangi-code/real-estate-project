import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// ================= REQUEST =================
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

// ================= RESPONSE =================
API.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        logout();
        return Promise.reject(err);
      }

      try {
        const res = await axios.post(
          "http://localhost:5000/api/user-auth/refresh-token",
          { token: refreshToken }
        );

        const newAccessToken = res.data.accessToken;

        localStorage.setItem("token", newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return API(originalRequest);
      } catch {
        logout();
        return Promise.reject(err);
      }
    }

    return Promise.reject(err);
  }
);

// ================= LOGOUT =================
const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");

  // 🔥 FIX
  window.location.reload();
};

export default API;