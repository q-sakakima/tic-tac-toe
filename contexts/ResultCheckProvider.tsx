import { createContext, ReactNode, useState } from 'react';

type ResultCheckContextType = {
  isWin: boolean | null;
  setIsWin: (isWin: boolean | null) => void;
  isDraw: boolean | null;
  setIsDraw: (isDraw: boolean | null) => void;
};

type ProviderProps = {
  children: ReactNode;
};

export const ResultCheckContext = createContext<ResultCheckContextType>({
  isWin: null,
  setIsWin: () => {},
  isDraw: false,
  setIsDraw: () => {},
});

export const ResultCheckProvider = ({ children }: ProviderProps) => {
  const [isWin, setIsWin] = useState<boolean | null>(null);
  const [isDraw, setIsDraw] = useState<boolean | null>(null);

  return (
    <ResultCheckContext.Provider value={{ isWin, setIsWin, isDraw, setIsDraw }}>
      {children}
    </ResultCheckContext.Provider>
  );
};
