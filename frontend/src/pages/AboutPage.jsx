import { useEffect } from "react";
import { motion } from "framer-motion";
import { Parallax } from "react-scroll-parallax";
import Lottie from "lottie-react";
import { Activity, Target, Heart, Users, CheckCircle2 } from "lucide-react";
import teamAnimation from "../assets/team-animation.json";
import howItWorksAnimation from "../assets/how-it-works.json";
import Header from "../components/Header";
import Footer from "../components/Footer";

const AboutPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const teamMembers = [
    {
      name: "Jaydeep Rathod",
      role: "Developer",
      image: "/src/assets/images/Jaydeep.jpg",
      bio: "Former fitness coach with a passion for technology and health innovation.",
    },
    
  ];

  const steps = [
    {
      title: "Sign Up",
      description:
        "Create your account and set your fitness goals and preferences.",
      icon: <Users className="text-primary" size={24} />,
    },
    {
      title: "Connect Devices",
      description: "Sync your wearables or use your phone to track activities.",
      icon: <Activity className="text-primary" size={24} />,
    },
    {
      title: "Get Personalized Plans",
      description:
        "Receive AI-generated workout and nutrition plans tailored to your goals.",
      icon: <Target className="text-primary" size={24} />,
    },
    {
      title: "Track Progress",
      description: "Monitor your improvements and adjust your plans as needed.",
      icon: <Heart className="text-primary" size={24} />,
    },
  ];

  return (
    <>
      <Header />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="pt-16"
      >
        <section className="relative py-20 bg-gradient-to-b from-blue-50 to-white overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Text Content */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="z-10"
              >
                <motion.h1
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="text-4xl md:text-5xl font-bold leading-tight mb-6"
                >
                  Empowering Your Fitness Journey with AI
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="text-lg text-gray-700 mb-6"
                >
                  At Swasthify, we believe in making fitness smarter and more
                  personalized. Our mission is to help everyone achieve their
                  health goals through innovative technology and data-driven
                  insights.
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="text-gray-700"
                >
                  Founded in 2023, we've already helped thousands of users
                  transform their lives through better health tracking and
                  personalized recommendations.
                </motion.p>
              </motion.div>

              {/* Image Content */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="relative h-[400px]"
              >
                <div className="absolute inset-0 justify-center flex items-center">
                  <img
                    src="https://media.gettyimages.com/id/639727810/photo/green-vegetables-on-wooden-table.jpg?s=612x612&w=0&k=20&c=LlmtC7VCJSNGJwMMdVcTc-KVQ9HJ_MsWTe-YLU6yM7o="
                    alt="Healthy vegetables"
                    className="size-3/4 object-cover rounded-2xl shadow-xl "
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Mission & Vision Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12">
              <Parallax speed={5}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7 }}
                  viewport={{ once: true }}
                  className="bg-blue-50 rounded-2xl p-8 h-full"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <Target size={28} className="text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold">Our Vision</h3>
                  </div>
                  <p className="text-gray-700 mb-6">
                    To create a world where everyone has access to personalized
                    fitness guidance powered by AI, making healthy living
                    accessible, enjoyable, and sustainable for all.
                  </p>
                  <ul className="space-y-3">
                    {[
                      "Democratize access to fitness expertise",
                      "Leverage AI to provide personalized health insights",
                      "Build a global community of health-conscious individuals",
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
                          className="text-primary mt-1 flex-shrink-0"
                        />
                        <span>{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </Parallax>

              <Parallax speed={-5}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7 }}
                  viewport={{ once: true }}
                  className="bg-green-50 rounded-2xl p-8 h-full"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-green-500/10 p-3 rounded-full">
                      <Heart size={28} className="text-green-500" />
                    </div>
                    <h3 className="text-2xl font-bold">Our Mission</h3>
                  </div>
                  <p className="text-gray-700 mb-6">
                    To empower individuals on their fitness journey by providing
                    intelligent, data-driven insights and personalized
                    recommendations that adapt to their unique needs and goals.
                  </p>
                  <ul className="space-y-3">
                    {[
                      "Develop cutting-edge AI fitness technology",
                      "Create intuitive, user-friendly experiences",
                      "Continuously improve based on user feedback",
                      "Foster a supportive community of fitness enthusiasts",
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
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-gray-50">
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
                Our Team
              </motion.span>
              <motion.h2
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-bold mb-4"
              >
                Meet the Experts Behind Swasthify
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                viewport={{ once: true }}
                className="text-gray-600 max-w-2xl mx-auto"
              >
                Our diverse team of fitness professionals, tech experts, and
                health enthusiasts is dedicated to helping you achieve your
                fitness goals.
              </motion.p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden"
                >
                  <img
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    className="w-full aspect-square object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                    <p className="text-primary font-medium mb-3">
                      {member.role}
                    </p>
                    <p className="text-gray-600">{member.bio}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
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
                className="inline-block px-4 py-1 rounded-full bg-green-50 text-green-600 font-medium text-sm mb-4"
              >
                Process
              </motion.span>
              <motion.h2
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-bold mb-4"
              >
                How Swasthify Works
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                viewport={{ once: true }}
                className="text-gray-600 max-w-2xl mx-auto"
              >
                Our simple yet powerful approach to fitness tracking and health
                improvement.
              </motion.p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true }}
              >
                <div className="grid gap-6">
                  {steps.map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      viewport={{ once: true }}
                      className="flex gap-4 bg-gray-50 p-6 rounded-xl"
                    >
                      <div className="bg-white p-3 rounded-full h-fit shadow-md">
                        {step.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-2">
                          <span className="text-primary mr-2">
                            {index + 1}.
                          </span>
                          {step.title}
                        </h3>
                        <p className="text-gray-600">{step.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true }}
                className="relative"
              >
                <Lottie
                  animationData={howItWorksAnimation}
                  loop={true}
                  className="w-full max-w-lg mx-auto"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-green-500 text-white">
          <div className="container mx-auto px-4 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-6 text-gray-900"
            >
              Join the Swasthify Community Today
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="text-gray-900 max-w-2xl mx-auto mb-8 "
            >
              Be part of a growing community of fitness enthusiasts and
              health-conscious individuals who are transforming their lives with
              Swasthify.
            </motion.p>
            <motion.button
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-black bg-white text-primary px-8 py-3 rounded-full font-medium shadow-lg"
            >
              Start Your Free Trial
            </motion.button>
          </div>
        </section>
        <Footer />
      </motion.main>
    </>
  );
};

export default AboutPage;