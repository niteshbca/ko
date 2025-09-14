import React from "react";
import { useNavigate } from "react-router-dom";
import "./css/AdminDashbTwo.css";
function AdminDashbTwo() {
  const navigate = useNavigate();
  const showDataDetails = () => {
    console.log("Show Data button clicked");
    navigate("/show-details");
  };
  const prodManagement = () => {
    console.log("Open Form button clicked");
    navigate("/production-management");
  };
  return (
    <>
      <div className="admin-container">
        <div className="background">
          <img src="/images/main bg (1).png" alt="" />
        </div>
        <div className="center-content">
          <div className="box">
            <p className="welcome">Welcome</p>
            <h3 className="employeeUserName">Employee User Name</h3>
            <div className="input-container showData">
              <button 
                className="showData" 
                onClick={showDataDetails}
                type="button"
                style={{ cursor: 'pointer' }}
              >
                Show Data
                <img
                  src="/images/group11.png"
                  alt=""
                  className="input-icon show"
                />
              </button>
            </div>
            <div className="input-container openForm">
              <button 
                onClick={prodManagement} 
                className="openForm"
                type="button"
                style={{ cursor: 'pointer' }}
              >
                Open Form
                <img
                  src="/images/group.png"
                  alt=""
                  className="input-icon open"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminDashbTwo;
