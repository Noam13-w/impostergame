import { db } from "../firebase";
import { collection, addDoc, getDocs, query, where, doc, updateDoc, getDoc, arrayUnion } from "firebase/firestore";

const ROOMS_COLLECTION = 'rooms';

export const gameService = {
    // יצירת חדר
    create: async (data) => {
        const docRef = await addDoc(collection(db, ROOMS_COLLECTION), {
            ...data,
            created_at: new Date().toISOString()
        });
        // חשוב: מחזירים את האובייקט עם ה-ID שנוצר ב-Firebase
        return { id: docRef.id, ...data };
    },

    // שליפת חדר ספציפי
    get: async (id) => {
        const docRef = doc(db, ROOMS_COLLECTION, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        }
        throw new Error("Room not found");
    },

    // חיפוש חדר לפי קוד (להצטרפות)
    filter: async (criteria) => {
        const q = query(collection(db, ROOMS_COLLECTION), where("code", "==", criteria.code));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    // עדכון מצב החדר
    update: async (id, updates) => {
        const roomRef = doc(db, ROOMS_COLLECTION, id);
        await updateDoc(roomRef, updates);
        const updated = await getDoc(roomRef);
        return { id: updated.id, ...updated.data() };
    },

    // הוספת שחקן בצורה בטוחה
    addPlayer: async (roomId, player) => {
        const roomRef = doc(db, ROOMS_COLLECTION, roomId);
        const roomSnap = await getDoc(roomRef);

        if (!roomSnap.exists()) {
            throw new Error("Room not found");
        }

        const currentData = roomSnap.data();
        const currentPlayers = currentData.players || [];

        // בדיקה אם השחקן כבר קיים (לפי ID)
        const playerExists = currentPlayers.some(p => p.id === player.id);
        if (playerExists) {
            return { id: roomSnap.id, ...currentData };
        }

        const updatedPlayers = [...currentPlayers, player];

        await updateDoc(roomRef, {
            players: updatedPlayers
        });

        const updated = await getDoc(roomRef);
        return { id: updated.id, ...updated.data() };
    }
};