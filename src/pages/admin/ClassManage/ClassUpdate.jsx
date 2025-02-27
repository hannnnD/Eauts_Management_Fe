import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../../components/Sidebar";

const ClassUpdate = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [classData, setClassData] = useState({
        class_name: "",
        major_name: "",
        note: ""
    });
    const [loading, setLoading] = useState(true); // Trạng thái load dữ liệu

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            alert("Bạn chưa đăng nhập!");
            navigate("/login");
            return;
        }

        axios.get(`http://localhost:8080/admin/classes/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            setClassData(response.data);  // Load dữ liệu vào state
            setLoading(false);  // Dữ liệu đã tải xong
        })
        .catch(error => {
            console.error("Lỗi khi tải dữ liệu lớp học:", error);
            alert("Không thể tải thông tin lớp học!");
            setLoading(false);
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
            await axios.put(`http://localhost:8080/admin/classes/${id}`, classData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            alert("Cập nhật thành công!");
            navigate("/admin/classes");
        } catch (error) {
            console.error("Lỗi khi cập nhật lớp học:", error);
            alert("Cập nhật thất bại!");
        }
    };

    const handleChange = (e) => {
        setClassData({ ...classData, [e.target.name]: e.target.value });
    };

    return (
        <div className="class-update-container">
            <Sidebar />
            <div className="content">
                <h2 className="title">Cập nhật thông tin lớp học</h2>

                {loading ? ( 
                    <p>Đang tải dữ liệu...</p>
                ) : (
                    <form className="teacher-form" onSubmit={handleUpdate}>
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

                        <button type="submit" className="update-button">Cập nhật</button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ClassUpdate;
