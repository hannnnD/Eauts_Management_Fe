import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../../components/Sidebar";
import { FaEdit, FaTrash } from "react-icons/fa";

const ScheduleList = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.warn("Token không tồn tại, chuyển hướng về đăng nhập");
          window.location.href = "/login";
          return;
        }

        const response = await axios.get("http://localhost:8080/admin/schedules", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setSchedules(response.data);
      } catch (err) {
        console.error("Lỗi tải danh sách lịch học:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  const handleDelete = async (scheduleId) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa lịch học này?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8080/admin/schedules/${scheduleId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSchedules(schedules.filter((schedule) => schedule.id !== scheduleId));
      alert("Xóa thành công!");
    } catch (err) {
      console.error("Lỗi khi xóa lịch học:", err);
      alert("Không thể xóa lịch học.");
    }
  };

  if (loading) return <p>Đang tải danh sách lịch học...</p>;

  return (
    <div className="schedule-list-container">
      <Sidebar />
      <div className="content">
        <h2 className="title">Danh sách lịch học</h2>
        <input
          type="text"
          placeholder="Tìm kiếm theo tên khóa học..."
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <table className="teacher-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Giáo viên</th>
              <th>Lớp học</th>
              <th>Khóa học</th>
              <th>Phòng học</th>
              <th>Ca học</th>
              <th>Ngày bắt đầu</th>
              <th>Ngày kết thúc</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {schedules
              .filter((schedule) =>
                schedule.courseName.toLowerCase().includes(search.toLowerCase())
              )
              .map((schedule) => (
                <tr key={schedule.id}>
                  <td>{schedule.id}</td>
                  <td>{schedule.teacherName}</td>
                  <td>{schedule.className}</td>
                  <td>{schedule.courseName}</td>
                  <td>{schedule.room}</td>
                  <td>{schedule.shift}</td>
                  <td>{new Date(schedule.startDate).toLocaleDateString()}</td>
                  <td>{new Date(schedule.endDate).toLocaleDateString()}</td>
                  <td className="actions">
                    <Link to={`/admin/schedules/update/${schedule.id}`}>
                      <FaEdit className="icon edit" />
                    </Link>
                    <FaTrash className="icon delete" onClick={() => handleDelete(schedule.id)} />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScheduleList;
