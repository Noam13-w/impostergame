import React from 'react';
import { motion } from 'framer-motion';

export default function LoadingScreen({ message = 'טוען...' }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex flex-col items-center justify-center" dir="rtl">
      <motion.div
        animate={{
          rotate: 360,
          scale: [1, 1.2, 1]
        }}
        transition={{
          rotate: { repeat: Infinity, duration: 2, ease: "linear" },
          scale: { repeat: Infinity, duration: 1.5, ease: "easeInOut" }
        }}
        className="text-7xl mb-6"
      >
        🎭
      </motion.div>
      
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="text-xl text-purple-300"
      >
        {message}
      </motion.div>

      {/* Animated dots */}
      <div className="flex gap-2 mt-4">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -10, 0] }}
            transition={{
              repeat: Infinity,
              duration: 0.6,
              delay: i * 0.2
            }}
            className="w-2 h-2 rounded-full bg-cyan-400"
          />
        ))}
      </div>
    </div>
  );
}