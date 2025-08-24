"use client"

import { motion } from "framer-motion"
import { Check } from "lucide-react"

/**
 * @typedef {Object} PricingCardProps
 * @property {Object} plan
 * @property {string} plan.name
 * @property {string} plan.price
 * @property {string} [plan.period]
 * @property {string[]} plan.features
 * @property {string} plan.cta
 * @property {boolean} plan.popular
 * @property {number} index
 */

/**
 * @param {PricingCardProps} props
 */
const PricingCard = ({ plan, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      className={`rounded-xl p-6 border ${
        plan.popular ? "border-primary bg-primary/5 shadow-xl shadow-primary/10" : "border-gray-200 bg-white"
      }`}
    >
      {plan.popular && (
        <div className="bg-primary text-white text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full inline-block mb-4">
          Most Popular
        </div>
      )}
      <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
      <div className="mb-6">
        <span className="text-4xl font-bold">{plan.price}</span>
        {plan.period && <span className="text-gray-500">/{plan.period}</span>}
      </div>
      <ul className="space-y-3 mb-8">
        {plan.features.map((feature, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 + i * 0.05, duration: 0.5 }}
            viewport={{ once: true }}
            className="flex items-start gap-3"
          >
            <Check size={18} className={`mt-0.5 ${plan.popular ? "text-primary" : "text-green-500"}`} />
            <span>{feature}</span>
          </motion.li>
        ))}
      </ul>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`w-full py-3 rounded-lg font-medium ${
          plan.popular
            ? "bg-green-500 from-primary  text-white"
            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
        }`}
      >
        {plan.cta}
      </motion.button>
    </motion.div>
  )
}

export default PricingCard

