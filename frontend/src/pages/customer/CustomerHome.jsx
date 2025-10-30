import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Search, ShoppingCart, Star, MapPin, Clock, Leaf } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { handleScroll } from "@/components/Navbar";
import { customerAPI } from "@/api";

const CustomerHome = () => {
  const { toast } = useToast();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    handleScroll();
    loadFeaturedProducts();
  }, []);

  const loadFeaturedProducts = async () => {
    try {
      setLoading(true);
      console.log("🔄 Loading featured products...");
      const response = await customerAPI.getMarketplaceProducts();
      const allProducts = response.data.products || [];
      
      // Get only first 3 products that match customer's district
      const customerDistrict = response.data.customer_district;
      let filteredProducts = allProducts;
      
      if (customerDistrict) {
        filteredProducts = allProducts.filter(product => 
          product.farmer_district === customerDistrict
        );
      }
      
      // Take only first 3 products
      const featured = filteredProducts.slice(0, 3);
      setFeaturedProducts(featured);
      
      console.log("✅ Featured products loaded:", {
        total: allProducts.length,
        filtered: filteredProducts.length,
        featured: featured.length,
        customerDistrict: customerDistrict
      });
      
    } catch (error) {
      console.error("Failed to load featured products:", error);
      // If API fails, show empty state
      setFeaturedProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Safe cart count function
  const getCartCount = () => {
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      return Array.isArray(cart) ? cart.length : 0;
    } catch (error) {
      console.error('Error reading cart from localStorage:', error);
      return 0;
    }
  };

  const handleAddToCart = (product) => {
    try {
      const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
      const cart = Array.isArray(existingCart) ? existingCart : [];
      
      const existingItem = cart.find(item => item.id === product.id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({
          ...product,
          quantity: 1
        });
      }
      
      localStorage.setItem('cart', JSON.stringify(cart));
      
      console.log("🛒 Added to cart:", {
        product: product.name,
        cartCount: cart.length
      });
      
      toast({
        title: "Added to cart! 🛒",
        description: `${product.name} has been added to your cart.`,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating || 4.5) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-4 mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900">
            Welcome to your <span className="text-green-600">Marketplace</span>
          </h1>
          <p className="text-xl text-gray-600">
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
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search for fresh produce, farmers, or locations..."
              className="pl-10 pr-4 py-3 text-lg border-2 border-gray-300 focus:border-green-500"
            />
            <Button 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-600 hover:bg-green-700"
              onClick={() => toast({
                title: "Search feature",
                description: "Search functionality will be implemented soon!",
              })}
            >
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
            <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer bg-white border border-gray-200">
              <CardContent className="p-6 text-center space-y-2">
                <div className="mx-auto w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                  <Leaf className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">Browse All</h3>
                <p className="text-sm text-gray-600">View all products</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/customer/cart">
            <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer bg-white border border-gray-200">
              <CardContent className="p-6 text-center space-y-2">
                <div className="mx-auto w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <ShoppingCart className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">My Cart</h3>
                <p className="text-sm text-gray-600">
                  {getCartCount()} items
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/customer/orders">
            <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer bg-white border border-gray-200">
              <CardContent className="p-6 text-center space-y-2">
                <div className="mx-auto w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">Orders</h3>
                <p className="text-sm text-gray-600">View history</p>
              </CardContent>
            </Card>
          </Link>

          <Card 
            className="hover:shadow-lg transition-all duration-200 cursor-pointer bg-white border border-gray-200"
            onClick={() => toast({
              title: "Coming Soon!",
              description: "Nearby farmers feature will be available soon.",
            })}
          >
            <CardContent className="p-6 text-center space-y-2">
              <div className="mx-auto w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900">Near Me</h3>
              <p className="text-sm text-gray-600">Local farmers</p>
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
            <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
            <Link to="/customer/marketplace">
              <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white">
                View All Products
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-4 text-lg text-gray-600">Loading featured products...</p>
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-16">
              <Leaf className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No featured products</h3>
              <p className="text-gray-600 mb-6">Check back later for fresh products from local farmers</p>
              <Link to="/customer/marketplace">
                <Button className="bg-green-600 hover:bg-green-700">
                  Browse All Products
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Card className="hover:shadow-lg transition-all duration-300 bg-white border border-gray-200">
                    <CardContent className="p-0">
                      <div className="aspect-square bg-gray-100 rounded-t-lg flex items-center justify-center relative">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-full object-cover rounded-t-lg"
                          />
                        ) : (
                          <Leaf className="h-12 w-12 text-green-300" />
                        )}
                        {product.organic && (
                          <div className="absolute top-2 left-2 w-3 h-3 bg-green-500 rounded-full" />
                        )}
                      </div>
                      <div className="p-4 space-y-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{product.name}</h3>
                          <p className="text-sm text-gray-600">{product.farmer_name}</p>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          {renderStars(product.rating)}
                          <span className="text-sm font-medium">{product.rating || 4.5}</span>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex items-center text-xs text-gray-500">
                            <MapPin className="h-3 w-3 mr-1" />
                            {product.farmer_district ? `${product.farmer_city}, ${product.farmer_district}` : 'Location not available'}
                          </div>
                          <div className="flex items-center text-xs text-gray-500">
                            <Clock className="h-3 w-3 mr-1" />
                            Harvested {new Date(product.harvest_date).toLocaleDateString()}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-green-600">
                            ${parseFloat(product.price).toFixed(2)}/{product.unit}
                          </span>
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleAddToCart(product)}
                          >
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
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default CustomerHome;