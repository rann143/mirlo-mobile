import { createContext, useState, useContext } from "react";

interface TrackContextType {
  currentTrackUrl: string;
  setCurrentTrackURL: (url: string) => void;
}

export const TrackContext = createContext<TrackContextType | null>(null);

export const TrackContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentTrackUrl, setCurrentTrackURL] = useState<string>("");

  const value: TrackContextType = {
    currentTrackUrl,
    setCurrentTrackURL,
  };

  return (
    <TrackContext.Provider value={value}>{children}</TrackContext.Provider>
  );
};

export const useTrack = (): TrackContextType => {
  const context = useContext(TrackContext);

  if (!context) {
    throw new Error("useTrack must be used within a TrackContext Provider");
  }

  return context;
};
