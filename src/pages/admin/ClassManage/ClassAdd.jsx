import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../../components/Sidebar";

const ClassAdd = () => {
    const navigate = useNavigate();
    const [classData, setClassData] = useState({
        class_name: "",
        major_name: "",
        note: "",
    });

    const handleChange = (e) => {
        setClassData({ ...classData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        if (!token) {
            alert("Bạn chưa đăng nhập!");
            navigate("/login");
            return;
        }

        try {
            await axios.post("http://localhost:8080/admin/classes", classData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            alert("Thêm lớp học thành công!");
            navigate("/admin/classes");
        } catch (error) {
            console.error("Lỗi khi thêm lớp học:", error);
            alert("Thêm lớp học thất bại!");
        }
    };

    return (
        <div className="class-add-container">
            <Sidebar />
            <div className="content">
                <h2>Thêm lớp học</h2>
                <form className="teacher-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Tên lớp:</label>
                    <input
                        type="text"
                        name="class_name"
                        value={classData.class_name}
                        onChange={handleChange}
                        placeholder="Nhập tên lớp"
                        required
                    />
</div>
<div className="form-group">
                    <label>Ngành học:</label>
                    <input
                        type="text"
                        name="major_name"
                        value={classData.major_name}
                        onChange={handleChange}
                        placeholder="Nhập ngành học"
                        required
                    />
</div>
<div className="form-group">
                    <label>Ghi chú:</label>
                    <textarea
                        name="note"
                        value={classData.note}
                        onChange={handleChange}
                        placeholder="Ghi chú về lớp học"
                    />
</div>
                    <button type="submit" className="add-button">Thêm lớp</button>
                </form>
            </div>
        </div>
    );
};

export default ClassAdd;
