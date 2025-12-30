import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { MessageCircle, Vote } from 'lucide-react';

export default function DiscussionPhase({ 
  currentPlayer,
  players,
  category,
  roundNumber,
  isHost,
  onMoveToVote
}) {
  const activePlayers = players?.filter(p => !p.is_eliminated) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex flex-col p-6" dir="rtl">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center pt-8"
      >
        <div className="flex justify-center gap-4 mb-6">
          <div className="bg-slate-800/50 rounded-full px-4 py-2">
            <span className="text-purple-300">סיבוב: </span>
            <span className="text-cyan-400 font-bold">{roundNumber}</span>
          </div>
          <div className="bg-slate-800/50 rounded-full px-4 py-2">
            <span className="text-purple-300">קטגוריה: </span>
            <span className="text-cyan-400 font-bold">{category}</span>
          </div>
        </div>

        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="bg-gradient-to-br from-purple-900/50 to-cyan-900/50 rounded-3xl p-8 border border-purple-500/30"
        >
          <MessageCircle className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">דיון במשחק</h1>
          
          {currentPlayer && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6"
            >
              <p className="text-gray-400 mb-2">השחקן הנוכחי:</p>
              <div className="bg-slate-800/50 rounded-xl p-4 inline-block">
                <span className="text-2xl font-bold text-cyan-400">{currentPlayer.name}</span>
                <span className="text-purple-300 mr-2">מתחיל!</span>
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      {/* Players List */}
      <div className="flex-1 mt-8">
        <h2 className="text-lg font-semibold text-white mb-4">שחקנים פעילים:</h2>
        <div className="grid grid-cols-2 gap-3">
          {activePlayers.map((player, index) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-slate-800/50 rounded-xl p-4 border ${
                player.id === currentPlayer?.id 
                  ? 'border-cyan-500/50 bg-cyan-900/20' 
                  : 'border-purple-500/20'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                  {player.name[0]}
                </div>
                <span className="text-white font-medium">{player.name}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Discussion Tips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-slate-800/30 rounded-xl p-4 my-6"
      >
        <h3 className="text-purple-300 font-semibold mb-2">💡 טיפ:</h3>
        <p className="text-gray-400 text-sm">
          שאלו שאלות שקשורות לקטגוריה. נסו לזהות מי לא יודע את המילה הסודית!
        </p>
      </motion.div>

      {/* Move to Vote Button (Host Only) */}
      {isHost && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="pb-8"
        >
          <Button
            onClick={onMoveToVote}
            className="w-full h-16 text-xl bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 rounded-2xl"
          >
            <Vote className="w-6 h-6 ml-2" />
            מעבר להצבעה
          </Button>
        </motion.div>
      )}

      {!isHost && (
        <div className="pb-8 text-center">
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-purple-300"
          >
            המארח יעביר להצבעה כשהדיון יסתיים...
          </motion.div>
        </div>
      )}
    </div>
  );
}