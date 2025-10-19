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
import { User, Tractor, LogOut, Settings, UserPlus, Loader2, Mail } from "lucide-react";
import { useUser } from "../App";
import API from "../api";

const ProfileDropdown = () => {
  const { user, setUser } = useUser();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSwitchAccount = (targetRole) => {
    if (targetRole === "farmer" && user.has_farmer) {
      setUser(prev => ({
        ...prev,
        role: "farmer"
      }));
      navigate("/farmer");
      toast({
        title: "Switched to Farmer Account",
        description: "You are now in your farmer dashboard.",
      });
    } else if (targetRole === "customer" && user.has_customer) {
      setUser(prev => ({
        ...prev,
        role: "customer"
      }));
      navigate("/customer");
      toast({
        title: "Switched to Customer Account",
        description: "You are now in your customer dashboard.",
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

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('temp_password');
    setUser({});
    navigate("/");
    toast({
      title: "Logged out successfully",
      description: "Hope to see you again soon!",
    });
  };

  if (!user?.email) {
    return null;
  }

  return (
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
      <DropdownMenuContent className="w-56" align="end">
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
  );
};

export default ProfileDropdown;