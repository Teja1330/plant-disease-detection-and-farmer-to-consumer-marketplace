// components/ProfileDropdown.jsx - COMPLETELY FIXED FOR PREFIX IDS
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
import { User, Tractor, LogOut, Settings, UserPlus, Loader2, Mail, MapPin, ShoppingCart } from "lucide-react";
import { useUser } from "../App";
import API from "../api";
import { authAPI } from "../api";
import AddressForm from "./AddressForm";

const ProfileDropdown = () => {
  const { user, setUser, logout, refreshUserData } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);

  // Get current user data reliably
  const getCurrentUser = () => {
    try {
      const storedUser = localStorage.getItem('user_data');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        console.log("🔍 ProfileDropdown - Current user:", {
          id: userData.id, // Prefix ID
          name: userData.name,
          role: userData.role,
          has_farmer: userData.has_farmer,
          has_customer: userData.has_customer
        });
        return userData;
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
    }
    return user;
  };

  const currentUser = getCurrentUser();

  const handleSwitchAccount = async (targetRole) => {
    if (!currentUser) return;

    try {
      setIsSwitching(true);
      console.log(`🔄 Switching to ${targetRole} account for user:`, {
        currentId: currentUser.id, // Prefix ID
        targetRole: targetRole
      });

      const response = await authAPI.switchAccount(targetRole);

      // Update tokens and roles
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('current_role', targetRole);

      // Update user data in localStorage
      const updatedUser = {
        ...currentUser,
        role: targetRole
      };
      localStorage.setItem('user_data', JSON.stringify(updatedUser));

      // Update context
      setUser(updatedUser);

      console.log(`✅ Switched to ${targetRole}, navigating...`);

      // Force navigation with timeout
      setTimeout(() => {
        if (targetRole === "farmer") {
          navigate("/farmer", { replace: true });
        } else {
          navigate("/customer", { replace: true });
        }
      }, 100);

      toast({
        title: `Switched to ${targetRole} Account`,
        description: `You are now in your ${targetRole} dashboard.`,
      });

      // Trigger auth change for navbar update
      window.dispatchEvent(new Event('authChange'));

    } catch (error) {
      console.error("Switch account error:", error);

      let errorMessage = "Failed to switch accounts. Please try again.";
      if (error.response?.status === 403) {
        errorMessage = "You don't have permission to access this account type.";
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      }

      toast({
        title: "Switch Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSwitching(false);
    }
  };

  const handleAutoRegister = async (targetRole) => {
    if (!currentUser?.email) return;

    // Get the actual password from localStorage
    const tempPassword = localStorage.getItem('temp_password');

    if (!tempPassword) {
      toast({
        title: "Password Required",
        description: "Please login again to enable auto-registration.",
        variant: "destructive",
      });
      return;
    }

    setIsRegistering(true);
    try {
      console.log(`🔄 Auto-registering as ${targetRole} for user:`, {
        currentId: currentUser.id, // Prefix ID
        targetRole: targetRole
      });

      const response = await API.post("/auto-register/", {
        role: targetRole,
        password: tempPassword  // Send the actual password
      });

      // Update tokens and user data
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('current_role', 'multi');

      // Update user data with MultiAccount info
      const updatedUser = {
        ...response.data.user  // Use the user data from response
      };

      setUser(updatedUser);
      localStorage.setItem('user_data', JSON.stringify(updatedUser));

      console.log("✅ Auto-registration successful - New user:", {
        id: updatedUser.id, // New prefix ID (M1, etc.)
        role: updatedUser.role,
        has_farmer: updatedUser.has_farmer,
        has_customer: updatedUser.has_customer
      });

      toast({
        title: `Registered as ${targetRole} Successfully! 🎉`,
        description: `You now have both farmer and customer accounts.`,
      });

      // Trigger auth change for navbar
      window.dispatchEvent(new Event('authChange'));

      // Navigate to account choice
      setTimeout(() => {
        navigate("/account-choice", { replace: true });
      }, 1500);

    } catch (error) {
      console.error("Auto-registration error:", error);
      let errorMessage = "Auto-registration failed. Please try again.";

      if (error.response?.status === 400) {
        errorMessage = error.response.data.detail || "Registration failed.";
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
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

  // In the handleAddressUpdateSuccess function, replace it with:
  const handleAddressUpdateSuccess = async (newAddress) => {
    try {
      console.log("🔄 Refreshing user data after address update...");

      // Update local user data immediately
      const updatedUser = {
        ...currentUser,
        ...newAddress
      };

      setUser(updatedUser);
      localStorage.setItem('user_data', JSON.stringify(updatedUser));

      // Close the modal first
      setShowAddressForm(false);

      // Then show success message
      toast({
        title: "Address Updated! ✅",
        description: "Your address has been saved successfully.",
      });

      // Trigger auth change for navbar update
      window.dispatchEvent(new Event('authChange'));

    } catch (error) {
      console.error("❌ Error in address update success handler:", error);
      // Still close the modal even if there's an error
      setShowAddressForm(false);
      toast({
        title: "Address Updated",
        description: "Your address has been saved.",
      });
    }
  };

  const handleLogout = async () => {
    await logout();
    window.dispatchEvent(new Event('authChange'));
    console.log("🔄 Auth change event dispatched for logout");
    navigate("/", { replace: true });
  };

  if (!currentUser?.email) {
    return null;
  }

  const userRole = currentUser.role || localStorage.getItem('current_role');
  const canSwitchToFarmer = currentUser.has_farmer && userRole !== 'farmer';
  const canSwitchToCustomer = currentUser.has_customer && userRole !== 'customer';
  const canRegisterFarmer = !currentUser.has_farmer;
  const canRegisterCustomer = !currentUser.has_customer;

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
              <p className="text-sm font-medium truncate">{currentUser.name}</p>
              <p className="text-xs text-gray-500 truncate flex items-center gap-1">
                <Mail className="h-3 w-3" />
                {currentUser.email}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full capitalize">
                  {userRole}
                </span>
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full font-mono">
                  {currentUser.id} {/* Display prefix ID */}
                </span>
              </div>
              <div className="flex space-x-1 text-xs text-gray-500">
                {currentUser.has_farmer && <span title="Farmer">👨‍🌾</span>}
                {currentUser.has_customer && <span title="Customer">🛒</span>}
              </div>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          {/* Account Switching Options */}
          {(canSwitchToFarmer || canSwitchToCustomer) && (
            <>
              {canSwitchToFarmer && (
                <DropdownMenuItem
                  onClick={() => handleSwitchAccount("farmer")}
                  disabled={isSwitching}
                >
                  {isSwitching ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Tractor className="h-4 w-4 mr-2" />
                  )}
                  Switch to Farmer
                </DropdownMenuItem>
              )}
              {canSwitchToCustomer && (
                <DropdownMenuItem
                  onClick={() => handleSwitchAccount("customer")}
                  disabled={isSwitching}
                >
                  {isSwitching ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <ShoppingCart className="h-4 w-4 mr-2" />
                  )}
                  Switch to Customer
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
            </>
          )}

          {/* Auto Register Option */}
          {(canRegisterFarmer || canRegisterCustomer) && (
            <>
              {canRegisterFarmer && (
                <DropdownMenuItem
                  onClick={() => handleAutoRegister("farmer")}
                  disabled={isRegistering}
                  className="text-green-600 focus:text-green-600"
                >
                  {isRegistering ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <UserPlus className="h-4 w-4 mr-2" />
                  )}
                  {isRegistering ? "Registering..." : "Register as Farmer"}
                </DropdownMenuItem>
              )}
              {canRegisterCustomer && (
                <DropdownMenuItem
                  onClick={() => handleAutoRegister("customer")}
                  disabled={isRegistering}
                  className="text-green-600 focus:text-green-600"
                >
                  {isRegistering ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <UserPlus className="h-4 w-4 mr-2" />
                  )}
                  {isRegistering ? "Registering..." : "Register as Customer"}
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
            </>
          )}

          {/* Update Address */}
          <DropdownMenuItem
            onClick={() => setShowAddressForm(true)}
          >
            <MapPin className="h-4 w-4 mr-2" />
            Update Address
          </DropdownMenuItem>

          {/* Settings */}
          <DropdownMenuItem>
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Logout */}
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Address Form Modal */}
      {showAddressForm && (
        <AddressForm
          isOpen={showAddressForm}
          onClose={() => setShowAddressForm(false)}
          onSuccess={handleAddressUpdateSuccess}
          user={currentUser}
          role={userRole}
        />
      )}
    </div>
  );
};

export default ProfileDropdown;