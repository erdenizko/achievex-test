import { useState, useEffect } from 'react';

interface UserData {
  id: string;
  username: string;
}

const USER_DATA_KEY = 'achievex_user_data';

export const useUserData = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Function to generate a random UUID
  const generateUUID = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  // Load user data from localStorage on mount
  useEffect(() => {
    const loadUserData = () => {
      try {
        const storedData = localStorage.getItem(USER_DATA_KEY);
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          setUserData(parsedData);
        }
      } catch (error) {
        console.error('Error loading user data from localStorage:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Save user data to localStorage and state
  const saveUserData = (username: string) => {
    const newUserData: UserData = {
      id: generateUUID(),
      username: username.trim(),
    };

    try {
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(newUserData));
      setUserData(newUserData);
    } catch (error) {
      console.error('Error saving user data to localStorage:', error);
    }
  };

  // Clear user data (for testing or logout purposes)
  const clearUserData = () => {
    try {
      localStorage.removeItem(USER_DATA_KEY);
      setUserData(null);
    } catch (error) {
      console.error('Error clearing user data from localStorage:', error);
    }
  };

  return {
    userData,
    isLoading,
    saveUserData,
    clearUserData,
    hasUserData: userData !== null,
  };
};