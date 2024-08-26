import {
  FunctionComponent,
  useState,
  useEffect,
  useContext,
  useMemo,
} from 'react';
import { ResultCheckContext } from '../contexts/ResultCheckProvider';
import { Mark, Coordinates } from '../types/index';
import { Board } from '../components/Board';

export default function Game() {
  const [history, setHistory] = useState<
    { squares: Mark[]; coordinates: Coordinates }[]
  >([{ squares: Array(9).fill(null), coordinates: null }]);
  const [currentMove, setCurrentMove] = useState<number>(0);
  const [bgColor, setBgColor] = useState<boolean>(false);
  const [boardSize, setBoardSize] = useState<number>(3);
  const currentSquares = history[currentMove]?.squares;

  const { isWin, setIsWin, isDraw, setIsDraw, xIsNext, setXIsNext } =
    useContext(ResultCheckContext);
  const [timeLeft, setTimeLeft] = useState<number>(10);

  const lines: number[][] = useMemo(() => {
    if (boardSize === 3) {
      return [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
      ];
    } else if (boardSize === 4) {
      return [
        [0, 1, 2, 3],
        [4, 5, 6, 7],
        [8, 9, 10, 11],
        [12, 13, 14, 15],
        [0, 4, 8, 12],
        [1, 5, 9, 13],
        [2, 6, 10, 14],
        [3, 7, 11, 15],
        [0, 5, 10, 15],
        [3, 6, 9, 12],
      ];
    }
    return [];
  }, [boardSize]);

  useEffect(() => {
    const checkDraw = lines.map((line) => {
      const [a, b, c, d] = line;

      const squareA = currentSquares[a];
      const squareB = currentSquares[b];
      const squareC = currentSquares[c];
      const squareD = d === undefined ? null : currentSquares[d];

      const containX = [squareA, squareB, squareC, squareD].includes('X');
      const containO = [squareA, squareB, squareC, squareD].includes('O');

      return containX && containO;
    });

    if (!checkDraw.includes(false)) {
      setIsDraw(true);
    }
  }, [currentSquares, lines]);

  useEffect(() => {
    setXIsNext(currentMove % 2 === 0);
  }, [currentMove]);

  useEffect(() => {
    if (isDraw || isWin !== null) {
      return;
    } else if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsWin(false);
    }
  }, [timeLeft]);

  const handlePlay = (nextSquares: Mark[], nextCoordinates: Coordinates) => {
    const nextHistory = [
      ...history.slice(0, currentMove + 1),
      { squares: nextSquares, coordinates: nextCoordinates },
    ];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    setTimeLeft(10);
  };

  const jumpTo = (nextMove: number, description: string) => {
    setCurrentMove(nextMove);
    if (description === 'Go to game start') {
      setIsWin(null);
      setIsDraw(null);
      setTimeLeft(10);
      setHistory([history[0]]);
    } else if (nextMove === history.length - 1) {
      setIsWin(false);
    } else {
      setIsWin(null);
    }
  };

  const moves = history.map((history, move) => {
    let description: string;
    if (move > 0) {
      description = `Go to move #${move} (${history.coordinates?.x}, ${history.coordinates?.y})`;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move, description)}>{description}</button>
      </li>
    );
  });

  const handleBGColor = () => {
    setBgColor(!bgColor);
  };

  const bgColorClass = bgColor ? 'dark-theme' : '';

  const handleBoardSize = () => {
    if (boardSize === 3) {
      setBoardSize(4);
    } else if (boardSize === 4) {
      setBoardSize(3);
    }
    setHistory([
      {
        squares: Array(boardSize === 3 ? 3 ** 2 : 4 ** 2).fill(null),
        coordinates: null,
      },
    ]);
    setCurrentMove(0);
    setTimeLeft(10);
    setIsWin(null);
    setIsDraw(null);
  };

  const handleSurrenderButton = () => {
    setIsWin(false);
  };

  return (
    <div className={`game ${bgColorClass}`}>
      <div className="game-board">
        <Board
          squares={currentSquares || []}
          lines={lines}
          boardSize={boardSize}
          timeLeft={timeLeft}
          handlePlay={handlePlay}
        />
      </div>
      <div className="game-info">
        {timeLeft ? `${timeLeft} seconds left.` : 'Time is Up.'}
        <ol>{moves}</ol>
      </div>
      <div className="bottom-column">
        <button onClick={() => handleSurrenderButton()}>Surrender</button>
        <button onClick={() => handleBGColor()}>Change BGColor</button>
        <button onClick={() => handleBoardSize()}>
          {boardSize === 3 ? 'Change 4x4' : 'Change 3x3'}
        </button>
      </div>
    </div>
  );
}
