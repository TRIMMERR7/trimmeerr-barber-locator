
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";

interface AnimatedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const AnimatedButton = ({ children, onClick, disabled, className, variant, size }: AnimatedButtonProps) => {
  return (
    <motion.div
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <Button
        onClick={onClick}
        disabled={disabled}
        className={className}
        variant={variant}
        size={size}
      >
        {children}
      </Button>
    </motion.div>
  );
};

export default AnimatedButton;
