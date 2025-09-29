import { collection, query, where, getDocs, updateDoc, doc, writeBatch, increment } from 'firebase/firestore';
import { db } from '../firebase';

// Helper function for retrying batch commit with exponential backoff
const commitWithRetry = async (batch, maxRetries = 3, baseDelay = 1000) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await batch.commit();
     // console.log(`Batch committed successfully on attempt ${attempt}`);
      return;
    } catch (error) {
      console.error(`Batch commit failed on attempt ${attempt}:`, error);
      if (attempt === maxRetries) {
        throw new Error(`Failed to commit batch after ${maxRetries} attempts: ${error.message}`);
      }
      // Exponential backoff: wait 1s, 2s, 4s, etc.
      const delay = baseDelay * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

export const declareResultService = async (gameName, resultType, resultDate, resultValue) => {
  try {
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
      { openResult: String(resultValue), openResultDate: resultDate } :
      { closeResult: String(resultValue), closeResultDate: resultDate };

    await updateDoc(gameDocRef, updateData);

    // 3. Fetch updated game data after update
    const updatedGameDoc = await getDocs(gameQuery);
    updatedGameDoc.forEach((doc) => {
      gameData = doc.data();
    });

    // 4. Process bids
    const sessionType = resultType === 'openResult' ? 'Open' : 'Close';
    const bidsQuery = query(
      collection(db, 'bids'),
      where('gameId', '==', gameName),
      where('date', '==', resultDate)
    );

    const bidsSnapshot = await getDocs(bidsQuery);
    const bids = bidsSnapshot.docs; // Convert to array for easier chunking

    const batchSize = 225; // Max 225 bids per batch (since max 2 operations per bid = 450 operations)
    const maxOperationsPerBatch = batchSize * 2; // 450 operations
    let currentBatch = writeBatch(db);
    let operationCount = 0;
    let batchCount = 0;
    let processedBids = 0;

    // Process regular bids (Single Ank, Single Pana, Double Pana, Triple Pana)
    for (const bidDoc of bids) {
      const bidData = bidDoc.data();
      const userRef = doc(db, 'users', bidData.userId);
      const bidRef = doc(db, 'bids', bidDoc.id);

      // Skip if not matching session for non-Jodi bids
      if (bidData.gameType !== 'Jodi' && bidData.session !== sessionType) {
        continue;
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
        } else if (bidData.gameType === 'Double Pana') {
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
            currentBatch.update(userRef, { balance: increment(newPayout) });
            operationCount++;
          }
        } else if (currentStatus === 'win') {
          if (!newIsWin) {
            currentBatch.update(userRef, { balance: increment(-oldPayout) });
            operationCount++;
          }
        } else if (currentStatus === 'loss') {
          if (newIsWin) {
            currentBatch.update(userRef, { balance: increment(newPayout) });
            operationCount++;
          }
        }

        const newStatus = newIsWin ? 'win' : 'loss';
        currentBatch.update(bidRef, {
          status: newStatus,
          payoutAmount: newPayout
        });
        operationCount++;
        processedBids++;
      }

      // Commit batch if it reaches the limit
      if (operationCount >= maxOperationsPerBatch) {
        await commitWithRetry(currentBatch);
        batchCount++;
        currentBatch = writeBatch(db);
        operationCount = 0;
      }
    }

    // Process Jodi, Half Sangam, and Full Sangam bids if both results are available
    if (gameData.openResult && gameData.closeResult && gameData.openResultDate === gameData.closeResultDate) {
      for (const bidDoc of bids) {
        const bidData = bidDoc.data();
        const userRef = doc(db, 'users', bidData.userId);
        const bidRef = doc(db, 'bids', bidDoc.id);

        const currentStatus = bidData.status || 'pending';
        const oldPayout = bidData.payoutAmount || 0;
        let newIsWin = false;
        let newMultiplier = 0;
        let newPayout = 0;

        // Process Jodi bids
        if (bidData.gameType === 'Jodi' && bidData.session === 'Open') {
          const openSum = [...String(gameData.openResult)].reduce((a, b) => Number(a) + Number(b), 0);
          const closeSum = [...String(gameData.closeResult)].reduce((a, b) => Number(a) + Number(b), 0);
          const jodiResultStr = `${openSum % 10}${closeSum % 10}`;
          const jodiResultNum = Number(jodiResultStr);

          if (jodiResultNum === bidData.bidDigit) {
            newIsWin = true;
            newMultiplier = 95;
            newPayout = Number(bidData.bidAmount) * newMultiplier;
          }

          // Handle wallet updates for Jodi bids
          if (currentStatus === 'pending') {
            if (newIsWin) {
              currentBatch.update(userRef, { balance: increment(newPayout) });
              operationCount++;
            }
          } else if (currentStatus === 'win') {
            if (!newIsWin) {
              currentBatch.update(userRef, { balance: increment(-oldPayout) });
              operationCount++;
            }
          } else if (currentStatus === 'loss') {
            if (newIsWin) {
              currentBatch.update(userRef, { balance: increment(newPayout) });
              operationCount++;
            }
          }

          const newStatus = newIsWin ? 'win' : 'loss';
          currentBatch.update(bidRef, {
            status: newStatus,
            payoutAmount: newPayout
          });
          operationCount++;
          processedBids++;
        }

        // Process Half Sangam bids
        if (bidData.gameType === 'Half Sangam') {
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
              currentBatch.update(userRef, { balance: increment(newPayout) });
              operationCount++;
            }
          } else if (currentStatus === 'win') {
            if (!newIsWin) {
              currentBatch.update(userRef, { balance: increment(-oldPayout) });
              operationCount++;
            }
          } else if (currentStatus === 'loss') {
            if (newIsWin) {
              currentBatch.update(userRef, { balance: increment(newPayout) });
              operationCount++;
            }
          }

          const newStatus = newIsWin ? 'win' : 'loss';
          currentBatch.update(bidRef, {
            status: newStatus,
            payoutAmount: newPayout
          });
          operationCount++;
          processedBids++;
        }

        // Process Full Sangam bids
        if (bidData.gameType === 'Full Sangam' && bidData.session === 'open') {
          if (Number(bidData.openPana) === Number(gameData.openResult) && Number(bidData.closePana) === Number(gameData.closeResult)) {
            newIsWin = true;
            newMultiplier = 10000;
            newPayout = Number(bidData.bidAmount) * newMultiplier;
          }

          // Handle wallet updates for Full Sangam bids
          if (currentStatus === 'pending') {
            if (newIsWin) {
              currentBatch.update(userRef, { balance: increment(newPayout) });
              operationCount++;
            }
          } else if (currentStatus === 'win') {
            if (!newIsWin) {
              currentBatch.update(userRef, { balance: increment(-oldPayout) });
              operationCount++;
            }
          } else if (currentStatus === 'loss') {
            if (newIsWin) {
              currentBatch.update(userRef, { balance: increment(newPayout) });
              operationCount++;
            }
          }

          const newStatus = newIsWin ? 'win' : 'loss';
          currentBatch.update(bidRef, {
            status: newStatus,
            payoutAmount: newPayout
          });
          operationCount++;
          processedBids++;
        }

        // Commit batch if it reaches the limit
        if (operationCount >= maxOperationsPerBatch) {
          await commitWithRetry(currentBatch);
          batchCount++;
          currentBatch = writeBatch(db);
          operationCount = 0;
        }
      }
    }

    // Commit any remaining operations in the last batch
    if (operationCount > 0) {
      await commitWithRetry(currentBatch);
      batchCount++;
    }

   // console.log(`Processed ${processedBids} bids in ${batchCount} batches`);
    return {
      success: true,
      bidsCount: processedBids,
      batchCount: batchCount
    };
  } catch (error) {
    console.error('Error in declareResultService:', error);
    return {
      success: false,
      error: error.message
    };
  }
};