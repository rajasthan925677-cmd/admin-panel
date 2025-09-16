import { declareResultService } from '../DashboardServices/DeclareResultServices';

export function useDeclareResult() {
  const declareResult = async (gameName, resultType, resultDate, resultValue) => {
    try {
      await declareResultService(gameName, resultType, resultDate, resultValue);
      alert('Result declared and bids processed successfully!');
    } catch (error) {
      console.error('Error declaring result:', error);
      alert('Failed to declare result. Please try again.');
    }
  };

  return { declareResult };
}