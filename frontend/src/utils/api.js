import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  withCredentials: true,
});
// ================= REQUEST =================
API.interceptors.request.use((req) => {

  const token =
    localStorage.getItem("token");

  if (token) {
    req.headers.Authorization =
      `Bearer ${token}`;
  }

  return req;
});

// ================= RESPONSE =================
API.interceptors.response.use(

  (res) => res,

  async (err) => {

    const originalRequest =
      err.config;

    // ================= TOKEN EXPIRED =================
    if (
      err.response?.status === 401 &&
      !originalRequest._retry
    ) {

      originalRequest._retry = true;

      const refreshToken =
        localStorage.getItem(
          "refreshToken"
        );

      // ❌ NO REFRESH TOKEN
      if (!refreshToken) {

        logout();

        return Promise.reject(err);
      }

      try {

        // 🔄 GET NEW ACCESS TOKEN
        const res =
          await axios.post(
            `${import.meta.env.VITE_API_URL}/api/user-auth/refresh-token`,
            {
              token: refreshToken,
            }
          );

        const newAccessToken =
          res.data.accessToken;

        // ✅ SAVE NEW TOKEN
        localStorage.setItem(
          "token",
          newAccessToken
        );

        // ✅ RETRY REQUEST
        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;

        return API(originalRequest);

      } catch (error) {

        logout();

        return Promise.reject(error);
      }
    }

    return Promise.reject(err);
  }
);

// ================= LOGOUT =================
const logout = () => {

  // ✅ CLEAR STORAGE ONLY
  localStorage.removeItem("token");

  localStorage.removeItem(
    "refreshToken"
  );

  localStorage.removeItem("user");

  // ❌ NO:
  // window.location.reload()
  // window.location.href
};

export default API;