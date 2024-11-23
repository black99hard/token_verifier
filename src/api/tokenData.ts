import { RecentToken } from '../types';

// This is a mock function. In a real application, you would fetch this data from your API.
export const fetchRecentTokens = async (): Promise<RecentToken[]> => {
  // Simulating an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(/* Your recent tokens data here */);
    }, 1000);
  });
};

// This is a mock function for fetching boosted tokens
export const fetchBoostedTokens = async () => {
  // Simulating an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(/* Your boosted tokens data here */);
    }, 1000);
  });
};

