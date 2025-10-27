import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/farmer/Dashboard";
import Store from "../pages/farmer/Store";
import Detection from "../pages/farmer/Detection";
import Orders from "../pages/farmer/Orders";

const FarmerLayout = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="store" element={<Store />} />
      <Route path="detection" element={<Detection />} />
      <Route path="orders" element={<Orders />} />
    </Routes>
  );
};

export default FarmerLayout;
