import { useState } from "react";
import { db } from "../firebase"; // tumhara Firebase config
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

const useResetResult = () => {
    const [loading, setLoading] = useState(false);

    const resetResults = async () => {
        setLoading(true);
        try {
            const gamesRef = collection(db, "games");
            const snapshot = await getDocs(gamesRef);

            const promises = snapshot.docs.map(async (gameDoc) => {
                const gameRef = doc(db, "games", gameDoc.id);
                await updateDoc(gameRef, {
                    openResult: "",
                    closeResult: ""
                });
            });

            await Promise.all(promises);

            alert("All game results have been reset!");
        } catch (error) {
            console.error("Error resetting results:", error);
            alert("Error resetting results: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return { resetResults, loading };
};

export default useResetResult;
