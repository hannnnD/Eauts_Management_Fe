import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../../components/Sidebar";

const CourseUpdate = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState({
        courseName: "",
        courseCode: "",
        description: "",
        credits: 0,
        tuitionFeePerCredit: 0
    });
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Bạn chưa đăng nhập!");
            navigate("/login");
            return;
        }

        axios.get(`http://localhost:8080/admin/courses/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            setCourse(response.data);
        })
        .catch(error => {
            console.error("Lỗi khi tải dữ liệu khóa học:", error);
            alert("Không thể tải thông tin khóa học!");
        });
    }, [id, navigate]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Bạn chưa đăng nhập!");
            navigate("/login");
            return;
        }

        try {
            await axios.put(`http://localhost:8080/admin/courses/${id}`, course, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            setSuccessMessage("Cập nhật thành công!");
            setTimeout(() => navigate("/admin/courses"), 1500);
        } catch (error) {
            console.error("Lỗi khi cập nhật khóa học:", error);
            setErrors({ general: "Cập nhật thất bại!" });
        }
    };

    return (
        <div className="teacher-add-container"> {/* ✅ Sử dụng chung layout với form giáo viên */}
            <Sidebar />
            <div className="content">
                <h2>Cập nhật khóa học</h2>
                {successMessage && <p className="success-message">{successMessage}</p>}
                {errors.general && <p className="error-message">{errors.general}</p>}
                <form onSubmit={handleUpdate} className="teacher-form">
                    <div className="form-group">
                        <label>Tên khóa học:</label>
                        <input type="text" value={course.courseName} onChange={(e) => setCourse({ ...course, courseName: e.target.value })} />
                    </div>

                    <div className="form-group">
                        <label>Mã khóa học:</label>
                        <input type="text" value={course.courseCode} onChange={(e) => setCourse({ ...course, courseCode: e.target.value })} />
                    </div>

                    <div className="form-group">
                        <label>Mô tả:</label>
                        <textarea value={course.description} onChange={(e) => setCourse({ ...course, description: e.target.value })} />
                    </div>

                    <div className="form-group">
                        <label>Số tín chỉ:</label>
                        <input type="number" value={course.credits} onChange={(e) => setCourse({ ...course, credits: Number(e.target.value) })} />
                    </div>

                    <div className="form-group">
                        <label>Học phí mỗi tín chỉ:</label>
                        <input type="number" value={course.tuitionFeePerCredit} onChange={(e) => setCourse({ ...course, tuitionFeePerCredit: Number(e.target.value) })} />
                    </div>

                    <button type="submit" className="submit-button">Cập nhật</button>
                </form>
            </div>
        </div>
    );
};

export default CourseUpdate;
