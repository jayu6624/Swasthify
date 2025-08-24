import logo from "../assets/images/logo.jpg";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X, Activity, Info, Mail, User } from "lucide-react";
import { NavLink } from "react-router-dom";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isButtonLocked, setIsButtonLocked] = useState(false); // New state for button lock
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsButtonLocked(false); // Reset button lock on page change
  }, [location.pathname]);

  // Handle button click with delay
  const handleMenuToggle = () => {
    if (isButtonLocked) return; // Prevent action if button is locked

    setIsButtonLocked(true);
    // Add pulse animation class for feedback
    const button = document.querySelector(".mobile-menu-button");
    if (button) button.classList.add("animate-pulse");

    // Delay menu toggle by 1000ms
    setTimeout(() => {
      setIsMenuOpen((prev) => !prev);
      setIsButtonLocked(false);
      if (button) button.classList.remove("animate-pulse");
    }, 1000); // 1-second delay
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 font-inter ${
        isScrolled
          ? "bg-black/90 backdrop-blur-md shadow-lg py-3"
          : "bg-white/80 backdrop-blur-sm py-4"
      }`}
      style={{
        backgroundImage: isScrolled ? "none" : "url('/health-pattern.png')",
      }}
    >
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3">
          <motion.div
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
          >
            <img
              src={logo}
              alt="Swasthify Logo"
              className="w-12 h-12 rounded-full object-cover"
              aria-label="Swasthify Home"
            />
          </motion.div>
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className={`text-2xl font-bold tracking-tight ${
              isScrolled
                ? "text-white"
                : "bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent"
            }`}
          >
            Swasthify
          </motion.span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-10">
          {[
            { label: "Home", to: "/", icon: Activity },
            { label: "About-Us", to: "/about-us", icon: Info },
            { label: "Contact", to: "/contact", icon: Mail },
          ].map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className={`flex items-center gap-2 font-medium transition-colors duration-200 ${
                location.pathname === item.to
                  ? isScrolled
                    ? "text-green-300"
                    : "text-green-600"
                  : isScrolled
                  ? "text-white/80"
                  : "text-gray-700"
              } hover:text-green-500`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
          <Link to="/login" aria-label="Login or Sign Up">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold text-base transition-all duration-300 ${
                isScrolled
                  ? "bg-gradient-to-r from-green-500 to-blue-500 text-white"
                  : "bg-gradient-to-r from-green-500 to-blue-500 text-white"
              } shadow-md`}
            >
              <User size={18} />
              Login/Sign-up
            </motion.button>
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <motion.button
          whileTap={{ scale: isButtonLocked ? 1 : 0.9 }}
          className={`md:hidden focus:outline-none focus:ring-2 focus:ring-green-500 rounded mobile-menu-button ${
            isScrolled ? "text-white" : "text-gray-800"
          } ${isButtonLocked ? "opacity-70 cursor-not-allowed" : ""}`}
          onClick={handleMenuToggle}
          aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
          disabled={isButtonLocked}
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </motion.button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3, type: "spring", stiffness: 100 }}
          className={`md:hidden ${
            isScrolled ? "bg-black/95" : "bg-white/95"
          } shadow-xl border-t border-gray-200/30`}
        >
          <div className="container mx-auto px-6 py-6 flex flex-col items-center gap-5">
            {[
              { label: "Home", to: "/", icon: Activity },
              { label: "About-Us", to: "/about-us", icon: Info },
              { label: "Contact", to: "/contact", icon: Mail },
            ].map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className={`flex items-center gap-3 w-full text-center py-3 border-b ${
                  isScrolled
                    ? "text-white border-gray-700"
                    : "text-gray-800 border-gray-200"
                } hover:bg-green-100/50 transition-colors duration-200`}
                aria-label={item.label}
              >
                <item.icon size={20} />
                {item.label}
              </Link>
            ))}
            <Link to="/login" className="w-full" aria-label="Login or Sign Up">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center justify-center gap-2 w-full px-6 py-3 rounded-full font-semibold text-base transition-all duration-300 ${
                  isScrolled
                    ? "bg-gradient-to-r from-green-500 to-blue-500 text-white"
                    : "bg-gradient-to-r from-green-500 to-blue-500 text-white"
                } shadow-md`}
              >
                <User size={18} />
                Login/Sign-up
              </motion.button>
            </Link>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
};

export default Header;
