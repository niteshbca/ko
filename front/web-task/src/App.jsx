import { useState } from "react";
import "./App.css";
import EmployeeLogin from "./components/EmployeeLogin.jsx";
import AdminDashB from "./components/AdminDashB.jsx";
import AdminDashbTwo from "./components/AdminDashbTwo.jsx";
import AddEmployees from "./components/AddEmployees.jsx";
import EditData from "./components/EditData.jsx";
import ShowDetails from "./components/ShowDetails.jsx";
import ProductionManagement from "./components/ProductionManagement.jsx";
import AdminLoginScreen from "./components/AdminLoginScreen.jsx";
import WelcomeScreen from "./components/WelcomeScreen.jsx";
import EditDelete from "./components/EditDelete.jsx";
import ExcelFormat from "./components/ExcelFormat.jsx";
import TableFormat from "./components/TableFormat.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<WelcomeScreen />} />
          <Route path="/admin-login" element={<AdminLoginScreen />} />
          <Route path="/employee-login" element={<EmployeeLogin />} />
          <Route path="/admin-dashboard" element={<AdminDashB />} />
          <Route path="/admin-dashboard-two" element={<AdminDashbTwo />} />
          <Route path="/add-employees" element={<AddEmployees />} />
          <Route path="/edit-data" element={<EditData />} />
          <Route
            path="/production-management"
            element={<ProductionManagement />}
          />
          <Route path="/show-details" element={<ShowDetails />} />
          <Route path="/edit-delete" element={<EditDelete />} />
          <Route path="/excel-format" element={<ExcelFormat />} />
          <Route path="/table-format" element={<TableFormat />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
