import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { Parallax } from "react-scroll-parallax";
import Lottie from "lottie-react";
import {
  ChevronRight,
  Activity,
  Footprints,
  Dumbbell,
  Salad,
  Brain,
  Download,
  CheckCircle2,
  Quote,
  Heart,
  Target,
  Zap,
} from "lucide-react";
import fitnessAnimation from "../assets/fitness-animation.json";
import mobileAppAnimation from "../assets/mobile-app.json";
import FeatureCard from "../components/FeatureCard";
import TestimonialCard from "../components/TestimonialCard";
import PricingCard from "../components/PricingCard";
import { ParallaxProvider } from "react-scroll-parallax";
import Header from "../components/Header";
import Footer from "../components/Footer";

import leftimg from "../assets/images/remove.jpg"; // Updated import path

// Wrapped Lottie component with error boundary
const SafeLottieAnimation = ({ animationData, ...props }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-500">
        Animation Failed to Load
      </div>
    );
  }

  return (
    <Lottie
      animationData={animationData}
      onError={() => setHasError(true)}
      renderer="svg"
      {...props}
    />
  );
};

const HomePage = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2], [0, -50]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const features = [
    {
      icon: <Footprints className="text-primary" size={32} />,
      title: " Calorie Tracker & AI based Meal loging",
      description:
        "Monitor your daily activity effortlessly with our advanced step counter and calorie tracking system.",
    },
    {
      icon: <Dumbbell className="text-primary" size={32} />,
      title: "Workout Plans & Reminders",
      description:
        "Custom workout routines tailored for you with timely reminders to keep you on track.",
    },
    {
      icon: <Salad className="text-primary" size={32} />,
      title: "Diet & Nutrition Guide",
      description:
        "Personalized meal plans based on your goals, preferences, and dietary requirements.",
    },
    {
      icon: <Brain className="text-primary" size={32} />,
      title: "AI-based Health Insights",
      description:
        "Analyze your fitness data with AI-driven recommendations for optimal results.",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Fitness Enthusiast",
      image:
        "data:image/jpeg;base64,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",
      quote:
        "I lost 10kg using Swasthify! The AI recommendations were spot on.",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Marathon Runner",
      image:
        "https://media.istockphoto.com/id/1410538853/photo/young-man-in-the-public-park.jpg?s=612x612&w=0&k=20&c=EtRJGnNOFPJ2HniBSLWKzsL9Xf7GHinHd5y2Tx3da0E=",
      quote:
        "Best AI-based fitness tracker ever! It helped me prepare for my first marathon.",
      rating: 5,
    },
    {
      name: "Emma Williams",
      role: "Yoga Instructor",
      image:
        "https://cdn2.stylecraze.com/wp-content/uploads/2013/07/Women-With-Beautiful-Face.jpg.webp",
      quote:
        "The nutrition guidance and workout plans are perfectly balanced. My clients love it!",
      rating: 4,
    },
  ];

  const pricingPlans = [
    {
      name: "Basic",
      price: "Free",
      features: [
        "Step Counter",
        "Basic Calorie Tracking",
        "Limited Workout Plans",
        "Community Access",
      ],
      cta: "Get Started",
      popular: false,
    },
    {
      name: "Premium",
      price: "₹99",
      period: "per month",
      features: [
        "Advanced Activity Tracking",
        "Custom Workout Plans",
        "Nutrition Guidance",
        "Basic AI Insights",
        "Progress Reports",
      ],
      cta: "Start 7-Day Trial",
      popular: true,
    },
    {
      name: "Ultimate",
      price: "₹999",
      period: "per month",
      features: [
        "Everything in Premium",
        "Advanced AI Health Insights",
        "Personal Coach Access",
        "Premium Content Library",
        "Family Account (up to 5)",
      ],
      cta: "Start 14-Day Trial",
      popular: false,
    },
  ];

  const motivationalQuotes = [
    {
      quote: "The only bad workout is the one that didn't happen.",
      author: "Unknown",
      icon: <Heart className="text-red-500" size={24} />,
    },
    {
      quote:
        "Your body can stand almost anything. It's your mind you have to convince.",
      author: "Unknown",
      icon: <Brain className="text-blue-500" size={24} />,
    },
    {
      quote:
        "Fitness is not about being better than someone else. It's about being better than you used to be.",
      author: "Unknown",
      icon: <Target className="text-green-500" size={24} />,
    },
    {
      quote: "The difference between try and triumph is just a little umph!",
      author: "Marvin Phillips",
      icon: <Zap className="text-yellow-500" size={24} />,
    },
  ];

  const dailyMotivations = [
    "Every step counts towards your goal",
    "Small progress is still progress",
    "Your future self is watching you right now",
    "Make today amazing",
    "You are stronger than you think",
    "Consistency beats perfection",
  ];

  return (
    <ParallaxProvider>
      <Header />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="pt-20" // Increased padding-top to ensure content doesn't overlap header
        style={{ zIndex: 1 }} // Ensure main content stays below header
      >
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center overflow-hidden">
          <motion.div style={{ opacity, y }} className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-100/50 to-green-100/50" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,123,255,0.05),transparent_40%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(40,167,69,0.05),transparent_40%)]" />
          </motion.div>

          <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center py-20">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.8 }}
                className="flex items-center gap-2 mb-4"
              >
                <Quote className="text-primary" size={20} />
                <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                  {
                    dailyMotivations[
                      Math.floor(Math.random() * dailyMotivations.length)
                    ]
                  }
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6"
              >
                <span className="block">Track Your Fitness,</span>
                <span className=" from-primarybg-green-500 bg-clip-text ">
                  Transform Your Life
                </span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-lg text-gray-700 mb-8 max-w-lg"
              >
                Stay on top of your health with real-time tracking, personalized
                insights, and AI-powered recommendations.
              </motion.p>

              {/* Motivational Quote */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-4 mb-6 border-l-4 border-primary"
              >
                <p className="text-gray-700 italic mb-2">
                  "{motivationalQuotes[0].quote}"
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    — {motivationalQuotes[0].author}
                  </span>
                  {motivationalQuotes[0].icon}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="flex flex-wrap gap-4"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-green-500 from-primary  text-white px-8 py-3 rounded-full font-medium flex items-center gap-2"
                >
                  Get Started
                  <ChevronRight size={18} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-primary text-primary px-8 py-3 rounded-full font-medium flex items-center gap-2 hover:bg-primary/5 transition-colors"
                >
                  Explore Features
                </motion.button>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="relative"
            >
              <img
                src={leftimg}
                alt="Healthy Kids"
                className="w-full h-auto rounded-2xl shadow-xl"
              />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="absolute bottom-10 left-0 right-0 flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2 }}
            >
              <ChevronRight size={30} className="text-primary rotate-90" />
            </motion.div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white" ref={ref}>
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <motion.span
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.2 }}
                className="inline-block px-4 py-1 rounded-full bg-blue-50 text-primary font-medium text-sm mb-4"
              >
                Features
              </motion.span>
              <motion.h2
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.3 }}
                className="text-3xl md:text-4xl font-bold mb-4"
              >
                Everything You Need to Stay Fit
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.4 }}
                className="text-gray-600 max-w-2xl mx-auto"
              >
                Swasthify combines cutting-edge technology with personalized
                fitness tracking to help you achieve your health goals.
              </motion.p>

              {/* Motivational Message */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.5 }}
                className="mt-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 max-w-3xl mx-auto"
              >
                <p className="text-gray-700 font-medium">
                  💪 <span className="text-primary">Remember:</span> "The only
                  person you are destined to become is the person you decide to
                  be." Start your journey today with tools designed for your
                  success.
                </p>
              </motion.div>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <FeatureCard
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Swasthify Section */}
        <section className="py-20 bg-gray-50/50">
          <div className="container mx-auto px-4">
            <Parallax speed={-10}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <motion.span
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  viewport={{ once: true }}
                  className="inline-block px-4 py-1 rounded-full bg-green-50 text-green-600 font-medium text-sm mb-4"
                >
                  Why Choose Us
                </motion.span>
                <motion.h2
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  viewport={{ once: true }}
                  className="text-3xl md:text-4xl font-bold mb-4"
                >
                  Smart Tracking for Better Results
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  viewport={{ once: true }}
                  className="text-gray-600 max-w-2xl mx-auto"
                >
                  See how Swasthify's AI-powered approach compares to
                  traditional fitness tracking methods.
                </motion.p>

                {/* Inspirational Quote */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  viewport={{ once: true }}
                  className="mt-8 bg-white rounded-xl p-6 shadow-lg max-w-2xl mx-auto"
                >
                  <div className="flex items-center gap-3 mb-3">
                    {motivationalQuotes[1].icon}
                    <h3 className="text-lg font-semibold text-gray-800">
                      Today's Motivation
                    </h3>
                  </div>
                  <p className="text-gray-700 italic text-lg mb-2">
                    "{motivationalQuotes[1].quote}"
                  </p>
                  <span className="text-sm text-gray-500">
                    — {motivationalQuotes[1].author}
                  </span>
                </motion.div>
              </motion.div>
            </Parallax>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <Parallax speed={5}>
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl shadow-xl p-8"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Activity size={28} className="text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold">Swasthify Approach</h3>
                  </div>
                  <ul className="space-y-4">
                    {[
                      "AI-powered personalized insights",
                      "Real-time health monitoring",
                      "Adaptive workout recommendations",
                      "Nutrition guidance based on your activity",
                      "Community support and challenges",
                    ].map((item, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        viewport={{ once: true }}
                        className="flex items-start gap-3"
                      >
                        <CheckCircle2
                          size={20}
                          className="text-green-500 mt-1 flex-shrink-0"
                        />
                        <span>{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </Parallax>

              <Parallax speed={-5}>
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl shadow-xl p-8"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-gray-100 p-3 rounded-full">
                      <Activity size={28} className="text-gray-500" />
                    </div>
                    <h3 className="text-2xl font-bold">Traditional Tracking</h3>
                  </div>
                  <ul className="space-y-4">
                    {[
                      "Generic fitness recommendations",
                      "Manual data entry and tracking",
                      "Static workout plans",
                      "Limited nutrition guidance",
                      "Isolated fitness experience",
                    ].map((item, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        viewport={{ once: true }}
                        className="flex items-start gap-3"
                      >
                        <CheckCircle2
                          size={20}
                          className="text-gray-400 mt-1 flex-shrink-0"
                        />
                        <span className="text-gray-600">{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </Parallax>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-white overflow-hidden">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
                className="inline-block px-4 py-1 rounded-full bg-orange-50 text-orange-500 font-medium text-sm mb-4"
              >
                Success Stories
              </motion.span>
              <motion.h2
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-bold mb-4"
              >
                Hear From Our Users
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                viewport={{ once: true }}
                className="text-gray-600 max-w-2xl mx-auto"
              >
                Join thousands of satisfied users who have transformed their
                fitness journey with Swasthify.
              </motion.p>

              {/* Community Message */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                viewport={{ once: true }}
                className="mt-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 max-w-3xl mx-auto"
              >
                <p className="text-gray-700 font-medium">
                  🌟{" "}
                  <span className="text-orange-600">Join Our Community:</span>{" "}
                  "Success is not final, failure is not fatal: it is the courage
                  to continue that counts." Be part of a community that
                  celebrates every step forward.
                </p>
              </motion.div>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard
                  key={index}
                  testimonial={testimonial}
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Mobile App Preview */}
        <section className="py-20 bg-blue-100/50  overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true }}
              >
                <motion.h2
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  viewport={{ once: true }}
                  className="text-3xl md:text-4xl font-bold mb-6"
                >
                  Mobile App Coming Soon!
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  viewport={{ once: true }}
                  className="text-gray-600 mb-8"
                >
                  We're working hard to bring Swasthify to your mobile devices.
                  Soon you'll be able to track your fitness, get health
                  insights, and receive personalized recommendations anywhere,
                  anytime. Stay tuned for our app launch!
                </motion.p>

                {/* Progress Message */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  viewport={{ once: true }}
                  className="bg-white/80 backdrop-blur-sm rounded-xl p-4 mb-6 border-l-4 border-blue-500"
                >
                  <p className="text-gray-700 font-medium">
                    🚀 <span className="text-blue-600">Progress Update:</span> "
                    {motivationalQuotes[2].quote}"
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  viewport={{ once: true }}
                  className="flex flex-wrap gap-4"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled
                    className="bg-gray-400 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 cursor-not-allowed"
                  >
                    <Download size={20} />
                    Coming to App Store
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled
                    className="bg-gray-400 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 cursor-not-allowed"
                  >
                    <Download size={20} />
                    Coming to Google Play
                  </motion.button>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="absolute inset-0  bg-green-500/10 from-primary/10  rounded-full blur-3xl -z-10" />
                <img
                  src="https://disabilityinsider.com/wp-content/uploads/2020/02/Girl-using-app-838x525.jpg"
                  alt="Girl using mobile app"
                  className="w-full h-auto rounded-2xl shadow-xl"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
                className="inline-block px-4 py-1 rounded-full bg-blue-50 text-primary font-medium text-sm mb-4"
              >
                Pricing
              </motion.span>
              <motion.h2
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-bold mb-4"
              >
                Choose Your Perfect Plan
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                viewport={{ once: true }}
                className="text-gray-600 max-w-2xl mx-auto"
              >
                Flexible plans designed to meet your fitness needs, with no
                hidden fees.
              </motion.p>

              {/* Investment Message */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                viewport={{ once: true }}
                className="mt-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 max-w-3xl mx-auto"
              >
                <p className="text-gray-700 font-medium">
                  💎{" "}
                  <span className="text-green-600">
                    Investment in Yourself:
                  </span>{" "}
                  "{motivationalQuotes[3].quote}" Your health is your greatest
                  wealth - start investing today.
                </p>
              </motion.div>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {pricingPlans.map((plan, index) => (
                <PricingCard key={index} plan={plan} index={index} />
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              viewport={{ once: true }}
              className="mt-12 text-center"
            >
              <p className="text-gray-500">
                All plans include a free 7-day trial. No credit card required.
              </p>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-green-500 from-primary">
          <div className="container mx-auto px-4 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-6"
            >
              Ready to Transform Your Fitness Journey?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="text-white/90 max-w-2xl mx-auto mb-8"
            >
              Join thousands of users who have already improved their health and
              fitness with Swasthify.
            </motion.p>

            {/* Final Motivational Message */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-white/20 backdrop-blur-sm rounded-xl p-4 mb-8 max-w-2xl mx-auto"
            >
              <p className="text-white font-medium text-lg">
                🎯 <span className="font-bold">Your Journey Starts Now:</span>{" "}
                "The future belongs to those who believe in the beauty of their
                dreams." Take the first step towards a healthier, stronger you.
              </p>
            </motion.div>

            <motion.button
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-primary px-8 py-3 rounded-full font-medium shadow-lg"
            >
              Get Started For Free
            </motion.button>
          </div>
        </section>
        <Footer />
      </motion.main>
    </ParallaxProvider>
  );
};

export default HomePage;
