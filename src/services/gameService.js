import { db } from "../firebase";
import { collection, addDoc, getDocs, query, where, doc, updateDoc, getDoc } from "firebase/firestore";

const ROOMS_COLLECTION = 'rooms';

export const gameService = {
    // יצירה
    create: async (data) => {
        const docRef = await addDoc(collection(db, ROOMS_COLLECTION), {
            ...data,
            created_at: new Date().toISOString()
        });
        return { id: docRef.id, ...data }; // מחזיר את ה-ID החדש
    },

    // שליפת חדר ספציפי (זה מה שהיה חסר!)
    get: async (id) => {
        const docRef = doc(db, ROOMS_COLLECTION, id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        }
        throw new Error("Room not found");
    },

    // חיפוש לפי קוד
    filter: async (criteria) => {
        const q = query(collection(db, ROOMS_COLLECTION), where("code", "==", criteria.code));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    // עדכון
    update: async (id, updates) => {
        const roomRef = doc(db, ROOMS_COLLECTION, id);
        await updateDoc(roomRef, updates);
        const updated = await getDoc(roomRef);
        return { id: updated.id, ...updated.data() };
    }
};