import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { User, Tractor, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { authAPI } from "@/api"; // ADD THIS IMPORT
import { useEffect } from "react";

const AccountChoice = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user actually has both accounts
    const token = localStorage.getItem('auth_token');
    if (!token) {
      navigate('/login');
      return;
    }
  }, [navigate]);

  const handleAccountSelect = async (role) => {
    try {
      const response = await authAPI.switchAccount(role); // Use authAPI instead of API
      
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('current_role', role);
      
      toast({
        title: `Switched to ${role} account`,
        description: `You are now logged in as a ${role}`,
      });

      // Redirect based on role
      setTimeout(() => {
        navigate(role === 'farmer' ? '/farmer' : '/customer');
      }, 1000);

    } catch (error) {
      console.error("Account switch error:", error);
      toast({
        title: "Switch Failed",
        description: "Failed to switch accounts. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('current_role');
    localStorage.removeItem('user_data');
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-secondary/5 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-2xl"
      >
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-4xl font-bold text-foreground">Choose Your Account</h1>
          <p className="text-lg text-muted-foreground">
            You have both farmer and customer accounts. Which one would you like to use?
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="cursor-pointer border-2 border-border hover:border-green-500 transition-all duration-200 hover:shadow-lg bg-card h-full">
              <CardContent className="p-8 text-center space-y-4 flex flex-col h-full">
                <div className="mx-auto w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-md">
                  <Tractor className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Farmer Account</h3>
                <p className="text-muted-foreground flex-grow">
                  Manage your products, view orders, and grow your farming business
                </p>
                <Button 
                  onClick={() => handleAccountSelect('farmer')}
                  className="bg-green-600 hover:bg-green-700 w-full"
                >
                  Continue as Farmer
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="cursor-pointer border-2 border-border hover:border-blue-500 transition-all duration-200 hover:shadow-lg bg-card h-full">
              <CardContent className="p-8 text-center space-y-4 flex flex-col h-full">
                <div className="mx-auto w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center shadow-md">
                  <User className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Customer Account</h3>
                <p className="text-muted-foreground flex-grow">
                  Browse fresh produce, place orders, and support local farmers
                </p>
                <Button 
                  onClick={() => handleAccountSelect('customer')}
                  className="bg-blue-600 hover:bg-blue-700 w-full"
                >
                  Continue as Customer
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="text-center">
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="border-gray-300"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Use Different Email
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default AccountChoice;