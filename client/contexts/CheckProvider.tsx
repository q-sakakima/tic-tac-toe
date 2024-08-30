import { createContext, ReactNode, useState } from 'react';

type ResultCheckContextType = {
  isWin: boolean | null;
  setIsWin: (isWin: boolean | null) => void;
  isDraw: boolean | null;
  setIsDraw: (isDraw: boolean | null) => void;
  xIsNext: boolean;
  setXIsNext: (xIsNext: boolean) => void;
};

type ProviderProps = {
  children: ReactNode;
};

export const CheckContext = createContext<ResultCheckContextType>({
  isWin: null,
  setIsWin: () => {},
  isDraw: null,
  setIsDraw: () => {},
  xIsNext: true,
  setXIsNext: () => {},
});

export const ResultCheckProvider = ({ children }: ProviderProps) => {
  const [isWin, setIsWin] = useState<boolean | null>(null);
  const [isDraw, setIsDraw] = useState<boolean | null>(null);
  const [xIsNext, setXIsNext] = useState<boolean>(true);

  return (
    <CheckContext.Provider
      value={{
        isWin,
        setIsWin,
        isDraw,
        setIsDraw,
        xIsNext,
        setXIsNext,
      }}
    >
      {children}
    </CheckContext.Provider>
  );
};
