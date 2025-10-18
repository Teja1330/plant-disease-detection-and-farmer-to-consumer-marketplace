import { useState } from "react";
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

const Marketplace = () => {
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // ✅ Corrected products array
  const products = [
    {
      id: 1,
      name: "Organic Tomatoes",
      farmer: "Green Valley Farm",
      price: 0.99,
      unit: "lb",
      rating: 4.8,
      reviewCount: 120,
      image: "/placeholder.svg",
      location: "15 miles away",
      harvestDate: "2 days ago",
      category: "Vegetables",
      organic: true,
      inStock: true,
      description: "Fresh, vine-ripened organic tomatoes perfect for salads and cooking."
    },
    {
      id: 2,
      name: "Fresh Spinach",
      farmer: "Sunny Acres",
      price: 1.5,
      unit: "bunch",
      rating: 4.9,
      reviewCount: 85,
      image: "/placeholder.svg",
      location: "8 miles away",
      harvestDate: "1 day ago",
      category: "Leafy Greens",
      organic: true,
      inStock: true,
      description: "Baby spinach leaves, perfect for salads and smoothies."
    },
    {
      id: 3,
      name: "Sweet Corn",
      farmer: "Prairie Fields",
      price: 2.0,
      unit: "dozen",
      rating: 4.7,
      reviewCount: 64,
      image: "/placeholder.svg",
      location: "12 miles away",
      harvestDate: "Today",
      category: "Vegetables",
      organic: false,
      inStock: true,
      description: "Sweet, tender corn on the cob, freshly picked this morning."
    },
    {
      id: 4,
      name: "Baby Carrots",
      farmer: "Earth Garden",
      price: 1.99,
      unit: "lb",
      rating: 4.6,
      reviewCount: 45,
      image: "/placeholder.svg",
      location: "20 miles away",
      harvestDate: "1 day ago",
      category: "Root Vegetables",
      organic: true,
      inStock: false,
      description: "Sweet baby carrots, perfect for snacking or cooking."
    },
    {
      id: 5,
      name: "Bell Peppers Mix",
      farmer: "Rainbow Gardens",
      price: 3.99,
      unit: "2 lbs",
      rating: 4.8,
      reviewCount: 90,
      image: "/placeholder.svg",
      location: "18 miles away",
      harvestDate: "1 day ago",
      category: "Vegetables",
      organic: true,
      inStock: true,
      description: "Colorful mix of red, yellow, and green bell peppers."
    },
    {
      id: 6,
      name: "Fresh Basil",
      farmer: "Herb Haven",
      price: 1.5,
      unit: "bunch",
      rating: 4.9,
      reviewCount: 50,
      image: "/placeholder.svg",
      location: "10 miles away",
      harvestDate: "Today",
      category: "Herbs",
      organic: true,
      inStock: true,
      description: "Aromatic fresh basil, perfect for pasta, pizza, and salads."
    }
  ];

  const categories = ["All", "Vegetables", "Fruits", "Leafy Greens", "Root Vegetables", "Herbs"];

  // ✅ Filter logic
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.farmer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // ✅ Fixed renderStars
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < Math.floor(rating)
              ? "fill-secondary text-secondary"
              : "text-muted-foreground"
          }`}
        />
      );
    }
    return stars;
  };

  // ✅ Fixed ProductCard component
  const ProductCard = ({ product, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <Card
        className={`hover:shadow-medium transition-all duration-300 bg-gradient-card ${
          !product.inStock ? "opacity-60" : ""
        }`}
      >
        <CardContent className="p-0">
          <div className="aspect-square bg-surface-soft rounded-t-lg flex items-center justify-center relative">
            <Leaf className="h-12 w-12 text-primary/30" />
            {product.organic && (
              <Badge className="absolute top-2 left-2 bg-green-500 text-white text-xs">
                Organic
              </Badge>
            )}
            {!product.inStock && (
              <Badge className="absolute top-2 right-2 bg-red-500 text-white text-xs">
                Out of Stock
              </Badge>
            )}
          </div>
          <div className="p-4 space-y-3">
            <div>
              <h3 className="font-semibold text-foreground">{product.name}</h3>
              <p className="text-sm text-muted-foreground">{product.farmer}</p>
            </div>

            <div className="flex items-center space-x-1">
              <div className="flex">{renderStars(product.rating)}</div>
              <span className="text-sm font-medium">{product.rating}</span>
              <span className="text-xs text-muted-foreground">
                ({product.reviewCount})
              </span>
            </div>

            <p className="text-sm text-muted-foreground line-clamp-2">
              {product.description}
            </p>

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
              <span className="text-lg font-bold text-primary">
                ${product.price.toFixed(2)}/{product.unit}
              </span>
              <Button
                size="sm"
                className="bg-gradient-primary hover:opacity-90"
                disabled={!product.inStock}
              >
                <ShoppingCart className="h-4 w-4 mr-1" />
                {product.inStock ? "Add" : "Out"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-4 mb-8"
        >
          <h1 className="text-4xl font-bold text-foreground">Marketplace</h1>
          <p className="text-lg text-muted-foreground">
            Fresh produce directly from local farmers
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
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              placeholder="Search products or farmers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-3 border-2 border-border focus:border-primary"
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
                      ? "bg-gradient-primary hover:opacity-90"
                      : "border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  }
                >
                  {category}
                </Button>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>

              <div className="flex border border-border rounded-lg overflow-hidden">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-none"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-none"
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
          <p className="text-muted-foreground">
            Showing {filteredProducts.length} products
            {selectedCategory !== "All" && ` in ${selectedCategory}`}
            {searchQuery && ` matching "${searchQuery}"`}
          </p>
        </motion.div>

        {/* Product Grid */}
        <div
          className={`grid gap-6 ${
            viewMode === "grid"
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              : "grid-cols-1"
          }`}
        >
          {filteredProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        {/* No Results */}
        {filteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center py-16"
          >
            <Search className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No products found
            </h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search or filter criteria
            </p>
            <Button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              Clear Filters
            </Button>
          </motion.div>
        )}

        {/* Load More Button */}
        {filteredProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mt-12"
          >
            <Button
              variant="outline"
              size="lg"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              Load More Products
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
