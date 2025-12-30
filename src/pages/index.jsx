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
  const [roomCodeInput, setRoomCodeInput] = useState('');
  const navigate = useNavigate();

  // יצירת חדר
  const createRoomMutation = useMutation({
    mutationFn: gameService.create
    // הורדתי מכאן את ה-onSuccess כדי למנוע את הבאג של הניווט הכפול
  });

  // הצטרפות לחדר
  const joinRoomMutation = useMutation({
    mutationFn: gameService.filter,
    onSuccess: (rooms) => {
      if (rooms.length > 0) {
        // אם נמצא חדר - נכנסים אליו עם ID של שחקן חדש
        const playerId = `player_${Math.random().toString(36).substr(2, 9)}`;
        navigate(`/game/${rooms[0].id}`, { state: { playerId } });
      } else {
        alert("חדר לא נמצא - בדוק את הקוד");
      }
    },
    onError: (error) => {
      console.error("Error joining room:", error);
      alert("שגיאה בהצטרפות לחדר");
    }
  });

  const handleCreateRoom = async () => {
    if (!name.trim()) return;
    
    // יצירת קוד חדר רנדומלי (6 תווים)
    const generatedCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    // יצירת השחקן המארח
    const hostPlayer = {
      id: `player_${Math.random().toString(36).substr(2, 9)}`,
      name: name.trim(),
      is_host: true,
      is_imposter: false,
      is_eliminated: false,
      status: 'ready'
    };

    try {
      // 1. יוצרים את החדר ב-Firebase ומחכים לתשובה
      const newRoom = await createRoomMutation.mutateAsync({
        code: generatedCode,
        status: 'lobby',
        players: [hostPlayer],
        category_votes: {},
        player_votes: {},
        created_at: new Date().toISOString()
      });

      // 2. רק אחרי שקיבלנו תשובה עם ID - עוברים לחדר
      console.log("Room created with ID:", newRoom.id); // לוג לבדיקה
      navigate(`/game/${newRoom.id}`, { state: { playerId: hostPlayer.id } });
      
    } catch (err) {
      console.error("Failed to create room:", err);
      alert("שגיאה ביצירת החדר. ודא שקובץ firebase.js מוגדר נכון.");
    }
  };

  const handleJoinRoom = () => {
    if (!name.trim() || !roomCodeInput.trim()) return;
    joinRoomMutation.mutate({ code: roomCodeInput.toUpperCase() });
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4" dir="rtl">
      <Card className="w-full max-w-md bg-slate-900 border-slate-800 text-slate-100">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="p-3 bg-indigo-500/10 rounded-2xl">
              <Gamepad2 className="w-12 h-12 text-indigo-500" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            המתחזה
          </CardTitle>
          <p className="text-slate-400 text-sm">משחק חברה מבוסס בינה מלאכותית</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
              <User className="w-4 h-4" /> השם שלך
            </label>
            <Input
              placeholder="איך יקראו לך?"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-slate-800/50 border-slate-700 focus:ring-indigo-500 text-lg py-6"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 pt-2">
            <Button 
              onClick={handleCreateRoom}
              disabled={createRoomMutation.isPending || !name}
              className="bg-indigo-600 hover:bg-indigo-700 text-white py-6 text-lg font-semibold transition-all hover:scale-[1.02]"
            >
              {createRoomMutation.isPending ? "יוצר חדר..." : "צור משחק חדש"}
            </Button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-800"></span></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-slate-900 px-2 text-slate-500">או הצטרף לחברים</span></div>
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="קוד חדר"
                value={roomCodeInput}
                onChange={(e) => setRoomCodeInput(e.target.value)}
                className="bg-slate-800/50 border-slate-700 uppercase font-mono tracking-widest text-center py-6"
              />
              <Button 
                variant="outline"
                onClick={handleJoinRoom}
                disabled={joinRoomMutation.isPending || !name || !roomCodeInput}
                className="border-slate-700 hover:bg-slate-800 px-8 py-6"
              >
                <Users className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}