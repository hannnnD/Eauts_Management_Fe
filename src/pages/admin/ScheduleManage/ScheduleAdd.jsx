import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../../components/Sidebar";

const ScheduleAdd = () => {
    const [scheduleData, setScheduleData] = useState({
        teacherId: "",
        classId: "",
        course_id: "",
        room: "",
        shift: "SHIFT_1",
        start_date: "",
        end_date: ""
    });

    const [teachers, setTeachers] = useState([]);
    const [classes, setClasses] = useState([]);
    const [courses, setCourses] = useState([]);
    const [searchTermTeacher, setSearchTermTeacher] = useState("");
    const [searchTermClass, setSearchTermClass] = useState("");
    const [searchTermCourse, setSearchTermCourse] = useState("");
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Bạn chưa đăng nhập!");
            return;
        }

        axios.get("http://localhost:8080/admin/teachers", {
            headers: { Authorization: `Bearer ${token}` }
        }).then(response => setTeachers(response.data))
        .catch(error => alert("Không thể tải danh sách giáo viên!"));

        axios.get("http://localhost:8080/admin/classes", {
            headers: { Authorization: `Bearer ${token}` }
        }).then(response => setClasses(response.data))
        .catch(error => alert("Không thể tải danh sách lớp!"));

        axios.get("http://localhost:8080/admin/courses", {
            headers: { Authorization: `Bearer ${token}` }
        }).then(response => setCourses(response.data))
        .catch(error => alert("Không thể tải danh sách khóa học!"));
    }, []);

    const validate = () => {
        let tempErrors = {};
        if (!scheduleData.teacherId) tempErrors.teacher_id = "Giáo viên không được để trống";
        if (!scheduleData.classId) tempErrors.class_id = "Lớp học không được để trống";
        if (!scheduleData.course_id) tempErrors.course_id = "Khóa học không được để trống";
        if (!scheduleData.room) tempErrors.room = "Phòng học không được để trống";
        if (!scheduleData.start_date) tempErrors.start_date = "Ngày bắt đầu không được để trống";
        if (!scheduleData.end_date) tempErrors.end_date = "Ngày kết thúc không được để trống";
        
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleChange = (e) => {
        setScheduleData({ ...scheduleData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        const token = localStorage.getItem("token");
        if (!token) {
            alert("Bạn chưa đăng nhập!");
            return;
        }

        const postData = {
            teacher: { teacherId: scheduleData.teacherId },
            studentClass: { classId: scheduleData.classId },
            course: { courses_id: scheduleData.course_id },
            room: scheduleData.room,
            shift: scheduleData.shift,
            start_date: scheduleData.start_date,
            end_date: scheduleData.end_date
        };

        try {
            await axios.post("http://localhost:8080/admin/schedules", postData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            setSuccessMessage("Thêm lịch học thành công!");
            setScheduleData({
                teacherId: "",
                classId: "",
                course_id: "",
                room: "",
                shift: "SHIFT_1",
                start_date: "",
                end_date: ""
            });
            setErrors({});
        } catch (error) {
            alert("Lỗi khi thêm lịch học: " + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="schedule-add-container">
            <Sidebar />
            <div className="content">
                <h2 className="">Thêm lịch học</h2>
                {successMessage && <p className="success-message">{successMessage}</p>}
                <form className="teacher-form" onSubmit={handleSubmit}>
                <div className="form-group">
                <label>Phòng học:</label>
                    <input type="text" placeholder="Phòng học" name="room" value={scheduleData.room} onChange={handleChange} />
                    {errors.room && <p className="error-message">{errors.room}</p>}
</div>
<div className="form-group">
                        <label>Ngày bắt đầu:</label>
                    <input type="datetime-local" name="start_date" value={scheduleData.start_date} onChange={handleChange} />
                    {errors.start_date && <p className="error-message">{errors.start_date}</p>}
</div>
<div className="form-group">
                        <label>Ngày kết thúc:</label>
                    <input type="datetime-local" name="end_date" value={scheduleData.end_date} onChange={handleChange} />
                    {errors.end_date && <p className="error-message">{errors.end_date}</p>}
</div>
<div className="form-group">
                        <label>Ca học:</label>
                    <select name="shift" value={scheduleData.shift} onChange={handleChange}>
                        <option value="SHIFT_1">Ca 1</option>
                        <option value="SHIFT_2">Ca 2</option>
                        <option value="SHIFT_3">Ca 3</option>
                        <option value="SHIFT_4">Ca 4</option>
                        <option value="SHIFT_5">Ca 5</option>
                    </select>
</div>
<div className="form-group">
                        <label>Chọn giảng viên:</label>
                    <input 
    type="text" 
    placeholder="Tìm kiếm giáo viên..." 
    value={searchTermTeacher} 
    onChange={(e) => setSearchTermTeacher(e.target.value)} 
/>

<select name="teacherId" value={scheduleData.teacherId} onChange={handleChange}>
    <option value="">--Chọn giảng viên--</option>
    {teachers
        .filter(t => t.full_name.toLowerCase().includes(searchTermTeacher.toLowerCase())) // Sửa 'name' thành 'full_name'
        .map(t => (
            <option key={t.teacherId} value={t.teacherId}> {/* Sửa 'id' thành 'teacher_id' */}
                {t.full_name}
            </option>
        ))}
</select>
</div>
<div className="form-group">
                        <label>Chọn lớp:</label>
                    <input type="text" placeholder="Tìm kiếm lớp học..." value={searchTermClass} onChange={(e) => setSearchTermClass(e.target.value)} />
                    <select name="classId" value={scheduleData.classId} onChange={handleChange}>
                        <option value="">--Chọn lớp--</option>
                        {classes.filter(cls => cls.className.toLowerCase().includes(searchTermClass.toLowerCase()))
                            .map(cls => <option key={cls.id} value={cls.id}>{cls.className}</option>)}
                    </select>
</div>
<div className="form-group">
                        <label>Chọn khóa học:</label>
                    <input 
    type="text" 
    placeholder="Tìm kiếm khóa học..." 
    value={searchTermCourse} 
    onChange={(e) => setSearchTermCourse(e.target.value)} 
/>

<select name="course_id" value={scheduleData.course_id} onChange={handleChange}>
    <option value="">--Chọn khóa học--</option>
    {courses
        .filter(c => c.courseName.toLowerCase().includes(searchTermCourse.toLowerCase())) 
        .map(c => (
            <option key={c.courses_id} value={c.courses_id}> {/* Sửa 'id' thành 'courses_id' */}
                {c.courseName}
            </option>
        ))}
</select>
                    </div>
                    <button type="submit">Thêm Lịch Học</button>
                </form>
            </div>
        </div>
    );
};

export default ScheduleAdd;
