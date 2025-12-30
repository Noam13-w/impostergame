import React, { useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';

export default function GameCard({ isImposter, secretWord, onCardSeen }) {
  const [hasSeenCard, setHasSeenCard] = useState(false);
  const y = useMotionValue(0);
  const rotate = useTransform(y, [-200, 0], [-15, 0]);
  const opacity = useTransform(y, [-150, -50, 0], [1, 0.5, 0]);

  const handleDragEnd = () => {
    y.set(0);
  };

  const handleDrag = (event, info) => {
    if (info.offset.y < -100 && !hasSeenCard) {
      setHasSeenCard(true);
      if (onCardSeen) onCardSeen();
    }
  };

  return (
    <div className="relative w-72 h-96 mx-auto" dir="rtl">
      {/* Secret Content Behind Card */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-cyan-500/30 flex flex-col items-center justify-center p-6 shadow-2xl shadow-cyan-500/20">
        {isImposter ? (
          <>
            <div className="text-6xl mb-4">🎭</div>
            <h2 className="text-2xl font-bold text-red-500 text-center mb-2">
              אתה האימפוסטר!
            </h2>
            <p className="text-gray-400 text-center text-sm">
              נסה לגלות את המילה הסודית מבלי להיחשף
            </p>
          </>
        ) : (
          <>
            <div className="text-6xl mb-4">✨</div>
            <p className="text-gray-400 text-sm mb-2">המילה הסודית:</p>
            <h2 className="text-3xl font-bold text-cyan-400 text-center">
              {secretWord}
            </h2>
            <p className="text-gray-500 text-center text-sm mt-4">
              אל תחשוף את המילה!
            </p>
          </>
        )}
      </div>

      {/* Cover Card - Draggable */}
      <motion.div
        className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-900 via-slate-900 to-cyan-900 border-2 border-purple-500/50 flex flex-col items-center justify-center cursor-grab active:cursor-grabbing shadow-2xl"
        style={{ y, rotate }}
        drag="y"
        dragConstraints={{ top: -200, bottom: 0 }}
        dragElastic={0.1}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
      >
        <motion.div 
          className="flex flex-col items-center"
          style={{ opacity: useTransform(y, [-100, 0], [0, 1]) }}
        >
          <div className="text-7xl mb-6">🕵️</div>
          <h3 className="text-2xl font-bold text-white mb-2">הקלף שלך</h3>
          <div className="flex items-center gap-2 text-purple-300">
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              ↑
            </motion.div>
            <span className="text-sm">גרור למעלה לחשיפה</span>
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              ↑
            </motion.div>
          </div>
        </motion.div>

        {/* Corner fold indicator */}
        <div className="absolute bottom-4 left-4 w-12 h-12">
          <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-br from-transparent via-transparent to-purple-400/30 rounded-br-2xl" />
          <motion.div
            className="absolute bottom-1 left-1 text-purple-300 text-xs"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            ↖
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}