import React, { useState, useEffect } from "react";

const DowntimeTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch production data from backend
  useEffect(() => {
    fetchProductionData();
  }, []);

  const fetchProductionData = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/production`);
      if (response.ok) {
        const productionData = await response.json();
        // Transform data to match the table format
        const transformedData = productionData.map((item, index) => ({
          serialNo: index + 1,
          date: item.dates,
          shift: item.shift,
          particulars: item.particulars,
          fromTime: item.from_time,
          toTime: item.to_time,
          downtime: item.downtime,
          mainDetails: item.main_detail,
          subDetails: item.sub_detail,
          detailValue: item.detail_value ? item.detail_value.toString() : "0.00",
        }));
        setData(transformedData);
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

  if (loading) {
    return (
      <div className="p-5 bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading production data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-5 bg-gray-100 min-h-screen flex items-center justify-center">
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
    <div className="p-5 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-lg p-5 shadow-lg overflow-x-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Production Data - Table Format</h2>
          <button 
            onClick={fetchProductionData}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
          >
            Refresh Data
          </button>
        </div>
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-gray-600 font-normal p-3 text-left border-b border-gray-200 whitespace-nowrap w-10 text-center">
                S. No.
              </th>
              <th className="text-gray-600 font-normal p-3 text-left border-b border-gray-200 whitespace-nowrap w-20">
                Date
              </th>
              <th className="text-gray-600 font-normal p-3 text-left border-b border-gray-200 whitespace-nowrap w-16 text-center">
                Shift
              </th>
              <th className="text-gray-600 font-normal p-3 text-left border-b border-gray-200 whitespace-nowrap w-44">
                Particulars
              </th>
              <th className="text-gray-600 font-normal p-3 text-left border-b border-gray-200 whitespace-nowrap w-20">
                From Time
              </th>
              <th className="text-gray-600 font-normal p-3 text-left border-b border-gray-200 whitespace-nowrap w-20">
                To Time
              </th>
              <th className="text-gray-600 font-normal p-3 text-left border-b border-gray-200 whitespace-nowrap w-20 text-center">
                Downtime
              </th>
              <th className="text-gray-600 font-normal p-3 text-left border-b border-gray-200 whitespace-nowrap w-28">
                Main Details
              </th>
              <th className="text-gray-600 font-normal p-3 text-left border-b border-gray-200 whitespace-nowrap w-28">
                Sub Details
              </th>
              <th className="text-gray-600 font-normal p-3 text-left border-b border-gray-200 whitespace-nowrap w-16 text-center">
                Detail Value
              </th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="10" className="p-8 text-center text-gray-500">
                  No production data available
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="p-3 border-b border-gray-200 text-gray-600 text-center">
                    {row.serialNo}
                  </td>
                  <td className="p-3 border-b border-gray-200 text-gray-700">
                    {row.date}
                  </td>
                  <td className="p-3 border-b border-gray-200 text-gray-700 text-center">
                    {row.shift}
                  </td>
                  <td className="p-3 border-b border-gray-200 text-gray-700">
                    {row.particulars}
                  </td>
                  <td className="p-3 border-b border-gray-200 text-gray-700">
                    {row.fromTime}
                  </td>
                  <td className="p-3 border-b border-gray-200 text-gray-700">
                    {row.toTime}
                  </td>
                  <td className="p-3 border-b border-gray-200 text-gray-700 text-center">
                    {row.downtime}
                  </td>
                  <td className="p-3 border-b border-gray-200 text-gray-700">
                    {row.mainDetails}
                  </td>
                  <td className="p-3 border-b border-gray-200 text-gray-700">
                    {row.subDetails}
                  </td>
                  <td className="p-3 border-b border-gray-200 text-gray-700 text-center">
                    {row.detailValue}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DowntimeTable;
