import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  Clock, 
  Package, 
  Calendar,
  MapPin,
  Phone,
  Mail,
  DollarSign,
  User
} from "lucide-react";

const Orders = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState([
    {
      id: "ORD-2024-001",
      customerName: "John Smith",
      customerEmail: "john.smith@email.com",
      customerPhone: "+1 (555) 123-4567",
      orderDate: "2024-01-25",
      deliveryDate: "2024-01-27",
      status: "pending",
      total: 48.0,
      address: "123 Main St, Cityville, ST 12345",
      items: [
        { name: "Organic Tomatoes", quantity: 2, unit: "lbs", price: 4.99 },
        { name: "Fresh Basil", quantity: 1, unit: "bunch", price: 0.50 }
      ]
    },
    {
      id: "ORD-2024-002",
      customerName: "Sarah Johnson",
      customerEmail: "sarah.j@email.com",
      customerPhone: "+1 (555) 234-5678",
      orderDate: "2024-01-24",
      deliveryDate: "2024-01-26",
      status: "processing",
      total: 98.0,
      address: "456 Oak Ave, Townsburg, ST 23456",
      items: [
        { name: "Sweet Corn", quantity: 3, unit: "dozen", price: 6.00 },
        { name: "Bell Peppers", quantity: 2, unit: "lbs", price: 0.99 }
      ]
    },
    {
      id: "ORD-2024-003",
      customerName: "Mike Davis",
      customerEmail: "mike.davis@email.com",
      customerPhone: "+1 (555) 345-6789",
      orderDate: "2024-01-23",
      deliveryDate: "2024-01-25",
      status: "completed",
      total: 0.0,
      address: "789 Pine Rd, Villagetown, ST 34567",
      items: [
        { name: "Fresh Spinach", quantity: 1, unit: "bunches", price: 0.50 }
      ]
    }
  ]);

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-success text-white';
      case 'processing':
        return 'bg-sky-blue text-white';
      case 'pending':
        return 'bg-secondary text-white';
      case 'cancelled':
        return 'bg-destructive text-white';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'processing':
        return <Package className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'cancelled':
        return <Clock className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const filteredOrders = orders.filter(order => 
    order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getOrdersByStatus = (status) => {
    if (status === 'all') return filteredOrders;
    return filteredOrders.filter(order => order.status === status);
  };

  const orderStats = {
    total: filteredOrders.length,
    pending: filteredOrders.filter(o => o.status === 'pending').length,
    processing: filteredOrders.filter(o => o.status === 'processing').length,
    completed: filteredOrders.filter(o => o.status === 'completed').length,
    cancelled: filteredOrders.filter(o => o.status === 'cancelled').length
  };

  const OrderCard = ({ order, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <Card className="shadow-medium bg-gradient-card hover:shadow-large transition-all duration-300">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg">{order.id}</CardTitle>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Ordered {new Date(order.orderDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <DollarSign className="h-4 w-4" />
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <Badge className={`${getStatusColor(order.status)} flex items-center space-x-1`}>
              {getStatusIcon(order.status)}
              <span className="capitalize">{order.status}</span>
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Customer Info */}
          <div className="bg-surface-soft rounded-lg p-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-primary" />
                  <span className="font-semibold">{order.customerName}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{order.customerEmail}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{order.customerPhone}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 text-primary mt-0.5" />
                  <span className="text-sm text-muted-foreground">{order.address}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-2">
            <h4 className="font-semibold text-foreground">Order Items:</h4>
            {order.items.map((item, itemIndex) => (
              <div key={itemIndex} className="flex justify-between items-center py-2 border-b border-border/50 last:border-0">
                <div>
                  <span className="font-medium">{item.name}</span>
                  <span className="text-muted-foreground ml-2">({item.quantity} {item.unit})</span>
                </div>
                <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-1" />
                View Details
              </Button>
              <Button variant="outline" size="sm">
                <Phone className="h-4 w-4 mr-1" />
                Contact
              </Button>
            </div>
            
            {order.status === 'pending' && (
              <Button 
                size="sm" 
                onClick={() => updateOrderStatus(order.id, 'processing')}
                className="bg-sky-blue hover:bg-sky-blue/90 text-white"
              >
                Accept Order
              </Button>
            )}
            
            {order.status === 'processing' && (
              <Button 
                size="sm" 
                onClick={() => updateOrderStatus(order.id, 'completed')}
                className="bg-success hover:bg-success/90 text-white"
              >
                Mark Complete
              </Button>
            )}
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
          <h1 className="text-4xl font-bold text-foreground">Order Management</h1>
          <p className="text-lg text-muted-foreground">
            Track and manage all your customer orders
          </p>
        </motion.div>

        {/* Order Stats */}
        {/* ... keep rest of your component as-is, orderStats usage is correct */}
      </div>
    </div>
  );
};

export default Orders;
