import React, { useState, useEffect } from "react";
import "./css/AddEmployee.css";

function AddEmployees() {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch employees from backend
  const fetchEmployees = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/employees`);
      
      if (response.ok) {
        const data = await response.json();
        setEmployees(data);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      
      setMessage('Error fetching employees');
    }
  };

  // Load employees on component mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddEmployee = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      setMessage('Please fill in all required fields (Name, Email, Password)');
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/employees`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newEmployee = await response.json();
        setEmployees([...employees, newEmployee]);
        setFormData({ 
          name: "", 
          email: "", 
          password: ""
        });
        setMessage('Employee added successfully!');
      } else {
        const error = await response.json();
        setMessage(error.error || 'Error adding employee');
      }
    } catch (error) {
      console.error('Error adding employee:', error);
      setMessage('Error adding employee');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEmployee = async (id) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/employees/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setEmployees(employees.filter((emp) => emp._id !== id));
        setMessage('Employee deleted successfully!');
      } else {
        setMessage('Error deleting employee');
      }
    } catch (error) {
      console.error('Error deleting employee:', error);
      setMessage('Error deleting employee');
    }
  };

  return (
    <div className="home-screen">
      <img src="/images/main bg (1).png" alt="" className="background-image" />
      <div className="mno">
        <div className="pqr">
          <div className="arrowandback">
            <p className="backPara">Back</p>
          </div>
          <p className="addEmployees">Add Employees</p>
          
          {message && (
            <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
              {message}
            </div>
          )}
          
          <div className="blueDiv">
            <div className="innerarrangement">
              <div className="input-group">
                <label htmlFor="name">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter employee name"
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="email">Email Id *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email id"
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="password">Password *</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter Password"
                  required
                />
              </div>
            </div>
            <button 
              className="addEmployee a" 
              onClick={handleAddEmployee}
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Employee'}
            </button>
            <button className="showEmployee s" onClick={fetchEmployees}>
              Refresh Employees
            </button>
          </div>

          {/* Employee Table Section */}
          <div className="table-section">
            <h2 className="table-title">Employees List</h2>
            <div className="employee-grid">
              {employees.length === 0 ? (
                <p className="no-employees">No employees found. Add some employees to get started.</p>
              ) : (
                employees.map((employee) => (
                  <div key={employee._id} className="employee-card">
                    <div className="employee-info">
                      <span className="employee-name">{employee.name}</span>
                      <span className="employee-email">{employee.email}</span>
                    </div>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteEmployee(employee._id)}
                    >
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddEmployees;