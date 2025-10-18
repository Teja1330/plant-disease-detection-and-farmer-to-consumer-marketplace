import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import API from "../../api";
import { useUser } from "../../App";

const Login = () => {
  const { setUser } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Missing fields",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log("Attempting login with:", { email, password });
      
      // 1️⃣ Login - get token from response
      const loginResponse = await API.post("/login", { 
        email: email.trim(), 
        password: password 
      });
      
      console.log("Login response:", loginResponse.data);
      
      const { token, user: userData } = loginResponse.data;
      
      // 2️⃣ Store token in localStorage for persistence
      if (token) {
        localStorage.setItem('auth_token', token);
        console.log("✅ Token stored in localStorage");
      }
      
      // 3️⃣ Set user in context
      setUser({
        email: userData.email,
        name: userData.name,
        role: userData.role,
      });

      toast({
        title: "Login successful!",
        description: `Welcome back, ${userData.name}!`,
      });

      // 4️⃣ Redirect based on role
      if (userData.role === "farmer") {
        navigate("/farmer");
      } else {
        navigate("/customer");
      }
    } catch (err) {
      console.error("Login error details:", err);
      
      let errorMessage = "Login failed. Please try again.";
      
      if (err.response) {
        if (err.response.status === 403) {
          errorMessage = "Access forbidden. Please check your credentials.";
        } else if (err.response.status === 401) {
          errorMessage = "Invalid email or password.";
        } else if (err.response.data && err.response.data.detail) {
          errorMessage = err.response.data.detail;
        }
      } else if (err.request) {
        errorMessage = "No response from server. Please check if the backend is running.";
      }

      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground">Login</h1>
          <p className="text-muted-foreground mt-2">
            Enter your credentials to access your account
          </p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-gradient-primary hover:opacity-90" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </Button>
        </form>
        
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <a 
              href="/signup" 
              className="text-primary hover:underline font-medium"
              onClick={(e) => {
                e.preventDefault();
                navigate("/signup");
              }}
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;