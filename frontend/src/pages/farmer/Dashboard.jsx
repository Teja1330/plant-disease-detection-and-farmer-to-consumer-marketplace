import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  TrendingUp, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  Star,
  Plus,
  Eye,
  Calendar,
  Users,
  BarChart3
} from "lucide-react";
import { useEffect } from "react";
import { handleScroll } from "@/components/Navbar";


const Dashboard = () => {
  useEffect(() => {
        handleScroll();
      }, []);
  const stats = [
    {
      title: "Total Revenue",
      value: "$2,847.50",
      change: "+12.5%",
      icon: TrendingUp,
      color: "primary"
    },
    {
      title: "Active Products",
      value: "24",
      change: "+3",
      icon: Package,
      color: "secondary"
    },
    {
      title: "Total Orders",
      value: "89",
      change: "+15.3%",
      icon: ShoppingCart,
      color: "accent"
    },
    {
      title: "Average Rating",
      value: "4.8",
      change: "+0.2",
      icon: Star,
      color: "warning"
    }
  ];

  const recentOrders = [
    {
      id: "ORD-001",
      customer: "John Smith",
      items: "Organic Tomatoes, Fresh Basil",
      amount: 48,
      status: "pending",
      date: "2024-01-25"
    },
    {
      id: "ORD-002",
      customer: "Sarah Johnson",
      items: "Sweet Corn, Bell Peppers",
      amount: 98,
      status: "completed",
      date: "2024-01-24"
    },
    {
      id: "ORD-003",
      customer: "Mike Davis",
      items: "Fresh Spinach",
      amount: 0,
      status: "processing",
      date: "2024-01-24"
    }
  ];

  const topProducts = [
    {
      name: "Organic Tomatoes",
      sales: 20,
      revenue: "$224.55",
      rating: 4.9
    },
    {
      name: "Fresh Spinach",
      sales: 15,
      revenue: "$112.00",
      rating: 4.8
    },
    {
      name: "Sweet Corn",
      sales: 10,
      revenue: "$168.00",
      rating: 4.7
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold text-foreground">Farmer Dashboard</h1>
            <p className="text-lg text-muted-foreground">
              Welcome back! Here's your farm's performance overview.
            </p>
          </div>
          
          <Link to="/farmer/store">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </Link>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="bg-card hover:shadow-md transition-all duration-300 border">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-muted-foreground text-sm font-medium">{stat.title}</p>
                        <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                        <p className="text-sm text-green-600">{stat.change}</p>
                      </div>
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-sm">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="shadow-md bg-card border">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl">Recent Orders</CardTitle>
                <Link to="/farmer/orders">
                  <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                    <Eye className="h-4 w-4 mr-2" />
                    View All
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentOrders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-muted rounded-lg border border-border"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-3">
                        <span className="font-semibold text-foreground">{order.id}</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{order.customer}</p>
                      <p className="text-xs text-muted-foreground">{order.items}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">${order.amount.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">{new Date(order.date).toLocaleDateString()}</p>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Top Products */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Card className="shadow-md bg-card border">
              <CardHeader>
                <CardTitle className="text-xl">Top Products</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {topProducts.map((product, index) => (
                  <motion.div
                    key={product.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="p-4 bg-muted rounded-lg border border-border"
                  >
                    <div className="space-y-2">
                      <h4 className="font-semibold text-foreground">{product.name}</h4>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{product.sales} sold</span>
                        <span className="font-medium text-primary">{product.revenue}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{product.rating}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mt-8"
        >
          <Card className="bg-primary text-primary-foreground shadow-lg">
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                <h2 className="text-2xl font-bold">Grow Your Business</h2>
                <p className="text-primary-foreground/90 max-w-2xl mx-auto">
                  Take advantage of our tools to increase your sales and reach more customers.
                </p>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <Link to="/farmer/store">
                    <Button 
                      variant="outline" 
                      className="w-full border-white text-primary hover:bg-white hover:text-primary"
                    >
                      <Package className="h-4 w-4 mr-2" />
                      Manage Store
                    </Button>
                  </Link>
                  
                  <Link to="/farmer/detection">
                    <Button 
                      variant="outline" 
                      className="w-full border-white text-primary hover:bg-white hover:text-primary"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Disease Detection
                    </Button>
                  </Link>
                  
                  <Link to="/farmer/reports">
                    <Button 
                      variant="outline" 
                      className="w-full border-white text-primary hover:bg-white hover:text-primary"
                    >
                      <BarChart3 className="h-4 w-4 mr-2" />
                      View Reports
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;