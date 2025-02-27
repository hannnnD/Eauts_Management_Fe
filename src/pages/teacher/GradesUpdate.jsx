import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import SidebarTeacher from "../../components/SidebarTeacher";

const GradesUpdate = () => {
  const { id } = useParams(); // Lấy scheduleId từ URL
  const navigate = useNavigate();
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.warn("Token không tồn tại, chuyển hướng về đăng nhập");
          navigate("/login");
          return;
        }
        
        const response = await axios.get(`http://localhost:8080/teacher/grades/schedule/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        setGrades(response.data);
      } catch (err) {
        setError("Không thể tải danh sách điểm.");
      } finally {
        setLoading(false);
      }
    };

    fetchGrades();
  }, [id, navigate]);

  const handleInputChange = (index, field, value) => {
    const updatedGrades = [...grades];
    updatedGrades[index][field] = parseFloat(value) || 0;
    setGrades(updatedGrades);
  };

  const handleUpdateGrades = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("Token không tồn tại, chuyển hướng về đăng nhập");
        navigate("/login");
        return;
      }

      const updateData = grades.map(({ gradesId, attendance, midterm, finalExam }) => ({
        gradesId,
        attendance,
        midterm,
        finalExam,
      }));

      await axios.put("http://localhost:8080/teacher/grades/bulk", updateData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Cập nhật điểm thành công!");
    } catch (err) {
      alert("Cập nhật điểm thất bại!");
    }
  };

  if (loading) return <p>Đang tải danh sách điểm...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
      <div className="flex h-screen">
      {/* Sidebar cho giáo viên */}
      <div className="w-64 bg-gray-800 text-white">
        <SidebarTeacher />
      </div>

      {/* Nội dung chính */}
      <div className="content">
      <h2>Cập nhật điểm</h2>
      <table border="1"className="teacher-table">
        <thead>
          <tr>
            <th>Tên sinh viên</th>
            <th>Chuyên cần</th>
            <th>Giữa kỳ</th>
            <th>Cuối kỳ</th>
          </tr>
        </thead>
        <tbody>
          {grades.map((grade, index) => (
            <tr key={grade.gradesId}>
              <td>{grade.studentName}</td>
              <td>
                <input
                  type="number"
                  value={grade.attendance}
                  onChange={(e) => handleInputChange(index, "attendance", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={grade.midterm}
                  onChange={(e) => handleInputChange(index, "midterm", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={grade.finalExam}
                  onChange={(e) => handleInputChange(index, "finalExam", e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={handleUpdateGrades}>Cập nhật điểm</button>
    </div>
    </div>
  );
};

export default GradesUpdate;
