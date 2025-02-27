import React, { useState } from "react";
import { Link } from "react-router-dom";

const SidebarStudent = () => {
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
          <button onClick={() => toggleDropdown("schedules")}>📚 Xem lịch học ▾</button>
          {openDropdown === "schedules" && (
            <ul className="dropdown">
              <li><Link to="/student/schedule">Xem lịch học</Link></li>
            </ul>
          )}
        </li>

        <li>
          <button onClick={() => toggleDropdown("grades")}>📚 Xem điểm học tập ▾</button>
          {openDropdown === "grades" && (
            <ul className="dropdown">
              <li><Link to="/student/grades">Xem điểm học tập</Link></li>
            </ul>
          )}
        </li>
      </ul>
    </div>
  );
};

export default SidebarStudent;
