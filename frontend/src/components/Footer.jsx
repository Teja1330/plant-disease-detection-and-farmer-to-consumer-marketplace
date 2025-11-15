import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Leaf,
  Mail,
  Phone,
  Facebook,
  Twitter,
  Instagram,
  Users,
} from "lucide-react";

const Footer = () => {
  const teamMembers = [
    "A. Narasimha Yadav",
    "B. Sree Sahithi",
    "D. Deekshith kumar",
    "L. Sravanthi",
    "Sk. Abdul kalam",
    "Y. Teja"
  ];

  return (
    <footer className="bg-green-950 text-white">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-1">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-3"
          >
            <div className="flex items-center space-x-2">
              <Leaf className="h-8 w-8" />
              <span className="text-2xl font-bold">AgriCare</span>
            </div>
            <p className="text-white/80 leading-relaxed text-sm">
              Connecting farmers and customers through technology, promoting
              sustainable agriculture and direct farm-to-table relationships.
            </p>
            <div className="flex space-x-2 pt-2">
              <motion.a
                whileHover={{ scale: 1.1 }}
                href="#"
                className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-all"
              >
                <Facebook className="h-4 w-4" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1 }}
                href="#"
                className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-all"
              >
                <Twitter className="h-4 w-4" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1 }}
                href="#"
                className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-all"
              >
                <Instagram className="h-4 w-4" />
              </motion.a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-3"
          >
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <div className="space-y-1.5">
              {[
                { to: "/", label: "Home" },
                { to: "/services", label: "Services" },
                { to: "/about", label: "About Us" },
                { to: "/guidelines", label: "Guidelines" },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="block text-white/80 hover:text-white transition-colors duration-200 text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-3"
          >
            <h3 className="text-lg font-semibold">Our Services</h3>
            <div className="space-y-1.5 text-white/80 text-sm">
              <div>Direct Marketplace</div>
              <div>Disease Detection</div>
              <div>Farming Guidelines</div>
              <div>Quality Assurance</div>
            </div>
          </motion.div>

          {/* Team Info */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-3"
          >
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Users className="h-5 w-5" />
              Our Project Team
            </h3>

            <div className="grid grid-cols-2 gap-2">
              {teamMembers.map((name, index) => (
                <div
                  key={index}
                  className="p-2 text-center border border-white/20 rounded-lg bg-white/10 hover:bg-white/20 transition-all text-sm font-medium"
                >
                  {name}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="border-t border-white/20 mt-6 pt-6 text-center text-white/60 text-sm"
        >
          <p>
            &copy; 2025 AgriCare. All rights reserved. Built by GMRIT Final Year
            B.Tech CSE (AI & DS) Team.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
