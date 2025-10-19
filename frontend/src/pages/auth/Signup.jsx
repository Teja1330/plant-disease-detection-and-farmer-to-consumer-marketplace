import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Tractor, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import API from "../../api";

const Signup = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Remove CSRF token check since it's not needed with JWT
  useEffect(() => {
    // Clear any existing tokens when arriving at signup page
    localStorage.removeItem('auth_token');
    console.log("Cleared existing tokens for fresh signup");
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!selectedRole)
      return toast({
        title: "Select a role",
        description: "Please choose whether you are a farmer or a customer.",
        variant: "destructive",
      });

    if (formData.password !== formData.confirmPassword)
      return toast({
        title: "Passwords do not match",
        variant: "destructive",
      });

    // Password strength validation
    if (formData.password.length < 6) {
      return toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
    }

    try {
      setIsLoading(true);
      console.log("Attempting signup with:", { 
        name: formData.name,
        email: formData.email,
        role: selectedRole 
      });

      const response = await API.post("/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: selectedRole,
      });

      console.log("Signup response:", response.data);

      toast({
        title: "Account created successfully! 🎉",
        description: "You can now log in to your account.",
      });

      // Redirect to login page after successful signup
      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (error) {
      console.error("Signup error:", error);
      
      let errorMessage = "Signup failed. Please try again.";
      
      if (error.response) {
        if (error.response.status === 400) {
          if (error.response.data.email) {
            errorMessage = "This email is already registered. Please use a different email or login.";
          } else if (error.response.data.password) {
            errorMessage = error.response.data.password[0];
          } else {
            errorMessage = error.response.data.detail || "Please check your information and try again.";
          }
        } else if (error.response.status === 500) {
          errorMessage = "Server error. Please try again later.";
        }
      } else if (error.request) {
        errorMessage = "No response from server. Please check if the backend is running.";
      }

      toast({
        title: "Signup failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Role selection screen
  if (!selectedRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-secondary/5 py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md space-y-8"
        >
          <div className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-lg mb-4"
            >
              <User className="h-8 w-8 text-primary-foreground" />
            </motion.div>
            <h1 className="text-3xl font-bold text-foreground">Join AgriCare</h1>
            <p className="text-muted-foreground">
              Choose your account type to get started
            </p>
          </div>

          <div className="grid gap-4">
            {/* Farmer */}
            <motion.div 
              whileHover={{ scale: 1.02 }} 
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card
                className="cursor-pointer border-2 border-border hover:border-primary transition-all duration-200 hover:shadow-lg bg-card"
                onClick={() => setSelectedRole("farmer")}
              >
                <CardContent className="p-8 text-center space-y-4">
                  <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-md">
                    <Tractor className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">I'm a Farmer</h3>
                  <p className="text-muted-foreground">
                    Start selling your produce and build your customer base
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Customer */}
            <motion.div 
              whileHover={{ scale: 1.02 }} 
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card
                className="cursor-pointer border-2 border-border hover:border-primary transition-all duration-200 hover:shadow-lg bg-card"
                onClick={() => setSelectedRole("customer")}
              >
                <CardContent className="p-8 text-center space-y-4">
                  <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-md">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">I'm a Customer</h3>
                  <p className="text-muted-foreground">
                    Access fresh produce directly from local farmers
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-center"
          >
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <a 
                href="/login" 
                className="text-primary hover:underline font-medium"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/login");
                }}
              >
                Sign in
              </a>
            </p>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // Signup form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-secondary/5 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl border-border/50 backdrop-blur-sm bg-card/95">
          <CardHeader className="text-center space-y-4 pb-6">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-lg"
            >
              {selectedRole === "farmer" ? (
                <Tractor className="h-8 w-8 text-white" />
              ) : (
                <User className="h-8 w-8 text-white" />
              )}
            </motion.div>
            <CardTitle className="text-2xl font-bold">
              Sign up as {selectedRole === "farmer" ? "Farmer" : "Customer"}
            </CardTitle>
            <p className="text-muted-foreground">
              Create your account to get started
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <Button 
              variant="outline" 
              onClick={() => setSelectedRole(null)} 
              className="w-full border-border hover:border-primary"
              disabled={isLoading}
            >
              ← Change Account Type
            </Button>

            <form onSubmit={handleSignup} className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-2"
              >
                <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                <Input 
                  id="name"
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  placeholder="Enter your full name"
                  required 
                  disabled={isLoading}
                  className="bg-background/50 border-border/70 focus:border-primary"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="space-y-2"
              >
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <Input 
                  id="email"
                  name="email" 
                  type="email" 
                  value={formData.email} 
                  onChange={handleInputChange} 
                  placeholder="Enter your email address"
                  required 
                  disabled={isLoading}
                  className="bg-background/50 border-border/70 focus:border-primary"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="space-y-2"
              >
                <Label className="text-sm font-medium">Password</Label>
                <div className="relative">
                  <Input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Create a password"
                    required
                    disabled={isLoading}
                    className="bg-background/50 border-border/70 focus:border-primary pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Password must be at least 6 characters long
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="space-y-2"
              >
                <Label className="text-sm font-medium">Confirm Password</Label>
                <div className="relative">
                  <Input
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    required
                    disabled={isLoading}
                    className="bg-background/50 border-border/70 focus:border-primary pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <Button 
                  type="submit" 
                  className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-200 font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-foreground border-t-transparent"></div>
                      <span>Creating Account...</span>
                    </div>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </motion.div>
            </form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="text-center"
            >
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <a 
                  href="/login" 
                  className="text-primary hover:underline font-medium"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/login");
                  }}
                >
                  Sign in
                </a>
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Signup;