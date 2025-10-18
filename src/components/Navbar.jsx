import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useUser } from "../App";
import {
  Leaf,
  User,
  LogOut,
  Home,
  ShoppingBag,
  FileText,
  ClipboardList,
  Package,
  Camera,
} from "lucide-react";

const Navbar = () => {
  const { user, logout } = useUser();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
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
    { to: "/farmer/reports", label: "Reports", icon: ClipboardList },
    { to: "/farmer/orders", label: "Orders", icon: Package },
  ];

  const getActiveLinks = () => {
    if (user.role === "customer") return customerLinks;
    if (user.role === "farmer") return farmerLinks;
    return publicLinks;
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-surface/95 backdrop-blur-sm border-b border-border sticky top-0 z-50 shadow-soft"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Leaf className="h-8 w-8 text-primary" />
            </motion.div>
            <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              AgriCare
            </span>
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
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-medium"
                        : "hover:bg-surface-soft text-foreground"
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
            {user.role ? (
              <div className="flex items-center space-x-3">
                <div className="hidden sm:flex items-center space-x-2 text-sm">
                  <User className="h-4 w-4 text-primary" />
                  <span className="text-foreground font-medium">{user.name}</span>
                  <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full capitalize">
                    {user.role}
                  </span>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-gradient-primary hover:opacity-90 shadow-medium">
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

