import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SidebarStudent from "../../components/SidebarStudent";

const convertToScale4 = (total) => {
  if (total >= 8.5) return 4.0;
  if (total >= 7.0) return 3.0;
  if (total >= 5.5) return 2.0;
  if (total >= 4.0) return 1.0;
  return 0.0;
};

const convertToLetterGrade = (total) => {
  if (total >= 8.5) return "A";
  if (total >= 7.0) return "B";
  if (total >= 5.5) return "C";
  if (total >= 4.0) return "D";
  return "F";
};

const GradesList = () => {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.warn("Token không tồn tại, chuyển hướng về đăng nhập");
          navigate("/login");
          return;
        }

        const response = await axios.get("http://localhost:8080/student/grades", {
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
  }, [navigate]);

  if (loading) return <p>Đang tải danh sách điểm...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  const totalScale10 = grades.reduce((sum, grade) => sum + grade.total, 0) / grades.length;
  const totalScale4 = grades.reduce((sum, grade) => sum + convertToScale4(grade.total), 0) / grades.length;

  return (
    <div style={{ display: "flex" }}>
      <SidebarStudent />
      <div style={{ marginLeft: "250px", padding: "20px", width: "100%" }}>
        <h2>Danh sách điểm</h2>

        {/* Tổng hợp điểm trung bình */}
        <div style={{ marginBottom: "20px", fontSize: "18px", fontWeight: "bold" }}>
          <p>📊 Trung bình (Thang 10): {totalScale10.toFixed(2)}</p>
          <p>🏆 Trung bình (Thang 4): {totalScale4.toFixed(2)}</p>
        </div>

        <table className="teacher-table" border="1" cellPadding="10" style={{ width: "100%", textAlign: "center" }}>
          <thead>
            <tr>
              <th>Mã điểm</th>
              <th>Tên sinh viên</th>
              <th>Môn học</th>
              <th>Chuyên cần</th>
              <th>Giữa kỳ</th>
              <th>Cuối kỳ</th>
              <th>Tổng điểm (10)</th>
              <th>Thang 4</th>
              <th>Điểm chữ</th>
            </tr>
          </thead>
          <tbody>
            {grades.map((grade) => (
              <tr key={grade.gradesId}>
                <td>{grade.gradesId}</td>
                <td>{grade.studentName}</td>
                <td>{grade.courseName}</td>
                <td>{grade.attendance}</td>
                <td>{grade.midterm}</td>
                <td>{grade.finalExam}</td>
                <td>{grade.total}</td>
                <td>{convertToScale4(grade.total)}</td>
                <td>{convertToLetterGrade(grade.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GradesList;
