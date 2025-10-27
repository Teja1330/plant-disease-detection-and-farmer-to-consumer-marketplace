import { useState, useEffect } from "react";
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
  User,
  RefreshCw
} from "lucide-react";
import { handleScroll } from "@/components/Navbar";
import { useToast } from "@/hooks/use-toast";
import { farmerAPI } from "@/api";

const Orders = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingOrder, setUpdatingOrder] = useState(null);

  useEffect(() => {
    handleScroll();
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await farmerAPI.getOrders();
      setOrders(response.data);
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

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setUpdatingOrder(orderId);
      await farmerAPI.updateOrderStatus(orderId, newStatus);
      
      setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      
      toast({
        title: "Order Updated",
        description: `Order status changed to ${newStatus}`,
        variant: "success"
      });
    } catch (error) {
      console.error("Failed to update order:", error);
      toast({
        title: "Update Failed",
        description: "Failed to update order status",
        variant: "destructive"
      });
    } finally {
      setUpdatingOrder(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500 text-white';
      case 'processing':
        return 'bg-blue-500 text-white';
      case 'pending':
        return 'bg-yellow-500 text-white';
      case 'cancelled':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-300 text-gray-700';
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
    order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.order_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getOrdersByStatus = (status) => {
    if (status === 'all') return filteredOrders;
    return filteredOrders.filter(order => order.status === status);
  };

  const orderStats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    completed: orders.filter(o => o.status === 'completed').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length
  };

  const OrderCard = ({ order, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <Card className="shadow-medium bg-white border border-gray-200 hover:shadow-large transition-all duration-300">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg">{order.order_id}</CardTitle>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Ordered {new Date(order.order_date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <DollarSign className="h-4 w-4" />
                  <span>${parseFloat(order.total_amount).toFixed(2)}</span>
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
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-blue-600" />
                  <span className="font-semibold">{order.customer_name}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Mail className="h-4 w-4" />
                  <span>{order.customer_email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Phone className="h-4 w-4" />
                  <span>{order.customer_phone}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 text-blue-600 mt-0.5" />
                  <span className="text-sm text-gray-500">{order.address}</span>
                </div>
                <div className="text-sm text-gray-500">
                  Delivery: {new Date(order.delivery_date).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-900">Order Items:</h4>
            {order.items.map((item, itemIndex) => (
              <div key={itemIndex} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0">
                <div>
                  <span className="font-medium">{item.product_name}</span>
                  <span className="text-gray-500 ml-2">({item.quantity} units)</span>
                </div>
                <span className="font-semibold">${(item.unit_price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                <Eye className="h-4 w-4 mr-1" />
                View Details
              </Button>
              <Button variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                <Phone className="h-4 w-4 mr-1" />
                Contact
              </Button>
            </div>
            
            {order.status === 'pending' && (
              <div className="flex items-center space-x-2">
                <Button 
                  size="sm" 
                  onClick={() => updateOrderStatus(order.id, 'processing')}
                  disabled={updatingOrder === order.id}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {updatingOrder === order.id ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    "Accept Order"
                  )}
                </Button>
              </div>
            )}
            
            {order.status === 'processing' && (
              <div className="flex items-center space-x-2">
                <Button 
                  size="sm" 
                  onClick={() => updateOrderStatus(order.id, 'completed')}
                  disabled={updatingOrder === order.id}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {updatingOrder === order.id ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    "Mark Complete"
                  )}
                </Button>
              </div>
            )}
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
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-4 mb-8"
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Order Management</h1>
              <p className="text-lg text-gray-600">
                Track and manage all your customer orders
              </p>
            </div>
            <Button
              onClick={loadOrders}
              disabled={loading}
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </motion.div>

        {/* Order Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8"
        >
          <Card className="bg-white border border-gray-200 text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{orderStats.total}</div>
              <p className="text-sm text-gray-500">Total Orders</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white border border-gray-200 text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-600">{orderStats.pending}</div>
              <p className="text-sm text-gray-500">Pending</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white border border-gray-200 text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-500">{orderStats.processing}</div>
              <p className="text-sm text-gray-500">Processing</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white border border-gray-200 text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{orderStats.completed}</div>
              <p className="text-sm text-gray-500">Completed</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white border border-gray-200 text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">{orderStats.cancelled}</div>
              <p className="text-sm text-gray-500">Cancelled</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-4 mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search orders by customer name or order ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-2 border-gray-300 focus:border-blue-500"
              />
            </div>
            <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </motion.div>

        {/* Orders Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-lg text-gray-600">Loading orders...</p>
            </div>
          ) : (
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-8 bg-gray-100 p-1 rounded-lg">
                <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  All ({orderStats.total})
                </TabsTrigger>
                <TabsTrigger value="pending" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  Pending ({orderStats.pending})
                </TabsTrigger>
                <TabsTrigger value="processing" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  Processing ({orderStats.processing})
                </TabsTrigger>
                <TabsTrigger value="completed" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  Completed ({orderStats.completed})
                </TabsTrigger>
                <TabsTrigger value="cancelled" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  Cancelled ({orderStats.cancelled})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-6">
                {getOrdersByStatus('all').map((order, index) => (
                  <OrderCard key={order.id} order={order} index={index} />
                ))}
              </TabsContent>

              <TabsContent value="pending" className="space-y-6">
                {getOrdersByStatus('pending').map((order, index) => (
                  <OrderCard key={order.id} order={order} index={index} />
                ))}
              </TabsContent>

              <TabsContent value="processing" className="space-y-6">
                {getOrdersByStatus('processing').map((order, index) => (
                  <OrderCard key={order.id} order={order} index={index} />
                ))}
              </TabsContent>

              <TabsContent value="completed" className="space-y-6">
                {getOrdersByStatus('completed').map((order, index) => (
                  <OrderCard key={order.id} order={order} index={index} />
                ))}
              </TabsContent>

              <TabsContent value="cancelled" className="space-y-6">
                {getOrdersByStatus('cancelled').map((order, index) => (
                  <OrderCard key={order.id} order={order} index={index} />
                ))}
              </TabsContent>
            </Tabs>
          )}

          {/* Empty State */}
          {!loading && filteredOrders.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center py-16"
            >
              <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-600 mb-6">
                {searchQuery ? "Try adjusting your search criteria" : "Orders will appear here once customers start buying your products"}
              </p>
              {searchQuery && (
                <Button 
                  onClick={() => setSearchQuery('')}
                  variant="outline"
                  className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                >
                  Clear Search
                </Button>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Orders;