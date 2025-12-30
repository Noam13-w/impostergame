import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Vote, Shield, Users } from 'lucide-react';

export default function VotingPhase({ 
  players,
  votes,
  currentPlayerId,
  onVote,
  category
}) {
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const hasVoted = votes && votes[currentPlayerId];
  
  const activePlayers = players?.filter(p => !p.is_eliminated) || [];
  
  const getVoteCount = (playerId) => {
    if (!votes) return 0;
    return Object.values(votes).filter(v => v === playerId).length;
  };

  const totalVotes = votes ? Object.keys(votes).length : 0;
  const totalActivePlayers = activePlayers.length;

  const handleVote = (playerId) => {
    if (!hasVoted && playerId !== currentPlayerId) {
      setSelectedPlayer(playerId);
      onVote(playerId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex flex-col p-6" dir="rtl">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center pt-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: 360 }}
          transition={{ type: "spring", duration: 0.8 }}
          className="inline-block mb-4"
        >
          <Vote className="w-16 h-16 text-red-500 mx-auto" />
        </motion.div>
        
        <h1 className="text-3xl font-bold text-white mb-2">הצבעה!</h1>
        <p className="text-gray-400">מי האימפוסטר?</p>
        
        <div className="bg-slate-800/50 rounded-full px-4 py-2 inline-block mt-4">
          <span className="text-purple-300">קטגוריה: </span>
          <span className="text-cyan-400 font-bold">{category}</span>
        </div>

        <div className="flex items-center justify-center gap-2 mt-4 text-purple-300">
          <Users className="w-4 h-4" />
          <span>{totalVotes} / {totalActivePlayers} הצביעו</span>
        </div>
      </motion.div>

      <div className="flex-1 my-8">
        <div className="grid gap-3">
          {activePlayers.map((player, index) => {
            const voteCount = getVoteCount(player.id);
            const isSelected = selectedPlayer === player.id || votes?.[currentPlayerId] === player.id;
            const canVote = player.id !== currentPlayerId && !hasVoted;
            
            return (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Button
                  onClick={() => handleVote(player.id)}
                  disabled={!canVote}
                  className={`w-full h-20 rounded-2xl transition-all relative overflow-hidden ${
                    player.id === currentPlayerId
                      ? 'bg-slate-700/50 border-2 border-slate-600 cursor-not-allowed opacity-50'
                      : isSelected
                      ? 'bg-gradient-to-r from-red-600 to-orange-600 border-2 border-orange-400'
                      : 'bg-slate-800/50 border-2 border-purple-500/30 hover:border-red-500/60 text-white hover:bg-slate-700/50'
                  }`}
                >
                  <div className="flex items-center justify-between w-full px-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                        player.id === currentPlayerId 
                          ? 'bg-slate-600'
                          : 'bg-gradient-to-br from-purple-500 to-cyan-500'
                      }`}>
                        {player.name[0]}
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-lg">{player.name}</div>
                        {player.id === currentPlayerId && (
                          <div className="text-xs text-gray-400 flex items-center gap-1">
                            <Shield className="w-3 h-3" />
                            זה אתה
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {voteCount > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex items-center gap-2"
                      >
                        <span className="text-sm bg-white/20 px-3 py-1 rounded-full font-bold">
                          {voteCount} 🗳️
                        </span>
                      </motion.div>
                    )}
                  </div>
                </Button>
              </motion.div>
            );
          })}
        </div>
      </div>

      {hasVoted && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="pb-8"
        >
          <div className="bg-slate-800/30 rounded-xl p-4 text-center">
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-purple-300"
            >
              ההצבעה שלך נספרה! ממתינים לשאר השחקנים...
            </motion.div>
          </div>
        </motion.div>
      )}

      {!hasVoted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="pb-8"
        >
          <div className="bg-orange-900/30 rounded-xl p-4 border border-orange-500/30">
            <p className="text-orange-300 text-sm text-center">
              ⚠️ לא ניתן לבחור בעצמך
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}