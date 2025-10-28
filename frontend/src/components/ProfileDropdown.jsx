import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { User, Tractor, LogOut, Settings, UserPlus, Loader2, Mail, MapPin } from "lucide-react";
import { useUser } from "../App";
import API from "../api";
import { authAPI } from "../api";
import AddressForm from "./AddressForm";

const ProfileDropdown = () => {
  const { user, setUser, logout } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);

  const handleSwitchAccount = async (targetRole) => {
    try {
      const response = await authAPI.switchAccount(targetRole);

      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('current_role', targetRole);

      setUser(prev => ({
        ...prev,
        role: targetRole
      }));

      navigate(targetRole === "farmer" ? "/farmer" : "/customer");

      toast({
        title: `Switched to ${targetRole} Account`,
        description: `You are now in your ${targetRole} dashboard.`,
      });
    } catch (error) {
      console.error("Switch account error:", error);
      toast({
        title: "Switch Failed",
        description: "Failed to switch accounts. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAutoRegister = async (targetRole) => {
    if (!user.email) return;

    const tempPassword = localStorage.getItem('temp_password');

    if (!tempPassword) {
      toast({
        title: "Cannot Auto-Register",
        description: "Please login again to enable auto-registration.",
        variant: "destructive",
      });
      return;
    }

    setIsRegistering(true);
    try {
      const response = await API.post("/register", {
        email: user.email,
        password: tempPassword,
        name: user.name,
        role: targetRole
      });

      setUser(prev => ({
        ...prev,
        has_farmer: response.data.user.has_farmer,
        has_customer: response.data.user.has_customer
      }));

      toast({
        title: `Registered as ${targetRole} Successfully! 🎉`,
        description: `You now have both farmer and customer accounts.`,
      });

      setTimeout(() => {
        navigate("/account-choice");
      }, 1500);

    } catch (error) {
      console.error("Auto-registration error:", error);
      let errorMessage = "Auto-registration failed. Please try again.";
      if (error.response?.status === 400) {
        errorMessage = error.response.data.detail || "Registration failed.";
      }

      toast({
        title: "Auto-Registration Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsRegistering(false);
    }
  };

  // In ProfileDropdown.jsx - update the success handler
  const handleAddressUpdateSuccess = async (newAddress) => {
    // Update user context with new address
    setUser(prev => ({
      ...prev,
      ...newAddress
    }));

    // Also refresh user data from server to ensure consistency
    try {
      const userResponse = await addressAPI.getCurrentAddress();
      const updatedUser = userResponse.data;

      setUser(prev => ({
        ...prev,
        ...updatedUser
      }));

      localStorage.setItem('user_data', JSON.stringify(updatedUser));

      toast({
        title: "Address Updated!",
        description: "Your address has been saved successfully.",
        variant: "success"
      });
    } catch (error) {
      console.error("Failed to refresh user data:", error);
      // Fallback to just updating with the returned address
      const storedUser = localStorage.getItem('user_data');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          const updatedUser = { ...userData, ...newAddress };
          localStorage.setItem('user_data', JSON.stringify(updatedUser));
        } catch (e) {
          console.error("Failed to update localStorage:", e);
        }
      }
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  if (!user?.email) {
    return null;
  }

  return (
    <div className="relative">
      {/* Dropdown Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="relative h-9 w-9 rounded-full border border-gray-300 bg-white hover:bg-gray-100"
          >
            <User className="h-4 w-4 text-gray-600" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" onCloseAutoFocus={(e) => e.preventDefault()}>
          {/* User Info Section */}
          <DropdownMenuLabel className="p-3">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate flex items-center gap-1">
                <Mail className="h-3 w-3" />
                {user.email}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full capitalize">
                  {user.role}
                </span>
                <div className="flex space-x-1 text-xs text-gray-500">
                  {user.has_farmer && <span>👨‍🌾</span>}
                  {user.has_customer && <span>🛒</span>}
                </div>
              </div>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          {/* Account Switching Options */}
          {user.has_farmer && user.has_customer && (
            <>
              {user.role !== 'farmer' && (
                <DropdownMenuItem onClick={() => handleSwitchAccount("farmer")}>
                  <Tractor className="h-4 w-4 mr-2" />
                  Switch to Farmer
                </DropdownMenuItem>
              )}
              {user.role !== 'customer' && (
                <DropdownMenuItem onClick={() => handleSwitchAccount("customer")}>
                  <User className="h-4 w-4 mr-2" />
                  Switch to Customer
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
            </>
          )}

          {/* Auto Register Option */}
          {!(user.has_farmer && user.has_customer) && (
            <>
              <DropdownMenuItem
                onClick={() => handleAutoRegister(user.has_farmer ? "customer" : "farmer")}
                disabled={isRegistering}
                className="text-green-600 focus:text-green-600"
              >
                {isRegistering ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <UserPlus className="h-4 w-4 mr-2" />
                )}
                {isRegistering ? "Registering..." : `Register as ${user.has_farmer ? "Customer" : "Farmer"}`}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}

          {/* Update Address */}
          <DropdownMenuItem
            onClick={() => {
              setShowAddressForm(true);
            }}
            onSelect={(e) => e.preventDefault()}
          >
            <MapPin className="h-4 w-4 mr-2" />
            Update Address
          </DropdownMenuItem>

          {/* Settings */}
          <DropdownMenuItem>
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </DropdownMenuItem>

          {/* Logout */}
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Address Form Modal - Rendered outside dropdown context */}
      {showAddressForm && (
        <AddressForm
          isOpen={showAddressForm}
          onClose={() => setShowAddressForm(false)}
          onSuccess={handleAddressUpdateSuccess}
          user={user}
          role={user.role}
        />
      )}
    </div>
  );
};

export default ProfileDropdown;