import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Copy, Check, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import QRCodeDisplay from './QRCodeDisplay';

export default function Lobby({ 
  room, 
  isHost, 
  currentPlayerId,
  onStartGame,
  onJoin 
}) {
  const [playerName, setPlayerName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [mode, setMode] = useState(null); // 'host' | 'join'

  const copyCode = () => {
    navigator.clipboard.writeText(room?.room_code || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Initial screen - choose mode
  if (!room && !mode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex flex-col items-center justify-center p-6" dir="rtl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 mb-4">
            אימפוסטר
          </h1>
          <p className="text-gray-400">מי מסתתר ביניכם?</p>
        </motion.div>

        <div className="flex flex-col gap-4 w-full max-w-xs">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Button
              onClick={() => setMode('host')}
              className="w-full h-16 text-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 border-0 rounded-2xl"
            >
              יצירת משחק חדש
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Button
              onClick={() => setMode('join')}
              variant="outline"
              className="w-full h-16 text-xl border-2 border-purple-500/50 text-purple-300 hover:bg-purple-500/20 rounded-2xl"
            >
              הצטרפות למשחק
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  // Host - enter name to create room
  if (mode === 'host' && !room) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex flex-col items-center justify-center p-6" dir="rtl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm"
        >
          <h2 className="text-2xl font-bold text-white text-center mb-8">יצירת משחק חדש</h2>
          
          <div className="space-y-4">
            <Input
              placeholder="הכנס את שמך"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && playerName.trim() && onJoin(playerName, null, true)}
              className="h-14 text-lg bg-slate-800/50 border-purple-500/30 text-white text-center rounded-xl"
              autoFocus
            />
            
            <Button
              onClick={() => onJoin(playerName, null, true)}
              disabled={!playerName.trim()}
              className="w-full h-14 text-lg bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 rounded-xl"
            >
              צור חדר
            </Button>
            
            <Button
              onClick={() => setMode(null)}
              variant="ghost"
              className="w-full text-gray-400 hover:text-white"
            >
              חזרה
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Join - enter name and code
  if (mode === 'join' && !room) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex flex-col items-center justify-center p-6" dir="rtl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm"
        >
          <h2 className="text-2xl font-bold text-white text-center mb-8">הצטרפות למשחק</h2>
          
          <div className="space-y-4">
            <Input
              placeholder="הכנס את שמך"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="h-14 text-lg bg-slate-800/50 border-purple-500/30 text-white text-center rounded-xl"
              autoFocus
            />
            
            <Input
              placeholder="קוד החדר"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === 'Enter' && playerName.trim() && roomCode.length === 6 && onJoin(playerName, roomCode, false)}
              maxLength={6}
              className="h-14 text-2xl font-mono bg-slate-800/50 border-purple-500/30 text-white text-center tracking-widest rounded-xl"
            />
            
            <Button
              onClick={() => onJoin(playerName, roomCode, false)}
              disabled={!playerName.trim() || roomCode.length !== 6}
              className="w-full h-14 text-lg bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 rounded-xl"
            >
              הצטרף
            </Button>
            
            <Button
              onClick={() => setMode(null)}
              variant="ghost"
              className="w-full text-gray-400 hover:text-white"
            >
              חזרה
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  // In Lobby - waiting for players
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex flex-col p-6" dir="rtl">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center pt-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">חדר משחק</h1>
        
        {/* Room Code Display */}
        <div className="mt-6 bg-slate-800/50 rounded-2xl p-6 border border-purple-500/30">
          <p className="text-gray-400 text-sm mb-2">קוד החדר:</p>
          <div className="flex items-center justify-center gap-3">
            <span className="text-4xl font-mono font-bold text-cyan-400 tracking-widest">
              {room?.room_code}
            </span>
            <Button
              onClick={copyCode}
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-white"
            >
              {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
            </Button>
          </div>
          
          <Button
            onClick={() => setShowQR(!showQR)}
            variant="ghost"
            className="mt-4 text-purple-300 hover:text-purple-200"
          >
            <QrCode className="w-4 h-4 ml-2" />
            {showQR ? 'הסתר QR' : 'הצג QR'}
          </Button>
          
          {showQR && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-4"
            >
              <QRCodeDisplay code={room?.room_code} />
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Players List */}
      <div className="flex-1 mt-8">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-purple-400" />
          <h2 className="text-lg font-semibold text-white">
            שחקנים ({room?.players?.length || 0})
          </h2>
        </div>
        
        <div className="grid gap-3">
          {room?.players?.map((player, index) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-slate-800/50 rounded-xl p-4 border ${
                player.id === room.host_id 
                  ? 'border-yellow-500/50' 
                  : 'border-purple-500/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white font-bold">
                    {player.name[0]}
                  </div>
                  <span className="text-white font-medium">{player.name}</span>
                </div>
                {player.id === room.host_id && (
                  <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full">
                    מארח
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Start Game Button (Host Only) */}
      {isHost && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-auto pt-6"
        >
          <Button
            onClick={onStartGame}
            disabled={(room?.players?.length || 0) < 3}
            className="w-full h-16 text-xl bg-gradient-to-r from-green-600 to-cyan-600 hover:from-green-500 hover:to-cyan-500 rounded-2xl disabled:opacity-50"
          >
            {(room?.players?.length || 0) < 3 
              ? `נדרשים לפחות 3 שחקנים (${room?.players?.length || 0}/3)`
              : 'התחל משחק!'
            }
          </Button>
        </motion.div>
      )}

      {!isHost && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-auto pt-6 text-center"
        >
          <div className="bg-slate-800/30 rounded-xl p-4">
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-purple-300"
            >
              ממתינים שהמארח יתחיל את המשחק...
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  );
}