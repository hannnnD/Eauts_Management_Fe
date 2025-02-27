import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../../components/Sidebar";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";

const ClassList = () => {
    const navigate = useNavigate();
    const [classes, setClasses] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            alert("Bạn chưa đăng nhập!");
            navigate("/login");
            return;
        }

        axios.get("http://localhost:8080/admin/classes", {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            setClasses(response.data);
        })
        .catch(error => {
            console.error("Lỗi khi tải danh sách lớp học:", error);
            alert("Không thể tải danh sách lớp học!");
        });
    }, [navigate]);

    const handleDelete = async (id) => {
        const token = localStorage.getItem("token");

        if (!token) {
            alert("Bạn chưa đăng nhập!");
            navigate("/login");
            return;
        }

        if (!window.confirm("Bạn có chắc chắn muốn xóa lớp học này không?")) return;

        try {
            await axios.delete(`http://localhost:8080/admin/classes/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Xóa lớp học thành công!");
            setClasses(classes.filter((cls) => cls.id !== id));
        } catch (error) {
            console.error("Lỗi khi xóa lớp học:", error);
            alert("Xóa lớp học thất bại!");
        }
    };

    return (
        <div className="class-list-container">
            <Sidebar />
            <div className="content">
                <h2 className="title">Danh sách lớp học</h2>
                <table className="teacher-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tên lớp</th>
                            <th>Ngành học</th>
                            <th>Ghi chú</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {classes.map((cls) => (
                            <tr key={cls.id}>
                                <td>{cls.id}</td>
                                <td>{cls.className}</td>
                                <td>{cls.majorName}</td>
                                <td>{cls.note}</td>
                                <td className="actions">
                                                    <Link to={`/admin/classes/update/${cls.id}`}>
                                                      <FaEdit className="icon edit" />
                                                    </Link>
                                                    <FaTrash className="icon delete" onClick={() => handleDelete(cls.id)} />
                                                  </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ClassList;
