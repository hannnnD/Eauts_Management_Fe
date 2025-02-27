import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../../components/Sidebar";

const ScheduleUpdate = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [scheduleData, setScheduleData] = useState({
        teacherId: "",
        classId: "",
        course_id: "",
        room: "",
        shift: "",
        start_date: "",
        end_date: ""
    });

    const [teachers, setTeachers] = useState([]);
    const [classes, setClasses] = useState([]);
    const [courses, setCourses] = useState([]);
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    alert("Bạn chưa đăng nhập!");
                    return;
                }

                const [scheduleRes, teachersRes, classesRes, coursesRes] = await Promise.all([
                    axios.get(`http://localhost:8080/admin/schedules/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get("http://localhost:8080/admin/teachers", { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get("http://localhost:8080/admin/classes", { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get("http://localhost:8080/admin/courses", { headers: { Authorization: `Bearer ${token}` } })
                ]);

                const schedule = scheduleRes.data;
                setScheduleData({
                    teacherId: schedule.teacher ? schedule.teacher.teacherId : "",
                    classId: schedule.studentClass ? schedule.studentClass.classId : "",
                    course_id: schedule.course ? schedule.course.courses_id : "",
                    room: schedule.room || "",
                    shift: schedule.shift || "",
                    start_date: schedule.startDate ? schedule.startDate.split("T")[0] : "",
                    end_date: schedule.endDate ? schedule.endDate.split("T")[0] : ""
                });

                setTeachers(teachersRes.data);
                setClasses(classesRes.data);
                setCourses(coursesRes.data);
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu:", error);
            }
        };

        fetchData();
    }, [id]);

    const handleChange = (e) => {
        setScheduleData({ ...scheduleData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Bạn chưa đăng nhập!");
            return;
        }

        const putData = {
            teacher: { teacherId: scheduleData.teacherId },
            studentClass: { classId: scheduleData.classId },
            course: { courses_id: scheduleData.course_id },
            room: scheduleData.room,
            shift: scheduleData.shift,
            start_date: scheduleData.start_date + "T08:00:00",
            end_date: scheduleData.end_date + "T10:00:00"
        };

        try {
            await axios.put(`http://localhost:8080/admin/schedules/${id}`, putData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            setSuccessMessage("Cập nhật lịch học thành công!");
            setTimeout(() => navigate("/admin/schedules"), 2000);
        } catch (error) {
            alert("Lỗi khi cập nhật lịch học: " + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="teacher-add-container">
            <Sidebar />
            <div className="content">
                <h2 className="title">Cập nhật lịch học</h2>
                {successMessage && <p className="success-message">{successMessage}</p>}
                <form className="teacher-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Giáo viên</label>
                        <select name="teacherId" value={scheduleData.teacherId} onChange={handleChange}>
                            {teachers.map((teacher) => (
                                <option key={teacher.teacherId} value={teacher.teacherId}>
                                    {teacher.full_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Lớp học</label>
                        <select name="classId" value={scheduleData.classId} onChange={handleChange}>
                            {classes.map((cls) => (
                                <option key={cls.id} value={cls.id}>{cls.className}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Khóa học</label>
                        <select name="course_id" value={scheduleData.course_id} onChange={handleChange}>
                            {courses.map((course) => (
                                <option key={course.courses_id} value={course.courses_id}>{course.courseName}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Phòng học</label>
                        <input type="text" name="room" value={scheduleData.room} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label>Ca học</label>
                        <select name="shift" value={scheduleData.shift} onChange={handleChange}>
                            <option value="SHIFT_1">Ca 1</option>
                            <option value="SHIFT_2">Ca 2</option>
                            <option value="SHIFT_3">Ca 3</option>
                            <option value="SHIFT_4">Ca 4</option>
                            <option value="SHIFT_5">Ca 5</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Ngày bắt đầu</label>
                        <input type="date" name="start_date" value={scheduleData.start_date} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label>Ngày kết thúc</label>
                        <input type="date" name="end_date" value={scheduleData.end_date} onChange={handleChange} />
                    </div>

                    <button type="submit">Cập nhật</button>
                </form>
            </div>
        </div>
    );
};

export default ScheduleUpdate;
