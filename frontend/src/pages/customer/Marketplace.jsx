// Marketplace.jsx - Updated version - UPDATED FOR PREFIX IDS
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  Star,
  MapPin,
  Clock,
  ShoppingCart,
  Leaf,
  Grid3X3,
  List
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { handleScroll } from "@/components/Navbar";
import { customerAPI } from "@/api";

const Marketplace = () => {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [customerPincode, setCustomerPincode] = useState("");
  const [customerDistrict, setCustomerDistrict] = useState("");

  useEffect(() => {
    handleScroll();
    // Load cart from localStorage on component mount
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(savedCart);
    loadMarketplaceProducts();
  }, []);

  const loadMarketplaceProducts = async () => {
    try {
      setLoading(true);
      console.log("🔄 Loading marketplace products...");
      const response = await customerAPI.getMarketplaceProducts();
      setProducts(response.data.products || []);
      setCustomerDistrict(response.data.customer_district || "");
      console.log("✅ Marketplace products loaded:", {
        productCount: response.data.products?.length,
        customerDistrict: response.data.customer_district
      });
    } catch (error) {
      console.error("Failed to load marketplace products:", error);
      toast({
        title: "Failed to load products",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const categories = ["All", "Vegetables", "Fruits", "Leafy Greens", "Root Vegetables", "Herbs"];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.farmer_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (product) => {
    if (product.stock === 0) {
      toast({
        title: "Out of Stock",
        description: `${product.name} is currently out of stock.`,
        variant: "destructive"
      });
      return;
    }

    const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = existingCart.find(item => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
      toast({
        title: "Cart Updated",
        description: `Increased quantity of ${product.name} in your cart.`,
        variant: "success"
      });
    } else {
      existingCart.push({
        ...product,
        quantity: 1
      });
      toast({
        title: "Added to Cart! 🛒",
        description: `${product.name} has been added to your cart.`,
        variant: "success"
      });
    }

    localStorage.setItem('cart', JSON.stringify(existingCart));
    setCart(existingCart);
    
    console.log("🛒 Cart updated:", {
      product: product.name,
      cartCount: existingCart.length
    });
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating)
          ? "fill-yellow-400 text-yellow-400"
          : "text-gray-300"
          }`}
      />
    ));
  };

  const ProductCard = ({ product, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <Card
        className={`hover:shadow-lg transition-all duration-300 bg-white border border-gray-200 ${product.stock === 0 ? "opacity-60" : ""
          }`}
      >
        <CardContent className="p-0">
          <div className="max-h-48 bg-gray-100 rounded-t-lg flex items-center justify-center relative overflow-hidden">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover rounded-t-lg"
              />
            ) : (
              <Leaf className="h-8 w-8 text-green-300" />
            )}
            {product.organic && (
              <Badge className="absolute top-2 left-2 bg-green-500 text-white text-xs">
                Organic
              </Badge>
            )}
            {product.stock === 0 && (
              <Badge className="absolute top-2 right-2 bg-red-500 text-white text-xs">
                Out of Stock
              </Badge>
            )}
          </div>
          <div className="p-4 space-y-3">
            <div>
              <h3 className="font-semibold text-gray-900">{product.name}</h3>
              <p className="text-sm text-gray-600">{product.farmer_name}</p>
            </div>

            <div className="flex items-center space-x-1">
              <div className="flex">{renderStars(product.rating || 4.5)}</div>
              <span className="text-sm font-medium">{product.rating || 4.5}</span>
            </div>

            <p className="text-sm text-gray-600 line-clamp-2">
              {product.description}
            </p>

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
                ₹{parseFloat(product.price).toFixed(2)}/{product.unit}
              </span>
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700"
                disabled={product.stock === 0}
                onClick={() => handleAddToCart(product)}
              >
                <ShoppingCart className="h-4 w-4 mr-1" />
                {product.stock === 0 ? "Out" : "Add"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-4 mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900">Marketplace</h1>
          <p className="text-lg text-gray-600">
            Fresh produce directly from local farmers {customerPincode && `in ${customerPincode}`}
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="space-y-4 mb-8"
        >
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search products or farmers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 border-2 border-gray-300 focus:border-green-500"
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={
                    selectedCategory === category
                      ? "bg-green-600 hover:bg-green-700"
                      : "border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                  }
                >
                  {category}
                </Button>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="border-gray-300 text-gray-700 hover:bg-gray-100"
                onClick={() => toast({
                  title: "More Filters",
                  description: "Advanced filtering options coming soon!",
                  variant: "default"
                })}
              >
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>

              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-none bg-white hover:bg-gray-100 border-0"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-none bg-white hover:bg-gray-100 border-0"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6"
        >
          <p className="text-gray-600">
            Showing {filteredProducts.length} products
            {selectedCategory !== "All" && ` in ${selectedCategory}`}
            {searchQuery && ` matching "${searchQuery}"`}
            {customerDistrict && ` from farmers in ${customerDistrict}`}
          </p>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-lg text-gray-600">Loading fresh products...</p>
          </div>
        )}

        {/* Product Grid */}
        {!loading && (
          <div
            className={`grid gap-6 ${viewMode === "grid"
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              : "grid-cols-1"
              }`}
          >
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && filteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center py-16"
          >
            <Search className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-600 mb-6">
              {customerDistrict
                ? `No products found from farmers in ${customerDistrict}. Try adjusting your search.`
                : "Try adjusting your search or filter criteria"}
            </p>
            <Button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              variant="outline"
              className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
            >
              Clear Filters
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;