import React, { useState } from "react";
import "./css/AdminLoginScreen.css";
import { useNavigate } from "react-router-dom";
function AdminLoginScreen() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const admLog = (e) => {
    e.preventDefault();
    
    // Validate credentials
    if (username === "admin" && password === "123") {
      setError("");
      navigate("/admin-dashboard");
    } else {
      setError("Invalid username or password. Please try again.");
    }
  };
  return (
    <div className="main-bg">
      <div className="design-bg">
        <img src="/images/main bg (1).png" alt="" />
        {/* <div className="admin-icon"> */}
        <div className="form-container">
          <img
            className="ri-admin"
            src="/images/ri_admin-line (1).png"
            alt=""
          />
          <h2>Admin Login</h2>

          <form onSubmit={admLog}>
            <div className="input-group">
              <input 
                type="text" 
                placeholder="Enter admin name" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <div className="input-icon">
                <img src="/images/dashicons_admin-users.png" alt="" />
              </div>
            </div>

            <div className="input-group">
              <input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="input-icon">
                <img src="/images/Vector.png" alt="" />
              </div>
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            <button type="submit">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminLoginScreen;
