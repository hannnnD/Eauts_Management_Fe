import React from "react";
import { Link } from "react-router-dom";

export const Navigation = () => {
  return (
    <nav id="menu" className="navbar navbar-default navbar-fixed-top">
      <div className="container">
        <div className="navbar-header">
          <button
            type="button"
            className="navbar-toggle collapsed"
            data-toggle="collapse"
            data-target="#bs-example-navbar-collapse-1"
          >
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
          <a className="navbar-brand page-scroll" href="#page-top">
            EMS
          </a>
        </div>

        <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
          <ul className="nav navbar-nav navbar-right">
            <li><a href="#features" className="page-scroll">Nổi bật</a></li>
            <li><a href="#about" className="page-scroll">Về chúng tôi</a></li>
            <li><a href="#services" className="page-scroll">Dịch vụ</a></li>
            <li><a href="#portfolio" className="page-scroll">Hình ảnh</a></li>
            <li><a href="#testimonials" className="page-scroll">Chứng thực</a></li>
            <li><a href="#contact" className="page-scroll">Liên hệ</a></li>
            <li>
              <Link to="/login">
                <button className="btn btn-primary">Đăng nhập</button>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
