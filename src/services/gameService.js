import { db } from "../firebase"; // מייבאים את החיבור לענן
import { collection, addDoc, getDocs, query, where, doc, updateDoc, getDoc } from "firebase/firestore";

const ROOMS_COLLECTION = 'rooms';

export const gameService = {
    // יצירת חדר חדש בענן
    create: async (data) => {
        const docRef = await addDoc(collection(db, ROOMS_COLLECTION), {
            ...data,
            created_at: new Date().toISOString()
        });
        return { id: docRef.id, ...data };
    },

    // חיפוש חדר לפי קוד (כדי שחברים יוכלו להצטרף)
    filter: async (criteria) => {
        const q = query(collection(db, ROOMS_COLLECTION), where("code", "==", criteria.code));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    // עדכון מצב המשחק (למשל כששחקן מצטרף)
    update: async (id, updates) => {
        const roomRef = doc(db, ROOMS_COLLECTION, id);
        await updateDoc(roomRef, updates);
        const updated = await getDoc(roomRef);
        return { id: updated.id, ...updated.data() };
    }
};