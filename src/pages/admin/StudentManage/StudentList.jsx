import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../../components/Sidebar";
import { FaEdit, FaTrash } from "react-icons/fa";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.warn("Token không tồn tại, chuyển hướng về đăng nhập");
          window.location.href = "/login";
          return;
        }

        const response = await axios.get("http://localhost:8080/admin/students", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setStudents(response.data);
      } catch (err) {
        console.error("Lỗi tải danh sách sinh viên:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleDelete = async (studentId) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa sinh viên này?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8080/admin/students/${studentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setStudents(students.filter((student) => student.student_id !== studentId));
      alert("Xóa thành công!");
    } catch (err) {
      console.error("Lỗi khi xóa sinh viên:", err);
      alert("Không thể xóa sinh viên.");
    }
  };

  if (loading) return <p>Đang tải danh sách sinh viên...</p>;

  return (
    <div className="student-list-container">
      <Sidebar />
      <div className="content">
        <h2 className="title">Danh sách sinh viên</h2>
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
              <th>Năm nhập học</th>
              <th>Tình trạng</th>
              <th>Mã sinh viên</th>
              <th>Chuyên ngành</th>
              <th>Lớp</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {students
              .filter((student) =>
                student.full_name.toLowerCase().includes(search.toLowerCase())
              )
              .map((student) => (
                <tr key={student.student_id}>
                  <td>{student.student_id}</td>
                  <td>{student.full_name}</td>
                  <td>{student.date_of_birth}</td>
                  <td className={student.gender === "MALE" ? "male" : "female"}>
                    {student.gender === "MALE" ? "Nam" : "Nữ"}
                  </td>
                  <td>{student.address}</td>
                  <td>{student.phone}</td>
                  <td>{student.enrollment_year}</td>
                  <td>{student.status === "ACTIVE" ? "Đang học" : "Ngừng học"}</td>
                  <td>{student.username}</td>
                  <td>{student.major_name}</td>
                  <td>{student.class_name}</td>
                  <td className="actions">
                    <Link to={`/admin/students/update/${student.student_id}`}>
                      <FaEdit className="icon edit" />
                    </Link>
                    <FaTrash className="icon delete" onClick={() => handleDelete(student.student_id)} />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentList;
