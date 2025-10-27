// Store.jsx - Complete updated version
import { useState, useEffect } from "react";
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
  Trash2,
  Upload,
  Image as ImageIcon
} from "lucide-react";
import { useToast } from "@/hooks/use-toast"; 
import { handleScroll } from "@/components/Navbar";
import { farmerAPI } from "@/api";

const Store = () => {
  const { toast } = useToast(); 
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("products"); // Set default to "products"
  
  useEffect(() => {
    handleScroll();
    loadProducts();
  }, []);

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    unit: "",
    description: "",
    category: "Vegetables",
    stock: "",
    organic: false,
    harvest_date: new Date().toISOString().split('T')[0],
    image: null
  });

  const categories = ["Vegetables", "Fruits", "Leafy Greens", "Root Vegetables", "Herbs", "Grains"];

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await farmerAPI.getProducts();
      setProducts(response.data);
    } catch (error) {
      console.error("Failed to load products:", error);
      toast({
        title: "Failed to load products",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file",
          variant: "destructive"
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 5MB",
          variant: "destructive"
        });
        return;
      }

      setNewProduct(prev => ({
        ...prev,
        image: file
      }));

      toast({
        title: "Image uploaded",
        description: "Product image ready for upload"
      });
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    
    if (!newProduct.name || !newProduct.price || !newProduct.unit || !newProduct.description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      
      // Create FormData to handle file upload
      const formData = new FormData();
      formData.append('name', newProduct.name);
      formData.append('price', parseFloat(newProduct.price));
      formData.append('unit', newProduct.unit);
      formData.append('description', newProduct.description);
      formData.append('category', newProduct.category);
      formData.append('stock', parseInt(newProduct.stock) || 0);
      formData.append('organic', newProduct.organic);
      formData.append('harvest_date', newProduct.harvest_date);
      
      if (newProduct.image) {
        formData.append('image', newProduct.image);
      }

      console.log("🔄 Creating product with data:", Object.fromEntries(formData));

      const response = await farmerAPI.createProduct(formData);
      
      setProducts(prev => [response.data, ...prev]);
      setNewProduct({
        name: "",
        price: "",
        unit: "",
        description: "",
        category: "Vegetables",
        stock: "",
        organic: false,
        harvest_date: new Date().toISOString().split('T')[0],
        image: null
      });

      toast({
        title: "Product Added!",
        description: `${response.data.name} has been added to your store.`
      });

      setActiveTab("products");
    } catch (error) {
      console.error("Failed to add product:", error);
      console.error("Error response:", error.response?.data);
      
      toast({
        title: "Failed to add product",
        description: error.response?.data?.detail || JSON.stringify(error.response?.data) || "Please try again",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await farmerAPI.deleteProduct(productId);
      setProducts(prev => prev.filter(p => p.id !== productId));
      toast({
        title: "Product Removed",
        description: "Product has been removed from your store."
      });
    } catch (error) {
      console.error("Failed to delete product:", error);
      toast({
        title: "Failed to delete product",
        description: "Please try again later",
        variant: "destructive"
      });
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
          className="space-y-4 mb-8"
        >
          <h1 className="text-4xl font-bold text-foreground">My Store</h1>
          <p className="text-lg text-muted-foreground">
            Manage your products and track their performance
          </p>
        </motion.div>

        {/* Tabs - Set default value to "products" */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            defaultValue="products" // Add this line
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="products" className="text-lg">
                <Leaf className="h-4 w-4 mr-2" />
                My Products ({products.length})
              </TabsTrigger>
              <TabsTrigger value="add-product" className="text-lg">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </TabsTrigger>
            </TabsList>

            {/* Products List - This tab opens by default */}
            <TabsContent value="products" className="space-y-6">
              {loading ? (
                <div className="text-center py-16">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-lg text-muted-foreground">Loading products...</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"> {/* More columns for smaller cards */}
                  {products.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }} // Faster animation
                      className="h-full"
                    >
                      <Card className="hover:shadow-medium transition-all duration-300 bg-white border h-full flex flex-col">
                        <CardContent className="p-3 flex flex-col flex-grow"> {/* Smaller padding */}
                          {/* Product Image - Smaller and compact */}
                          <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center relative mb-3">
                            {product.image_url ? (
                              <img
                                src={product.image_url}
                                alt={product.name}
                                className="object-cover w-full h-full rounded-lg"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                            ) : null}
                            <div className={`flex items-center justify-center ${product.image_url ? 'hidden' : 'flex'}`}>
                              <Leaf className="h-8 w-8 text-green-300" /> {/* Smaller icon */}
                            </div>
                            
                            {/* Badges */}
                            {product.organic && (
                              <Badge className="absolute top-1 left-1 bg-green-500 text-white text-xs px-1 py-0">
                                Organic
                              </Badge>
                            )}
                            {product.stock === 0 && (
                              <Badge className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1 py-0">
                                Out of Stock
                              </Badge>
                            )}
                          </div>

                          {/* Product Info - Compact layout */}
                          <div className="flex-grow space-y-2">
                            <h3 className="font-semibold text-foreground text-sm leading-tight line-clamp-2">
                              {product.name}
                            </h3>
                            <p className="text-xs text-muted-foreground capitalize">
                              {product.category.toLowerCase()}
                            </p>
                            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                              {product.description}
                            </p>
                            
                            {/* Price and Stock */}
                            <div className="flex items-center justify-between mt-auto">
                              <span className="text-sm font-bold text-green-600">
                                ${parseFloat(product.price).toFixed(2)}/{product.unit}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                Stock: {product.stock}
                              </span>
                            </div>
                          </div>

                          {/* Delete Button */}
                          <Button
                            onClick={() => handleDeleteProduct(product.id)}
                            disabled={loading}
                            className="mt-2 w-full bg-red-600 hover:bg-red-700 text-white text-xs py-1 h-8"
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}

              {products.length === 0 && !loading && (
                <div className="text-center py-16">
                  <Leaf className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No products yet</h3>
                  <p className="text-gray-600 mb-6">Add your first product to start selling</p>
                  <Button 
                    onClick={() => setActiveTab("add-product")}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Product
                  </Button>
                </div>
              )}
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
                      {/* Image Upload */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Product Image</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="product-image"
                          />
                          <label htmlFor="product-image" className="cursor-pointer">
                            {newProduct.image ? (
                              <div className="space-y-2">
                                <img 
                                  src={URL.createObjectURL(newProduct.image)} 
                                  alt="Preview" 
                                  className="mx-auto h-32 w-32 object-cover rounded-lg"
                                />
                                <p className="text-sm text-green-600">Image selected: {newProduct.image.name}</p>
                                <p className="text-xs text-gray-500">Click to change</p>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                <Upload className="h-8 w-8 text-gray-400 mx-auto" />
                                <p className="text-sm font-medium">Click to upload product image</p>
                                <p className="text-xs text-gray-500">PNG, JPG, JPEG up to 5MB</p>
                              </div>
                            )}
                          </label>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Product Name *</label>
                          <Input
                            placeholder="e.g., Organic Tomatoes"
                            value={newProduct.name}
                            onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Price *</label>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={newProduct.price}
                            onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Unit *</label>
                          <Input
                            placeholder="e.g., lb, bunch, kg"
                            value={newProduct.unit}
                            onChange={(e) => setNewProduct({...newProduct, unit: e.target.value})}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Stock</label>
                          <Input
                            type="number"
                            placeholder="0"
                            value={newProduct.stock}
                            onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Category</label>
                          <select
                            value={newProduct.category}
                            onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {categories.map(category => (
                              <option key={category} value={category}>{category}</option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Harvest Date</label>
                          <Input
                            type="date"
                            value={newProduct.harvest_date}
                            onChange={(e) => setNewProduct({...newProduct, harvest_date: e.target.value})}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Description *</label>
                        <Textarea
                          placeholder="Describe your product..."
                          value={newProduct.description}
                          onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                          required
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="organic"
                          checked={newProduct.organic}
                          onChange={(e) => setNewProduct({...newProduct, organic: e.target.checked})}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="organic" className="text-sm font-medium">
                          Organic Product
                        </label>
                      </div>

                      <Button 
                        type="submit" 
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 w-full"
                      >
                        {loading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Adding Product...
                          </>
                        ) : (
                          "Add Product"
                        )}
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