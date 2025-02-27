import React, { useState } from "react";
import axios from "axios";
import Sidebar from "../../../components/Sidebar";

const CourseAdd = () => {
    const [course, setCourse] = useState({
        courseCode: "",
        courseName: "",
        credits: "",
        description: "",
        tuitionFeePerCredit: ""
    });
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState("");

    const validate = () => {
        let tempErrors = {};
        if (!course.courseCode) tempErrors.courseCode = "Mã khóa học không được để trống";
        if (!course.courseName) tempErrors.courseName = "Tên khóa học không được để trống";
        if (!course.credits || course.credits <= 0) tempErrors.credits = "Số tín chỉ phải lớn hơn 0";
        if (!course.description) tempErrors.description = "Mô tả không được để trống";
        if (!course.tuitionFeePerCredit || course.tuitionFeePerCredit <= 0) tempErrors.tuitionFeePerCredit = "Học phí / tín chỉ phải lớn hơn 0";

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleChange = (e) => {
        setCourse({ ...course, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        const token = localStorage.getItem("token");
        if (!token) {
            setSuccessMessage("Bạn chưa đăng nhập!");
            return;
        }

        try {
            await axios.post("http://localhost:8080/admin/courses", course, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });
            setSuccessMessage("Thêm khóa học thành công!");
            setCourse({
                courseCode: "",
                courseName: "",
                credits: "",
                description: "",
                tuitionFeePerCredit: ""
            });
            setErrors({});
        } catch (error) {
            alert("Lỗi khi thêm khóa học: " + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="course-add-container">
            <Sidebar />
            <div className="content">
                <h2>Thêm Khóa Học</h2>
                {successMessage && <p className="success-message">{successMessage}</p>}
                <form onSubmit={handleSubmit} className="teacher-form">
                <div className="form-group">
                    <label>Mã khóa học:</label>
                    <input type="text" name="courseCode" placeholder="Mã khóa học" value={course.courseCode} onChange={handleChange} />
                    {errors.courseCode && <p className="error-message">{errors.courseCode}</p>}
                </div>
                <div className="form-group">
                    <label>Tên khóa học:</label>
                    <input type="text" name="courseName" placeholder="Tên khóa học" value={course.courseName} onChange={handleChange} />
                    {errors.courseName && <p className="error-message">{errors.courseName}</p>}
                </div>
                <div className="form-group">
                    <label>Số tín chỉ:</label>
                    <input type="number" name="credits" placeholder="Số tín chỉ" value={course.credits} onChange={handleChange} />
                    {errors.credits && <p className="error-message">{errors.credits}</p>}
                </div>
                <div className="form-group">
                    <label>Mô tả:</label>
                    <input type="text" name="description" placeholder="Mô tả" value={course.description} onChange={handleChange} />
                    {errors.description && <p className="error-message">{errors.description}</p>}
                </div>
                <div className="form-group">
                    <label>Học phí / tín chỉ:</label>
                    <input type="number" name="tuitionFeePerCredit" placeholder="Học phí / tín chỉ" value={course.tuitionFeePerCredit} onChange={handleChange} />
                    {errors.tuitionFeePerCredit && <p className="error-message">{errors.tuitionFeePerCredit}</p>}
                    </div>
                    <button type="submit">Thêm Khóa Học</button>
                </form>
            </div>
        </div>
    );
};

export default CourseAdd;