import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../../components/Sidebar";

const StudentAdd = () => {
    const [studentData, setStudentData] = useState({
        full_name: "",
        date_of_birth: "",
        gender: "MALE",
        address: "",
        phone: "",
        enrollment_year: "",
        status: "ACTIVE",
        email: "",
        password: "",
        classId: ""
    });
    
    const [classes, setClasses] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Bạn chưa đăng nhập!");
            return;
        }

        axios.get("http://localhost:8080/admin/classes", {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            setClasses(response.data);
        })
        .catch(error => {
            console.error("Lỗi khi tải danh sách lớp:", error);
            alert("Không thể tải danh sách lớp!");
        });
    }, []);

    const validate = () => {
        let tempErrors = {};
        if (!studentData.full_name) tempErrors.full_name = "Họ và tên không được để trống";
        if (!studentData.date_of_birth) tempErrors.date_of_birth = "Ngày sinh không được để trống";
        if (!studentData.address) tempErrors.address = "Địa chỉ không được để trống";
        if (!studentData.phone.match(/^\d{10,15}$/)) tempErrors.phone = "Số điện thoại không hợp lệ (10-15 số)";
        if (!studentData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) tempErrors.email = "Email không hợp lệ";
        if (!studentData.password) tempErrors.password = "Mật khẩu không được để trống";
        if (!studentData.classId) tempErrors.classId = "Lớp học không được để trống";
        
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleChange = (e) => {
        setStudentData({ ...studentData, [e.target.name]: e.target.value });
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
            ...studentData,
            user: { password: studentData.password },
            studentClass: { classId: studentData.classId }
        };
        delete postData.password;
        delete postData.classId;

        try {
            await axios.post("http://localhost:8080/admin/students", postData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            setSuccessMessage("Thêm sinh viên thành công!");
            setStudentData({
                full_name: "",
                date_of_birth: "",
                gender: "MALE",
                address: "",
                phone: "",
                enrollment_year: "",
                status: "ACTIVE",
                email: "",
                password: "",
                classId: ""
            });
            setErrors({});
        } catch (error) {
            alert("Lỗi khi thêm sinh viên: " + (error.response?.data?.message || error.message));
        }
    };
        return (
            <div className="student-add-container">
                <Sidebar />
                <div className="content">
                    <h2 className="form-title">Thêm sinh viên</h2>
                    {successMessage && <p className="success-message">{successMessage}</p>}
                    
                    <form className="teacher-form" onSubmit={handleSubmit}>
                        {/* Thông tin cá nhân */}
                        <div className="form-group">
                            <label>Họ và tên</label>
                            <input type="text" name="full_name" value={studentData.full_name} onChange={handleChange} />
                            {errors.full_name && <p className="error-message">{errors.full_name}</p>}
                        </div>
                        
                        <div className="form-group">
                            <label>Ngày sinh</label>
                            <input type="date" name="date_of_birth" value={studentData.date_of_birth} onChange={handleChange} />
                            {errors.date_of_birth && <p className="error-message">{errors.date_of_birth}</p>}
                        </div>
                        
                        <div className="form-group">
                            <label>Giới tính</label>
                            <select name="gender" value={studentData.gender} onChange={handleChange}>
                                <option value="MALE">Nam</option>
                                <option value="FEMALE">Nữ</option>
                            </select>
                        </div>
                        
                        <div className="form-group">
                            <label>Địa chỉ</label>
                            <input type="text" name="address" value={studentData.address} onChange={handleChange} />
                            {errors.address && <p className="error-message">{errors.address}</p>}
                        </div>
                        
                        <div className="form-group">
                            <label>Số điện thoại</label>
                            <input type="text" name="phone" value={studentData.phone} onChange={handleChange} />
                            {errors.phone && <p className="error-message">{errors.phone}</p>}
                        </div>
                        
                        {/* Thông tin học tập */}
                        <div className="form-group">
                            <label>Năm nhập học</label>
                            <input type="number" name="enrollment_year" value={studentData.enrollment_year} onChange={handleChange} />
                        </div>
                        
                        <div className="form-group">
                            <label>Trạng thái</label>
                            <select name="status" value={studentData.status} onChange={handleChange}>
                                <option value="ACTIVE">Đang học</option>
                                <option value="INACTIVE">Tạm nghỉ</option>
                            </select>
                        </div>
                        
                        {/* Tài khoản đăng nhập */}
                        <div className="form-group">
                            <label>Email</label>
                            <input type="email" name="email" value={studentData.email} onChange={handleChange} />
                            {errors.email && <p className="error-message">{errors.email}</p>}
                        </div>
                        
                        <div className="form-group">
                            <label>Mật khẩu</label>
                            <input type="password" name="password" value={studentData.password} onChange={handleChange} />
                            {errors.password && <p className="error-message">{errors.password}</p>}
                        </div>
                        
                        {/* Lựa chọn lớp học */}
                        <div className="form-group">
                            <label>Tìm kiếm lớp học</label>
                            <input type="text" placeholder="Nhập tên lớp..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        </div>
                        
                        <div className="form-group">
                            <label>Chọn lớp</label>
                            <select name="classId" value={studentData.classId} onChange={handleChange} required>
                                <option value="">Chọn lớp</option>
                                {classes.filter(cls => cls.className.toLowerCase().includes(searchTerm.toLowerCase()))
                                    .map(cls => (
                                        <option key={cls.id} value={cls.id}>{cls.className}</option>
                                    ))}
                            </select>
                            {errors.class_id && <p className="error-message">{errors.class_id}</p>}
                        </div>
                        
                        {/* Nút Submit */}
                        <button type="submit" className="submit-button">Thêm Sinh Viên</button>
                    </form>
                </div>
            </div>
        );
    };
    
    export default StudentAdd;
    