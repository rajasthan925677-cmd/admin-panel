import { collection, query, where, getDocs, updateDoc, doc, writeBatch, increment } from 'firebase/firestore';
import { db } from '../firebase';

export const declareResultService = async (gameName, resultType, resultDate, resultValue) => {
  

  // 1. Fetch game document
  const gameQuery = query(collection(db, 'games'), where('gameName', '==', gameName));
  const gameSnapshot = await getDocs(gameQuery);

  let gameDocId = null;
  let gameData = null;
  gameSnapshot.forEach((doc) => {
    gameDocId = doc.id;
    gameData = doc.data();
  });

  if (!gameDocId) {
    throw new Error('Game not found');
  }

  const gameDocRef = doc(db, 'games', gameDocId);

  // 2. Update game result fields (overwrite existing)
  const updateData = resultType === 'openResult' ?
    { openResult: String(resultValue), openResultDate: resultDate } : // Save as string
    { closeResult: String(resultValue), closeResultDate: resultDate }; // Save as string

  await updateDoc(gameDocRef, updateData);
  

  // 3. Fetch updated game data after update
  const updatedGameDoc = await getDocs(gameQuery);
  updatedGameDoc.forEach((doc) => {
    gameData = doc.data();
  });
  // 4. Process regular bids (Single Ank, Single Pana, DoublePana, Triple Pana)
  const sessionType = resultType === 'openResult' ? 'Open' : 'Close';
  const bidsQuery = query(
    collection(db, 'bids'),
    where('gameId', '==', gameName),
    where('date', '==', resultDate)
  );

  const bidsSnapshot = await getDocs(bidsQuery);
  
  const batch = writeBatch(db);

  bidsSnapshot.forEach((bidDoc) => {
    const bidData = bidDoc.data();
    
    const userRef = doc(db, 'users', bidData.userId);
    const bidRef = doc(db, 'bids', bidDoc.id);

    // Skip if not matching session for non-Jodi bids
    if (bidData.gameType !== 'Jodi' && bidData.session !== sessionType) {
      return;
    }

    const currentStatus = bidData.status || 'pending';
    const oldPayout = bidData.payoutAmount || 0;

    let newIsWin = false;
    let newMultiplier = 0;
    let newPayout = 0;

    // Process non-Jodi bids
    if (bidData.gameType !== 'Jodi') {
      if (bidData.gameType === 'Single Ank') {
        const resultSum = [...String(resultValue)].reduce((a, b) => Number(a) + Number(b), 0);
        const lastDigit = resultSum % 10;
        if (lastDigit === bidData.bidDigit) {
          newIsWin = true;
          newMultiplier = 9.5;
        }
      } else if (bidData.gameType === 'Single Pana') {
        if (Number(bidData.bidDigit) === Number(resultValue)) {
          newIsWin = true;
          newMultiplier = 150;
        }
      } else if (bidData.gameType === 'DoublePana') {
        if (Number(bidData.bidDigit) === Number(resultValue)) {
          newIsWin = true;
          newMultiplier = 300;
        }
      } else if (bidData.gameType === 'Triple Pana') {
        if (Number(bidData.bidDigit) === Number(resultValue)) {
          newIsWin = true;
          newMultiplier = 900;
        }
      }

      if (newIsWin) {
        newPayout = Number(bidData.bidAmount) * newMultiplier;
      }

      // Handle wallet updates for non-Jodi bids
      if (currentStatus === 'pending') {
        if (newIsWin) {
          batch.update(userRef, { balance: increment(newPayout) });
        }
      } else if (currentStatus === 'win') {
        if (!newIsWin) {
          batch.update(userRef, { balance: increment(-oldPayout) });
        }
      } else if (currentStatus === 'loss') {
        if (newIsWin) {
          batch.update(userRef, { balance: increment(newPayout) });
        }
      }

      const newStatus = newIsWin ? 'win' : 'loss';
      batch.update(bidRef, {
        status: newStatus,
        payoutAmount: newPayout
      });
    }
  });

  // 5. Process Jodi bids only if both openResult and closeResult are available
  if (gameData.openResult && gameData.closeResult && gameData.openResultDate === gameData.closeResultDate) {
   
    bidsSnapshot.forEach((bidDoc) => {
      const bidData = bidDoc.data();
      if (bidData.gameType !== 'Jodi' || bidData.session !== 'Open') {
        return;
      }

      const userRef = doc(db, 'users', bidData.userId);
      const bidRef = doc(db, 'bids', bidDoc.id);

      const currentStatus = bidData.status || 'pending';
      const oldPayout = bidData.payoutAmount || 0;

      // Calculate Jodi result
      const openSum = [...String(gameData.openResult)].reduce((a, b) => Number(a) + Number(b), 0);
      const closeSum = [...String(gameData.closeResult)].reduce((a, b) => Number(a) + Number(b), 0);
      const jodiResultStr = `${openSum % 10}${closeSum % 10}`; // String "04"
      const jodiResultNum = Number(jodiResultStr); // Number 4
      

      let newIsWin = false;
      let newMultiplier = 0;
      let newPayout = 0;

      if (jodiResultNum === bidData.bidDigit) { // Number comparison
        newIsWin = true;
        newMultiplier = 95;
        newPayout = Number(bidData.bidAmount) * newMultiplier;
      }
     

      // Handle wallet updates for Jodi bids
      if (currentStatus === 'pending') {
        if (newIsWin) {
          batch.update(userRef, { balance: increment(newPayout) });
        }
      } else if (currentStatus === 'win') {
        if (!newIsWin) {
          batch.update(userRef, { balance: increment(-oldPayout) });
        }
      } else if (currentStatus === 'loss') {
        if (newIsWin) {
          batch.update(userRef, { balance: increment(newPayout) });
        }
      }

      const newStatus = newIsWin ? 'win' : 'loss';
      batch.update(bidRef, {
        status: newStatus,
        payoutAmount: newPayout
      });
    });

    // 6. Process Half Sangam bids only if both openResult and closeResult are available
    bidsSnapshot.forEach((bidDoc) => {
      const bidData = bidDoc.data();
      if (bidData.gameType !== 'Half Sangam') {
        return;
      }

      const userRef = doc(db, 'users', bidData.userId);
      const bidRef = doc(db, 'bids', bidDoc.id);

      const currentStatus = bidData.status || 'pending';
      const oldPayout = bidData.payoutAmount || 0;

      // Calculate win condition based on session
      let newIsWin = false;
      let newMultiplier = 0;
      let newPayout = 0;

      const openSum = [...String(gameData.openResult)].reduce((a, b) => Number(a) + Number(b), 0);
      const closeSum = [...String(gameData.closeResult)].reduce((a, b) => Number(a) + Number(b), 0);
      const openLastDigit = openSum % 10;
      const closeLastDigit = closeSum % 10;

      if (bidData.session === 'OpenPanna+CloseDigit') {
        if (Number(bidData.panaDigit) === Number(gameData.openResult) && bidData.singleDigit === closeLastDigit) {
          newIsWin = true;
          newMultiplier = 1200;
        }
      } else if (bidData.session === 'ClosePanna+OpenDigit') {
        if (Number(bidData.panaDigit) === Number(gameData.closeResult) && bidData.singleDigit === openLastDigit) {
          newIsWin = true;
          newMultiplier = 1200;
        }
      }

      if (newIsWin) {
        newPayout = Number(bidData.bidAmount) * newMultiplier;
      }

      // Handle wallet updates for Half Sangam bids
      if (currentStatus === 'pending') {
        if (newIsWin) {
          batch.update(userRef, { balance: increment(newPayout) });
        }
      } else if (currentStatus === 'win') {
        if (!newIsWin) {
          batch.update(userRef, { balance: increment(-oldPayout) });
        }
      } else if (currentStatus === 'loss') {
        if (newIsWin) {
          batch.update(userRef, { balance: increment(newPayout) });
        }
      }

      const newStatus = newIsWin ? 'win' : 'loss';
      batch.update(bidRef, {
        status: newStatus,
        payoutAmount: newPayout
      });
    });

    // 7. Process Full Sangam bids only if both openResult and closeResult are available
    bidsSnapshot.forEach((bidDoc) => {
      const bidData = bidDoc.data();
      if (bidData.gameType !== 'Full Sangam' || bidData.session !== 'open') {
        return;
      }

      const userRef = doc(db, 'users', bidData.userId);
      const bidRef = doc(db, 'bids', bidDoc.id);

      const currentStatus = bidData.status || 'pending';
      const oldPayout = bidData.payoutAmount || 0;

      // Calculate win condition for Full Sangam
      let newIsWin = false;
      let newMultiplier = 0;
      let newPayout = 0;

      if (Number(bidData.openPana) === Number(gameData.openResult) && Number(bidData.closePana) === Number(gameData.closeResult)) {
        newIsWin = true;
        newMultiplier = 10000;
        newPayout = Number(bidData.bidAmount) * newMultiplier;
      }

      // Handle wallet updates for Full Sangam bids
      if (currentStatus === 'pending') {
        if (newIsWin) {
          batch.update(userRef, { balance: increment(newPayout) });
        }
      } else if (currentStatus === 'win') {
        if (!newIsWin) {
          batch.update(userRef, { balance: increment(-oldPayout) });
        }
      } else if (currentStatus === 'loss') {
        if (newIsWin) {
          batch.update(userRef, { balance: increment(newPayout) });
        }
      }

      const newStatus = newIsWin ? 'win' : 'loss';
      batch.update(bidRef, {
        status: newStatus,
        payoutAmount: newPayout
      });
    });
  } else {
  
    
  }

  await batch.commit();
 
  
};