import { Routes, Route } from "react-router-dom";
import CustomerHome from "../pages/customer/CustomerHome";
import Marketplace from "../pages/customer/Marketplace";
import Cart from "../pages/customer/Cart";
import Orders from "../pages/customer/OrderHistory";

const CustomerLayout = () => {
  return (
    <Routes>
      <Route path="/" element={<CustomerHome />} />
      <Route path="marketplace" element={<Marketplace />} />
      <Route path="cart" element={<Cart />} />
      <Route path="orders" element={<Orders />} />
    </Routes>
  );
};

export default CustomerLayout;
