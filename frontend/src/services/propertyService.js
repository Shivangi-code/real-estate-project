import axios from "axios";

const API = `${import.meta.env.VITE_API_URL}/property`;

export const addProperty = async (formData) => {
  const token = localStorage.getItem("token");

  return await axios.post(`${API}/add`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};