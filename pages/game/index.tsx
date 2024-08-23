import { FunctionComponent, useState, useEffect, useContext } from 'react';
import { ResultCheckContext } from '../../contexts/ResultCheckProvider';
import { Mark, Coordinates } from '../../types/index';
import { Board } from '../../components/Board';

export const Game: FunctionComponent = () => {
  const [history, setHistory] = useState<
    { squares: Mark[]; nextCoordinates: Coordinates }[]
  >([{ squares: Array(9).fill(null), nextCoordinates: null }]);
  const [currentMove, setCurrentMove] = useState<number>(0);
  const [bgColor, setBgColor] = useState<boolean>(false);
  const [boardSize, setBoardSize] = useState<number>(3);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove]?.squares;

  let lines: number[][] = [];
  const { isWin, setIsWin, isDraw, setIsDraw } = useContext(ResultCheckContext);
  const [timeLeft, setTimeLeft] = useState<number>(10);

  if (boardSize === 3) {
    lines = [
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
    lines = [
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

  // TODO: 条件文にtimeLeft > 0 && !isWin && !isDrawを使えるように変更
  useEffect(() => {
    if (isDraw || isWin) {
      return;
    } else if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handlePlay = (nextSquares: Mark[], nextCoordinates: Coordinates) => {
    const nextHistory = [
      ...history.slice(0, currentMove + 1),
      { squares: nextSquares, nextCoordinates: nextCoordinates },
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
    }
  };

  const moves = history.map((history, move) => {
    let description;
    if (move > 0) {
      description = `Go to move #${move} (${history.nextCoordinates?.x}, ${history.nextCoordinates?.y})`;
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
        nextCoordinates: null,
      },
    ]);
    setCurrentMove(0);
    setTimeLeft(10);
  };

  return (
    <div className={`game ${bgColorClass}`}>
      <div className="game-board">
        <Board
          xIsNext={xIsNext}
          squares={currentSquares || []}
          lines={lines}
          boardSize={boardSize}
          timeLeft={timeLeft}
          handlePlay={handlePlay}
        />
      </div>
      <div className="game-info">
        {!isWin && !isDraw && (timeLeft > 0 ? timeLeft : 'Time is up.')}
        <ol>{moves}</ol>
      </div>
      <div className="bottom-column">
        <button onClick={() => handleBGColor()}>Change BGColor</button>
        <button onClick={() => handleBoardSize()}>
          {boardSize === 3 ? 'Change 4x4' : 'Change 3x3'}
        </button>
      </div>
    </div>
  );
};
