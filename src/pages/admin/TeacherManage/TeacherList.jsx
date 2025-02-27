import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../../components/Sidebar";
import { FaEdit, FaTrash } from "react-icons/fa";

const TeacherList = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.warn("Token không tồn tại, chuyển hướng về đăng nhập");
          window.location.href = "/login";
          return;
        }

        const response = await axios.get("http://localhost:8080/admin/teachers", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Cập nhật danh sách giảng viên, thêm username và password từ user object
        const updatedTeachers = response.data.map(teacher => ({
          ...teacher,
          username: teacher.user?.username || "N/A",
          password: teacher.user?.password || "N/A"
        }));

        setTeachers(updatedTeachers);
      } catch (err) {
        console.error("Lỗi tải danh sách giảng viên:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  const handleDelete = async (teacherId) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa giảng viên này?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8080/admin/teachers/${teacherId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTeachers(teachers.filter((teacher) => teacher.teacher_id !== teacherId));
      alert("Xóa thành công!");
    } catch (err) {
      console.error("Lỗi khi xóa giảng viên:", err);
      alert("Không thể xóa giảng viên.");
    }
  };

  if (loading) return <p>Đang tải danh sách giảng viên...</p>;

  return (
    <div className="teacher-list-container">
      <Sidebar />
      <div className="content">
        <h2 className="title">Danh sách giảng viên</h2>
        <input
          type="text"
          placeholder="Tìm kiếm..."
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <table className="teacher-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Họ và tên</th>
              <th>Ngày sinh</th>
              <th>Giới tính</th>
              <th>Địa chỉ</th>
              <th>Số điện thoại</th>
              <th>Email</th>
              <th>Tên đăng nhập</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {teachers
              .filter((teacher) =>
                teacher.full_name.toLowerCase().includes(search.toLowerCase())
              )
              .map((teacher) => (
                <tr key={teacher.teacherId}>
                  <td>{teacher.teacherId}</td>
                  <td>{teacher.full_name}</td>
                  <td>{teacher.date_of_birth}</td>
                  <td className={teacher.gender === "MALE" ? "male" : "female"}>
                    {teacher.gender === "MALE" ? "Nam" : "Nữ"}
                  </td>
                  <td>{teacher.address}</td>
                  <td>{teacher.phone}</td>
                  <td>{teacher.email}</td>
                  <td>{teacher.username}</td>
                  <td className="actions">
                    <Link to={`/admin/teacher/update/${teacher.teacherId}`}>
                      <FaEdit className="icon edit" />
                    </Link>
                    <FaTrash className="icon delete" onClick={() => handleDelete(teacher.teacherId)} />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeacherList;
