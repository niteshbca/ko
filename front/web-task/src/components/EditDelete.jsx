import React, { useState, useEffect } from "react";
import { Edit, Trash2 } from "react-feather";

const EditDelete = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  // Fetch production data from backend
  useEffect(() => {
    fetchProductionData();
  }, []);

  const fetchProductionData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/production`);
      if (response.ok) {
        const productionData = await response.json();
        setData(productionData);
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

  const handleEdit = (id) => {
    const item = data.find((row) => row._id === id);
    setEditingId(id);
    setEditForm({
      progress: item.progress || 'Unapproved',
      dates: item.dates,
      shift: item.shift,
      particulars: item.particulars,
      from_time: item.from_time,
      to_time: item.to_time,
      downtime: item.downtime,
      main_detail: item.main_detail,
      sub_detail: item.sub_detail,
      detail_value: item.detail_value || 0
    });
  };

  const handleSaveEdit = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/production/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      });

      if (response.ok) {
        const updatedItem = await response.json();
        setData(data.map(item => item._id === editingId ? updatedItem : item));
        setEditingId(null);
        setEditForm({});
        alert('Record updated successfully!');
      } else {
        alert('Error updating record');
      }
    } catch (error) {
      console.error('Error updating record:', error);
      alert('Error updating record');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this row?")) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/production/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setData(data.filter((row) => row._id !== id));
          alert('Record deleted successfully!');
        } else {
          alert('Error deleting record');
        }
      } catch (error) {
        console.error('Error deleting record:', error);
        alert('Error deleting record');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-5 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading production data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-5 flex items-center justify-center">
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
    <div className="min-h-screen bg-gray-100 p-5">
      <div className="max-w-7xl mx-auto bg-gray-400 rounded-lg p-5">
        <div className="bg-white rounded-lg overflow-hidden shadow-lg">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-semibold text-gray-800">Production Data Management</h2>
            <button 
              onClick={fetchProductionData}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
            >
              Refresh Data
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left py-3 px-2 text-gray-500 font-medium text-xs border-b">
                    S. No.
                  </th>
                  <th className="text-left py-3 px-2 text-gray-500 font-medium text-xs border-b min-w-24">
                    Progress
                  </th>
                  <th className="text-left py-3 px-2 text-gray-500 font-medium text-xs border-b min-w-24">
                    Date
                  </th>
                  <th className="text-left py-3 px-2 text-gray-500 font-medium text-xs border-b">
                    Shift
                  </th>
                  <th className="text-left py-3 px-2 text-gray-500 font-medium text-xs border-b min-w-48">
                    Particulars
                  </th>
                  <th className="text-left py-3 px-2 text-gray-500 font-medium text-xs border-b min-w-24">
                    From Time
                  </th>
                  <th className="text-left py-3 px-2 text-gray-500 font-medium text-xs border-b min-w-24">
                    To Time
                  </th>
                  <th className="text-left py-3 px-2 text-gray-500 font-medium text-xs border-b">
                    Downtime
                  </th>
                  <th className="text-left py-3 px-2 text-gray-500 font-medium text-xs border-b">
                    Main Details
                  </th>
                  <th className="text-left py-3 px-2 text-gray-500 font-medium text-xs border-b min-w-36">
                    Sub Details
                  </th>
                  <th className="text-right py-3 px-2 text-gray-500 font-medium text-xs border-b">
                    Detail Value
                  </th>
                  <th className="text-left py-3 px-2 text-gray-500 font-medium text-xs border-b min-w-32">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td colSpan="12" className="p-8 text-center text-gray-500">
                      No production data available
                    </td>
                  </tr>
                ) : (
                  data.map((row, index) => (
                    <tr
                      key={row._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3 px-2 text-gray-500 font-medium border-b border-gray-100">
                        {index + 1}
                      </td>
                      <td className="py-3 px-2 text-gray-800 border-b border-gray-100">
                        {editingId === row._id ? (
                          <select
                            value={editForm.progress}
                            onChange={(e) => setEditForm({...editForm, progress: e.target.value})}
                            className="w-full px-2 py-1 border rounded text-xs"
                          >
                            <option value="Approved">Approved</option>
                            <option value="Unapproved">Unapproved</option>
                          </select>
                        ) : (
                          <span className={`px-2 py-1 rounded text-xs ${
                            row.progress === 'Approved' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {row.progress}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-2 text-gray-800 border-b border-gray-100 whitespace-nowrap">
                        {editingId === row._id ? (
                          <input
                            type="text"
                            value={editForm.dates}
                            onChange={(e) => setEditForm({...editForm, dates: e.target.value})}
                            className="w-full px-2 py-1 border rounded text-xs"
                          />
                        ) : (
                          row.dates
                        )}
                      </td>
                      <td className="py-3 px-2 text-gray-800 border-b border-gray-100">
                        {editingId === row._id ? (
                          <select
                            value={editForm.shift}
                            onChange={(e) => setEditForm({...editForm, shift: e.target.value})}
                            className="w-full px-2 py-1 border rounded text-xs"
                          >
                            <option value="Day">Day</option>
                            <option value="Night">Night</option>
                          </select>
                        ) : (
                          row.shift
                        )}
                      </td>
                      <td className="py-3 px-2 text-gray-800 border-b border-gray-100">
                        {editingId === row._id ? (
                          <input
                            type="text"
                            value={editForm.particulars}
                            onChange={(e) => setEditForm({...editForm, particulars: e.target.value})}
                            className="w-full px-2 py-1 border rounded text-xs"
                          />
                        ) : (
                          row.particulars
                        )}
                      </td>
                      <td className="py-3 px-2 text-gray-800 border-b border-gray-100 whitespace-nowrap">
                        {editingId === row._id ? (
                          <input
                            type="text"
                            value={editForm.from_time}
                            onChange={(e) => setEditForm({...editForm, from_time: e.target.value})}
                            className="w-full px-2 py-1 border rounded text-xs"
                          />
                        ) : (
                          row.from_time
                        )}
                      </td>
                      <td className="py-3 px-2 text-gray-800 border-b border-gray-100 whitespace-nowrap">
                        {editingId === row._id ? (
                          <input
                            type="text"
                            value={editForm.to_time}
                            onChange={(e) => setEditForm({...editForm, to_time: e.target.value})}
                            className="w-full px-2 py-1 border rounded text-xs"
                          />
                        ) : (
                          row.to_time
                        )}
                      </td>
                      <td className="py-3 px-2 text-gray-800 border-b border-gray-100 whitespace-nowrap">
                        {editingId === row._id ? (
                          <input
                            type="text"
                            value={editForm.downtime}
                            onChange={(e) => setEditForm({...editForm, downtime: e.target.value})}
                            className="w-full px-2 py-1 border rounded text-xs"
                          />
                        ) : (
                          row.downtime
                        )}
                      </td>
                      <td className="py-3 px-2 text-gray-800 border-b border-gray-100">
                        {editingId === row._id ? (
                          <select
                            value={editForm.main_detail}
                            onChange={(e) => setEditForm({...editForm, main_detail: e.target.value})}
                            className="w-full px-2 py-1 border rounded text-xs"
                          >
                            <option value="By Employee">By Employee</option>
                            <option value="By Other">By Other</option>
                          </select>
                        ) : (
                          row.main_detail
                        )}
                      </td>
                      <td className="py-3 px-2 text-gray-800 border-b border-gray-100">
                        {editingId === row._id ? (
                          <input
                            type="text"
                            value={editForm.sub_detail}
                            onChange={(e) => setEditForm({...editForm, sub_detail: e.target.value})}
                            className="w-full px-2 py-1 border rounded text-xs"
                          />
                        ) : (
                          row.sub_detail
                        )}
                      </td>
                      <td className="py-3 px-2 text-gray-800 border-b border-gray-100 text-right">
                        {editingId === row._id ? (
                          <input
                            type="number"
                            value={editForm.detail_value}
                            onChange={(e) => setEditForm({...editForm, detail_value: parseFloat(e.target.value) || 0})}
                            className="w-full px-2 py-1 border rounded text-xs"
                            step="0.01"
                          />
                        ) : (
                          row.detail_value || 0
                        )}
                      </td>
                      <td className="py-3 px-2 border-b border-gray-100">
                        <div className="flex items-center gap-1">
                          {editingId === row._id ? (
                            <>
                              <button
                                onClick={handleSaveEdit}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 hover:bg-green-100 text-green-600 text-xs rounded transition-colors"
                              >
                                Save
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-gray-50 hover:bg-gray-100 text-gray-600 text-xs rounded transition-colors"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleEdit(row._id)}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs rounded transition-colors"
                              >
                                <Edit size={12} />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(row._id)}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-red-50 hover:bg-red-100 text-red-600 text-xs rounded transition-colors"
                              >
                                <Trash2 size={12} />
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditDelete;
