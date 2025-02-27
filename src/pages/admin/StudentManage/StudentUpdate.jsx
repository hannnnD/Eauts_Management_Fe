import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../../components/Sidebar";

const StudentUpdate = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [studentData, setStudentData] = useState({
        full_name: "",
        date_of_birth: "",
        gender: "MALE",
        address: "",
        phone: "",
        enrollment_year: "",
        status: "ACTIVE",
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

        axios.get(`http://localhost:8080/admin/students/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            const student = response.data;
            setStudentData({
                full_name: student.full_name,
                date_of_birth: student.date_of_birth,
                gender: student.gender,
                address: student.address,
                phone: student.phone,
                enrollment_year: student.enrollment_year,
                status: student.status,
                classId: student.studentClass ? student.studentClass.classId : ""  // Kiểm tra dữ liệu studentClass
            });
        })
        .catch(error => {
            console.error("Lỗi khi tải thông tin sinh viên:", error);
            alert("Không thể tải thông tin sinh viên!");
        });
    }, [id]);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Bạn chưa đăng nhập!");
            return;
        }

        axios.get("http://localhost:8080/admin/classes", {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => setClasses(response.data))
        .catch(error => console.error("Lỗi khi tải danh sách lớp:", error));
    }, []);

    const validate = () => {
        let tempErrors = {};
        if (!studentData.full_name) tempErrors.full_name = "Họ và tên không được để trống";
        if (!studentData.date_of_birth) tempErrors.date_of_birth = "Ngày sinh không được để trống";
        if (!studentData.address) tempErrors.address = "Địa chỉ không được để trống";
        if (!studentData.phone.match(/^\d{10,15}$/)) tempErrors.phone = "Số điện thoại không hợp lệ (10-15 số)";
        if (!studentData.classId) tempErrors.class_id = "Lớp học không được để trống";
        
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

        const putData = {
            full_name: studentData.full_name,
            date_of_birth: studentData.date_of_birth,
            gender: studentData.gender,
            address: studentData.address,
            phone: studentData.phone,
            enrollment_year: studentData.enrollment_year,
            status: studentData.status,
            studentClass: { classId: studentData.classId }
        };

        try {
            await axios.put(`http://localhost:8080/admin/students/${id}`, putData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            setSuccessMessage("Cập nhật sinh viên thành công!");
            setTimeout(() => navigate("/admin/students"), 2000);
        } catch (error) {
            alert("Lỗi khi cập nhật sinh viên: " + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="student-update-container">
            <Sidebar />
            <div className="content">
                <h2 className="title">Cập nhật thông tin sinh viên</h2>
                {successMessage && <p className="success-message">{successMessage}</p>}
                <form className="teacher-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Họ và tên:</label>
                        <input type="text" name="full_name" value={studentData.full_name} onChange={handleChange} />
                        {errors.full_name && <p className="error-message">{errors.full_name}</p>}
                    </div>

                    <div className="form-group">
                        <label>Ngày sinh:</label>
                        <input type="date" name="date_of_birth" value={studentData.date_of_birth} onChange={handleChange} />
                        {errors.date_of_birth && <p className="error-message">{errors.date_of_birth}</p>}
                    </div>

                    <div className="form-group">
                        <label>Giới tính:</label>
                        <select name="gender" value={studentData.gender} onChange={handleChange}>
                            <option value="MALE">Nam</option>
                            <option value="FEMALE">Nữ</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Địa chỉ:</label>
                        <input type="text" name="address" value={studentData.address} onChange={handleChange} />
                        {errors.address && <p className="error-message">{errors.address}</p>}
                    </div>

                    <div className="form-group">
                        <label>Số điện thoại:</label>
                        <input type="text" name="phone" value={studentData.phone} onChange={handleChange} />
                        {errors.phone && <p className="error-message">{errors.phone}</p>}
                    </div>

                    <div className="form-group">
                        <label>Năm nhập học:</label>
                        <input type="number" name="enrollment_year" value={studentData.enrollment_year} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                        <label>Trạng thái:</label>
                        <select name="status" value={studentData.status} onChange={handleChange}>
                            <option value="ACTIVE">Đang học</option>
                            <option value="INACTIVE">Tạm nghỉ</option>
                        </select>
                    </div>

                    <div className="form-group">
                    <label>Lớp học:</label>
                    <input type="text" placeholder="Tìm kiếm lớp học..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                    <select name="classId" value={studentData.classId} onChange={handleChange} required>
                        <option value="">Chọn lớp</option>
                        {classes.filter(cls => cls.className.toLowerCase().includes(searchTerm.toLowerCase()))
                            .map(cls => (
                                <option key={cls.id} value={cls.id}>{cls.className}</option>
                            ))}
                    </select>
                    </div>
                    {errors.classId && <p className="error-message">{errors.classId}</p>}
                    
                    <button type="submit">Cập nhật</button>
                </form>
            </div>
        </div>
    );
};

export default StudentUpdate;
