const handleCreateRoom = async () => {
  if (!name.trim()) return;
  
  const roomCode = generateRoomCode();
  const player = {
    id: `player_${Math.random().toString(36).substr(2, 9)}`,
    name: name.trim(),
    is_imposter: false,
    is_eliminated: false,
    has_seen_card: false,
    rounds_survived: 0
  };

  try {
    // אנחנו יוצרים את החדר ומחכים לקבל את ה-ID שלו מהענן
    const newRoom = await createRoomMutation.mutateAsync({
      code: roomCode,
      host_id: player.id,
      status: 'lobby',
      players: [player],
      category_votes: {},
      player_votes: {}
    });

    // כאן התיקון: עוברים לכתובת המלאה עם ה-ID שקיבלנו
    navigate(`/game/${newRoom.id}`, { state: { playerId: player.id } });
    
  } catch (error) {
    console.error("שגיאה ביצירת חדר:", error);
  }
};