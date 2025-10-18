import React, { createContext, useContext, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import API from "./api";

// Components & Layouts
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FarmerLayout from "./layouts/FarmerLayout";
import CustomerLayout from "./layouts/CustomerLayout";

// Pages
import Home from "./pages/Home";
import Services from "./pages/Services";
import About from "./pages/About";
import Guidelines from "./pages/Guidelines";
import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";
import NotFound from "./pages/NotFound";

// User Context
const UserContext = createContext(null);
export const useUser = () => useContext(UserContext);

// Protected Route
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useUser();

  if (!user || !user.email) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;

  return children;
};

const App = () => {
  const [user, setUser] = useState({ role: null, name: null, email: null });
  const [loading, setLoading] = useState(true);

  // logout function
  const logout = async () => {
    try {
      await API.post("/logout");
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      // Clear token from storage
      localStorage.removeItem('auth_token');
      setUser({ role: null, name: null, email: null });
    }
  };

  // Fetch user on page load
  // In App.jsx, update the useEffect:
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get("/user");
        setUser({
          email: res.data.email,
          name: res.data.name,
          role: res.data.role,
        });
      } catch (err) {
        console.log("Not logged in yet");
        // Remove invalid token
        localStorage.removeItem('auth_token');
      } finally {
        setLoading(false);
      }
    };

    // Check if we have a token before making the request
    const token = localStorage.getItem('auth_token');
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

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
              <Route path="/farmer/*" element={<ProtectedRoute allowedRoles={['farmer']}><FarmerLayout /></ProtectedRoute>} />

              {/* Customer Routes */}
              <Route path="/customer/*" element={<ProtectedRoute allowedRoles={['customer']}><CustomerLayout /></ProtectedRoute>} />

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