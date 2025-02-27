import React, { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import SidebarTeacher from "../../components/SidebarTeacher";

const TeacherDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      console.error("Không tìm thấy token, chuyển hướng đến login!");
      navigate("/login");
      return;
    }
  
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      console.log("Payload từ token:", payload);
  
      if (!payload.role || payload.role !== "TEACHER") {
        console.error("Người dùng không có quyền truy cập!");
        navigate("/login");
        return;
      }
  
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp < now) {
        console.error("Token đã hết hạn!");
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }
  
    } catch (error) {
      console.error("Lỗi giải mã token:", error);
      navigate("/login");
    }
  }, [navigate]);
  

  return (
    <div className="flex h-screen">
      {/* Sidebar cố định bên trái */}
      <div className="w-64 bg-gray-800 text-white border-r border-gray-300">
        <SidebarTeacher />
      </div>
  
      {/* Khu vực hiển thị nội dung thay đổi */}
      <div className="flex-1 p-5">
        <Outlet />  {/* Nơi hiển thị nội dung theo tuyến đường */}
      </div>
    </div>
  );
};

export default TeacherDashboard;
