import React, { useState } from "react";
import { Link } from "react-router-dom";


const SidebarTeacher = () => {
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  return (
    <div className="sidebar">
      <h2>Teacher Panel</h2>
      <ul>
        <li>
          <Link to="/teacher/dashboard">🏠 Trang chủ</Link>
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
  <Link to="/teacher/schedule">📚 Lịch dạy học</Link>
</li>
      </ul>
    </div>
  );
};

export default SidebarTeacher;
