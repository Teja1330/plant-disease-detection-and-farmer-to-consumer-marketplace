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
import AccountChoice from "./pages/AccountChoice";

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
  const [user, setUser] = useState({
    role: null,
    name: null,
    email: null,
    has_farmer: false,
    has_customer: false
  });
  const [loading, setLoading] = useState(true);

  const logout = async () => {
    try {
      await API.post("/logout");
    } catch (err) {
      console.error("Logout API failed:", err);
    } finally {
      // Always clear client-side storage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('current_role');
      localStorage.removeItem('user_data');
      localStorage.removeItem('temp_password');
      localStorage.removeItem('cart');
      
      setUser({
        role: null,
        name: null,
        email: null,
        has_farmer: false,
        has_customer: false
      });
      
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
        variant: "success"
      });
    }
  };

  // Fetch user on page load
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          setLoading(false);
          return;
        }

        const res = await API.get("/user");
        console.log("User data from API:", res.data);

        const userData = {
          email: res.data.email,
          name: res.data.name,
          role: res.data.role || (res.data.has_farmer ? 'farmer' : 'customer'),
          has_farmer: res.data.has_farmer || false,
          has_customer: res.data.has_customer || false
        };

        setUser(userData);

        // Store user data in localStorage
        localStorage.setItem('user_data', JSON.stringify({
          name: userData.name,
          email: userData.email,
          role: userData.role
        }));

        // Store current role if not set
        if (!localStorage.getItem('current_role')) {
          localStorage.setItem('current_role', userData.role);
        }

      } catch (err) {
        console.log("Not logged in or token expired");
        localStorage.removeItem('auth_token');
        localStorage.removeItem('temp_password');
        localStorage.removeItem('user_data');
        localStorage.removeItem('current_role');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p className="text-center">Loading...</p></div>;

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

              {/* Account Choice Route */}
              <Route path="/account-choice" element={<AccountChoice />} />

              {/* Farmer Routes */}
              <Route path="/farmer/*" element={
                <ProtectedRoute allowedRoles={['farmer', 'multi']}>
                  <FarmerLayout />
                </ProtectedRoute>
              } />

              {/* Customer Routes */}
              <Route path="/customer/*" element={
                <ProtectedRoute allowedRoles={['customer', 'multi']}>
                  <CustomerLayout />
                </ProtectedRoute>
              } />

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