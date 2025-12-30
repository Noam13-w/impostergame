import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Trophy, Skull, Target, RotateCcw } from 'lucide-react';

export default function GameResults({ 
  winner,
  eliminatedPlayer,
  imposterPlayer,
  secretWord,
  roundsSurvived,
  onNewGame,
  onBackToLobby,
  isHost
}) {
  const imposterWon = winner === 'imposter';
  const innocentsWon = winner === 'innocents';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex flex-col items-center justify-center p-6" dir="rtl">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", duration: 1 }}
        className="text-center"
      >
        {/* Winner Icon */}
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 2,
            ease: "easeInOut"
          }}
          className="mb-6"
        >
          {imposterWon ? (
            <div className="text-8xl">🎭</div>
          ) : (
            <Trophy className="w-24 h-24 text-yellow-400 mx-auto" />
          )}
        </motion.div>

        {/* Main Result */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className={`text-4xl font-black mb-4 ${
            imposterWon ? 'text-red-500' : 'text-green-500'
          }`}>
            {imposterWon ? 'האימפוסטר ניצח!' : 'התמימים ניצחו!'}
          </h1>

          {innocentsWon && eliminatedPlayer && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-green-900/30 rounded-2xl p-6 border border-green-500/30 mb-6"
            >
              <Skull className="w-12 h-12 text-green-400 mx-auto mb-3" />
              <p className="text-green-300 text-xl mb-2">האימפוסטר נתפס!</p>
              <div className="bg-slate-800/50 rounded-xl p-3 inline-block">
                <span className="text-2xl font-bold text-red-400">{eliminatedPlayer.name}</span>
              </div>
            </motion.div>
          )}

          {imposterWon && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-red-900/30 rounded-2xl p-6 border border-red-500/30 mb-6"
            >
              <p className="text-red-300 text-xl mb-3">האימפוסטר היה:</p>
              <div className="bg-slate-800/50 rounded-xl p-3 inline-block mb-4">
                <span className="text-2xl font-bold text-red-400">{imposterPlayer?.name}</span>
              </div>
              {roundsSurvived > 0 && (
                <div className="flex items-center justify-center gap-2 text-purple-300">
                  <Target className="w-5 h-5" />
                  <span>שרד {roundsSurvived} {roundsSurvived === 1 ? 'סיבוב' : 'סיבובים'}!</span>
                </div>
              )}
            </motion.div>
          )}

          {/* Secret Word Reveal */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="bg-cyan-900/30 rounded-2xl p-6 border border-cyan-500/30 mb-8"
          >
            <p className="text-cyan-300 text-lg mb-2">המילה הסודית הייתה:</p>
            <div className="bg-slate-800/50 rounded-xl p-4 inline-block">
              <span className="text-3xl font-bold text-cyan-400">{secretWord}</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="space-y-4 w-full max-w-sm"
        >
          {isHost && (
            <Button
              onClick={onNewGame}
              className="w-full h-14 text-lg bg-gradient-to-r from-green-600 to-cyan-600 hover:from-green-500 hover:to-cyan-500 rounded-2xl"
            >
              <RotateCcw className="w-5 h-5 ml-2" />
              משחק חדש
            </Button>
          )}
          
          <Button
            onClick={onBackToLobby}
            variant="outline"
            className="w-full h-14 text-lg border-2 border-purple-500/50 text-purple-300 hover:bg-purple-500/20 rounded-2xl"
          >
            חזרה ללובי
          </Button>
        </motion.div>

        {!isHost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-6 text-gray-400 text-sm"
          >
            המארח יכול להתחיל משחק חדש
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}