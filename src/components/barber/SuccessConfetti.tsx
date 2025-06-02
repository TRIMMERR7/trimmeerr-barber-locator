
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface SuccessConfettiProps {
  show: boolean;
}

const SuccessConfetti = ({ show }: SuccessConfettiProps) => {
  const [confetti, setConfetti] = useState<Array<{ id: number; x: number; color: string; delay: number }>>([]);

  useEffect(() => {
    if (show) {
      const newConfetti = Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: ['#dc2626', '#f97316', '#eab308', '#22c55e', '#3b82f6'][Math.floor(Math.random() * 5)],
        delay: Math.random() * 0.5
      }));
      setConfetti(newConfetti);
    }
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {confetti.map((piece) => (
        <motion.div
          key={piece.id}
          initial={{ y: -20, x: `${piece.x}%`, opacity: 1, scale: 1 }}
          animate={{ 
            y: window.innerHeight + 100, 
            opacity: 0,
            scale: 0,
            rotate: 360
          }}
          transition={{ 
            duration: 3,
            delay: piece.delay,
            ease: "easeOut"
          }}
          className="absolute w-3 h-3 rounded"
          style={{ backgroundColor: piece.color }}
        />
      ))}
    </div>
  );
};

export default SuccessConfetti;
