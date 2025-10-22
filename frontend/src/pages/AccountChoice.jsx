import React, {useEffect} from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Tractor, User, ArrowRight } from "lucide-react";
import { useUser } from "../App";
import { handleScroll } from "@/components/Navbar";


const AccountChoice = () => {
  useEffect(() => {
        handleScroll();
      }, []);
  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleAccountChoice = (role) => {
    // Update user context with selected role
    setUser(prev => ({
      ...prev,
      role: role
    }));
    
    // Redirect to the selected dashboard
    navigate(role === "farmer" ? "/farmer" : "/customer");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-secondary/5 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl border-border/50 backdrop-blur-sm bg-card/95">
          <CardHeader className="text-center space-y-4 pb-6">
            <CardTitle className="text-2xl font-bold text-foreground">
              Welcome Back!
            </CardTitle>
            <p className="text-muted-foreground">
              Which account would you like to access?
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Farmer Account */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="cursor-pointer border-2 border-border hover:border-primary transition-all duration-200 hover:shadow-lg bg-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-md">
                        <Tractor className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Farmer Account</h3>
                        <p className="text-sm text-muted-foreground">Manage your farm and products</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleAccountChoice("farmer")}
                      className="bg-primary hover:bg-primary/90"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Customer Account */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="cursor-pointer border-2 border-border hover:border-primary transition-all duration-200 hover:shadow-lg bg-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-md">
                        <User className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Customer Account</h3>
                        <p className="text-sm text-muted-foreground">Shop for fresh produce</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleAccountChoice("customer")}
                      className="bg-primary hover:bg-primary/90"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-center"
            >
              <p className="text-sm text-muted-foreground">
                You can switch between accounts anytime from your profile
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AccountChoice;