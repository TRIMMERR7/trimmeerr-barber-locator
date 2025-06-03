
import React from 'react';
import { motion } from 'framer-motion';

const SecurityNotice = () => {
  return (
    <motion.div 
      className="text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
        <span>🔒</span>
        <span>Secure payment powered by Stripe • Your data is protected</span>
      </p>
    </motion.div>
  );
};

export default SecurityNotice;
