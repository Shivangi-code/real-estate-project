import axios from "axios";

const API = "http://localhost:5000/property";

export const addProperty = async (formData) => {
  const token = localStorage.getItem("token");

  return await axios.post(`${API}/add`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};