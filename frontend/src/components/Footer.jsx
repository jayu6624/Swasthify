"use client";
import logo from "../assets/images/logo.jpg";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Activity,
  Instagram,
  Twitter,
  Facebook,
  Youtube,
  Mail,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="bg-gray-900 text-white pt-16 pb-8 mt-auto"
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <motion.div
              variants={item}
              className="flex items-center gap-2 mb-4"
            >
              <img
                src={logo}
                alt="Swasthify"
                className="w-10 h-10 rounded-full"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-green-500 bg-clip-text">
                Swasthify
              </span>
            </motion.div>
            <motion.p variants={item} className="text-gray-400 mb-6">
              Track your fitness, transform your life with AI-powered insights
              and personalized recommendations.
            </motion.p>
            <motion.div variants={item} className="flex gap-4">
              {[Instagram, Twitter, Facebook, Youtube].map((Icon, index) => (
                <motion.a
                  key={index}
                  href="#"
                  whileHover={{ y: -5, color: "#007bff" }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Icon size={20} />
                </motion.a>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <motion.h3 variants={item} className="text-lg font-semibold mb-4">
              Quick Links
            </motion.h3>
            {["Home", "Features", "Pricing", "About Us", "Contact Us"].map(
              (link) => (
                <motion.div variants={item} key={link} className="mb-2">
                  <Link
                    to={
                      link === "Home"
                        ? "/"
                        : `/${link.toLowerCase().replace(" ", "-")}`
                    }
                    className="text-gray-400 hover:text-primary transition-colors"
                  >
                    {link}
                  </Link>
                </motion.div>
              )
            )}
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <motion.h3 variants={item} className="text-lg font-semibold mb-4">
              Features
            </motion.h3>
            {[
              "Step Counter",
              "Workout Plans",
              "Diet & Nutrition",
              "AI Health Insights",
              "Progress Tracking",
              "Community Support",
            ].map((feature) => (
              <motion.div variants={item} key={feature} className="mb-2">
                <Link
                  to="#"
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  {feature}
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <motion.h3 variants={item} className="text-lg font-semibold mb-4">
              Contact Us
            </motion.h3>
            <motion.div variants={item} className="flex items-start gap-3 mb-4">
              <Mail size={20} className="text-primary mt-1" />
              <span className="text-gray-400">support@swasthify.com</span>
            </motion.div>
            <motion.div variants={item}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-primary to-green-500 text-white px-6 py-2 rounded-full font-medium"
              >
                Subscribe to Newsletter
              </motion.button>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
          className="pt-8 border-t border-gray-800 text-center text-gray-500 text-sm"
        >
          <p>
            © {currentYear} Swasthify. All rights reserved.
            <span className="mx-2">|</span>
            <Link to="/privacy-policy" className="hover:text-primary">
              Privacy Policy
            </Link>
            <span className="mx-2">|</span>
            <Link to="/terms" className="hover:text-primary">
              Terms & Conditions
            </Link>
          </p>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
