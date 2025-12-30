import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { gameService } from '../services/gameService';
// הסרנו את כל הייבואים של ה-components כדי למנוע קריסות

export default function Index() {
  const [name, setName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [errorMsg, setErrorMsg] = useState(''); // להציג שגיאות למשתמש
  const navigate = useNavigate();

  const createRoomMutation = useMutation({
    mutationFn: gameService.create
  });

  const joinRoomMutation = useMutation({
    mutationFn: gameService.filter,
    onSuccess: (rooms) => {
      if (rooms.length > 0) {
        navigate(`/game/${rooms[0].id}`, { state: { playerId: `player_${Math.random().toString(36).substr(2, 9)}` } });
      } else {
        setErrorMsg("חדר לא נמצא");
      }
    },
    onError: (err) => setErrorMsg("שגיאה בהצטרפות: " + err.message)
  });

  const handleCreateRoom = async () => {
    if (!name.trim()) return;
    setErrorMsg(''); // ניקוי שגיאות קודמות

    try {
      const player = {
        id: `player_${Math.random().toString(36).substr(2, 9)}`,
        name: name.trim(),
        is_host: true,
        status: 'ready'
      };

      // שלב 1: יצירה ב-Firebase
      const newRoom = await createRoomMutation.mutateAsync({
        code: Math.random().toString(36).substring(2, 8).toUpperCase(),
        status: 'lobby',
        players: [player],
        created_at: new Date().toISOString()
      });

      // שלב 2: מעבר לדף המשחק רק אם קיבלנו ID
      if (newRoom && newRoom.id) {
        navigate(`/game/${newRoom.id}`, { state: { playerId: player.id } });
      } else {
        setErrorMsg("שגיאה: לא התקבל מזהה חדר מהשרת");
      }

    } catch (err) {
      console.error("Critical Error:", err);
      setErrorMsg("תקלה ביצירת החדר: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 text-white" dir="rtl">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
        
        {/* כותרת */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-400 mb-2">המתחזה</h1>
          <p className="text-slate-400">משחק חברה מבוסס AI</p>
        </div>

        {/* הודעות שגיאה */}
        {errorMsg && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-3 rounded mb-4 text-sm text-center">
            {errorMsg}
          </div>
        )}

        <div className="space-y-4">
          {/* שדה שם */}
          <div>
            <input
              type="text"
              placeholder="השם שלך"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded p-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* כפתור יצירה */}
          <button
            onClick={handleCreateRoom}
            disabled={createRoomMutation.isPending || !name}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded transition-colors"
          >
            {createRoomMutation.isPending ? "יוצר חדר..." : "צור משחק חדש"}
          </button>

          <div className="text-center text-slate-500 text-sm py-2">- או -</div>

          {/* הצטרפות */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="קוד חדר"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              className="flex-1 bg-slate-800 border border-slate-700 rounded p-3 text-center uppercase tracking-widest focus:outline-none focus:border-indigo-500"
            />
            <button
              onClick={() => joinRoomMutation.mutate({ code: roomCode })}
              disabled={!roomCode}
              className="bg-slate-700 hover:bg-slate-600 text-white px-6 rounded transition-colors"
            >
              הצטרף
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}