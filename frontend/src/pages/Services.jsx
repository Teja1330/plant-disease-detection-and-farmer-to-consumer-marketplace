import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ShoppingBag, Camera, Handshake, Shield, TrendingUp, Users } from "lucide-react";

import marketplaceImage from "/assets/marketplace-service.jpg";
import detectionImage from "/assets/disease-detection-service.jpg";
import connectionImage from "/assets/connection-service.jpg";

const Services = () => {
  const mainServices = [
    {
      title: "Digital Marketplace",
      description:
        "A comprehensive platform where farmers can showcase their products and customers can browse and purchase fresh produce directly.",
      image: marketplaceImage,
      features: ["Real-time inventory", "Secure payments", "Quality ratings", "Delivery tracking"],
      icon: ShoppingBag,
    },
    {
      title: "Disease Detection",
      description:
        "AI-powered disease detection system that helps farmers identify crop diseases early and take preventive measures.",
      image: detectionImage,
      features: ["Image analysis", "Disease identification", "Treatment recommendations", "Expert consultation"],
      icon: Camera,
    },
    {
      title: "Direct Connection",
      description:
        "Building direct relationships between farmers and customers, eliminating middlemen and increasing profits for farmers.",
      image: connectionImage,
      features: ["Farmer profiles", "Customer reviews", "Direct communication", "Partnership programs"],
      icon: Handshake,
    },
  ];

  const additionalServices = [
    {
      title: "Quality Assurance",
      description: "Comprehensive quality checks and certifications for all products.",
      icon: Shield,
    },
    {
      title: "Market Analytics",
      description: "Data-driven insights to help farmers make informed decisions.",
      icon: TrendingUp,
    },
    {
      title: "Community Support",
      description: "Building a supportive community of farmers and customers.",
      icon: Users,
    },
  ];

  return (
    <div className="min-h-screen py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-6 mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Our <span className="text-primary">Services</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Comprehensive solutions designed to empower farmers and connect them with customers through technology and innovation.
          </p>
        </motion.div>

        {/* Main Services */}
        <div className="space-y-16 md:space-y-20 mb-16 md:mb-20">
          {mainServices.map((service, index) => {
            const Icon = service.icon;
            const isEven = index % 2 === 0;

            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, x: isEven ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className={`grid lg:grid-cols-2 gap-8 md:gap-12 items-center ${!isEven ? "lg:grid-flow-col-dense" : ""}`}
              >
                {/* Content */}
                <div className={`space-y-6 ${!isEven ? "lg:col-start-2" : ""}`}>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-soft">
                      <Icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground">{service.title}</h2>
                  </div>

                  <p className="text-base md:text-lg text-muted-foreground leading-relaxed">{service.description}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {service.features.map((feature) => (
                      <div key={feature} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-primary rounded-full" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Link to="/signup">
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-medium">
                      Get Started
                    </Button>
                  </Link>
                </div>

                {/* Image */}
                <div className={!isEven ? "lg:col-start-1 lg:row-start-1" : ""}>
                  <div className="relative rounded-2xl overflow-hidden shadow-large">
                    <img src={service.image} alt={service.title} className="w-full h-64 md:h-80 object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Additional Services */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8 }} 
          className="space-y-12"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">Additional Services</h2>
            <p className="text-lg text-muted-foreground">Supporting services that make the AgriCare ecosystem complete</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {additionalServices.map((service) => {
              const Icon = service.icon;
              return (
                <motion.div 
                  key={service.title} 
                  initial={{ opacity: 0, y: 50 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  transition={{ duration: 0.6 }}
                >
                  <Card className="h-full text-center bg-card hover:shadow-medium transition-all duration-300 border">
                    <CardContent className="p-6 space-y-4">
                      <div className="mx-auto w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-soft">
                        <Icon className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <h3 className="text-xl font-bold text-foreground">{service.title}</h3>
                      <p className="text-muted-foreground text-sm">{service.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-primary text-primary-foreground rounded-2xl p-8 md:p-12 text-center mt-16 md:mt-20"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-base md:text-lg text-primary-foreground/90 mb-6 md:mb-8 max-w-2xl mx-auto">
            Join thousands of farmers and customers who are already benefiting from our services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-large">
                Join as Farmer
              </Button>
            </Link>
            <Link to="/signup">
              <Button variant="outline" size="lg" className="border-white text-primary hover:bg-white hover:text-primary">
                Join as Customer
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Services;