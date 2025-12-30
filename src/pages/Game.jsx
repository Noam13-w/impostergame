import React, { useState, useEffect } from 'react';
import { gameService } from '../services/gameService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  generateRoomCode,
  generatePlayerId,
  getRandomCategories,
  getRandomWord
} from '../components/game/gameData';

import Lobby from '../components/game/Lobby';
import CategoryVote from '../components/game/CategoryVote';
import RevealPhase from '../components/game/RevealPhase';
import DiscussionPhase from '../components/game/DiscussionPhase';
import VotingPhase from '../components/game/VotingPhase';
import GameResults from '../components/game/GameResults';
import LoadingScreen from '../components/game/LoadingScreen';
import ErrorDisplay from '../components/game/ErrorBoundary';

export default function GamePage() {
  const [currentPlayerId, setCurrentPlayerId] = useState(null);
  const [currentRoomId, setCurrentRoomId] = useState(null);
  const [error, setError] = useState(null);
  const queryClient = useQueryClient();

  // Load player ID from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('imposter_player_id');
    if (stored) {
      setCurrentPlayerId(stored);
    }
  }, []);

  // Get current room data
  const { data: room, isLoading } = useQuery({
    queryKey: ['game_room', currentRoomId],
    queryFn: async () => {
      if (!currentRoomId) return null;
      const rooms = await gameService.filter({ id: currentRoomId });
      return rooms[0] || null;
    },
    enabled: !!currentRoomId,
    refetchInterval: 2000, // Poll every 2 seconds for real-time updates
  });

  const createRoomMutation = useMutation({
    mutationFn: async ({ playerName }) => {
      const roomCode = generateRoomCode();
      const playerId = generatePlayerId();

      const newRoom = await gameService.create({
        room_code: roomCode,
        host_id: playerId,
        status: 'lobby',
        players: [{
          id: playerId,
          name: playerName,
          is_imposter: false,
          is_eliminated: false,
          has_seen_card: false
        }],
        category_votes: {},
        player_votes: {},
        rounds_survived: 0
      });

      localStorage.setItem('imposter_player_id', playerId);
      setCurrentPlayerId(playerId);
      setCurrentRoomId(newRoom.id);

      return newRoom;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['game_room'] });
    }
  });

  const joinRoomMutation = useMutation({
    mutationFn: async ({ playerName, roomCode }) => {
      const rooms = await gameService.filter({ room_code: roomCode });
      if (!rooms || rooms.length === 0) {
        throw new Error('חדר לא נמצא');
      }

      const room = rooms[0];
      if (room.status !== 'lobby') {
        throw new Error('המשחק כבר התחיל');
      }

      const playerId = generatePlayerId();
      const updatedPlayers = [...(room.players || []), {
        id: playerId,
        name: playerName,
        is_imposter: false,
        is_eliminated: false,
        has_seen_card: false
      }];

      await gameService.update(room.id, {
        players: updatedPlayers
      });

      localStorage.setItem('imposter_player_id', playerId);
      setCurrentPlayerId(playerId);
      setCurrentRoomId(room.id);

      return room;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['game_room'] });
    }
  });

  const updateRoomMutation = useMutation({
    mutationFn: async ({ updates }) => {
      if (!currentRoomId) return;
      await gameService.update(currentRoomId, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['game_room'] });
    }
  });

  // Game Actions
  const handleJoin = async (playerName, roomCode, isHost) => {
    try {
      setError(null);
      if (isHost) {
        await createRoomMutation.mutateAsync({ playerName });
      } else {
        await joinRoomMutation.mutateAsync({ playerName, roomCode });
      }
    } catch (error) {
      setError(error.message || 'שגיאה בהצטרפות למשחק');
    }
  };

  const handleStartGame = async () => {
    const categories = getRandomCategories(3);
    await updateRoomMutation.mutateAsync({
      updates: {
        status: 'category_vote',
        category_options: categories,
        category_votes: {}
      }
    });
  };

  const handleCategoryVote = async (category) => {
    if (!room || !currentPlayerId) return;

    const newVotes = { ...(room.category_votes || {}), [currentPlayerId]: category };
    await updateRoomMutation.mutateAsync({
      updates: { category_votes: newVotes }
    });

    // Check if all active players voted
    const activePlayers = room.players?.filter(p => !p.is_eliminated) || [];
    if (Object.keys(newVotes).length === activePlayers.length) {
      // Count votes and pick winner
      const voteCounts = {};
      Object.values(newVotes).forEach(cat => {
        voteCounts[cat] = (voteCounts[cat] || 0) + 1;
      });

      const winningCategory = Object.entries(voteCounts)
        .sort(([, a], [, b]) => b - a)[0][0];

      const secretWord = getRandomWord(winningCategory);

      // Assign imposter randomly
      const randomIndex = Math.floor(Math.random() * activePlayers.length);
      const updatedPlayers = room.players.map((p, idx) => ({
        ...p,
        is_imposter: idx === randomIndex,
        has_seen_card: false
      }));

      await updateRoomMutation.mutateAsync({
        updates: {
          status: 'reveal',
          current_category: winningCategory,
          current_word: secretWord,
          players: updatedPlayers
        }
      });
    }
  };

  const handleCardSeen = async () => {
    if (!room || !currentPlayerId) return;

    const updatedPlayers = room.players.map(p =>
      p.id === currentPlayerId ? { ...p, has_seen_card: true } : p
    );

    await updateRoomMutation.mutateAsync({
      updates: { players: updatedPlayers }
    });

    // Check if all active players have seen their cards
    const activePlayers = updatedPlayers.filter(p => !p.is_eliminated);
    const allSeen = activePlayers.every(p => p.has_seen_card);

    if (allSeen) {
      // Pick random starting player
      const activePlayersList = activePlayers;
      const randomPlayer = activePlayersList[Math.floor(Math.random() * activePlayersList.length)];

      await updateRoomMutation.mutateAsync({
        updates: {
          status: 'discussion',
          current_player_turn: randomPlayer.id
        }
      });
    }
  };

  const handleMoveToVote = async () => {
    await updateRoomMutation.mutateAsync({
      updates: {
        status: 'voting',
        player_votes: {}
      }
    });
  };

  const handlePlayerVote = async (votedPlayerId) => {
    if (!room || !currentPlayerId) return;

    const newVotes = { ...(room.player_votes || {}), [currentPlayerId]: votedPlayerId };
    await updateRoomMutation.mutateAsync({
      updates: { player_votes: newVotes }
    });

    // Check if all active players voted
    const activePlayers = room.players?.filter(p => !p.is_eliminated) || [];
    if (Object.keys(newVotes).length === activePlayers.length) {
      // Count votes
      const voteCounts = {};
      Object.values(newVotes).forEach(playerId => {
        voteCounts[playerId] = (voteCounts[playerId] || 0) + 1;
      });

      const eliminatedPlayerId = Object.entries(voteCounts)
        .sort(([, a], [, b]) => b - a)[0][0];

      const eliminatedPlayer = room.players.find(p => p.id === eliminatedPlayerId);

      if (eliminatedPlayer?.is_imposter) {
        // Innocents win!
        await updateRoomMutation.mutateAsync({
          updates: {
            status: 'ended',
            winner: 'innocents'
          }
        });
      } else {
        // Innocent eliminated - continue game with new word
        const updatedPlayers = room.players.map(p =>
          p.id === eliminatedPlayerId
            ? { ...p, is_eliminated: true, has_seen_card: false }
            : { ...p, has_seen_card: false }
        );

        const remainingPlayers = updatedPlayers.filter(p => !p.is_eliminated);

        // Check if only imposter and one innocent left
        if (remainingPlayers.length <= 2) {
          await updateRoomMutation.mutateAsync({
            updates: {
              status: 'ended',
              winner: 'imposter',
              players: updatedPlayers
            }
          });
        } else {
          // New round - same or new category
          const newWord = getRandomWord(room.current_category);
          const newRound = (room.rounds_survived || 0) + 1;

          await updateRoomMutation.mutateAsync({
            updates: {
              status: 'reveal',
              current_word: newWord,
              players: updatedPlayers,
              rounds_survived: newRound
            }
          });
        }
      }
    }
  };

  const handleNewGame = async () => {
    const categories = getRandomCategories(3);

    // Reset all players
    const resetPlayers = room.players.map(p => ({
      ...p,
      is_imposter: false,
      is_eliminated: false,
      has_seen_card: false
    }));

    await updateRoomMutation.mutateAsync({
      updates: {
        status: 'category_vote',
        category_options: categories,
        category_votes: {},
        player_votes: {},
        rounds_survived: 0,
        winner: null,
        players: resetPlayers
      }
    });
  };

  const handleBackToLobby = async () => {
    setCurrentRoomId(null);
    setCurrentPlayerId(null);
    localStorage.removeItem('imposter_player_id');
  };

  // Get current player data
  const currentPlayer = room?.players?.find(p => p.id === currentPlayerId);
  const isHost = room?.host_id === currentPlayerId;

  // Render based on game status
  if (error) {
    return <ErrorDisplay error={error} onRetry={() => setError(null)} />;
  }

  if (isLoading && currentRoomId) {
    return <LoadingScreen message="טוען את המשחק..." />;
  }

  if (!room || room.status === 'lobby') {
    return (
      <Lobby
        room={room}
        isHost={isHost}
        currentPlayerId={currentPlayerId}
        onStartGame={handleStartGame}
        onJoin={handleJoin}
      />
    );
  }

  if (room.status === 'category_vote') {
    return (
      <CategoryVote
        categories={room.category_options}
        votes={room.category_votes}
        players={room.players}
        currentPlayerId={currentPlayerId}
        onVote={handleCategoryVote}
      />
    );
  }

  if (room.status === 'reveal') {
    const activePlayers = room.players?.filter(p => !p.is_eliminated) || [];
    const playersReady = activePlayers.filter(p => p.has_seen_card).length;

    return (
      <RevealPhase
        isImposter={currentPlayer?.is_imposter}
        secretWord={room.current_word}
        category={room.current_category}
        onCardSeen={handleCardSeen}
        onReady={handleCardSeen}
        playersReady={playersReady}
        totalPlayers={activePlayers.length}
        hasSeenCard={currentPlayer?.has_seen_card}
      />
    );
  }

  if (room.status === 'discussion') {
    const currentTurnPlayer = room.players?.find(p => p.id === room.current_player_turn);

    return (
      <DiscussionPhase
        currentPlayer={currentTurnPlayer}
        players={room.players}
        category={room.current_category}
        roundNumber={(room.rounds_survived || 0) + 1}
        isHost={isHost}
        onMoveToVote={handleMoveToVote}
      />
    );
  }

  if (room.status === 'voting') {
    return (
      <VotingPhase
        players={room.players}
        votes={room.player_votes}
        currentPlayerId={currentPlayerId}
        onVote={handlePlayerVote}
        category={room.current_category}
      />
    );
  }

  if (room.status === 'ended') {
    const imposterPlayer = room.players?.find(p => p.is_imposter);
    const eliminatedPlayer = room.players?.find(p =>
      room.player_votes &&
      Object.values(room.player_votes).filter(id => id === p.id).length > 0 &&
      p.is_imposter
    );

    return (
      <GameResults
        winner={room.winner}
        eliminatedPlayer={eliminatedPlayer}
        imposterPlayer={imposterPlayer}
        secretWord={room.current_word}
        roundsSurvived={room.rounds_survived}
        onNewGame={handleNewGame}
        onBackToLobby={handleBackToLobby}
        isHost={isHost}
      />
    );
  }

  return null;
}