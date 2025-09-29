import { useState } from 'react';
import { declareResultService } from '../DashboardServices/DeclareResultServices';

export function useDeclareResult() {
  const [isLoading, setIsLoading] = useState(false);
  const [resultMessage, setResultMessage] = useState('');

  const declareResult = async (gameName, resultType, resultDate, resultValue) => {
    try {
      setIsLoading(true);
      setResultMessage('Processing result, please wait...');
      const result = await declareResultService(gameName, resultType, resultDate, resultValue);
      
      if (result.success) {
        setResultMessage(`Total ${result.bidsCount} bids in ${result.batchCount} batches successfully processed`);
      } else {
        setResultMessage(`Process failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Error declaring result:', error);
      setResultMessage('Process failed: An unexpected error occurred');
    } finally {
      setIsLoading(false);
      // Clear message after 5 seconds
      setTimeout(() => {
        setResultMessage('');
      }, 5000);
    }
  };

  return { declareResult, isLoading, resultMessage };
}