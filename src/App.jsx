import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Navigation } from "./components/navigation";
import { Header } from "./components/header";
import { Features } from "./components/features";
import { About } from "./components/about";
import { Services } from "./components/services";
import { Gallery } from "./components/gallery";
import { Testimonials } from "./components/testimonials";
import { Contact } from "./components/contact";
import { Login } from "./pages/Login";  

import AdminDashboard from "./pages/admin/dashboard";

import ClassList from "./pages/admin/ClassManage/ClassList";
import ClassAdd from "./pages/admin/ClassManage/ClassAdd";
import ClassUpdate from "./pages/admin/ClassManage/ClassUpdate";

import CourseList from "./pages/admin/CourseManage/CourseList";
import CourseAdd from "./pages/admin/CourseManage/CourseAdd";
import CourseUpdate from "./pages/admin/CourseManage/CourseUpdate";

import ScheduleList from "./pages/admin/ScheduleManage/ScheduleList";
import ScheduleAdd from "./pages/admin/ScheduleManage/ScheduleAdd";
import ScheduleUpdate from "./pages/admin/ScheduleManage/ScheduleUpdate";

import StudentList from "./pages/admin/StudentManage/StudentList";
import StudentAdd from "./pages/admin/StudentManage/StudentAdd";
import StudentUpdate from "./pages/admin/StudentManage/StudentUpdate";

import TeacherList from "./pages/admin/TeacherManage/TeacherList";
import TeacherAdd from "./pages/admin/TeacherManage/TeacherAdd";
import TeacherUpdate from "./pages/admin/TeacherManage/TeacherUpdate";

import TeacherDashboard from "./pages/teacher/dashboard";
import GradesUpdate from "./pages/teacher/GradesUpdate";
import TeacherSchedule from "./pages/teacher/ScheduleList";

import StudentDashboard from "./pages/student/dashboard";
import StudentGrades from "./pages/student/GradesList";
import StudentSchedule from "./pages/student/ScheduleList";

import JsonData from "./data/data.json";
import SmoothScroll from "smooth-scroll";
import "./App.css";

export const scroll = new SmoothScroll('a[href*="#"]', {
  speed: 1000,
  speedAsDuration: true,
});

const App = () => {
  const [landingPageData, setLandingPageData] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token")); // ✅ Kiểm tra token trong localStorage

  useEffect(() => {
    setLandingPageData(JsonData);
  }, []);

  const ProtectedRoute = ({ element }) => {
    return isLoggedIn ? element : <Navigate to="/login" />;
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <Navigation />
              <Header data={landingPageData.Header} />
              <Features data={landingPageData.Features} />
              <About data={landingPageData.About} />
              <Services data={landingPageData.Services} />
              <Gallery data={landingPageData.Gallery} />
              <Testimonials data={landingPageData.Testimonials} />
              <Contact data={landingPageData.Contact} />
            </div>
          }
        />

        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />

        {/* Bảo vệ trang admin */}
        <Route path="/admin/dashboard" element={<ProtectedRoute element={<AdminDashboard />} />} />

        <Route path="/admin/classes" element={<ProtectedRoute element={<ClassList />} />} />
        <Route path="/admin/classes/add" element={<ProtectedRoute element={<ClassAdd />} />} />
        <Route path="/admin/classes/update/:id" element={<ProtectedRoute element={<ClassUpdate />} />} />

        <Route path="/admin/courses" element={<ProtectedRoute element={<CourseList />} />} />
        <Route path="/admin/courses/add" element={<ProtectedRoute element={<CourseAdd />} />} />
        <Route path="/admin/courses/update/:id" element={<ProtectedRoute element={<CourseUpdate />} />} />

        <Route path="/admin/schedules" element={<ProtectedRoute element={<ScheduleList />} />} />
        <Route path="/admin/schedules/add" element={<ProtectedRoute element={<ScheduleAdd />} />} />
        <Route path="/admin/schedules/update/:id" element={<ProtectedRoute element={<ScheduleUpdate />} />} />

        <Route path="/admin/students" element={<ProtectedRoute element={<StudentList />} />} />
        <Route path="/admin/students/add" element={<ProtectedRoute element={<StudentAdd />} />} />
        <Route path="/admin/students/update/:id" element={<ProtectedRoute element={<StudentUpdate />} />} />
        
        <Route path="/admin/teachers" element={<ProtectedRoute element={<TeacherList />} />} />
        <Route path="/admin/teachers/add" element={<ProtectedRoute element={<TeacherAdd />} />} />
        <Route path="/admin/teacher/update/:id" element={<ProtectedRoute element={<TeacherUpdate />} />} />
        
        {/* Bảo vệ trang giảng viên */}
        <Route path="/teacher/dashboard" element={<ProtectedRoute element={<TeacherDashboard />} />} />
        <Route path="/teacher/schedule" element={<ProtectedRoute element={<TeacherSchedule />} />} />
        <Route path="/teacher/grades/schedule/:id" element={<ProtectedRoute element={<GradesUpdate />} />} />


        {/* Bảo vệ trang sinh viên */}
        <Route path="/student/dashboard" element={<ProtectedRoute element={<StudentDashboard />} />} />
        <Route path="/student/grades" element={<ProtectedRoute element={<StudentGrades />} />} />
        <Route path="/student/schedule" element={<ProtectedRoute element={<StudentSchedule />} />} />

        {/* Trang không hợp lệ */}
        <Route path="*" element={<p>404 - Không tìm thấy trang</p>} />
      </Routes>
    </Router>
  );
};

export default App;
