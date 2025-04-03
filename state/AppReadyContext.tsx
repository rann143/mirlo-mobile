import { createContext, useContext, useState } from "react";

export const AppReadyContext = createContext({
  isDataLoaded: false,
  setIsDataLoaded: (loaded: boolean) => {},
});

export const AppReadyContextProvider: React.FC<{
  value: {
    isDataLoaded: boolean;
    setIsDataLoaded: (loaded: boolean) => void;
  };
  children: React.ReactNode;
}> = ({ value, children }) => {
  return (
    <AppReadyContext.Provider value={value}>
      {children}
    </AppReadyContext.Provider>
  );
};

export function useAppIsReadyContext() {
  const context = useContext(AppReadyContext);

  if (!context) {
    throw new Error(
      "useAppIsReadyContext must be used within the proper Context Provider"
    );
  }

  return context;
}
