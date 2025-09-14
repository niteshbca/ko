// src/HomeScreen.js
import React from "react";
import "./css/WelcomeScreen.css";
import { useNavigate } from "react-router-dom";
function WelcomeScreen() {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/admin-login");
  };
  const handleClickEmp = () => {
    navigate("/employee-login");
  };
  return (
    <div className="home-screen">
      <img src="/images/main bg (1).png" alt="" />
      <div className="centered-content">
        <div className="welcome-container">
          <div className="adminLoginBtn">
            <div className="adminBtnInner" onClick={handleClick}>
              <img
                src="/images/dashicons_admin-users.png"
                alt=""
                className="adminBtnImg"
                style={{ width: "32px", height: "30px" }}
              />
              <span className="adminSpan">Admin</span>
            </div>
          </div>

          <div className="employeeLoginBtn">
            <div className="employeeBtnInner" onClick={handleClickEmp}>
              <img
                src="/images/streamline.png"
                alt=""
                className="employeeBtnImg"
                style={{ width: "32px", height: "30px" }}
              />
              <span className="employeeSpan">Employee</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WelcomeScreen;
