import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Check, Users } from 'lucide-react';

export default function CategoryVote({ 
  categories, 
  votes, 
  players,
  currentPlayerId,
  onVote 
}) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const hasVoted = votes && votes[currentPlayerId];
  
  const getVoteCount = (category) => {
    if (!votes) return 0;
    return Object.values(votes).filter(v => v === category).length;
  };

  const totalVotes = votes ? Object.keys(votes).length : 0;
  const totalPlayers = players?.filter(p => !p.is_eliminated).length || 0;

  const handleVote = (category) => {
    if (!hasVoted) {
      setSelectedCategory(category);
      onVote(category);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex flex-col p-6" dir="rtl">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center pt-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">בחירת קטגוריה</h1>
        <p className="text-gray-400">הצביעו לקטגוריה המועדפת עליכם</p>
        
        <div className="flex items-center justify-center gap-2 mt-4 text-purple-300">
          <Users className="w-4 h-4" />
          <span>{totalVotes} / {totalPlayers} הצביעו</span>
        </div>
      </motion.div>

      <div className="flex-1 flex flex-col justify-center gap-4 my-8">
        {categories?.map((category, index) => {
          const voteCount = getVoteCount(category);
          const isSelected = selectedCategory === category || votes?.[currentPlayerId] === category;
          
          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.15 }}
            >
              <Button
                onClick={() => handleVote(category)}
                disabled={hasVoted}
                className={`w-full h-20 text-2xl rounded-2xl transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-purple-600 to-cyan-600 border-2 border-cyan-400'
                    : 'bg-slate-800/50 border-2 border-purple-500/30 hover:border-purple-500/60 text-white'
                }`}
              >
                <div className="flex items-center justify-between w-full px-4">
                  <span>{category}</span>
                  <div className="flex items-center gap-2">
                    {voteCount > 0 && (
                      <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                        {voteCount} קולות
                      </span>
                    )}
                    {isSelected && <Check className="w-6 h-6" />}
                  </div>
                </div>
              </Button>
            </motion.div>
          );
        })}
      </div>

      {hasVoted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center pb-8"
        >
          <div className="bg-slate-800/30 rounded-xl p-4">
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-purple-300"
            >
              ממתינים לשאר השחקנים...
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  );
}