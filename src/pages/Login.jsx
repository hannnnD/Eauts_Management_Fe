import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

export const Login = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Tên đăng nhập và mật khẩu không được để trống!");
      return;
    }
  
    try {
      const response = await axios.post("http://127.0.0.1:8080/auth/login", { username, password });
  
      if (response.data === "Invalid credentials") {
        setError("Tên đăng nhập hoặc mật khẩu không đúng!");
        return;
      }
  
      const token = response.data;
      console.log("Token nhận được từ API:", token);
  
      try {
        const payload = JSON.parse(atob(token.split(".")[1])); // Giải mã payload JWT
        console.log("Payload giải mã:", payload);
        const role = payload.role;
  
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
  
        console.log("Token lưu vào localStorage:", localStorage.getItem("token"));
        console.log("Role lưu vào localStorage:", localStorage.getItem("role"));

        setIsLoggedIn(true);  // ✅ Cập nhật trạng thái đăng nhập

        setTimeout(() => {
          switch (role) {
            case "ADMIN":
              navigate("/admin/dashboard");
              break;
            case "TEACHER":
              navigate("/teacher/dashboard");
              break;
            case "STUDENT":
              navigate("/student/dashboard");
              break;
            default:
              setError("Quyền truy cập không hợp lệ!");
          }
        }, 1000);
      } catch (decodeError) {
        console.error("Lỗi khi giải mã JWT:", decodeError);
        setError("Lỗi xác thực! Token không hợp lệ.");
      }
    } catch (error) {
      console.error("Lỗi khi đăng nhập:", error);
      setError("Lỗi hệ thống! Vui lòng thử lại.");
    }
  };

  return (
    <div className="login-container">
      <h2>Đăng nhập</h2>
      {error && <p className="error-msg">{error}</p>}
      <input
        type="text"
        placeholder="Tên đăng nhập"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Mật khẩu"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="login-btn" onClick={handleLogin}>Đăng nhập</button>
    </div>
  );
};
