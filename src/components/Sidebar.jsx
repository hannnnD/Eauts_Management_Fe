import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  return (
    <div className="sidebar">
      <h2>Admin Panel</h2>
      <ul>
        <li>
          <Link to="/admin/dashboard">🏠 Trang chủ</Link>
        </li>

        <li>
          <button onClick={() => toggleDropdown("users")}>👤 Quản lý người dùng ▾</button>
          {openDropdown === "users" && (
            <ul className="dropdown">
              <li><Link to="/login">Đăng xuất</Link></li>
            </ul>
          )}
        </li>

        <li>
          <button onClick={() => toggleDropdown("teachers")}>📚 Quản lý giảng viên ▾</button>
          {openDropdown === "teachers" && (
            <ul className="dropdown">
              <li><Link to="/admin/teachers/add">Thêm giảng viên</Link></li>
              <li><Link to="/admin/teachers">Danh sách giảng viên</Link></li>
            </ul>
          )}
        </li>

        <li>
          <button onClick={() => toggleDropdown("courses")}>📖 Quản lý khóa học ▾</button>
          {openDropdown === "courses" && (
            <ul className="dropdown">
              <li><Link to="/admin/courses/add">Thêm khóa học</Link></li>
              <li><Link to="/admin/courses">Danh sách khóa học</Link></li>
            </ul>
          )}
        </li>

        <li>
          <button onClick={() => toggleDropdown("classes")}>🏫 Quản lý lớp học ▾</button>
          {openDropdown === "classes" && (
            <ul className="dropdown">
              <li><Link to="/admin/classes/add">Thêm lớp học</Link></li>
              <li><Link to="/admin/classes">Danh sách lớp học</Link></li>
            </ul>
          )}
        </li>

        <li>
          <button onClick={() => toggleDropdown("schedules")}>📅 Quản lý lịch học ▾</button>
          {openDropdown === "schedules" && (
            <ul className="dropdown">
              <li><Link to="/admin/schedules/add">Thêm lịch học</Link></li>
              <li><Link to="/admin/schedules">Danh sách lịch học</Link></li>
            </ul>
          )}
        </li>

        <li>
          <button onClick={() => toggleDropdown("students")}>🎓 Quản lý sinh viên ▾</button>
          {openDropdown === "students" && (
            <ul className="dropdown">
              <li><Link to="/admin/students/add">Thêm sinh viên</Link></li>
              <li><Link to="/admin/students">Danh sách sinh viên</Link></li>
            </ul>
          )}
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
