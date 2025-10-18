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

  // Ensure CSRF token is available
  useEffect(() => {
    const ensureCSRFToken = async () => {
      try {
        await API.get("/login");
        console.log("CSRF token ready for signup");
      } catch (error) {
        console.error("Failed to get CSRF token:", error);
      }
    };
    ensureCSRFToken();
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

    try {
      setIsLoading(true);
      await API.post("/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: selectedRole,
      });

      toast({
        title: "Account created!",
        description: "You can now log in to your account.",
      });

      navigate("/login");
    } catch (error) {
      console.error("Signup error:", error);
      toast({
        title: "Signup failed",
        description: error.response?.data?.detail || error.response?.data || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Role selection screen
  if (!selectedRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md space-y-8"
        >
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-foreground">Join AgriCare</h1>
            <p className="text-muted-foreground">
              Choose your account type to get started
            </p>
          </div>

          <div className="grid gap-4">
            {/* Farmer */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Card
                className="cursor-pointer border-2 hover:border-primary transition-all duration-200 hover:shadow-medium"
                onClick={() => setSelectedRole("farmer")}
              >
                <CardContent className="p-8 text-center space-y-4">
                  <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center shadow-soft">
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
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Card
                className="cursor-pointer border-2 hover:border-primary transition-all duration-200 hover:shadow-medium"
                onClick={() => setSelectedRole("customer")}
              >
                <CardContent className="p-8 text-center space-y-4">
                  <div className="mx-auto w-16 h-16 bg-gradient-secondary rounded-full flex items-center justify-center shadow-soft">
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
        </motion.div>
      </div>
    );
  }

  // Signup form
  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-large">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center shadow-soft">
              {selectedRole === "farmer" ? (
                <Tractor className="h-8 w-8 text-white" />
              ) : (
                <User className="h-8 w-8 text-white" />
              )}
            </div>
            <CardTitle className="text-2xl">
              Sign up as {selectedRole === "farmer" ? "Farmer" : "Customer"}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <Button variant="outline" onClick={() => setSelectedRole(null)} className="w-full">
              ← Change Account Type
            </Button>

            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input name="name" value={formData.name} onChange={handleInputChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input name="email" type="email" value={formData.email} onChange={handleInputChange} required />
              </div>

              <div className="space-y-2">
                <Label>Password</Label>
                <div className="relative">
                  <Input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Confirm Password</Label>
                <div className="relative">
                  <Input
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full bg-gradient-primary hover:opacity-90" disabled={isLoading}>
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Signup;