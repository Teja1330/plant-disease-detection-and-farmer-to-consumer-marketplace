import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useUser } from "../App";
import {
  ArrowRight,
  Users,
  Leaf,
  Shield,
  TrendingUp,
} from "lucide-react";
import heroImage from "/assets/hero-agriculture.jpg";

const Home = () => {
  const { user } = useUser();

  const stats = [
    { number: "10K+", label: "Happy Farmers", icon: Users },
    { number: "50K+", label: "Fresh Products", icon: Leaf },
    { number: "99%", label: "Quality Assured", icon: Shield },
    { number: "25%", label: "Better Earnings", icon: TrendingUp },
  ];

  const features = [
    {
      title: "Direct Connection",
      description: "Connect farmers directly with customers, eliminating middlemen and increasing profits.",
      icon: Users,
    },
    {
      title: "Quality Assurance",
      description: "Every product goes through quality checks to ensure freshness and safety.",
      icon: Shield,
    },
    {
      title: "Disease Detection",
      description: "AI-powered disease detection helps farmers identify and treat crop diseases early.",
      icon: Leaf,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt="Agriculture landscape"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/60 to-transparent" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left space-y-6 md:space-y-8"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Cultivating{" "}
                <span className="text-secondary-light">
                  Connections
                </span>
                <br />
                Growing{" "}
                <span className="text-secondary-light">
                  Communities
                </span>
              </h1>
              
              <p className="text-lg md:text-xl lg:text-2xl text-white/90 max-w-2xl leading-relaxed">
                AgriCare bridges the gap between farmers and customers, creating sustainable 
                relationships while promoting fresh, quality produce and better livelihoods.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                {user.role ? (
                  <Link to={user.role === 'farmer' ? '/farmer' : '/customer'}>
                    <Button
                      size="lg"
                      className="bg-white text-primary hover:bg-white/90 shadow-large text-base md:text-lg px-6 md:px-8 py-3 md:py-4 h-auto"
                    >
                      Go to Dashboard
                      <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/signup">
                      <Button
                        size="lg"
                        className="bg-white text-primary hover:bg-white/90 shadow-large text-base md:text-lg px-6 md:px-8 py-3 md:py-4 h-auto"
                      >
                        Get Started
                        <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                      </Button>
                    </Link>
                    <Link to="/services">
                      <Button
                        variant="outline"
                        size="lg"
                        className="border-white text-primary hover:bg-white hover:text-primary text-base md:text-lg px-6 md:px-8 py-3 md:py-4 h-auto"
                      >
                        Learn More
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-20 bg-muted">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center space-y-3"
                >
                  <div className="mx-auto w-14 h-14 md:w-16 md:h-16 bg-primary rounded-full flex items-center justify-center shadow-medium">
                    <Icon className="h-6 w-6 md:h-8 md:w-8 text-primary-foreground" />
                  </div>
                  <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary">
                    {stat.number}
                  </div>
                  <div className="text-muted-foreground font-medium text-sm md:text-base">
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-4 mb-12 md:mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
              Why Choose <span className="text-primary">AgriCare?</span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              We're transforming agriculture through technology, sustainability, and community connections.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                >
                  <Card className="h-full bg-card border hover:shadow-medium transition-all duration-300">
                    <CardContent className="p-6 text-center space-y-4">
                      <div className="mx-auto w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-soft">
                        <Icon className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold text-foreground">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 md:space-y-8"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
              Ready to Transform Agriculture?
            </h2>
            <p className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl mx-auto">
              Join thousands of farmers and customers who are already part of the AgriCare community.
            </p>
            {!user.role && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/signup">
                  <Button
                    size="lg"
                    className="bg-white text-primary hover:bg-white/90 shadow-large text-base md:text-lg px-6 md:px-8 py-3 md:py-4 h-auto"
                  >
                    Join as Farmer
                    <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white text-primary hover:bg-white hover:text-primary text-base md:text-lg px-6 md:px-8 py-3 md:py-4 h-auto"
                  >
                    Join as Customer
                  </Button>
                </Link>
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;