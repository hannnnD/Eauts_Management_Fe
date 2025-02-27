import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../../components/Sidebar";

const TeacherUpdate = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [teacher, setTeacher] = useState({
        full_name: "",
        date_of_birth: "",
        gender: "",
        address: "",
        phone: "",
        email: ""
    });
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Bạn chưa đăng nhập!");
            navigate("/login");
            return;
        }

        axios.get(`http://localhost:8080/admin/teachers/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            setTeacher(response.data);
        })
        .catch(error => {
            console.error("Lỗi khi tải dữ liệu giảng viên:", error);
            alert("Không thể tải thông tin giảng viên!");
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
            await axios.put(`http://localhost:8080/admin/teachers/${id}`, teacher, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            setSuccessMessage("Cập nhật thành công!");
            setTimeout(() => navigate("/admin/teachers"), 2000);
        } catch (error) {
            console.error("Lỗi khi cập nhật giảng viên:", error);
            alert("Cập nhật thất bại!");
        }
    };

    return (
        <div className="teacher-update-container">
            <Sidebar />
            <div className="content">
                <h2>Cập nhật Thông Tin Giảng Viên</h2>
                {successMessage && <p className="success-message">{successMessage}</p>}
                <form onSubmit={handleUpdate} className="teacher-form">
                    <div className="form-group">
                        <label>Họ và tên:</label>
                        <input type="text" value={teacher.full_name} onChange={(e) => setTeacher({ ...teacher, full_name: e.target.value })} required />
                    </div>
                    <div className="form-group">
                        <label>Ngày sinh:</label>
                        <input type="date" value={teacher.date_of_birth} onChange={(e) => setTeacher({ ...teacher, date_of_birth: e.target.value })} required />
                    </div>
                    <div className="form-group">
                        <label>Giới tính:</label>
                        <select value={teacher.gender} onChange={(e) => setTeacher({ ...teacher, gender: e.target.value })}>
                            <option value="MALE">Nam</option>
                            <option value="FEMALE">Nữ</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Địa chỉ:</label>
                        <input type="text" value={teacher.address} onChange={(e) => setTeacher({ ...teacher, address: e.target.value })} />
                    </div>
                    <div className="form-group">
                        <label>Số điện thoại:</label>
                        <input type="text" value={teacher.phone} onChange={(e) => setTeacher({ ...teacher, phone: e.target.value })} />
                    </div>
                    <div className="form-group">
                        <label>Email:</label>
                        <input type="email" value={teacher.email} onChange={(e) => setTeacher({ ...teacher, email: e.target.value })} />
                    </div>
                    <button type="submit" className="update-button">Cập nhật</button>
                </form>
            </div>
        </div>
    );
};

export default TeacherUpdate;
