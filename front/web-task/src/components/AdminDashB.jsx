import React from "react";
import { useState } from "react";
import "./css/AdminDashB.css";
import { useNavigate } from "react-router-dom";

function AdminDashB() {
  const navigate = useNavigate();
  const showData = () => {
    navigate("/show-details");
  };
  const addEmployees = () => {
    navigate("/add-employees");
  };
  const editData = () => {
    navigate("/edit-data");
  };
  const updateDelete = () => {
    navigate("/edit-delete");
  };
  const [count, setCount] = useState(0); // example state
  return (
    <>
      <div className="admin-container">
        <div className="background">
          <img src="/images/main bg (1).png" alt="" />
        </div>
        <div className="centered-content">
          <div className="admindash-content">
            <p className="welcomeTo">Welcome to</p>
            <h3>Admin Dashboard</h3>
            <div className="group131">
              <button onClick={addEmployees} className="adminDashBtn">
                <span className="button-text">Add Employee</span>
                <img src="/images/group11.png" alt="" />
              </button>
              <div className="input-container">
                <button onClick={editData} className="adminDashBtn blueBtn">
                  <span className="button-text">Edit Category</span>
                  <img src="/images/group.png" alt="" />
                </button>
              </div>

              <div className="input-container">
                <button className="adminDashBtn">
                  <span className="button-text" onClick={showData}>
                    Show Data
                  </span>
                  <img
                    src="/images/rounded-check.png"
                    alt=""
                    className="rounded-check"
                  />
                </button>
              </div>
              <div className="input-container">
                <button onClick={updateDelete} className="adminDashBtn">
                  <span className="button-text">Update and Delete dat</span>
                  <img src="/images/iconsUpdate.png" alt="" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminDashB;
