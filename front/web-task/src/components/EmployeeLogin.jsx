import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function EmployeeLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const empUserLogin = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // First, get all employees to find matching credentials
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/employees`);
      if (response.ok) {
        const employees = await response.json();
        const employee = employees.find(
          emp => emp.email === formData.email && emp.password === formData.password
        );
        
        if (employee) {
          // Store employee info in localStorage for session management
          localStorage.setItem('employee', JSON.stringify(employee));
          navigate("/admin-dashboard-two");
        } else {
          setError("Invalid email or password");
        }
      } else {
        setError("Error connecting to server");
      }
    } catch (error) {
      console.error('Login error:', error);
      setError("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="welcome-bg">
      <div className="background-card">
        <div className="content">
          <img src="/images/ri_admin-line (1).png" alt="" id="admin-line2" />
          <p id="employee-login">Employee Login</p>
        </div>

        <form onSubmit={empUserLogin}>
          <div className="empLoginInputContainer">
            <input
              type="email"
              name="email"
              placeholder="Enter employee email"
              className="welcome-btn name"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <img
              src="/images/dashicons_admin-users.png"
              alt=""
              className="empDashicon"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              className="welcome-btn name"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            <img src="/images/Vector.png" alt="" className="empIconVector" />

            {error && <div className="error-message">{error}</div>}

            <button 
              type="submit" 
              className="empLoginBtn"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EmployeeLogin;
