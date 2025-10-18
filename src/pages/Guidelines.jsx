import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CheckCircle, 
  Users, 
  Leaf, 
  Shield, 
  Camera, 
  Package,
  Star,
  AlertTriangle,
  Info
} from "lucide-react";

const Guidelines = () => {
  const farmerGuidelines = [
    {
      category: "Product Quality",
      icon: Leaf,
      color: "primary",
      guidelines: [
        { title: "Fresh Produce Standards", description: "Ensure all produce is harvested at optimal ripeness and handled with care.", type: "best-practice" },
        { title: "Organic Certification", description: "Maintain proper documentation for organic products and follow certification requirements.", type: "requirement" },
        { title: "Storage Guidelines", description: "Store products in appropriate conditions to maintain freshness and quality.", type: "best-practice" },
        { title: "Packaging Standards", description: "Use eco-friendly packaging and ensure products are properly labeled.", type: "requirement" }
      ]
    },
    {
      category: "Photography & Listing",
      icon: Camera,
      color: "secondary",
      guidelines: [
        { title: "High-Quality Images", description: "Upload clear, well-lit photos that accurately represent your products.", type: "requirement" },
        { title: "Multiple Angles", description: "Provide 3-4 images showing different angles and details of your produce.", type: "best-practice" },
        { title: "Accurate Descriptions", description: "Write detailed, honest descriptions including variety, growing methods, and harvest date.", type: "requirement" },
        { title: "Pricing Transparency", description: "Clearly state all prices, including any additional fees for packaging or delivery.", type: "requirement" }
      ]
    },
    {
      category: "Customer Service",
      icon: Users,
      color: "accent",
      guidelines: [
        { title: "Response Time", description: "Respond to customer inquiries within 24 hours.", type: "requirement" },
        { title: "Order Fulfillment", description: "Process and prepare orders within the timeframe specified in your listing.", type: "requirement" },
        { title: "Communication", description: "Keep customers informed about order status and any potential delays.", type: "best-practice" },
        { title: "Problem Resolution", description: "Address customer concerns promptly and fairly.", type: "best-practice" }
      ]
    }
  ];

  const customerGuidelines = [
    {
      category: "Ordering Best Practices",
      icon: Leaf,
      color: "primary",
      guidelines: [
        { title: "Read Product Descriptions", description: "Carefully review product details, including variety, quantity, and harvest information.", type: "best-practice" },
        { title: "Check Delivery Areas", description: "Ensure the farmer delivers to your location before placing an order.", type: "requirement" },
        { title: "Order in Advance", description: "Place orders with sufficient lead time, especially for seasonal products.", type: "best-practice" },
        { title: "Seasonal Awareness", description: "Understand that availability depends on growing seasons and weather conditions.", type: "info" }
      ]
    },
    {
      category: "Quality & Reviews",
      icon: Star,
      color: "secondary",
      guidelines: [
        { title: "Fair Reviews", description: "Leave honest, constructive reviews based on product quality and service.", type: "best-practice" },
        { title: "Photo Reviews", description: "Include photos in your reviews to help other customers make informed decisions.", type: "best-practice" },
        { title: "Timely Feedback", description: "Provide feedback within a reasonable time after receiving your order.", type: "best-practice" },
        { title: "Report Issues", description: "Contact farmers directly first to resolve any issues before leaving negative reviews.", type: "requirement" }
      ]
    },
    {
      category: "Community Support",
      icon: Shield,
      color: "accent",
      guidelines: [
        { title: "Support Local Farmers", description: "Prioritize local and sustainable farming practices when making purchase decisions.", type: "best-practice" },
        { title: "Reduce Food Waste", description: "Order quantities you can consume and store products properly.", type: "best-practice" },
        { title: "Share Experiences", description: "Share your positive experiences with friends and family to support the farming community.", type: "best-practice" },
        { title: "Provide Feedback", description: "Offer constructive feedback to help farmers improve their products and services.", type: "best-practice" }
      ]
    }
  ];

  const getTypeIcon = (type) => {
    switch (type) {
      case 'requirement': return <AlertTriangle className="h-4 w-4" />;
      case 'best-practice': return <CheckCircle className="h-4 w-4" />;
      case 'info': return <Info className="h-4 w-4" />;
      default: return <CheckCircle className="h-4 w-4" />;
    }
  };

  const getTypeBadge = (type) => {
    switch (type) {
      case 'requirement': return <Badge variant="destructive" className="text-xs">Required</Badge>;
      case 'best-practice': return <Badge className="bg-success text-white text-xs">Best Practice</Badge>;
      case 'info': return <Badge variant="secondary" className="text-xs">Info</Badge>;
      default: return <Badge className="bg-success text-white text-xs">Best Practice</Badge>;
    }
  };

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-6 mb-16"
        >
          <h1 className="text-5xl font-bold text-foreground">
            Community <span className="text-primary">Guidelines</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Best practices and requirements to ensure a positive experience for everyone in the AgriCare community.
          </p>
        </motion.div>

        {/* Guidelines Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Tabs defaultValue="farmers" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-12">
              <TabsTrigger value="farmers" className="text-lg">For Farmers</TabsTrigger>
              <TabsTrigger value="customers" className="text-lg">For Customers</TabsTrigger>
            </TabsList>

            {/* Farmer Guidelines */}
            <TabsContent value="farmers" className="space-y-8">
              {farmerGuidelines.map((section, sectionIndex) => {
                const Icon = section.icon;
                return (
                  <motion.div
                    key={section.category}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: sectionIndex * 0.1 }}
                  >
                    <Card className="bg-gradient-card shadow-medium">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-3 text-2xl">
                          <div className={`w-10 h-10 bg-gradient-${section.color} rounded-full flex items-center justify-center shadow-soft`}>
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          <span>{section.category}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-4">
                          {section.guidelines.map((guideline, index) => (
                            <motion.div
                              key={guideline.title}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.4, delay: index * 0.05 }}
                              className="flex items-start space-x-3 p-4 bg-surface rounded-lg border border-border/50"
                            >
                              <div className="mt-1">{getTypeIcon(guideline.type)}</div>
                              <div className="flex-1 space-y-2">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-semibold text-foreground">{guideline.title}</h4>
                                  {getTypeBadge(guideline.type)}
                                </div>
                                <p className="text-muted-foreground text-sm leading-relaxed">{guideline.description}</p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </TabsContent>

            {/* Customer Guidelines */}
            <TabsContent value="customers" className="space-y-8">
              {customerGuidelines.map((section, sectionIndex) => {
                const Icon = section.icon;
                return (
                  <motion.div
                    key={section.category}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: sectionIndex * 0.1 }}
                  >
                    <Card className="bg-gradient-card shadow-medium">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-3 text-2xl">
                          <div className={`w-10 h-10 bg-gradient-${section.color} rounded-full flex items-center justify-center shadow-soft`}>
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          <span>{section.category}</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-4">
                          {section.guidelines.map((guideline, index) => (
                            <motion.div
                              key={guideline.title}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.4, delay: index * 0.05 }}
                              className="flex items-start space-x-3 p-4 bg-surface rounded-lg border border-border/50"
                            >
                              <div className="mt-1">{getTypeIcon(guideline.type)}</div>
                              <div className="flex-1 space-y-2">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-semibold text-foreground">{guideline.title}</h4>
                                  {getTypeBadge(guideline.type)}
                                </div>
                                <p className="text-muted-foreground text-sm leading-relaxed">{guideline.description}</p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Community Standards */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-hero text-white rounded-2xl p-12 text-center mt-20"
        >
          <h2 className="text-3xl font-bold mb-4">Building a Better Community Together</h2>
          <p className="text-lg text-white/90 mb-8 max-w-3xl mx-auto">
            These guidelines help ensure that AgriCare remains a trusted, supportive platform where 
            farmers can thrive and customers can access quality, fresh produce with confidence.
          </p>
          <div className="flex items-center justify-center space-x-8 text-white/80">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5" />
              <span>Quality Assured</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Community Protected</span>
            </div>
            <div className="flex items-center space-x-2">
              <Leaf className="h-5 w-5" />
              <span>Sustainably Focused</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Guidelines;

