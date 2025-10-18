import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Clock, CheckCircle, Star, MapPin, Calendar } from "lucide-react";

const OrderHistory = () => {
  const orders = [
    {
      id: "ORD-2024-001",
      date: "2024-01-15",
      farmer: "Green Valley Farm",
      items: [
        { name: "Organic Tomatoes", quantity: "2 lbs", price: 0.98 },
        { name: "Fresh Basil", quantity: "1 bunch", price: 0.50 },
      ],
      total: 0.48,
      status: "delivered",
      deliveryDate: "2024-01-17",
      rating: 4,
      location: "15 miles away",
    },
    {
      id: "ORD-2024-002",
      date: "2024-01-20",
      farmer: "Sunny Acres",
      items: [
        { name: "Fresh Spinach", quantity: "3 bunches", price: 0.50 },
        { name: "Baby Carrots", quantity: "1 lb", price: 0.99 },
      ],
      total: 0.49,
      status: "in-transit",
      deliveryDate: "2024-01-22",
      location: "8 miles away",
    },
    {
      id: "ORD-2024-003",
      date: "2024-01-25",
      farmer: "Prairie Fields",
      items: [
        { name: "Sweet Corn", quantity: "1 dozen", price: 1.00 },
        { name: "Bell Peppers", quantity: "2 lbs", price: 0.98 },
      ],
      total: 1.98,
      status: "processing",
      deliveryDate: "2024-01-27",
      location: "12 miles away",
    },
    {
      id: "ORD-2024-004",
      date: "2024-01-10",
      farmer: "Earth Garden",
      items: [
        { name: "Mixed Greens", quantity: "2 bags", price: 0.50 },
        { name: "Cherry Tomatoes", quantity: "1 lb", price: 0.99 },
      ],
      total: 0.49,
      status: "delivered",
      deliveryDate: "2024-01-12",
      rating: 5,
      location: "20 miles away",
    },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="h-4 w-4" />;
      case "in-transit":
        return <Package className="h-4 w-4" />;
      case "processing":
        return <Clock className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-500 text-white";
      case "in-transit":
        return "bg-blue-500 text-white";
      case "processing":
        return "bg-yellow-500 text-white";
      default:
        return "bg-gray-300 text-gray-700";
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
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
          <h1 className="text-4xl font-bold text-foreground">Order History</h1>
          <p className="text-lg text-muted-foreground">
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
              <Card className="shadow-md bg-white">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{order.id}</CardTitle>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            Ordered {new Date(order.date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>
                            {order.farmer} • {order.location}
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
                        {order.status.replace("-", " ")}
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
                        <span className="font-medium">{item.name}</span>
                        <span className="text-gray-500 ml-2">
                          ({item.quantity})
                        </span>
                      </div>
                      <span className="font-semibold">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>
                  ))}

                  <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                    <span className="text-lg font-bold">
                      Total: ${order.total.toFixed(2)}
                    </span>
                    {order.status === "delivered" && order.rating && (
                      <div className="flex items-center space-x-1">
                        <span className="text-sm text-gray-500">
                          Your rating:
                        </span>
                        <div className="flex">{renderStars(order.rating)}</div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
