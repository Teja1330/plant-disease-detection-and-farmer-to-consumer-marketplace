import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Search, ShoppingCart, Star, MapPin, Clock, Leaf } from "lucide-react";

const CustomerHome = () => {
  const featuredProducts = [
    {
      id: 1,
      name: "Organic Tomatoes",
      farmer: "Green Valley Farm",
      price: "$4.99/lb",
      rating: 4.8,
      image: "/placeholder.svg",
      location: "15 miles away",
      harvestDate: "2 days ago"
    },
    {
      id: 2,
      name: "Fresh Spinach",
      farmer: "Sunny Acres",
      price: "$3.50/bunch",
      rating: 4.9,
      image: "/placeholder.svg",
      location: "8 miles away",
      harvestDate: "1 day ago"
    },
    {
      id: 3,
      name: "Sweet Corn",
      farmer: "Prairie Fields",
      price: "$6.00/dozen",
      rating: 4.7,
      image: "/placeholder.svg",
      location: "12 miles away",
      harvestDate: "Today"
    },
    {
      id: 4,
      name: "Baby Carrots",
      farmer: "Earth Garden",
      price: "$2.99/lb",
      rating: 4.6,
      image: "/placeholder.svg",
      location: "20 miles away",
      harvestDate: "1 day ago"
    }
  ];

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-4 mb-12"
        >
          <h1 className="text-4xl font-bold text-foreground">
            Welcome to your <span className="text-primary">Marketplace</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Discover fresh, local produce directly from farmers in your area
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="max-w-2xl mx-auto mb-12"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              placeholder="Search for fresh produce, farmers, or locations..."
              className="pl-10 pr-4 py-3 text-lg border-2 border-border focus:border-primary"
            />
            <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-primary hover:opacity-90">
              Search
            </Button>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          <Link to="/customer/marketplace">
            <Card className="hover:shadow-medium transition-all duration-200 cursor-pointer bg-gradient-card">
              <CardContent className="p-6 text-center space-y-2">
                <div className="mx-auto w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                  <Leaf className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-foreground">Browse All</h3>
                <p className="text-sm text-muted-foreground">View all products</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/customer/cart">
            <Card className="hover:shadow-medium transition-all duration-200 cursor-pointer bg-gradient-card">
              <CardContent className="p-6 text-center space-y-2">
                <div className="mx-auto w-12 h-12 bg-gradient-secondary rounded-full flex items-center justify-center">
                  <ShoppingCart className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-foreground">My Cart</h3>
                <p className="text-sm text-muted-foreground">3 items</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/customer/orders">
            <Card className="hover:shadow-medium transition-all duration-200 cursor-pointer bg-gradient-card">
              <CardContent className="p-6 text-center space-y-2">
                <div className="mx-auto w-12 h-12 bg-gradient-accent rounded-full flex items-center justify-center">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-foreground">Orders</h3>
                <p className="text-sm text-muted-foreground">View history</p>
              </CardContent>
            </Card>
          </Link>

          <Card className="hover:shadow-medium transition-all duration-200 cursor-pointer bg-gradient-card">
            <CardContent className="p-6 text-center space-y-2">
              <div className="mx-auto w-12 h-12 bg-sky-blue/80 rounded-full flex items-center justify-center">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-foreground">Near Me</h3>
              <p className="text-sm text-muted-foreground">Local farmers</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Featured Products */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">Featured Products</h2>
            <Link to="/customer/marketplace">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                View All Products
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <Card className="hover:shadow-medium transition-all duration-300 bg-gradient-card">
                  <CardContent className="p-0">
                    <div className="aspect-square bg-surface-soft rounded-t-lg flex items-center justify-center">
                      <Leaf className="h-12 w-12 text-primary/30" />
                    </div>
                    <div className="p-4 space-y-3">
                      <div>
                        <h3 className="font-semibold text-foreground">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">{product.farmer}</p>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-secondary text-secondary" />
                        <span className="text-sm font-medium">{product.rating}</span>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3 mr-1" />
                          {product.location}
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          Harvested {product.harvestDate}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary">{product.price}</span>
                        <Button size="sm" className="bg-gradient-primary hover:opacity-90">
                          <ShoppingCart className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CustomerHome;

