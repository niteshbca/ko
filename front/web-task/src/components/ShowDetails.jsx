import React from "react";
import "./css/ShowDetails.css";
import { useState, useEffect } from "react";
import { BiFontFamily } from "react-icons/bi";
import { CgOverflow } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
function ShowDetails() {
  const navigate = useNavigate();
  const tableFormat = () => {
    navigate("/table-format");
  };
  const excelFormat = () => {
    navigate("/excel-format");
  };
  const [selectedOption, setSelectedOption] = useState(""); //track dropdown selection
  
  // State for calculation history
  const [calculationHistory, setCalculationHistory] = useState([]);
  const [multiplier, setMultiplier] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  
  // State for production data
  const [productionData, setProductionData] = useState([]);
  const [productionLoading, setProductionLoading] = useState(false);
  
  // State for filtering
  const [filters, setFilters] = useState({
    progress: '',
    main_detail: '',
    shift: '',
    sub_detail: '',
    month: ''
  });
  const [filteredData, setFilteredData] = useState([]);
  
  // State for dynamic filter options
  const [uniqueMainDetails, setUniqueMainDetails] = useState([]);
  const [uniqueSubDetails, setUniqueSubDetails] = useState([]);
  const [uniqueShifts, setUniqueShifts] = useState([]);

  // Fetch data on component mount
  useEffect(() => {
    fetchCalculationHistory();
    fetchProductionData();
  }, []);

  // Apply filters when production data, filters, or selected option change
  useEffect(() => {
    applyFilters();
  }, [productionData, filters, selectedOption]);

  // Extract unique values for filter options when production data changes
  useEffect(() => {
    if (productionData.length > 0) {
      // Get unique main details
      const mainDetails = [...new Set(productionData.map(item => item.main_detail).filter(Boolean))];
      setUniqueMainDetails(mainDetails);
      
      // Get unique sub details
      const subDetails = [...new Set(productionData.map(item => item.sub_detail).filter(Boolean))];
      setUniqueSubDetails(subDetails);
      
      // Get unique shifts
      const shifts = [...new Set(productionData.map(item => item.shift).filter(Boolean))];
      setUniqueShifts(shifts);
    }
  }, [productionData]);

  // Fetch calculation history from backend
  const fetchCalculationHistory = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/calculation-history`);
      if (response.ok) {
        const data = await response.json();
        setCalculationHistory(data);
      }
    } catch (error) {
      console.error('Error fetching calculation history:', error);
      setMessage('Error fetching calculation history');
    }
  };

  // Fetch production data from backend
  const fetchProductionData = async () => {
    setProductionLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/production`);
      if (response.ok) {
        const data = await response.json();
        setProductionData(data);
      } else {
        console.error('Error fetching production data');
        setMessage('Error fetching production data');
      }
    } catch (error) {
      console.error('Error fetching production data:', error);
      setMessage('Error fetching production data');
    } finally {
      setProductionLoading(false);
    }
  };

  // Apply filters to production data
  const applyFilters = () => {
    let filtered = [...productionData];

    // Filter by selected main detail from dropdown
    if (selectedOption) {
      filtered = filtered.filter(item => item.main_detail === selectedOption);
    }

    if (filters.progress) {
      filtered = filtered.filter(item => item.progress === filters.progress);
    }
    if (filters.shift) {
      filtered = filtered.filter(item => item.shift === filters.shift);
    }
    if (filters.sub_detail) {
      filtered = filtered.filter(item => item.sub_detail === filters.sub_detail);
    }
    if (filters.month) {
      filtered = filtered.filter(item => {
        const itemMonth = new Date(item.dates).getMonth() + 1;
        return itemMonth.toString() === filters.month;
      });
    }

    setFilteredData(filtered);
  };

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Handle Approved/Unapproved button clicks
  const handleProgressFilter = (progress) => {
    setFilters(prev => ({
      ...prev,
      progress: prev.progress === progress ? '' : progress
    }));
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedOption('');
    setFilters({
      progress: '',
      main_detail: '',
      shift: '',
      sub_detail: '',
      month: ''
    });
  };

  // Save new calculation to backend
  const saveCalculation = async () => {
    if (!multiplier || isNaN(multiplier)) {
      setMessage('Please enter a valid multiplier');
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const currentDate = new Date();
      const date = currentDate.toLocaleDateString('en-GB'); // DD/MM/YYYY format
      const time = currentDate.toLocaleTimeString('en-US', { 
        hour12: true, 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      });

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/calculation-history`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          date, 
          time, 
          multiplier: parseFloat(multiplier) 
        }),
      });

      if (response.ok) {
        const newRecord = await response.json();
        setCalculationHistory([...calculationHistory, newRecord]);
        setMultiplier("");
        setMessage('Calculation saved successfully!');
      } else {
        const error = await response.json();
        setMessage(error.error || 'Error saving calculation');
      }
    } catch (error) {
      console.error('Error saving calculation:', error);
      setMessage('Error saving calculation');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      padding: "20px",
      backgroundColor: "#f5f5f7",
      // minHeight: "100vh",
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    tableContainer: {
      background: "white",
      borderRadius: "12px",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
      overflow: "hidden",
      maxWidth: "100%",
      overflowX: "auto",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      fontSize: "13px",
      minWidth: "1200px",
    },
    thead: {
      backgroundColor: "#f8f9fa",
    },
    th: {
      padding: "12px 8px",
      textAlign: "left",
      fontWeight: "500",
      color: "#6c757d",
      fontSize: "12px",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      borderBottom: "1px solid #e9ecef",
    },
    td: {
      // color: "#6c757d",
      padding: "12px 8px",
      borderBottom: "1px solid #f1f3f4",
      verticalAlign: "middle",
    },
    statusCell: {
      display: "flex",
      alignItems: "center",
      gap: "6px",
    },
    statusDot: {
      width: "8px",
      height: "8px",
      borderRadius: "50%",
      flexShrink: "0",
    },
    statusDotApproved: {
      backgroundColor: "#22c55e",
    },
    statusDotUnapproved: {
      backgroundColor: "#ef4444",
    },
    statusTextApproved: {
      color: "#22c55e",
      fontWeight: "500",
    },
    statusTextUnapproved: {
      color: "#ef4444",
      fontWeight: "500",
    },
    rowNumberApproved: {
      color: "#22c55e",
      fontWeight: "500",
    },
    rowNumberUnapproved: {
      color: "#ef4444",
      fontWeight: "500",
    },
    shiftBadge: {
      backgroundColor: "#e9ecef",
      padding: "2px 8px",
      borderRadius: "12px",
      fontSize: "11px",
      fontWeight: "500",
      color: "#495057",
    },
    timeCell: {
      fontFamily:
        '"SF Mono", "Monaco", "Cascadia Code", "Roboto Mono", monospace',
      fontSize: "12px",
      color: "#495057",
    },
    durationCell: {
      fontWeight: "500",
      color: "#343a40",
    },
    departmentCell: {
      color: "#6c757d",
    },
    row: {
      cursor: "pointer",
      transition: "background-color 0.2s",
    },
  };

  const StatusIndicator = ({ status }) => {
    const isApproved = status === "Approved";
    return (
      <div style={styles.statusCell}>
        <div
          style={{
            ...styles.statusDot,
            ...(isApproved
              ? styles.statusDotApproved
              : styles.statusDotUnapproved),
          }}
        ></div>
        <span
          style={
            isApproved ? styles.statusTextApproved : styles.statusTextUnapproved
          }
        >
          {status}
        </span>
      </div>
    );
  };

  const ShiftBadge = ({ shift }) => (
    <span style={styles.shiftBadge}>{shift}</span>
  );

  const handleRowHover = (e, isEntering) => {
    e.currentTarget.style.backgroundColor = isEntering
      ? "#f8f9fa"
      : "transparent";
  };

  return (
    <>
      <style>
        {`
          .production-table-container::-webkit-scrollbar {
            width: 8px;
          }
          .production-table-container::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 4px;
          }
          .production-table-container::-webkit-scrollbar-thumb {
            background: #cbd5e0;
            border-radius: 4px;
          }
          .production-table-container::-webkit-scrollbar-thumb:hover {
            background: #a0aec0;
          }
        `}
      </style>
      <div className="bg-color">
        <img
          src="/images/main bg (1).png"
          alt=""
          className="background-image"
        />
        <div className="outer-blue">
          <div className="group19">
            <div className="btn-group">
              <img src="/images/powerBtn.png" alt="" className="power-btn" />
            </div>
            <br />
            <div className="table-excel-format">
              <button className="table-format" onClick={tableFormat}>
                Table Format
              </button>
              <button className="excel-format" onClick={excelFormat}>
                Excel Format
              </button>
            </div>
          </div>

          <div className="group120">
            <div className="innerWhite">
              <div className="firstDiv">
                <img src="/images/Group 18.png" alt="" />
                <p className="back">Back</p>
              </div>
              <p className="show-details">Show Details</p>
              <div className="value">
                <div className="originalValue">
                  Original Target Value:
                  <p className="num">91,667.0612</p>
                </div>
              </div>
              <div className="secondDiv">
                <div className="contents">
                  <div className="leftside">
                    <p>Enter Multiplier:</p>
                    <div className="multiplier-divs">
                      <input 
                        type="number" 
                        className="number" 
                        value={multiplier}
                        onChange={(e) => setMultiplier(e.target.value)}
                        placeholder="Enter multiplier"
                      />
                      <button 
                        className="calculate" 
                        onClick={saveCalculation}
                        disabled={loading}
                      >
                        {loading ? 'Saving...' : 'Calculate'}
                      </button>
                    </div>
                    
                    {message && (
                      <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
                        {message}
                      </div>
                    )}

                    <div className="your-container-class">
                      <select
                        className="dropdown1"
                        name=""
                        id=""
                        value={selectedOption}
                        onChange={(e) => setSelectedOption(e.target.value)}
                      >
                        <option value="">Select main detail</option>
                        {uniqueMainDetails.map((detail, index) => (
                          <option key={index} value={detail}>{detail}</option>
                        ))}
                      </select>
                    </div>
                    {/* conditionally show buttons */}
                    {selectedOption && (
                      <div className="employee-options">
                        <div className="row1">
                          <button 
                            className={`bt-n ${filters.progress === 'Approved' ? 'active' : ''}`}
                            onClick={() => handleProgressFilter('Approved')}
                          >
                            Approved
                          </button>
                          <button 
                            className={`bt-n ${filters.progress === 'Unapproved' ? 'active' : ''}`}
                            onClick={() => handleProgressFilter('Unapproved')}
                          >
                            Unapproved
                          </button>
                          <button 
                            className="bt-n clear-filters"
                            onClick={clearAllFilters}
                            style={{
                              backgroundColor: '#dc3545',
                              color: 'white',
                              border: 'none'
                            }}
                          >
                            Clear All
                          </button>
                        </div>
                        <div className="row2">
                          <div className="selected-main-detail" style={{
                            padding: '8px 12px',
                            backgroundColor: '#f8f9fa',
                            border: '1px solid #dee2e6',
                            borderRadius: '4px',
                            fontSize: '14px',
                            color: '#495057'
                          }}>
                            Selected: {selectedOption}
                          </div>
                          <select 
                            name="" 
                            id="" 
                            className="dropdown"
                            value={filters.shift}
                            onChange={(e) => handleFilterChange('shift', e.target.value)}
                          >
                            <option value="">All Shifts</option>
                            {uniqueShifts.map((shift, index) => (
                              <option key={index} value={shift}>{shift}</option>
                            ))}
                          </select>
                          <select 
                            name="" 
                            id="" 
                            className="dropdown"
                            value={filters.sub_detail}
                            onChange={(e) => handleFilterChange('sub_detail', e.target.value)}
                          >
                            <option value="">Select Sub Details</option>
                            {uniqueSubDetails.map((detail, index) => (
                              <option key={index} value={detail}>{detail}</option>
                            ))}
                          </select>
                          <select 
                            name="" 
                            id="" 
                            className="dropdown"
                            value={filters.month}
                            onChange={(e) => handleFilterChange('month', e.target.value)}
                          >
                            <option value="">All Month</option>
                            <option value="1">January</option>
                            <option value="2">February</option>
                            <option value="3">March</option>
                            <option value="4">April</option>
                            <option value="5">May</option>
                            <option value="6">June</option>
                            <option value="7">July</option>
                            <option value="8">August</option>
                            <option value="9">September</option>
                            <option value="10">October</option>
                            <option value="11">November</option>
                            <option value="12">December</option>
                          </select>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="rightside">
                    <div className="frame48">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <p className="prevCal">Previous calculations:</p>
                        <button 
                          onClick={fetchCalculationHistory}
                          style={{
                            padding: '5px 10px',
                            fontSize: '12px',
                            backgroundColor: '#5f7bef',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer'
                          }}
                        >
                          Refresh
                        </button>
                      </div>
                      <div className="yellowDiv" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        <div className="innerYellowDiv">
                          <table className="table-data">
                            <thead style={{ position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 1 }}>
                              <tr>
                                <th>Date</th>
                                <th>Multiplier</th>
                                <th>Time</th>
                              </tr>
                            </thead>
                            <tbody>
                              {calculationHistory.length === 0 ? (
                                <tr>
                                  <td colSpan="3" style={{ textAlign: 'center', color: '#666' }}>
                                    No calculations yet
                                  </td>
                                </tr>
                              ) : (
                                calculationHistory.map((record, index) => (
                                  <tr key={record._id || index}>
                                    <td>{record.date}</td>
                                    <td>{record.multiplier}</td>
                                    <td>{record.time}</td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* bottomtable */}
              <div style={styles.container}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <div>
                    <h3 style={{ margin: 0, color: '#333' }}>Production Data</h3>
                    <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#666' }}>
                      Showing {filteredData.length} of {productionData.length} records
                    </p>
                  </div>
                  <button 
                    onClick={fetchProductionData}
                    style={{
                      padding: '8px 16px',
                      fontSize: '14px',
                      backgroundColor: '#5f7bef',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer'
                    }}
                  >
                    Refresh Data
                  </button>
                </div>
                <div 
                  className="production-table-container"
                  style={{
                    ...styles.tableContainer, 
                    maxHeight: '500px', 
                    overflowY: 'auto',
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#cbd5e0 #f7fafc'
                  }}
                >
                  <table style={styles.table}>
                    <thead style={{...styles.thead, position: 'sticky', top: 0, zIndex: 10}}>
                      <tr>
                        <th style={styles.th}>S. No.</th>
                        <th style={styles.th}>Progress</th>
                        <th style={styles.th}>Date</th>
                        <th style={styles.th}>Shift</th>
                        <th style={styles.th}>Particulars</th>
                        <th style={styles.th}>From Time</th>
                        <th style={styles.th}>To Time</th>
                        <th style={styles.th}>Downtime</th>
                        <th style={styles.th}>Main Details</th>
                        <th style={styles.th}>Sub Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productionLoading ? (
                        <tr>
                          <td colSpan="10" style={{ textAlign: 'center', padding: '20px' }}>
                            Loading production data...
                          </td>
                        </tr>
                      ) : filteredData.length === 0 ? (
                        <tr>
                          <td colSpan="10" style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                            {productionData.length === 0 ? 'No production data available' : 'No data matches the current filters'}
                          </td>
                        </tr>
                      ) : (
                        filteredData.map((row, index) => {
                          const isApproved = row.progress === "Approved";
                          return (
                            <tr
                              key={row._id || index}
                              style={styles.row}
                              onMouseEnter={(e) => handleRowHover(e, true)}
                              onMouseLeave={(e) => handleRowHover(e, false)}
                            >
                              <td
                                style={{
                                  ...styles.td,
                                  ...(isApproved
                                    ? styles.rowNumberApproved
                                    : styles.rowNumberUnapproved),
                                }}
                              >
                                {index + 1}
                              </td>
                              <td style={styles.td}>
                                <StatusIndicator status={row.progress} />
                              </td>
                              <td style={styles.td}>{row.dates}</td>
                              <td style={styles.td}>
                                <ShiftBadge shift={row.shift} />
                              </td>
                              <td style={styles.td}>{row.particulars}</td>
                              <td style={{ ...styles.td, ...styles.timeCell }}>
                                {row.from_time}
                              </td>
                              <td style={{ ...styles.td, ...styles.timeCell }}>
                                {row.to_time}
                              </td>
                              <td
                                style={{ ...styles.td, ...styles.durationCell }}
                              >
                                {row.downtime}
                              </td>
                              <td
                                style={{ ...styles.td, ...styles.departmentCell }}
                              >
                                {row.main_detail}
                              </td>
                              <td style={styles.td}>{row.sub_detail}</td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              {/* end */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ShowDetails;
