import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  ShoppingCart,
  Minus,
  Plus,
  Trash2,
  MapPin,
  Clock,
  Leaf,
  CreditCard,
  Truck
} from "lucide-react";

const Cart = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Organic Tomatoes",
      farmer: "Green Valley Farm",
      price: 0.99,
      unit: "lb",
      quantity: 2,
      image: "/placeholder.svg",
      location: "15 miles away",
      harvestDate: "2 days ago",
      organic: true
    },
    {
      id: 2,
      name: "Fresh Spinach",
      farmer: "Sunny Acres",
      price: 0.5,
      unit: "bunch",
      quantity: 1,
      image: "/placeholder.svg",
      location: "8 miles away",
      harvestDate: "1 day ago",
      organic: true
    },
    {
      id: 3,
      name: "Sweet Corn",
      farmer: "Prairie Fields",
      price: 1.0,
      unit: "dozen",
      quantity: 3,
      image: "/placeholder.svg",
      location: "12 miles away",
      harvestDate: "Today",
      organic: false
    }
  ]);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity === 0) {
      setCartItems(cartItems.filter(item => item.id !== id));
    } else {
      setCartItems(cartItems.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = subtotal > 50 ? 0 : 0.99;
  const tax = subtotal * 0.08;
  const total = subtotal + deliveryFee + tax;

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
          <h1 className="text-4xl font-bold text-foreground flex items-center">
            <ShoppingCart className="h-10 w-10 mr-3 text-primary" />
            Shopping Cart
          </h1>
          <p className="text-lg text-muted-foreground">
            {cartItems.length} items in your cart
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-center py-16"
              >
                <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Your cart is empty</h3>
                <p className="text-muted-foreground mb-6">Add some fresh produce to get started</p>
                <Button className="bg-gradient-primary hover:opacity-90">
                  Browse Products
                </Button>
              </motion.div>
            ) : (
              cartItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="shadow-medium bg-gradient-card">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        {/* Product Image */}
                        <div className="w-20 h-20 bg-surface-soft rounded-lg flex items-center justify-center flex-shrink-0 relative">
                          <Leaf className="h-8 w-8 text-primary/30" />
                          {item.organic && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full" />
                          )}
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 space-y-2">
                          <div>
                            <h3 className="font-semibold text-foreground">{item.name}</h3>
                            <p className="text-sm text-muted-foreground">{item.farmer}</p>
                          </div>
                          
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <div className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {item.location}
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              Harvested {item.harvestDate}
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-primary">
                              ${item.price.toFixed(2)}/{item.unit}
                            </span>
                            
                            {/* Quantity Controls */}
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-8 h-8 p-0"
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              
                              <Input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 0)}
                                className="w-16 text-center"
                                min="0"
                              />
                              
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-8 h-8 p-0"
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                              
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeItem(item.id)}
                                className="w-8 h-8 p-0 text-destructive hover:bg-destructive hover:text-white ml-2"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <span className="text-lg font-bold text-foreground">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>

          {/* Order Summary */}
          {cartItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="lg:col-span-1"
            >
              <Card className="shadow-large bg-gradient-card sticky top-8">
                <CardHeader>
                  <CardTitle className="text-xl">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">${subtotal.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Delivery Fee
                        {subtotal > 50 && (
                          <span className="text-xs text-success ml-1">(Free over $50)</span>
                        )}
                      </span>
                      <span className="font-medium">
                        {deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax</span>
                      <span className="font-medium">${tax.toFixed(2)}</span>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-primary">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="bg-surface-soft rounded-lg p-4 space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <Truck className="h-4 w-4 text-primary" />
                      <span className="font-medium">Estimated Delivery</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      2–3 business days
                    </p>
                  </div>

                  <Button className="w-full bg-gradient-primary hover:opacity-90 shadow-medium text-lg py-3">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Checkout
                  </Button>

                  <div className="space-y-2 text-xs text-muted-foreground">
                    <p className="flex items-center">
                      <Leaf className="h-3 w-3 mr-1 text-success" />
                      Supporting {new Set(cartItems.map(item => item.farmer)).size} local farmers
                    </p>
                    <p>Free delivery on orders over $50</p>
                    <p>100% money-back guarantee</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        {cartItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mt-12"
          >
            <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              Continue Shopping
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Cart;
