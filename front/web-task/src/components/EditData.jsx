import React, { useState, useEffect } from "react";
import "./css/EditData.css";

function EditData() {
  // State for main details
  const [mainDetails, setMainDetails] = useState([]);
  const [selectedMainDetail, setSelectedMainDetail] = useState("");
  const [newMainDetail, setNewMainDetail] = useState("");
  
  // State for sub details
  const [subDetails, setSubDetails] = useState([]);
  const [selectedSubDetail, setSelectedSubDetail] = useState("");
  const [newSubDetail, setNewSubDetail] = useState("");
  
  // Loading and message states
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch main details on component mount
  useEffect(() => {
    fetchMainDetails();
  }, []);

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
      setMessage('Error fetching main details');
    }
  };

  // Fetch sub details when main detail is selected
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
      setMessage('Error fetching sub details');
    }
  };

  // Handle main detail selection change
  const handleMainDetailChange = (e) => {
    const value = e.target.value;
    setSelectedMainDetail(value);
    fetchSubDetails(value);
    setSelectedSubDetail(""); // Reset sub detail selection
  };

  // Main detail operations
  const handleAddMainDetail = async () => {
    if (!newMainDetail.trim()) {
      setMessage('Please enter a main detail');
      return;
    }

    setLoading(true);
    setMessage("");

    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/details/main`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ main_detail: newMainDetail }),
      });

      if (response.ok) {
        setNewMainDetail("");
        fetchMainDetails();
        setMessage('Main detail added successfully!');
      } else {
        const error = await response.json();
        setMessage(error.error || 'Error adding main detail');
      }
    } catch (error) {
      console.error('Error adding main detail:', error);
      setMessage('Error adding main detail');
    } finally {
      setLoading(false);
    }
  };

  const handleEditMainDetail = async () => {
    if (!selectedMainDetail || !newMainDetail.trim()) {
      setMessage('Please select a main detail and enter a new value');
      return;
    }

    setLoading(true);
    setMessage("");

    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/details/main`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          old_main_detail: selectedMainDetail, 
          new_main_detail: newMainDetail 
        }),
      });

      if (response.ok) {
        setNewMainDetail("");
        setSelectedMainDetail("");
        fetchMainDetails();
        setMessage('Main detail updated successfully!');
      } else {
        const error = await response.json();
        setMessage(error.error || 'Error updating main detail');
      }
    } catch (error) {
      console.error('Error updating main detail:', error);
      setMessage('Error updating main detail');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMainDetail = async () => {
    if (!selectedMainDetail) {
      setMessage('Please select a main detail to delete');
      return;
    }

    setLoading(true);
    setMessage("");

    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/details/main`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ main_detail: selectedMainDetail }),
      });

      if (response.ok) {
        setSelectedMainDetail("");
        setNewMainDetail("");
        fetchMainDetails();
        setMessage('Main detail deleted successfully!');
      } else {
        const error = await response.json();
        setMessage(error.error || 'Error deleting main detail');
      }
    } catch (error) {
      console.error('Error deleting main detail:', error);
      setMessage('Error deleting main detail');
    } finally {
      setLoading(false);
    }
  };

  // Sub detail operations
  const handleAddSubDetail = async () => {
    if (!selectedMainDetail || !newSubDetail.trim()) {
      setMessage('Please select a main detail and enter a sub detail');
      return;
    }

    setLoading(true);
    setMessage("");

    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/details/sub`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          main_detail: selectedMainDetail, 
          sub_detail: newSubDetail 
        }),
      });

      if (response.ok) {
        setNewSubDetail("");
        fetchSubDetails(selectedMainDetail);
        setMessage('Sub detail added successfully!');
      } else {
        const error = await response.json();
        setMessage(error.error || 'Error adding sub detail');
      }
    } catch (error) {
      console.error('Error adding sub detail:', error);
      setMessage('Error adding sub detail');
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubDetail = async () => {
    if (!selectedMainDetail || !selectedSubDetail || !newSubDetail.trim()) {
      setMessage('Please select a main detail, sub detail, and enter a new value');
      return;
    }

    setLoading(true);
    setMessage("");

    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/details/sub`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          main_detail: selectedMainDetail,
          old_sub_detail: selectedSubDetail, 
          new_sub_detail: newSubDetail 
        }),
      });

      if (response.ok) {
        setNewSubDetail("");
        setSelectedSubDetail("");
        fetchSubDetails(selectedMainDetail);
        setMessage('Sub detail updated successfully!');
      } else {
        const error = await response.json();
        setMessage(error.error || 'Error updating sub detail');
      }
    } catch (error) {
      console.error('Error updating sub detail:', error);
      setMessage('Error updating sub detail');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubDetail = async () => {
    if (!selectedMainDetail || !selectedSubDetail) {
      setMessage('Please select a main detail and sub detail to delete');
      return;
    }

    setLoading(true);
    setMessage("");

    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/details/sub`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          main_detail: selectedMainDetail, 
          sub_detail: selectedSubDetail 
        }),
      });

      if (response.ok) {
        setSelectedSubDetail("");
        setNewSubDetail("");
        fetchSubDetails(selectedMainDetail);
        setMessage('Sub detail deleted successfully!');
      } else {
        const error = await response.json();
        setMessage(error.error || 'Error deleting sub detail');
      }
    } catch (error) {
      console.error('Error deleting sub detail:', error);
      setMessage('Error deleting sub detail');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-outer">
      <img src="/images/main bg (1).png" alt="" className="editdata-mainbg" />
      <div className="editWhitebg">
        <div className="editWhite">
          <div className="editFirstDiv">
            <img src="/images/Group 18.png" alt="" />
            <p className="back">Back</p>
          </div>
          <div className="edit-data">
            <p className="editData">Edit Category</p>
            {message && (
              <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
                {message}
              </div>
            )}
          </div>
          <div className="outerBlue">
            <div className="frame1">
              <p className="manage_main">Manage Main Details</p>
              <label htmlFor="mainDetailSelect">Select main detail</label>
              <select 
                id="mainDetailSelect"
                className="editinput" 
                value={selectedMainDetail}
                onChange={handleMainDetailChange}
              >
                <option value="">Select a main detail...</option>
                {mainDetails.map((detail, index) => (
                  <option key={index} value={detail}>{detail}</option>
                ))}
              </select>
              <label htmlFor="newMainDetail">Enter new main detail</label>
              <input
                id="newMainDetail"
                type="text"
                placeholder="Enter new main detail"
                className="editinputblue"
                value={newMainDetail}
                onChange={(e) => setNewMainDetail(e.target.value)}
              />
              <div className="btnsinrows">
                <button 
                  className="add" 
                  onClick={handleAddMainDetail}
                  disabled={loading}
                >
                  {loading ? 'Adding...' : 'Add'}
                </button>
                <button 
                  className="edit" 
                  onClick={handleEditMainDetail}
                  disabled={loading}
                >
                  {loading ? 'Editing...' : 'Edit'}
                </button>
                <button 
                  className="delete" 
                  onClick={handleDeleteMainDetail}
                  disabled={loading}
                >
                  {loading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
            <div className="frame2">
              <p className="manage_main">Manage Sub Details</p>
              <label htmlFor="subDetailSelect">Select sub detail</label>
              <select 
                id="subDetailSelect"
                className="editinputblue" 
                value={selectedSubDetail}
                onChange={(e) => setSelectedSubDetail(e.target.value)}
                disabled={!selectedMainDetail}
              >
                <option value="">Select a sub detail...</option>
                {subDetails.map((detail, index) => (
                  <option key={index} value={detail}>{detail}</option>
                ))}
              </select>
              <label htmlFor="newSubDetail">Enter new sub detail</label>
              <input
                id="newSubDetail"
                type="text"
                placeholder="Enter new sub detail"
                className="editinputblue"
                value={newSubDetail}
                onChange={(e) => setNewSubDetail(e.target.value)}
                disabled={!selectedMainDetail}
              />
              <div className="btnsinrows">
                <button 
                  className="add" 
                  onClick={handleAddSubDetail}
                  disabled={loading || !selectedMainDetail}
                >
                  {loading ? 'Adding...' : 'Add'}
                </button>
                <button 
                  className="edit" 
                  onClick={handleEditSubDetail}
                  disabled={loading || !selectedMainDetail}
                >
                  {loading ? 'Editing...' : 'Edit'}
                </button>
                <button 
                  className="delete" 
                  onClick={handleDeleteSubDetail}
                  disabled={loading || !selectedMainDetail}
                >
                  {loading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditData;
