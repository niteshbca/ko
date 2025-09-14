import React, { useState, useEffect } from "react";

const ExcelFormat = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uniqueSubDetails, setUniqueSubDetails] = useState([]);
  const [uniqueMainDetails, setUniqueMainDetails] = useState([]);
  const [allUniqueValues, setAllUniqueValues] = useState([]);

  // Fetch production data from backend
  useEffect(() => {
    fetchProductionData();
  }, []);

  const fetchProductionData = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/production`);
      if (response.ok) {
        const productionData = await response.json();
        
        // Get unique subDetails and mainDetails from the data
        const uniqueSubDetails = [...new Set(productionData.map(item => item.sub_detail).filter(Boolean))];
        const uniqueMainDetails = [...new Set(productionData.map(item => item.main_detail).filter(Boolean))];
        
        // Combine all unique values for dynamic columns
        const allUniqueValues = [...new Set([...uniqueSubDetails, ...uniqueMainDetails])];
        
        // Transform data to match the excel format with dynamic columns
        const transformedData = productionData.map((item, index) => {
          const rowData = {
            id: index + 1,
            sNo: index + 1,
            date: item.dates,
            shift: item.shift,
            particulars: item.particulars,
            fromTime: item.from_time,
            toTime: item.to_time,
            downtime: item.downtime,
            mainDetails: item.main_detail,
            subDetails: item.sub_detail,
            detailValue: item.detail_value || 0,
            total: item.detail_value || 0.0,
            percentage: `${(item.detail_value || 0).toFixed(2)}%`,
          };
          
          // Add dynamic columns for each unique value (both sub and main details)
          allUniqueValues.forEach(uniqueValue => {
            const fieldName = `dynamic_${uniqueValue.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '')}`;
            rowData[fieldName] = 
              (item.sub_detail === uniqueValue || item.main_detail === uniqueValue) ? (item.detail_value || 0) : 0;
          });
          
          return rowData;
        });
        
        setData(transformedData);
        setUniqueSubDetails(uniqueSubDetails);
        setUniqueMainDetails(uniqueMainDetails);
        setAllUniqueValues(allUniqueValues);
      } else {
        setError('Error fetching production data');
      }
    } catch (error) {
      console.error('Error fetching production data:', error);
      setError('Error fetching production data');
    } finally {
      setLoading(false);
    }
  };

  const handleCellChange = (rowId, field, value) => {
    setData((prevData) =>
      prevData.map((row) => {
        if (row.id === rowId) {
          const updatedRow = {
            ...row,
            [field]: parseFloat(value) || 0,
          };

          // Calculate total from all dynamic columns
          const dynamicTotal = allUniqueValues.reduce((sum, uniqueValue) => {
            const fieldName = `dynamic_${uniqueValue.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '')}`;
            return sum + (updatedRow[fieldName] || 0);
          }, 0);
          
          updatedRow.total = dynamicTotal;
          updatedRow.percentage = `${updatedRow.total.toFixed(2)}%`;

          return updatedRow;
        }
        return row;
      })
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading production data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchProductionData}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-full mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Production Data - Excel Format</h2>
            <div className="mt-2 text-sm text-gray-600">
             
            </div>
          </div>
          <button 
            onClick={fetchProductionData}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
          >
            Refresh Data
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50">
                {/* Main headers */}
                <th
                  rowSpan="2"
                  className="border border-gray-300 px-2 py-3 text-left font-medium text-gray-600 min-w-12"
                >
                  S. No.
                </th>
                <th
                  rowSpan="2"
                  className="border border-gray-300 px-2 py-3 text-left font-medium text-gray-600 min-w-20"
                >
                  Date
                </th>
                <th
                  rowSpan="2"
                  className="border border-gray-300 px-2 py-3 text-left font-medium text-gray-600 min-w-16"
                >
                  Shift
                </th>
                <th
                  rowSpan="2"
                  className="border border-gray-300 px-2 py-3 text-left font-medium text-gray-600 min-w-24"
                >
                  Particulars
                </th>
                <th
                  rowSpan="2"
                  className="border border-gray-300 px-2 py-3 text-left font-medium text-gray-600 min-w-24"
                >
                  From Time
                </th>
                <th
                  rowSpan="2"
                  className="border border-gray-300 px-2 py-3 text-left font-medium text-gray-600 min-w-20"
                >
                  Downtime
                </th>
                  <th
                    rowSpan="2"
                    className="border border-gray-300 px-2 py-3 text-left font-medium text-gray-600 min-w-20"
                  >
                    Main Details
                  </th>
                  <th
                    rowSpan="2"
                    className="border border-gray-300 px-2 py-3 text-left font-medium text-gray-600 min-w-20"
                  >
                    Sub Details
                  </th>

                  {/* Dynamic Columns for all unique values */}
                  {allUniqueValues.length > 0 && (
                    <th
                      colSpan={allUniqueValues.length}
                      className="border border-gray-300 px-2 py-2 text-center font-medium text-gray-600 bg-blue-50"
                    >
                      Dynamic Details Breakdown
                    </th>
                  )}

                <th
                  rowSpan="2"
                  className="border border-gray-300 px-2 py-3 text-center font-medium text-gray-600 min-w-16"
                >
                  Total
                </th>
                <th
                  rowSpan="2"
                  className="border border-gray-300 px-2 py-3 text-center font-medium text-gray-600 min-w-16"
                >
                  Percentage
                </th>
              </tr>
              <tr className="bg-gray-50">
                {/* Dynamic columns subheaders */}
                {allUniqueValues.map((uniqueValue, index) => (
                  <th 
                    key={index}
                    className="border border-gray-300 px-1 py-2 text-center font-medium text-gray-600 text-xs min-w-20"
                  >
                    {uniqueValue}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={8 + allUniqueValues.length + 2} className="p-8 text-center text-gray-500">
                    No production data available
                  </td>
                </tr>
              ) : (
                data.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 px-2 py-3 text-gray-600">
                    {row.id}
                  </td>
                  <td className="border border-gray-300 px-2 py-3 text-gray-800 whitespace-nowrap">
                    {row.date}
                  </td>
                  <td className="border border-gray-300 px-2 py-3 text-gray-800">
                    {row.shift}
                  </td>
                  <td className="border border-gray-300 px-2 py-3 text-gray-800">
                    {row.particulars}
                  </td>
                  <td className="border border-gray-300 px-2 py-3 text-gray-800 whitespace-nowrap">
                    {row.fromTime}
                  </td>
                  <td className="border border-gray-300 px-2 py-3 text-gray-800 whitespace-nowrap">
                    {row.downtime}
                  </td>
                  <td className="border border-gray-300 px-2 py-3 text-gray-800">
                    {row.mainDetails}
                  </td>
                  <td className="border border-gray-300 px-2 py-3 text-gray-800">
                    {row.subDetails}
                  </td>

                  {/* Dynamic columns for all unique values */}
                  {allUniqueValues.map((uniqueValue, index) => {
                    const fieldName = `dynamic_${uniqueValue.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '')}`;
                    const value = row[fieldName] || 0;
                    return (
                      <td
                        key={index}
                        className="border border-gray-300 px-1 py-3 text-center"
                      >
                        <input
                          type="number"
                          value={value}
                          onChange={(e) =>
                            handleCellChange(
                              row.id,
                              fieldName,
                              e.target.value
                            )
                          }
                          className="w-full text-center border-none outline-none bg-transparent text-xs"
                          step="0.01"
                          min="0"
                        />
                      </td>
                    );
                  })}

                  <td className="border border-gray-300 px-2 py-3 text-center font-medium text-gray-800">
                    {row.total.toFixed(2)}
                  </td>
                  <td className="border border-gray-300 px-2 py-3 text-center font-medium text-gray-800">
                    {row.percentage}
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExcelFormat;
