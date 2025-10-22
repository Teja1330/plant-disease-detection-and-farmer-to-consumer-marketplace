import { useState, useEffect} from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea"; 
import { 
  Plus, 
  Leaf, 
  Star, 
  Package
} from "lucide-react";

import { useToast } from "@/hooks/use-toast"; 
import { handleScroll } from "@/components/Navbar";

const Store = () => {
  const { toast } = useToast(); 
  useEffect(() => {
        handleScroll();
      }, []);

  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Organic Tomatoes",
      price: 0.99,
      unit: "lb",
      description: "Fresh, vine-ripened organic tomatoes perfect for salads and cooking.",
      category: "Vegetables",
      stock: 50,
      image: "/placeholder.svg",
      organic: true,
      harvestDate: "2024-01-23",
      rating: 4,
      sales: 20
    },
    {
      id: 2,
      name: "Fresh Spinach",
      price: 0.5,
      unit: "bunch",
      description: "Baby spinach leaves, perfect for salads and smoothies.",
      category: "Leafy Greens",
      stock: 30,
      image: "/placeholder.svg",
      organic: true,
      harvestDate: "2024-01-24",
      rating: 5,
      sales: 15
    },
    {
      id: 3,
      name: "Sweet Corn",
      price: 1.0,
      unit: "dozen",
      description: "Sweet, tender corn on the cob, freshly picked this morning.",
      category: "Vegetables",
      stock: 0,
      image: "/placeholder.svg",
      organic: false,
      harvestDate: "2024-01-25",
      rating: 3,
      sales: 10
    }
  ]);

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    unit: "",
    description: "",
    category: "",
    stock: "",
    organic: false,
    harvestDate: ""
  });

  const categories = ["Vegetables", "Fruits", "Leafy Greens", "Root Vegetables", "Herbs", "Grains"];

  const handleAddProduct = (e) => {
    e.preventDefault();

    if (!newProduct.name || !newProduct.price || !newProduct.unit || !newProduct.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields."
      });
      return;
    }

    const product = {
      id: Date.now(),
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      unit: newProduct.unit,
      description: newProduct.description,
      category: newProduct.category || "Vegetables",
      stock: parseInt(newProduct.stock) || 0,
      image: "/placeholder.svg",
      organic: newProduct.organic,
      harvestDate: newProduct.harvestDate || new Date().toISOString().split('T')[0],
      rating: 0,
      sales: 0
    };

    setProducts([...products, product]);
    setNewProduct({
      name: "",
      price: "",
      unit: "",
      description: "",
      category: "",
      stock: "",
      organic: false,
      harvestDate: ""
    });

    toast({
      title: "Product Added!",
      description: `${product.name} has been added to your store.`
    });
  };

  const handleDeleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
    toast({
      title: "Product Removed",
      description: "Product has been removed from your store."
    });
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
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
          className="space-y-4 mb-8"
        >
          <h1 className="text-4xl font-bold text-foreground">My Store</h1>
          <p className="text-lg text-muted-foreground">
            Manage your products and track their performance
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <Tabs defaultValue="products" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="products" className="text-lg">
                <Package className="h-4 w-4 mr-2" />
                My Products
              </TabsTrigger>
              <TabsTrigger value="add-product" className="text-lg">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </TabsTrigger>
            </TabsList>

            {/* Products List */}
            <TabsContent value="products" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-medium transition-all duration-300 bg-white border">
                      <CardContent className="p-0">
                        <div className="aspect-square bg-gray-100 rounded-t-lg flex items-center justify-center relative">
                          <Leaf className="h-12 w-12 text-green-300" />
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
                          <h3 className="font-semibold text-foreground">{product.name}</h3>
                          <p className="text-sm text-muted-foreground">{product.category}</p>
                          <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                          <div className="flex items-center space-x-1">
                            <div className="flex">{renderStars(product.rating)}</div>
                            <span className="text-sm font-medium">{product.rating}</span>
                            <span className="text-xs text-muted-foreground">({product.sales} sold)</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-green-600">
                              ${product.price.toFixed(2)}/{product.unit}
                            </span>
                            <span className="text-sm text-muted-foreground">Stock: {product.stock}</span>
                          </div>
                          <Button
                            type="button"
                            onClick={() => handleDeleteProduct(product.id)}
                            className="mt-2 w-full bg-red-600 hover:bg-red-700 text-white"
                          >
                            Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Add Product Form */}
            <TabsContent value="add-product">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Card className="max-w-2xl mx-auto shadow-large bg-white border">
                  <CardHeader>
                    <CardTitle className="text-2xl">Add New Product</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleAddProduct} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <Input
                          placeholder="Product Name"
                          value={newProduct.name}
                          onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                          required
                        />
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="Price"
                          value={newProduct.price}
                          onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                          required
                        />
                        <Input
                          placeholder="Unit (e.g., lb, bunch)"
                          value={newProduct.unit}
                          onChange={(e) => setNewProduct({...newProduct, unit: e.target.value})}
                          required
                        />
                        <Input
                          placeholder="Stock"
                          type="number"
                          value={newProduct.stock}
                          onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                        />
                      </div>
                      <Textarea
                        placeholder="Description"
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                        required
                      />
                      <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                        Add Product
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default Store;