import axios from "axios";

// Lấy token từ localStorage
const token = localStorage.getItem("token");

const api = axios.create({
  baseURL: "http://localhost:8080", // Thay URL nếu cần
  headers: {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "", // Thêm Token vào Header nếu có
  },
});

export default api;
