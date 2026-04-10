import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// ================= REQUEST INTERCEPTOR =================
// ✅ Attach access token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});


// ================= RESPONSE INTERCEPTOR =================
API.interceptors.response.use(
  (res) => res,

  async (err) => {
    const originalRequest = err.config;

    // ✅ If token expired
    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");

      // ❌ No refresh token → logout
      if (!refreshToken) {
        logout();
        return Promise.reject(err);
      }

      try {
        // 🔄 Request new access token
        const res = await axios.post(
          "http://localhost:5000/api/user-auth/refresh-token",
          { token: refreshToken }
        );

        const newAccessToken = res.data.accessToken;

        // ✅ Save new token
        localStorage.setItem("token", newAccessToken);

        // ✅ Retry original request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return API(originalRequest);

      } catch (error) {
        // ❌ Refresh failed → logout
        logout();
        return Promise.reject(error);
      }
    }

    return Promise.reject(err);
  }
);


// ================= LOGOUT HELPER =================
const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");

  window.location.href = "/login";
};

export default API;