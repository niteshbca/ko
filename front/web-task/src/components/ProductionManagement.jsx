import React, { useState, useEffect } from "react";
import "./css/ProductionManagement.css";
import { useNavigate } from "react-router-dom";

function ProductionManagement() {
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    dates: '',
    shift: '',
    particulars: '',
    from_time: '',
    to_time: '',
    downtime: '',
    main_detail: '',
    sub_detail: '',
    detail_value: '',
    progress: 'Unapproved'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State for dynamic data
  const [mainDetails, setMainDetails] = useState([]);
  const [subDetails, setSubDetails] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch main details on component mount
  useEffect(() => {
    fetchMainDetails();
  }, []);

  // Fetch sub details when main detail is selected
  useEffect(() => {
    if (formData.main_detail) {
      fetchSubDetails(formData.main_detail);
    } else {
      setSubDetails([]);
    }
  }, [formData.main_detail]);

  // Fetch main details from backend
  const fetchMainDetails = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/details/main`);
      if (response.ok) {
        const data = await response.json();
        setMainDetails(data);
      }
    } catch (error) {
      console.error('Error fetching main details:', error);
    }
  };

  // Fetch sub details from backend
  const fetchSubDetails = async (mainDetail) => {
    if (!mainDetail) {
      setSubDetails([]);
      return;
    }
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/details/sub/${encodeURIComponent(mainDetail)}`);
      if (response.ok) {
        const data = await response.json();
        setSubDetails(data);
      }
    } catch (error) {
      console.error('Error fetching sub details:', error);
    }
  };

  // Calculate downtime automatically when from_time or to_time changes
  useEffect(() => {
    if (formData.from_time && formData.to_time) {
      const fromDate = new Date(`2000-01-01T${formData.from_time}`);
      const toDate = new Date(`2000-01-01T${formData.to_time}`);
      
      let diffInMs = toDate - fromDate;
      
      // Handle case where to_time is next day (cross midnight)
      if (diffInMs < 0) {
        diffInMs += 24 * 60 * 60 * 1000; // Add 24 hours
      }
      
      const hours = Math.floor(diffInMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
      
      const downtimeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      
      // Calculate detail_value in hours.minutes format (e.g., 2.05 for 2h 5m)
      const detailValueFormatted = parseFloat(`${hours}.${minutes.toString().padStart(2, '0')}`);
      
      setFormData(prev => ({
        ...prev,
        downtime: downtimeString,
        detail_value: detailValueFormatted
      }));
    }
  }, [formData.from_time, formData.to_time]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Reset sub_detail when main_detail changes
      ...(name === 'main_detail' && { sub_detail: '' })
    }));
  };

  const showData = () => {
    navigate("/show-details");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/production`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Data saved successfully:', result);
        alert('Data saved successfully!');
        
        // Reset form
        setFormData({
          dates: '',
          shift: '',
          particulars: '',
          from_time: '',
          to_time: '',
          downtime: '',
          main_detail: '',
          sub_detail: '',
          detail_value: '',
          progress: 'Unapproved'
        });
      } else {
        const error = await response.json();
        console.error('Error saving data:', error);
        alert('Error saving data. Please try again.');
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('Network error. Please check if the server is running.');
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <>
      <div className="prod-bgcol">
        <div className="gradient-bg">
          <img src="/images/main bg.png" alt="" />
          <div className="prod-content">
            <div className="first-content">
              <div className="backlogo">
                <img src="/images/Group 18.png" alt="" className="ar" />
                <p className="ar-back">Back</p>
              </div>
              <b className="showD">Show Details</b>
            </div>

            <div className="content-in prodManagement">
              <h3>Production Data Entry</h3>
              <form onSubmit={handleSubmit}>
                <div className="content-details1">
                  <div className="field">
                    <label htmlFor="dates">Select date</label>
                    <input 
                      type="date" 
                      className="date" 
                      name="dates"
                      value={formData.dates}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="shift">Select your shift</label>
                    <div className="shift-options">
                      <label htmlFor="day">
                        <div className="day">
                          <input
                            type="radio"
                            name="shift"
                            value="day"
                            className="dayradio"
                            checked={formData.shift === 'day'}
                            onChange={handleInputChange}
                          />
                          Day
                        </div>
                      </label>
                      <label htmlFor="night">
                        <div className="night">
                          <input
                            type="radio"
                            name="shift"
                            value="night"
                            className="nightradio"
                            checked={formData.shift === 'night'}
                            onChange={handleInputChange}
                          />
                          Night
                        </div>
                      </label>
                    </div>
                  </div>
                  <div className="field">
                    <label htmlFor="particulars">Select Your Particulars</label>
                    <input  
                      type="text"
                      name="particulars"
                      placeholder="Enter particulars"
                      className="some-text"
                      value={formData.particulars}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <h3>Machine Downtime</h3>
                <div className="content-details1">
                  <div className="field">
                    <label htmlFor="from_time">From:</label>
                    <input 
                      type="time" 
                      name="from_time" 
                      id="from_time"
                      value={formData.from_time}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="to_time">To:</label>
                    <input 
                      type="time" 
                      name="to_time" 
                      id="to_time"
                      value={formData.to_time}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="downtime">Downtime(hours and minute):</label>
                    <input 
                      type="text" 
                      name="downtime" 
                      id="downtime"
                      value={formData.downtime}
                      readOnly
                      placeholder="Auto-calculated"
                      className="some-text"
                    />
                  </div>
                </div>
                <h3>Details Hours and Minutes</h3>

                <div className="content-details1">
                  <div className="field">
                    <label htmlFor="main_detail">Select by whose name:</label>
                    <select 
                      name="main_detail" 
                      id="main_detail" 
                      className="select-other"
                      value={formData.main_detail}
                      onChange={handleInputChange}
                    >
                      <option value="">Select an option</option>
                      {mainDetails.map((detail, index) => (
                        <option key={index} value={detail}>{detail}</option>
                      ))}
                    </select>
                  </div>
                  <div className="field">
                    <label htmlFor="sub_detail">Select the problem</label>
                    <select 
                      name="sub_detail" 
                      id="sub_detail" 
                      className="select-other"
                      value={formData.sub_detail}
                      onChange={handleInputChange}
                      disabled={!formData.main_detail}
                    >
                      <option value="">Select problem type</option>
                      {subDetails.map((detail, index) => (
                        <option key={index} value={detail}>{detail}</option>
                      ))}
                    </select>
                  </div>
                  <div className="field">
                    <label htmlFor="detail_value">Value for Downtime (Auto-calculated):</label>
                    <input
                      type="text"
                      name="detail_value"
                      id="detail_value"
                      placeholder="Auto-calculated from downtime"
                      className="some-text"
                      value={formData.detail_value ? `${formData.detail_value} hours` : ''}
                      readOnly
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="submitdataBtn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Data'}
                </button>
                <button 
                  type="button" 
                  className="showdataBtn" 
                  onClick={showData}
                >
                  Show Data
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductionManagement;
