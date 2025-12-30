import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import GameCard from './GameCard';
import { Button } from '@/components/ui/button';

export default function RevealPhase({ 
  isImposter, 
  secretWord, 
  category,
  onCardSeen,
  onReady,
  playersReady,
  totalPlayers,
  hasSeenCard
}) {
  const [timeLeft, setTimeLeft] = useState(20);
  const [cardRevealed, setCardRevealed] = useState(false);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handleCardSeen = () => {
    setCardRevealed(true);
    if (onCardSeen) onCardSeen();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex flex-col p-6" dir="rtl">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center pt-8"
      >
        <div className="bg-slate-800/50 rounded-full px-4 py-2 inline-block mb-4">
          <span className="text-purple-300">קטגוריה: </span>
          <span className="text-cyan-400 font-bold">{category}</span>
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-2">חשוף את הקלף שלך!</h1>
        <p className="text-gray-400 text-sm">גרור את הקלף למעלה בזהירות</p>
        
        {/* Timer */}
        <motion.div 
          className={`mt-4 text-4xl font-bold ${
            timeLeft <= 5 ? 'text-red-500' : 'text-cyan-400'
          }`}
          animate={timeLeft <= 5 ? { scale: [1, 1.1, 1] } : {}}
          transition={{ repeat: Infinity, duration: 0.5 }}
        >
          {timeLeft}
        </motion.div>
      </motion.div>

      <div className="flex-1 flex items-center justify-center py-8">
        <GameCard
          isImposter={isImposter}
          secretWord={secretWord}
          onCardSeen={handleCardSeen}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="pb-8"
      >
        <div className="text-center text-gray-400 text-sm mb-4">
          {playersReady} / {totalPlayers} שחקנים מוכנים
        </div>
        
        <Button
          onClick={onReady}
          disabled={!cardRevealed || hasSeenCard}
          className={`w-full h-14 text-lg rounded-2xl ${
            cardRevealed && !hasSeenCard
              ? 'bg-gradient-to-r from-green-600 to-cyan-600 hover:from-green-500 hover:to-cyan-500'
              : 'bg-slate-700 cursor-not-allowed'
          }`}
        >
          {hasSeenCard ? 'ממתין לשאר השחקנים...' : cardRevealed ? 'ראיתי את הקלף!' : 'גלה קודם את הקלף'}
        </Button>
      </motion.div>
    </div>
  );
}