"use client"

import { motion } from "framer-motion"
import { Star } from "lucide-react"

const TestimonialCard = ({ testimonial, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
    >
      <div className="flex items-center gap-4 mb-4">
        <img
          src={testimonial.image || "/placeholder.svg"}
          alt={testimonial.name}
          className="w-16 h-16 rounded-full object-cover border-2 border-primary"
        />
        <div>
          <h3 className="font-bold">{testimonial.name}</h3>
          <p className="text-gray-500 text-sm">{testimonial.role}</p>
        </div>
      </div>
      <p className="text-gray-700 mb-4">"{testimonial.quote}"</p>
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={18}
            className={i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
          />
        ))}
      </div>
    </motion.div>
  )
}

export default TestimonialCard

