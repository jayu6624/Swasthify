

import React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Lottie from "lottie-react"
import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react"
import contactAnimation from "../assets/contact-animation.json"
import Header from "../components/Header"
import Footer from "../components/Footer"
import MapContact from "../components/MapContact"

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isChatOpen, setIsChatOpen] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Form submission logic would go here
    alert("Thank you for your message! We'll get back to you soon.")
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    })
  }

  return (
    <>
    <Header/>
    <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pt-16">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-blue-50 to-white overflow-hidden">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-4xl md:text-5xl font-bold leading-tight mb-6"
            >
              We're Here to Help
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-lg text-gray-700 mb-6"
            >
              Have questions? Reach out, and we'll assist you in every step of your fitness journey.
            </motion.p>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Mail className="text-primary" size={20} />
                </div>
                <span>support@swasthify.com</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Phone className="text-primary" size={20} />
                </div>
                <span>+1 (555) 123-4567</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="bg-gray-50 rounded-2xl p-8"
            >
              <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Your Name
                  </label>
                  <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }} className="relative">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                      placeholder="John Doe"
                    />
                  </motion.div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }} className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                      placeholder="john@example.com"
                    />
                  </motion.div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                    Subject
                  </label>
                  <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }} className="relative">
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                      placeholder="How can we help?"
                    />
                  </motion.div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                    Message
                  </label>
                  <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }} className="relative">
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                      placeholder="Your message here..."
                    />
                  </motion.div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-gradient-to-r from-primary to-green-500 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 shadow-lg shadow-primary/20"
                  type="submit"
                >
                  <Send size={18} />
                  Send Message
                </motion.button>
              </form>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-2xl font-bold mb-6">Our Location</h2>
                <div className="bg-gray-50 rounded-2xl p-6 flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <MapPin className="text-primary" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">Headquarters</h3>
                    <p className="text-gray-600">
                      123 Fitness Avenue, <br />
                      San Francisco, CA 94103, <br />
                      United States
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-6">Office Hours</h2>
                <div className="bg-gray-50 rounded-2xl p-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-bold mb-2">Weekdays</h3>
                      <p className="text-gray-600">9:00 AM - 6:00 PM</p>
                    </div>
                    <div>
                      <h3 className="font-bold mb-2">Weekends</h3>
                      <p className="text-gray-600">10:00 AM - 4:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-6">Connect With Us</h2>
                <div className="bg-gray-50 rounded-2xl p-6">
                  <p className="text-gray-600 mb-4">
                    Follow us on social media for fitness tips, updates, and inspiration.
                  </p>
                  <div className="flex gap-4">
                    {["twitter", "facebook", "instagram", "youtube"].map((social) => (
                      <motion.a
                        key={social}
                        href={`https://${social}.com/swasthify`}
                        whileHover={{ y: -5 }}
                        className="bg-white p-3 rounded-full shadow-md"
                      >
                        <img src={`/placeholder.svg?height=24&width=24`} alt={social} className="w-6 h-6" />
                      </motion.a>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold">Find Us</h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden shadow-lg h-[400px] bg-white"
          >
            {/* Placeholder for Google Maps */}
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <MapContact />
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
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
              FAQ
            </motion.span>
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              Frequently Asked Questions
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
              className="text-gray-600 max-w-2xl mx-auto"
            >
              Find quick answers to common questions about Swasthify.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                question: "How does Swasthify use AI for fitness tracking?",
                answer:
                  "Swasthify uses machine learning algorithms to analyze your activity patterns, workout performance, and health metrics to provide personalized recommendations and insights tailored to your specific goals and needs.",
              },
              {
                question: "Is my health data secure with Swasthify?",
                answer:
                  "Yes, we take data security very seriously. All your health and personal data is encrypted and stored securely. We never share your information with third parties without your explicit consent.",
              },
              {
                question: "Can I use Swasthify without a fitness tracker?",
                answer:
                  "While connecting a fitness tracker enhances the experience, you can manually log your workouts, meals, and other activities directly in the app.",
              },
              {
                question: "How accurate are the calorie tracking features?",
                answer:
                  "Our calorie tracking is based on scientific formulas and machine learning models that improve over time as they learn your specific metabolism and activity patterns, making them increasingly accurate.",
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-gray-50 rounded-xl p-6"
              >
                <h3 className="text-xl font-bold mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Chat Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="bg-gradient-to-r from-primary to-green-500 text-white p-4 rounded-full shadow-lg"
        >
          <MessageSquare size={24} />
        </motion.button>

        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            className="absolute bottom-16 right-0 bg-white rounded-xl shadow-2xl w-80 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-primary to-green-500 text-white p-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold">Live Chat</h3>
                <button onClick={() => setIsChatOpen(false)}>×</button>
              </div>
              <p className="text-sm text-white/80">We typically reply in a few minutes</p>
            </div>
            <div className="p-4 h-64 bg-gray-50">
              <div className="text-center text-gray-500 h-full flex items-center justify-center">
                <p>Chat functionality would be implemented here</p>
              </div>
            </div>
            <div className="p-4 border-t">
              <input
                type="text"
                placeholder="Type your message..."
                className="w-full px-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.main>
    <Footer/>
    </>
  )
}

export default ContactPage

