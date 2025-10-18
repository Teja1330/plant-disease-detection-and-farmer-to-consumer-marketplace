import React, { createContext, useContext, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
import Home from "./pages/Home";
import Services from "./pages/Services";
import About from "./pages/About";
import Guidelines from "./pages/Guidelines";
import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";
import NotFound from "./pages/NotFound";

// Farmer Pages
import FarmerDashboard from "./pages/farmer/Dashboard";
import FarmerStore from "./pages/farmer/Store";
import FarmerDetection from "./pages/farmer/Detection";
import FarmerReports from "./pages/farmer/Reports";
import FarmerOrders from "./pages/farmer/Orders";

// Customer Pages
import CustomerHome from "./pages/customer/CustomerHome";
import CustomerMarketplace from "./pages/customer/Marketplace";
import CustomerOrders from "./pages/customer/OrderHistory";
import CustomerCart from "./pages/customer/Cart";

// User Context
const UserContext = createContext(null);
export const useUser = () => useContext(UserContext);

const App = () => {
  const [user, setUser] = useState({ role: null, name: null, email: null });

  const logout = () => setUser({ role: null, name: null, email: null });

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/about" element={<About />} />
              <Route path="/guidelines" element={<Guidelines />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />

              {/* Farmer Routes */}
              <Route path="/farmer" element={<FarmerDashboard />} />
              <Route path="/farmer/store" element={<FarmerStore />} />
              <Route path="/farmer/detection" element={<FarmerDetection />} />
              <Route path="/farmer/reports" element={<FarmerReports />} />
              <Route path="/farmer/orders" element={<FarmerOrders />} />

              {/* Customer Routes */}
              <Route path="/customer" element={<CustomerHome />} />
              <Route path="/customer/marketplace" element={<CustomerMarketplace />} />
              <Route path="/customer/orders" element={<CustomerOrders />} />
              <Route path="/customer/cart" element={<CustomerCart />} />

              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </UserContext.Provider>
  );
};

export default App;
