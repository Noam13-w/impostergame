import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { gameService } from '../services/gameService';

function generateRoomCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function generatePlayerId() {
  return `player_${Math.random().toString(36).substr(2, 9)}`;
}

export default function Index() {
  const [mode, setMode] = useState(null); // 'create' | 'join'
  const [playerName, setPlayerName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleCreateRoom = async () => {
    if (!playerName.trim()) return;

    setLoading(true);
    setError('');

    try {
      const playerId = generatePlayerId();
      const code = generateRoomCode();

      const newRoom = await gameService.create({
        code: code,
        host_id: playerId,
        status: 'lobby',
        players: [{
          id: playerId,
          name: playerName.trim(),
          is_imposter: false,
          is_eliminated: false,
          has_seen_card: false
        }],
        category_votes: {},
        player_votes: {},
        rounds_survived: 0
      });

      localStorage.setItem('imposter_player_id', playerId);
      navigate(`/game/${newRoom.id}`, { state: { playerId } });
    } catch (err) {
      console.error('Error creating room:', err);
      setError('שגיאה ביצירת החדר: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinRoom = async () => {
    if (!playerName.trim() || roomCode.length !== 6) return;

    setLoading(true);
    setError('');

    try {
      const rooms = await gameService.filter({ code: roomCode.toUpperCase() });

      if (!rooms || rooms.length === 0) {
        setError('חדר לא נמצא');
        setLoading(false);
        return;
      }

      const room = rooms[0];

      if (room.status !== 'lobby') {
        setError('המשחק כבר התחיל');
        setLoading(false);
        return;
      }

      const playerId = generatePlayerId();
      const newPlayer = {
        id: playerId,
        name: playerName.trim(),
        is_imposter: false,
        is_eliminated: false,
        has_seen_card: false
      };

      console.log('Adding player to room:', room.id, newPlayer);
      const updatedRoom = await gameService.addPlayer(room.id, newPlayer);
      console.log('Updated room:', updatedRoom);

      localStorage.setItem('imposter_player_id', playerId);
      navigate(`/game/${room.id}`, { state: { playerId } });
    } catch (err) {
      console.error('Error joining room:', err);
      setError('שגיאה בהצטרפות: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Initial mode selection
  if (!mode) {
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
              onClick={() => setMode('create')}
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

  // Create room mode
  if (mode === 'create') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex flex-col items-center justify-center p-6" dir="rtl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm"
        >
          <h2 className="text-2xl font-bold text-white text-center mb-8">יצירת משחק חדש</h2>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-3 rounded-xl mb-4 text-sm text-center">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <Input
              placeholder="הכנס את שמך"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !loading && playerName.trim() && handleCreateRoom()}
              className="h-14 text-lg bg-slate-800/50 border-purple-500/30 text-white text-center rounded-xl"
              autoFocus
              disabled={loading}
            />

            <Button
              onClick={handleCreateRoom}
              disabled={!playerName.trim() || loading}
              className="w-full h-14 text-lg bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 rounded-xl disabled:opacity-50"
            >
              {loading ? 'יוצר חדר...' : 'צור חדר'}
            </Button>

            <Button
              onClick={() => { setMode(null); setError(''); }}
              variant="ghost"
              className="w-full text-gray-400 hover:text-white"
              disabled={loading}
            >
              חזרה
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Join room mode
  if (mode === 'join') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex flex-col items-center justify-center p-6" dir="rtl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm"
        >
          <h2 className="text-2xl font-bold text-white text-center mb-8">הצטרפות למשחק</h2>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-3 rounded-xl mb-4 text-sm text-center">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <Input
              placeholder="הכנס את שמך"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="h-14 text-lg bg-slate-800/50 border-purple-500/30 text-white text-center rounded-xl"
              autoFocus
              disabled={loading}
            />

            <Input
              placeholder="קוד החדר (6 תווים)"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === 'Enter' && !loading && playerName.trim() && roomCode.length === 6 && handleJoinRoom()}
              maxLength={6}
              className="h-14 text-2xl font-mono bg-slate-800/50 border-purple-500/30 text-white text-center tracking-widest rounded-xl uppercase"
              disabled={loading}
            />

            <Button
              onClick={handleJoinRoom}
              disabled={!playerName.trim() || roomCode.length !== 6 || loading}
              className="w-full h-14 text-lg bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 rounded-xl disabled:opacity-50"
            >
              {loading ? 'מצטרף...' : 'הצטרף'}
            </Button>

            <Button
              onClick={() => { setMode(null); setError(''); setRoomCode(''); }}
              variant="ghost"
              className="w-full text-gray-400 hover:text-white"
              disabled={loading}
            >
              חזרה
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return null;
}