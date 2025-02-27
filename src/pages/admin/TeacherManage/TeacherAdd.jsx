import React, { useState } from "react";
import axios from "axios";
import Sidebar from "../../../components/Sidebar";

const TeacherAdd = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        full_name: "",
        date_of_birth: "",
        gender: "",
        address: "",
        phone: "",
        email: ""
    });

    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState("");

    const validate = () => {
        let tempErrors = {};
        if (!formData.username) tempErrors.username = "Tên đăng nhập không được để trống";
        if (!formData.password) tempErrors.password = "Mật khẩu không được để trống";
        if (!formData.full_name) tempErrors.full_name = "Họ và tên không được để trống";
        if (!formData.date_of_birth) tempErrors.date_of_birth = "Ngày sinh không được để trống";
        if (!formData.gender) tempErrors.gender = "Giới tính không được để trống";
        if (!formData.address) tempErrors.address = "Địa chỉ không được để trống";
        if (!formData.phone.match(/^\d{10,15}$/)) tempErrors.phone = "Số điện thoại không hợp lệ (10-15 số)";
        if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) tempErrors.email = "Email không hợp lệ";

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        const payload = {
            user: {
                username: formData.username,
                password: formData.password
            },
            full_name: formData.full_name,
            date_of_birth: formData.date_of_birth,
            gender: formData.gender,
            address: formData.address,
            phone: formData.phone,
            email: formData.email
        };

        const token = localStorage.getItem("token");

        try {
            await axios.post("http://localhost:8080/admin/teachers", payload, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });
            setSuccessMessage("Thêm giảng viên thành công!");
            setFormData({
                username: "",
                password: "",
                full_name: "",
                date_of_birth: "",
                gender: "",
                address: "",
                phone: "",
                email: ""
            });
            setErrors({});
        } catch (error) {
            alert("Lỗi khi thêm giảng viên: " + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="teacher-add-container">
            <Sidebar />
            <div className="content">
                <h2>Thêm Giảng Viên</h2>
                {successMessage && <p className="success-message">{successMessage}</p>}
                <form onSubmit={handleSubmit} className="teacher-form">
                    <div className="form-group">
                        <label>Tên đăng nhập:</label>
                        <input type="text" name="username" value={formData.username} onChange={handleChange} />
                        {errors.username && <p className="error-message">{errors.username}</p>}
                    </div>
    
                    <div className="form-group">
                        <label>Mật khẩu:</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} />
                        {errors.password && <p className="error-message">{errors.password}</p>}
                    </div>
    
                    <div className="form-group">
                        <label>Họ và tên:</label>
                        <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} />
                        {errors.full_name && <p className="error-message">{errors.full_name}</p>}
                    </div>
    
                    <div className="form-group">
                        <label>Ngày sinh:</label>
                        <input type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} />
                        {errors.date_of_birth && <p className="error-message">{errors.date_of_birth}</p>}
                    </div>
    
                    <div className="form-group">
                        <label>Giới tính:</label>
                        <select name="gender" value={formData.gender} onChange={handleChange}>
                            <option value="">Chọn giới tính</option>
                            <option value="MALE">Nam</option>
                            <option value="FEMALE">Nữ</option>
                        </select>
                        {errors.gender && <p className="error-message">{errors.gender}</p>}
                    </div>
    
                    <div className="form-group">
                        <label>Địa chỉ:</label>
                        <input type="text" name="address" value={formData.address} onChange={handleChange} />
                        {errors.address && <p className="error-message">{errors.address}</p>}
                    </div>
    
                    <div className="form-group">
                        <label>Số điện thoại:</label>
                        <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
                        {errors.phone && <p className="error-message">{errors.phone}</p>}
                    </div>
    
                    <div className="form-group">
                        <label>Email:</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} />
                        {errors.email && <p className="error-message">{errors.email}</p>}
                    </div>
    
                    <button type="submit">Thêm Giảng Viên</button>
                </form>
            </div>
        </div>
    );
    
};

export default TeacherAdd;
