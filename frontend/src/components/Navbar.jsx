// components/Navbar.jsx - COMPLETELY FIXED FOR PREFIX IDS
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useUser } from "../App";
import {
  User,
  Home,
  ShoppingBag,
  FileText,
  ClipboardList,
  Package,
  Camera,
  LogOut
} from "lucide-react";
import ProfileDropdown from "./ProfileDropdown";

const Navbar = () => {
  const { user, logout } = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Sync user data on mount and when user changes
  useEffect(() => {
    const syncUserData = () => {
      try {
        const token = localStorage.getItem('auth_token');
        const storedUser = localStorage.getItem('user_data');
        
        if (token && storedUser) {
          const userData = JSON.parse(storedUser);
          setCurrentUser(userData);
          setIsLoggedIn(true);
          console.log("🔄 Navbar - User authenticated:", {
            id: userData.id, // Prefix ID
            name: userData.name,
            role: userData.role
          });
        } else {
          setCurrentUser(null);
          setIsLoggedIn(false);
          console.log("🔄 Navbar - No user authenticated");
        }
      } catch (error) {
        console.error("❌ Navbar - Error syncing user data:", error);
        setCurrentUser(null);
        setIsLoggedIn(false);
      }
    };

    syncUserData();
    
    // Listen for auth changes
    const handleAuthChange = () => {
      console.log("🔄 Navbar - Auth change detected");
      syncUserData();
    };

    window.addEventListener('authChange', handleAuthChange);
    
    return () => {
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, [user]);

  // Public navbar links
  const publicLinks = [
    { to: "/", label: "Home", icon: Home },
    { to: "/services", label: "Services", icon: ShoppingBag },
    { to: "/about", label: "About", icon: FileText },
    { to: "/guidelines", label: "Guidelines", icon: ClipboardList },
  ];

  // Customer navbar links
  const customerLinks = [
    { to: "/customer", label: "Home", icon: Home },
    { to: "/customer/marketplace", label: "Marketplace", icon: Package },
    { to: "/customer/orders", label: "Order History", icon: ClipboardList },
    { to: "/customer/cart", label: "Cart", icon: ShoppingBag },
  ];

  // Farmer navbar links
  const farmerLinks = [
    { to: "/farmer", label: "Dashboard", icon: Home },
    { to: "/farmer/store", label: "Store", icon: ShoppingBag },
    { to: "/farmer/detection", label: "Detection", icon: Camera },
    { to: "/farmer/orders", label: "Orders", icon: Package },
  ];

  const getActiveLinks = () => {
    if (!isLoggedIn || !currentUser) {
      return publicLinks;
    }
    
    const userRole = currentUser.role || localStorage.getItem('current_role');
    
    console.log("🔍 Navbar - Determining links for:", {
      id: currentUser.id, // Prefix ID
      role: userRole
    });
    
    if (userRole === "customer") return customerLinks;
    if (userRole === "farmer") return farmerLinks;
    if (userRole === "multi") {
      const currentRole = localStorage.getItem('current_role');
      if (currentRole === "farmer") return farmerLinks;
      if (currentRole === "customer") return customerLinks;
    }
    
    return publicLinks;
  };

  const handleNavigation = (to) => {
    console.log("🔄 Navigating to:", to);
    navigate(to);
  };

  const handleLogout = async () => {
    await logout();
    window.dispatchEvent(new Event('authChange'));
    navigate("/");
  };

  const activeLinks = getActiveLinks();

  console.log("🔍 Navbar State:", {
    isLoggedIn,
    currentUserId: currentUser?.id, // Prefix ID
    currentUserEmail: currentUser?.email,
    activeLinks: activeLinks.length,
    location: location.pathname
  });

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-white backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50 shadow-sm"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-3 group cursor-pointer"
            onClick={() => handleNavigation("/")}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="flex items-center space-x-3"
            >
              <img
                src="/assets/leaf-logo.png"
                alt="AgriCare Logo"
                className="h-8 w-8 object-contain"
              />
              <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
                AgriCare
              </span>
            </motion.div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {activeLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;
              
              return (
                <motion.div
                  key={link.to}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-green-600 text-white shadow-md"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                  onClick={() => handleNavigation(link.to)}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{link.label}</span>
                </motion.div>
              );
            })}
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-3">
            {isLoggedIn ? (
              <div className="flex items-center space-x-3">
                {/* User info */}
                <div className="hidden lg:flex items-center space-x-2 text-sm">
                  <span className="text-gray-700 font-medium truncate max-w-[120px]">
                    {currentUser?.name || 'User'}
                  </span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full capitalize">
                    {currentUser?.role || localStorage.getItem('current_role') || 'user'}
                  </span>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-mono">
                    ID: {currentUser?.id || 'N/A'} {/* Display prefix ID */}
                  </span>
                </div>

                {/* Quick Logout Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="hidden sm:flex items-center space-x-1 border-red-200 text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>

                {/* Profile Dropdown */}
                <ProfileDropdown />
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                  onClick={() => handleNavigation("/login")}
                >
                  Login
                </Button>
                <Button 
                  className="bg-green-600 hover:bg-green-700 text-white shadow-md"
                  onClick={() => handleNavigation("/signup")}
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;

export function handleScroll() {
  window.scrollTo({
    top: 10,
    behavior: "smooth",
  });
}