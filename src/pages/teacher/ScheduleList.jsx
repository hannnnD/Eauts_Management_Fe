import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import SidebarTeacher from "../../components/SidebarTeacher";

const ScheduleListTeacher = () => {
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

        const response = await axios.get("http://localhost:8080/teacher/schedule", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setSchedules(response.data);
      } catch (err) {
        console.error("Lỗi tải danh sách lịch giảng dạy:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  if (loading) return <p className="p-4">Đang tải danh sách lịch giảng dạy...</p>;

  return (
    <div className="flex h-screen">
      {/* Sidebar cho giáo viên */}
      <div className="w-64 bg-gray-800 text-white">
        <SidebarTeacher />
      </div>

      {/* Nội dung chính */}
      <div className="content">
        <h2 className="text-2xl font-bold mb-4">📅 Lịch Giảng Dạy</h2>

        {/* Ô tìm kiếm */}
        <input
          type="text"
          placeholder="🔍 Tìm kiếm theo tên khóa học..."
          className="border p-2 mb-4 w-full rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Bảng lịch giảng dạy */}
        <table className="teacher-table">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">#</th>
              <th className="border px-4 py-2">Lớp</th>
              <th className="border px-4 py-2">Môn học</th>
              <th className="border px-4 py-2">Phòng</th>
              <th className="border px-4 py-2">Ca học</th>
              <th className="border px-4 py-2">Ngày bắt đầu</th>
              <th className="border px-4 py-2">Ngày kết thúc</th>
              <th className="border px-4 py-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {schedules
              .filter((schedule) =>
                schedule.courseName.toLowerCase().includes(search.toLowerCase())
              )
              .map((schedule, index) => (
                <tr key={schedule.id} className="hover:bg-gray-100">
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">{schedule.className}</td>
                  <td className="border px-4 py-2">{schedule.courseName}</td>
                  <td className="border px-4 py-2">{schedule.room}</td>
                  <td className="border px-4 py-2">{schedule.shift.replace("SHIFT_", "Ca ")}</td>
                  <td className="border px-4 py-2">
                    {new Date(schedule.startDate).toLocaleDateString()}
                  </td>
                  <td className="border px-4 py-2">
                    {new Date(schedule.endDate).toLocaleDateString()}
                  </td>
                  <td className="border px-4 py-2 text-center">
                    <Link
                      to={`/teacher/grades/schedule/${schedule.id}`}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      Nhập điểm
                    </Link>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScheduleListTeacher;
