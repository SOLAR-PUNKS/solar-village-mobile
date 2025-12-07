import React, { createContext, useContext, useState } from 'react';

interface AppContextType {
  showOpenLocationsOnly: boolean;
  setShowOpenLocationsOnly: (value: boolean) => void;
  showNearbyLocationsOnly: boolean;
  setShowNearbyLocationsOnly: (value: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showOpenLocationsOnly, setShowOpenLocationsOnly] = useState<boolean>(false);
  const [showNearbyLocationsOnly, setShowNearbyLocationsOnly] = useState<boolean>(false);

  return (
    <AppContext.Provider value={{ showOpenLocationsOnly, setShowOpenLocationsOnly, showNearbyLocationsOnly, setShowNearbyLocationsOnly }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};