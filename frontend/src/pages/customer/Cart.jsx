import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import {
  ShoppingCart,
  Minus,
  Plus,
  Trash2,
  MapPin,
  Clock,
  Leaf,
  CreditCard,
  Truck,
  ArrowLeft
} from "lucide-react";

const Cart = () => {
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(savedCart);
  }, []);

  const updateQuantity = (id, newQuantity) => {
    let updatedCart;
    if (newQuantity === 0) {
      const item = cartItems.find(item => item.id === id);
      updatedCart = cartItems.filter(item => item.id !== id);
      toast({
        title: "Item Removed",
        description: `${item.name} has been removed from your cart.`,
        variant: "success"
      });
    } else {
      updatedCart = cartItems.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      );
      const item = updatedCart.find(item => item.id === id);
      toast({
        title: "Quantity Updated",
        description: `${item.name} quantity updated to ${newQuantity}.`,
        variant: "default"
      });
    }

    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeItem = (id) => {
    const item = cartItems.find(item => item.id === id);
    const updatedCart = cartItems.filter(item => item.id !== id);
    
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    
    toast({
      title: "Item Removed",
      description: `${item.name} has been removed from your cart.`,
      variant: "success"
    });
  };

  const clearCart = () => {
    if (cartItems.length === 0) {
      toast({
        title: "Cart is empty",
        description: "There are no items to clear.",
        variant: "destructive"
      });
      return;
    }

    setCartItems([]);
    localStorage.setItem('cart', JSON.stringify([]));
    
    toast({
      title: "Cart Cleared",
      description: "All items have been removed from your cart.",
      variant: "success"
    });
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = subtotal > 50 ? 0 : 4.99;
  const tax = subtotal * 0.08;
  const total = subtotal + deliveryFee + tax;

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add items to your cart before checkout.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Order Placed! 🎉",
      description: "Your order has been successfully placed. Thank you for your purchase!",
      variant: "success"
    });

    // Clear cart after successful checkout
    setCartItems([]);
    localStorage.setItem('cart', JSON.stringify([]));
  };

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
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/customer/marketplace">
                <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Continue Shopping
                </Button>
              </Link>
              <h1 className="text-4xl font-bold text-gray-900 flex items-center">
                <ShoppingCart className="h-10 w-10 mr-3 text-green-600" />
                Shopping Cart
              </h1>
            </div>
            {cartItems.length > 0 && (
              <Button 
                variant="outline" 
                onClick={clearCart}
                className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Cart
              </Button>
            )}
          </div>
          <p className="text-lg text-gray-600">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
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
                <ShoppingCart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-gray-600 mb-6">Add some fresh produce to get started</p>
                <Link to="/customer/marketplace">
                  <Button className="bg-green-600 hover:bg-green-700">
                    Browse Products
                  </Button>
                </Link>
              </motion.div>
            ) : (
              <>
                {cartItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card className="shadow-lg bg-white border border-gray-200">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                          {/* Product Image */}
                          <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 relative">
                            <Leaf className="h-8 w-8 text-green-300" />
                            {item.organic && (
                              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full" />
                            )}
                          </div>

                          {/* Product Details */}
                          <div className="flex-1 space-y-2">
                            <div>
                              <h3 className="font-semibold text-gray-900">{item.name}</h3>
                              <p className="text-sm text-gray-600">{item.farmer}</p>
                            </div>
                            
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
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
                              <span className="text-lg font-bold text-green-600">
                                ${item.price.toFixed(2)}/{item.unit}
                              </span>
                              
                              {/* Quantity Controls */}
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  className="w-8 h-8 p-0 border-gray-300"
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                                
                                <Input
                                  type="number"
                                  value={item.quantity}
                                  onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 0)}
                                  className="w-16 text-center border-gray-300"
                                  min="0"
                                />
                                
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="w-8 h-8 p-0 border-gray-300"
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                                
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removeItem(item.id)}
                                  className="w-8 h-8 p-0 text-red-600 hover:bg-red-600 hover:text-white ml-2 border-red-300"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <span className="text-lg font-bold text-gray-900">
                                ${(item.price * item.quantity).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </>
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
              <Card className="shadow-lg bg-white border border-gray-200 sticky top-8">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">${subtotal.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Delivery Fee
                        {subtotal > 50 && (
                          <span className="text-xs text-green-600 ml-1">(Free over $50)</span>
                        )}
                      </span>
                      <span className="font-medium">
                        {deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax</span>
                      <span className="font-medium">${tax.toFixed(2)}</span>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-gray-900">Total</span>
                      <span className="text-green-600">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 space-y-2 border border-gray-200">
                    <div className="flex items-center space-x-2 text-sm">
                      <Truck className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-gray-900">Estimated Delivery</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      2–3 business days
                    </p>
                  </div>

                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700 shadow-md text-lg py-3"
                    onClick={handleCheckout}
                  >
                    <CreditCard className="h-5 w-5 mr-2" />
                    Checkout
                  </Button>

                  <div className="space-y-2 text-xs text-gray-500">
                    <p className="flex items-center">
                      <Leaf className="h-3 w-3 mr-1 text-green-500" />
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
      </div>
    </div>
  );
};

export default Cart;