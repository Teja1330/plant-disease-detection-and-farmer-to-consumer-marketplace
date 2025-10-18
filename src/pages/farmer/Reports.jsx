import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Download, 
  DollarSign,
  Package,
  Eye,
  Star,
  ShoppingCart,
  FileText
} from "lucide-react";

const Reports = () => {
  const salesData = {
    thisMonth: 50,
    lastMonth: 20,
    growth: 4
  };

  const monthlyReports = [
    { id: 1, month: "January 2024", revenue: 50, orders: 120, products: 24, avgRating: 4.8, status: "completed" },
    { id: 2, month: "December 2023", revenue: 20, orders: 98, products: 20, avgRating: 4.7, status: "completed" },
    { id: 3, month: "November 2023", revenue: 80, orders: 150, products: 30, avgRating: 4.6, status: "completed" },
    { id: 4, month: "October 2023", revenue: 40, orders: 110, products: 22, avgRating: 4.7, status: "completed" }
  ];

  const topProducts = [
    { name: "Organic Tomatoes", revenue: 20, units: 50, growth: 2 },
    { name: "Fresh Spinach", revenue: 50, units: 40, growth: 7 },
    { name: "Sweet Corn", revenue: 0, units: 30, growth: -2.3 },
    { name: "Bell Peppers", revenue: 80, units: 25, growth: 1 }
  ];

  const customerMetrics = [
    { metric: "New Customers", value: 35, change: 5, percentage: 5 },
    { metric: "Repeat Customers", value: 50, change: 4, percentage: 4 },
    { metric: "Customer Satisfaction", value: "96%", change: 1, percentage: 1 }
  ];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'fill-secondary text-secondary' : 'text-muted-foreground'}`}
      />
    ));
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
            <h1 className="text-4xl font-bold text-foreground">Sales Reports</h1>
            <p className="text-lg text-muted-foreground">
              Track your performance and business insights
            </p>
          </div>
          
          <Button className="bg-gradient-primary hover:opacity-90 shadow-medium">
            <Download className="h-4 w-4 mr-2" />
            Export Reports
          </Button>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card className="bg-gradient-card hover:shadow-medium transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">This Month Revenue</p>
                  <p className="text-2xl font-bold text-foreground">${salesData.thisMonth.toFixed(2)}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <TrendingUp className="h-4 w-4 text-success" />
                    <span className="text-sm text-success">+{salesData.growth}%</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center shadow-soft">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card hover:shadow-medium transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Total Orders</p>
                  <p className="text-2xl font-bold text-foreground">89</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <TrendingUp className="h-4 w-4 text-success" />
                    <span className="text-sm text-success">+15.3%</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-gradient-secondary rounded-full flex items-center justify-center shadow-soft">
                  <ShoppingCart className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card hover:shadow-medium transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Active Products</p>
                  <p className="text-2xl font-bold text-foreground">24</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <TrendingUp className="h-4 w-4 text-success" />
                    <span className="text-sm text-success">+3 new</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-gradient-accent rounded-full flex items-center justify-center shadow-soft">
                  <Package className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card hover:shadow-medium transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-sm font-medium">Avg Rating</p>
                  <p className="text-2xl font-bold text-foreground">4.8</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <div className="flex">{renderStars(4.8)}</div>
                  </div>
                </div>
                <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center shadow-soft">
                  <Star className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Monthly Reports */}
        <div className="grid lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="shadow-medium bg-gradient-card">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl">Monthly Performance</CardTitle>
                <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Chart
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {monthlyReports.map((report, index) => (
                  <motion.div
                    key={report.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-surface rounded-lg border border-border/50"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-3">
                        <h4 className="font-semibold text-foreground">{report.month}</h4>
                        <Badge className="bg-success text-white text-xs">
                          {report.status}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>{report.orders} orders</span>
                        <span>{report.products} products</span>
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 fill-secondary text-secondary" />
                          <span>{report.avgRating}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right space-y-1">
                      <p className="text-lg font-bold text-primary">${report.revenue.toFixed(2)}</p>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          Details
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
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
            className="space-y-6"
          >
            <Card className="shadow-medium bg-gradient-card">
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
                    className="p-4 bg-surface rounded-lg border border-border/50"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-foreground">{product.name}</h4>
                      <div className="flex items-center space-x-1">
                        {product.growth > 0 ? (
                          <TrendingUp className="h-4 w-4 text-success" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-destructive" />
                        )}
                        <span className={`text-sm ${product.growth > 0 ? 'text-success' : 'text-destructive'}`}>
                          {product.growth > 0 ? '+' : ''}{product.growth}%
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-1">
                      <span className="text-muted-foreground">{product.units} units sold</span>
                      <span className="font-medium text-primary">${product.revenue.toFixed(2)}</span>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            {/* Customer Metrics */}
            <Card className="shadow-medium bg-gradient-card">
              <CardHeader>
                <CardTitle className="text-xl">Customer Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {customerMetrics.map((metric, index) => (
                  <motion.div
                    key={metric.metric}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-surface rounded-lg border border-border/50"
                  >
                    <div>
                      <h4 className="font-semibold text-foreground">{metric.metric}</h4>
                      <p className="text-sm text-muted-foreground">+{metric.change} this month</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary">{metric.value}</p>
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="h-3 w-3 text-success" />
                        <span className="text-xs text-success">+{metric.percentage}%</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
