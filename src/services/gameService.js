
const STORAGE_KEY = 'imposter_game_rooms';

const getRooms = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
};

const saveRooms = (rooms) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rooms));
};

export const gameService = {
    create: async (data) => {
        const rooms = getRooms();
        const newRoom = {
            id: crypto.randomUUID(), // Use native crypto for UUID
            created_at: new Date().toISOString(),
            ...data
        };
        rooms.push(newRoom);
        saveRooms(rooms);
        return newRoom;
    },
    filter: async (criteria) => {
        const rooms = getRooms();
        return rooms.filter(room => {
            return Object.entries(criteria).every(([key, value]) => room[key] === value);
        });
    },
    update: async (id, updates) => {
        const rooms = getRooms();
        const index = rooms.findIndex(r => r.id === id);
        if (index === -1) throw new Error('Room not found');
        
        const updatedRoom = { ...rooms[index], ...updates };
        rooms[index] = updatedRoom;
        saveRooms(rooms);
        return updatedRoom;
    }
};
