import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { gameService } from '../services/gameService';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Gamepad2, Users } from 'lucide-react';

export default function Index() {
  const [name, setName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const navigate = useNavigate();

  // תיקון 1: הורדנו את ה-onSuccess וה-useEffect שגרמו ללופ
  const createRoomMutation = useMutation({
    mutationFn: gameService.create
  });

  const joinRoomMutation = useMutation({
    mutationFn: gameService.filter,
    onSuccess: (rooms) => {
      if (rooms.length > 0) {
        navigate(`/game/${rooms[0].id}`, { state: { playerId: `player_${Math.random().toString(36).substr(2, 9)}` } });
      } else {
        alert("חדר לא נמצא");
      }
    }
  });

  const handleCreateRoom = async () => {
    if (!name.trim()) return;
    
    // תיקון 2: יצירה שמחכה לתשובה מ-Firebase
    try {
      const player = {
        id: `player_${Math.random().toString(36).substr(2, 9)}`,
        name: name.trim(),
        is_host: true,
        status: 'ready'
      };

      const newRoom = await createRoomMutation.mutateAsync({
        code: Math.random().toString(36).substring(2, 8).toUpperCase(),
        status: 'lobby',
        players: [player],
        created_at: new Date().toISOString()
      });

      // תיקון 3: מעבר לחדר רק כשיש לנו ID ביד
      navigate(`/game/${newRoom.id}`, { state: { playerId: player.id } });
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4" dir="rtl">
      <Card className="w-full max-w-md bg-slate-900 border-slate-800 text-slate-100">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-bold text-indigo-400 flex justify-center gap-2 items-center">
            <Gamepad2 /> המתחזה
          </CardTitle>
          <p className="text-slate-400">משחק חברה מבוסס AI</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input placeholder="שם שחקן" value={name} onChange={(e) => setName(e.target.value)} className="bg-slate-800" />
            <Button onClick={handleCreateRoom} disabled={createRoomMutation.isPending || !name} className="w-full bg-indigo-600">
              {createRoomMutation.isPending ? "יוצר..." : "צור משחק חדש"}
            </Button>
          </div>
          <div className="relative text-center text-xs text-slate-500 uppercase py-2">או הצטרף</div>
          <div className="flex gap-2">
            <Input placeholder="קוד חדר" value={roomCode} onChange={(e) => setRoomCode(e.target.value.toUpperCase())} className="bg-slate-800 text-center uppercase" />
            <Button variant="outline" onClick={() => joinRoomMutation.mutate({ code: roomCode })} disabled={!roomCode}>
              <Users className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}