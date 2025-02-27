import React, { useEffect, useState } from "react";
import axios from "axios";
import SidebarStudent from "../../components/SidebarStudent";

const ScheduleList = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.warn("Token không tồn tại, chuyển hướng về đăng nhập");
          window.location.href = "/login";
          return;
        }

        const response = await axios.get("http://localhost:8080/student/schedule", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSchedules(response.data);
      } catch (err) {
        setError("Không thể tải lịch học.");
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  if (loading) return <p>Đang tải lịch học...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ display: "flex" }}>
      <SidebarStudent />
      <div style={{ marginLeft: "250px", padding: "20px", width: "100%" }}>
        <h2>Lịch học của bạn</h2>
        <table className="teacher-table" border="1" width="100%" style={{ width: "100%", textAlign: "center" }}>
          <thead>
            <tr>
              <th>Môn học</th>
              <th>Lớp</th>
              <th>Giảng viên</th>
              <th>Phòng học</th>
              <th>Ca học</th>
              <th>Ngày bắt đầu</th>
              <th>Ngày kết thúc</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((schedule) => (
              <tr key={schedule.id}>
                <td>{schedule.courseName}</td>
                <td>{schedule.className}</td>
                <td>{schedule.teacherName}</td>
                <td>{schedule.room}</td>
                <td>{schedule.shift}</td>
                <td>{new Date(schedule.startDate).toLocaleDateString()}</td>
                <td>{new Date(schedule.endDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScheduleList;
