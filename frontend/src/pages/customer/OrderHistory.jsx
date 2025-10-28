// OrderHistory.jsx - Updated version
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Clock, CheckCircle, Star, MapPin, Calendar, ShoppingCart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { handleScroll } from "@/components/Navbar";
import { customerAPI } from "@/api";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    handleScroll();
    loadOrders();
  }, []);

  const { toast } = useToast();

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await customerAPI.getOrders();
      setOrders(response.data || []);
    } catch (error) {
      console.error("Failed to load orders:", error);
      toast({
        title: "Failed to load orders",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "processing":
        return <Package className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-500 text-white";
      case "processing":
        return "bg-blue-500 text-white";
      case "pending":
        return "bg-yellow-500 text-white";
      default:
        return "bg-gray-300 text-gray-700";
    }
  };

  const handleReorder = (order) => {
    // Add all items from the order to cart
    const existingCart = JSON.parse(localStorage.getItem('cart')) || [];

    order.items.forEach(orderItem => {
      const product = {
        id: orderItem.product.id,
        name: orderItem.product.name,
        price: parseFloat(orderItem.unit_price),
        unit: orderItem.product.unit,
        farmer: order.farmer.name,
        location: order.farmer.pincode || 'Nearby',
        organic: orderItem.product.organic,
        image_url: orderItem.product.image_url,
        description: orderItem.product.description,
        stock: orderItem.product.stock
      };

      const existingItem = existingCart.find(item => item.id === product.id);

      if (existingItem) {
        existingItem.quantity += orderItem.quantity;
      } else {
        existingCart.push({
          ...product,
          quantity: orderItem.quantity
        });
      }
    });

    localStorage.setItem('cart', JSON.stringify(existingCart));

    toast({
      title: "Order Recreated! 🛒",
      description: `Items from your ${order.order_id} order have been added to cart.`,
      variant: "success"
    });
  };

  const handleRateOrder = (order) => {
    toast({
      title: "Thank You! ⭐",
      description: `Your rating for order ${order.order_id} has been recorded.`,
      variant: "success"
    });
  };

  const handleTrackOrder = (order) => {
    toast({
      title: "Tracking Information",
      description: `Your order ${order.order_id} is ${order.status}. Expected delivery: ${new Date(order.delivery_date).toLocaleDateString()}`,
      variant: "default"
    });
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
          }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-lg text-gray-600">Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

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
          <h1 className="text-4xl font-bold text-gray-900">Order History</h1>
          <p className="text-lg text-gray-600">
            Track your orders and review your purchases
          </p>
        </motion.div>

        {/* Orders */}
        <div className="space-y-6">
          {orders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="shadow-md bg-white border border-gray-200">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg text-gray-900">{order.order_id}</CardTitle>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            Ordered {new Date(order.order_date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>
                            {order.farmer?.name || 'Farmer'} • {order.farmer?.pincode || 'Nearby'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge
                      className={`${getStatusColor(
                        order.status
                      )} flex items-center space-x-1`}
                    >
                      {getStatusIcon(order.status)}
                      <span className="capitalize">
                        {order.status}
                      </span>
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {order.items.map((item, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center py-2 border-b border-gray-200"
                    >
                      <div>
                        <span className="font-medium text-gray-900">{item.product_name}</span>
                        <span className="text-gray-500 ml-2">
                          ({item.quantity} {item.product.unit})
                        </span>
                      </div>
                      <span className="font-semibold text-gray-900">
                        ${(item.unit_price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}

                  <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                    <span className="text-lg font-bold text-gray-900">
                      Total: ${parseFloat(order.total_amount).toFixed(2)}
                    </span>
                    {order.status === "completed" && (
                      <div className="flex items-center space-x-1">
                        <span className="text-sm text-gray-500">
                          Rate this order:
                        </span>
                        <div className="flex cursor-pointer" onClick={() => handleRateOrder(order)}>
                          {renderStars(0)}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-4">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReorder(order)}
                        className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                      >
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        Reorder
                      </Button>
                      {order.status === "completed" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRateOrder(order)}
                          className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                        >
                          <Star className="h-4 w-4 mr-1" />
                          Rate Order
                        </Button>
                      )}
                      {order.status !== "completed" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleTrackOrder(order)}
                          className="border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white"
                        >
                          Track Order
                        </Button>
                      )}
                    </div>
                    <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {orders.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center py-16"
          >
            <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-600 mb-6">Your order history will appear here once you start shopping</p>
            <Link to="/customer/marketplace">
              <Button className="bg-green-600 hover:bg-green-700">
                Start Shopping
              </Button>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;