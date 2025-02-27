import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../../components/Sidebar";
import { FaEdit, FaTrash } from "react-icons/fa";

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.warn("Token không tồn tại, chuyển hướng về đăng nhập");
          window.location.href = "/login";
          return;
        }

        const response = await axios.get("http://localhost:8080/admin/courses", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setCourses(response.data);
      } catch (err) {
        console.error("Lỗi tải danh sách khóa học:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleDelete = async (courseId) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa khóa học này?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8080/admin/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCourses(courses.filter((course) => course.courses_id !== courseId));
      alert("Xóa thành công!");
    } catch (err) {
      console.error("Lỗi khi xóa khóa học:", err);
      alert("Không thể xóa khóa học.");
    }
  };

  if (loading) return <p>Đang tải danh sách khóa học...</p>;

  return (
    <div className="course-list-container">
      <Sidebar />
      <div className="content">
        <h2 className="title">Danh sách khóa học</h2>
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
              <th>Mã khóa học</th>
              <th>Tên khóa học</th>
              <th>Số tín chỉ</th>
              <th>Mô tả</th>
              <th>Học phí mỗi tín chỉ</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {courses
              .filter((course) =>
                course.courseName.toLowerCase().includes(search.toLowerCase())
              )
              .map((course) => (
                <tr key={course.courses_id}>
                  <td>{course.courses_id}</td>
                  <td>{course.courseCode}</td>
                  <td>{course.courseName}</td>
                  <td>{course.credits}</td>
                  <td>{course.description}</td>
                  <td>{course.tuitionFeePerCredit.toLocaleString()} VND</td>
                  <td className="actions">
                    <Link to={`/admin/courses/update/${course.courses_id}`}>
                      <FaEdit className="icon edit" />
                    </Link>
                    <FaTrash className="icon delete" onClick={() => handleDelete(course.courses_id)} />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CourseList;
