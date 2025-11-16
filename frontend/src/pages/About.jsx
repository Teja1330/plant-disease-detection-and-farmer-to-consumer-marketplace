import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Target, Award, Globe } from "lucide-react";
import { useEffect } from "react";
import { handleScroll } from "@/components/Navbar";

const About = () => {
  useEffect(() => {
        handleScroll();
      }, []);
  const values = [
    {
      icon: Users,
      title: "Community First",
      description: "Building strong relationships between farmers and customers for mutual benefit."
    },
    {
      icon: Target,
      title: "Quality Focus",
      description: "Ensuring every product meets the highest standards of freshness and safety."
    },
    {
      icon: Award,
      title: "Innovation",
      description: "Leveraging technology to solve real agricultural challenges."
    },
    {
      icon: Globe,
      title: "Sustainability",
      description: "Promoting eco-friendly farming practices for a better future."
    }
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
            About <span className="text-primary">AgriCare</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We're on a mission to revolutionize agriculture by connecting farmers directly with customers, 
            promoting sustainable farming practices, and ensuring food security for everyone.
          </p>
        </motion.div>

        {/* Mission Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-primary/10 rounded-2xl p-8 md:p-12 mb-16 shadow-medium border"
        >
          <div className="text-center space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Our Mission</h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              To create a sustainable agricultural ecosystem where farmers can thrive economically while 
              providing customers with fresh, quality produce. We eliminate middlemen, reduce food waste, 
              and promote direct relationships that benefit everyone in the supply chain.
            </p>
          </div>
        </motion.div>

        {/* Values Grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="h-full text-center bg-card hover:shadow-medium transition-all duration-300 border">
                    <CardContent className="p-6 space-y-4">
                      <div className="mx-auto w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-soft">
                        <Icon className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <h3 className="text-xl font-bold text-foreground">{value.title}</h3>
                      <p className="text-muted-foreground text-sm">{value.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Story Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-muted rounded-2xl p-8 md:p-12 text-center border"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">Our Story</h2>
          <div className="max-w-4xl mx-auto space-y-4 text-muted-foreground leading-relaxed text-sm md:text-base">
            <p>
              AgriCare was born from a simple observation: many barriers exist between farmers who grow 
              our food and the people who consume it. Traditional supply chains often leave farmers with 
              minimal profits while customers pay high prices for produce that may not be at its freshest.
            </p>
            <p>
              Our founders, with backgrounds in agriculture and technology, saw an opportunity to create 
              a platform that would benefit everyone involved. By connecting farmers directly with customers, 
              we're building a more transparent, efficient, and sustainable food system.
            </p>
            <p>
              Today, AgriCare serves thousands of farmers and customers across the region, facilitating 
              millions of rupees in direct trade while promoting sustainable farming practices and 
              food security for local communities.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;