// App.jsx - COMPLETELY FIXED FOR PREFIX IDS
import React, { createContext, useContext, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import API from "./api";

// Components & Layouts
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FarmerLayout from "./layouts/FarmerLayout";
import CustomerLayout from "./layouts/CustomerLayout";
import Toast from "./components/ui/toast";

// Contexts
import { ToastProvider } from "./contexts/ToastContext";

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

// Protected Route Component - UPDATED FOR PREFIX IDS
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useUser();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const token = localStorage.getItem('auth_token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If user exists and has role, check authorization
  if (user && user.email) {
    const userRole = user.role || localStorage.getItem('current_role');
    
    if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

// Navigation Handler Component
const NavigationHandler = () => {
  const location = useLocation();
  
  useEffect(() => {
    console.log("📍 Current Route:", location.pathname);
  }, [location]);

  return null;
};

// Main App Content Component
const AppContent = () => {
  const [user, setUser] = useState({
    id: null, // Now handles prefix IDs: F1, C1, M1, etc.
    role: null,
    name: null,
    email: null,
    has_farmer: false,
    has_customer: false,
    street_address: null,
    city: null,
    district: null,
    state: null,
    country: null,
    pincode: null,
    phone: null
  });
  const [loading, setLoading] = useState(true);

  const logout = async () => {
    try {
      await API.post("/logout");
    } catch (err) {
      console.error("Logout API failed:", err);
    } finally {
      // Clear all client-side storage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('current_role');
      localStorage.removeItem('user_data');
      localStorage.removeItem('temp_password');
      localStorage.removeItem('cart');

      setUser({
        id: null,
        role: null,
        name: null,
        email: null,
        has_farmer: false,
        has_customer: false,
        street_address: null,
        city: null,
        district: null,
        state: null,
        country: null,
        pincode: null,
        // Derived address flags
        hasCompleteAddress: false,
        hasNoAddress: true,
        phone: null
      });

      console.log("✅ User logged out successfully");
    }
  };

  // Fetch user on page load - UPDATED FOR PREFIX IDS
  useEffect(() => {
    // Helper to compute derived address flags once and attach to user object
    const computeAddressFlags = (u) => {
      const street = u?.street_address || '';
      const city = u?.city || '';
      const district = u?.district || '';
      const state = u?.state || '';
      const pincode = u?.pincode || '';

      const hasCompleteAddress = !!(street && street.trim() !== '' && city && city.trim() !== '' && district && district.trim() !== '' && state && state.trim() !== '' && pincode && pincode.trim() !== '');
      const hasNoAddress = !street && !city && !district && !state && !pincode;

      return { hasCompleteAddress, hasNoAddress };
    };

    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const storedUser = localStorage.getItem('user_data');

        if (!token) {
          setLoading(false);
          return;
        }

        // If we have stored user data, use it immediately
        if (storedUser) {
          try {
            const userData = JSON.parse(storedUser);
            // Ensure address flags exist (compute if missing)
            const flags = computeAddressFlags(userData);
            const merged = { ...userData, ...flags };
            setUser(merged);
            console.log("✅ User loaded from localStorage:", {
              id: merged.id, // Prefix ID
              name: merged.name,
              role: merged.role
            });
          } catch (e) {
            console.error("Error parsing stored user data:", e);
          }
        }

        // Then try to fetch fresh data from API
        console.log("🔄 Fetching fresh user data from API...");
        const response = await API.get("/user");
        const userData = response.data;

        console.log("✅ Fresh user data from API:", {
          id: userData.id, // Prefix ID (F1, C1, M1, etc.)
          name: userData.name,
          role: userData.role,
          has_farmer: userData.has_farmer,
          has_customer: userData.has_customer
        });

        const flags = computeAddressFlags(userData);
        const updatedUser = {
          id: userData.id, // Store prefix ID
          email: userData.email,
          name: userData.name,
          role: userData.role || (userData.has_farmer ? 'farmer' : 'customer'),
          has_farmer: userData.has_farmer || false,
          has_customer: userData.has_customer || false,
          street_address: userData.street_address || null,
          city: userData.city || null,
          district: userData.district || null,
          state: userData.state || null,
          country: userData.country || 'India',
          pincode: userData.pincode || null,
          // attach derived flags
          hasCompleteAddress: flags.hasCompleteAddress,
          hasNoAddress: flags.hasNoAddress,
          phone: userData.phone || null
        };

        setUser(updatedUser);
        localStorage.setItem('user_data', JSON.stringify(updatedUser));

        // Ensure current_role is set
        if (!localStorage.getItem('current_role')) {
          localStorage.setItem('current_role', updatedUser.role);
        }

      } catch (err) {
        console.error("❌ Failed to fetch user data:", err);

        // Clear invalid token
        if (err.response?.status === 401) {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user_data');
          localStorage.removeItem('current_role');
          console.log("🔑 Token expired or invalid - cleared");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Function to refresh user data - UPDATED FOR PREFIX IDS
  const refreshUserData = async () => {
    try {
      console.log("🔄 Manually refreshing user data...");
      const response = await API.get("/user");
      const userData = response.data;

      const updatedUser = {
        id: userData.id, // Store prefix ID
        email: userData.email,
        name: userData.name,
        role: userData.role || (userData.has_farmer ? 'farmer' : 'customer'),
        has_farmer: userData.has_farmer || false,
        has_customer: userData.has_customer || false,
        street_address: userData.street_address || null,
        city: userData.city || null,
        district: userData.district || null,
        state: userData.state || null,
        country: userData.country || 'India',
        pincode: userData.pincode || null,
        phone: userData.phone || null
      };

      setUser(updatedUser);
      localStorage.setItem('user_data', JSON.stringify(updatedUser));

      console.log("✅ User data refreshed successfully - ID:", updatedUser.id);
      return true;
    } catch (error) {
      console.error("❌ Failed to refresh user data:", error);
      return false;
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><p className="text-center">Loading...</p></div>;
  }

  return (
    <UserContext.Provider value={{ user, setUser, logout, refreshUserData, loading }}>
      <div className="min-h-screen flex flex-col">
        <NavigationHandler />
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
            <Route 
              path="/account-choice" 
              element={
                <ProtectedRoute>
                  <AccountChoice />
                </ProtectedRoute>
              } 
            />

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
    </UserContext.Provider>
  );
};

// Main App wrapper
const App = () => {
  return (
    <ToastProvider>
      <Router>
        <AppContent />
      </Router>
    </ToastProvider>
  );
};

export default App;