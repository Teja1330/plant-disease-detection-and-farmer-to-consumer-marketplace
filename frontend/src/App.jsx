import React, { createContext, useContext, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import API from "./api";

// Components & Layouts
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FarmerLayout from "./layouts/FarmerLayout";
import CustomerLayout from "./layouts/CustomerLayout";
import Toast from "./components/ui/toast";

// Contexts
import { ToastProvider, useToast } from "./contexts/ToastContext";

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

// Main App Content Component
const AppContent = () => {
  const { toast } = useToast();
  const [user, setUser] = useState({ role: null, name: null, email: null });
  const [loading, setLoading] = useState(true);

  const logout = async () => {
    try {
      await API.post("/logout");
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
        variant: "success"
      });
    } catch (err) {
      console.error("Logout failed:", err);
      toast({
        title: "Logout failed",
        description: "There was an issue logging out.",
        variant: "destructive"
      });
    }
    setUser({ role: null, name: null, email: null });
  };

  // Fetch user on page load
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
          
          {/* Toast Container */}
          <Toast />
        </div>
      </Router>
    </UserContext.Provider>
  );
};

// Main App wrapper
const App = () => {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
};

export default App;