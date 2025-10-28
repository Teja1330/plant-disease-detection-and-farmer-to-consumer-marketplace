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
} from "lucide-react";
import ProfileDropdown from "./ProfileDropdown";
import { useEffect, useState } from "react";


const Navbar = () => {
  const { user, logout } = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  const [userName, setUserName] = useState(''); // ADD STATE

  useEffect(() => {
    if (user?.name) {
      setUserName(user.name);
    } else {
      // Try to get from localStorage or make API call
      const storedUser = localStorage.getItem('user_data');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setUserName(userData.name || 'User');
        } catch (e) {
          setUserName('User');
        }
      }
    }
  }, [user]);


  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

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
    if (user?.role === "customer") return customerLinks;
    if (user?.role === "farmer") return farmerLinks;
    return publicLinks;
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-white backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50 shadow-sm"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Using public folder logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="flex items-center space-x-3"
            >
              <img
                src="/assets/leaf-logo.png"
                alt="AgriCare Logo"
                className="h-8 w-8 object-contain"
                onError={(e) => {
                  console.error("Logo failed to load");
                }}
              />
              <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
                AgriCare
              </span>
            </motion.div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {getActiveLinks().map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;
              return (
                <Link key={link.to} to={link.to}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${isActive
                        ? "bg-green-600 text-white shadow-md"
                        : "hover:bg-gray-100 text-gray-700"
                      }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{link.label}</span>
                  </motion.div>
                </Link>
              );
            })}
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-3">
            {user?.email ? (
              <div className="flex items-center space-x-3">
                {/* User info - Only show name if there's enough space */}
                <div className="hidden lg:flex items-center space-x-2 text-sm">
                  <span className="text-gray-700 font-medium truncate max-w-[120px]">
                    {userName || user?.name || 'User'} {/* UPDATED THIS LINE */}
                  </span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full capitalize">
                    {user?.role || localStorage.getItem('current_role') || 'user'} {/* UPDATED THIS LINE */}
                  </span>
                </div>

                {/* Profile Dropdown */}
                <ProfileDropdown />
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-green-600 hover:bg-green-700 text-white shadow-md">
                    Sign Up
                  </Button>
                </Link>
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