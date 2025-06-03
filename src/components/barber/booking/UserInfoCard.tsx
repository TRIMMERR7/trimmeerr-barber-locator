
import React from 'react';
import { User } from "lucide-react";
import { motion } from 'framer-motion';

interface UserInfoCardProps {
  user: any;
}

const UserInfoCard = ({ user }: UserInfoCardProps) => {
  return (
    <motion.div 
      className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-xl border border-blue-200/30 rounded-xl p-4 shadow-lg"
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.1 }}
    >
      <div className="flex items-center gap-2 mb-2">
        <User className="w-4 h-4 text-blue-600" />
        <span className="font-medium text-blue-800">Booking For</span>
      </div>
      <p className="text-blue-700 font-medium">{user?.email}</p>
    </motion.div>
  );
};

export default UserInfoCard;
