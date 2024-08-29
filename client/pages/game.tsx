import { useState, useEffect, useContext, useMemo } from 'react';
import { CheckContext } from '../contexts/CheckProvider';
import { Mark, Coordinates } from '../types/index';
import { Board } from '../components/Board';
import io from 'socket.io-client';

const socket = io('http://localhost:3500');

export default function Game() {
  const [history, setHistory] = useState<
    { squares: Mark[]; coordinates: Coordinates }[]
  >([{ squares: Array(9).fill(null), coordinates: null }]);
  const [currentMove, setCurrentMove] = useState<number>(0);
  const [bgColor, setBgColor] = useState<boolean>(false);
  const [boardSize, setBoardSize] = useState<number>(3);
  const { isWin, setIsWin, isDraw, setIsDraw, xIsNext, setXIsNext } =
    useContext(CheckContext);
  const [timeLeft, setTimeLeft] = useState<number>(10);
  const [playerMark, setPlayerMark] = useState<Mark | null>(null);
  const [gameFull, setGameFull] = useState<boolean>(false);

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
    socket.on('send_playerMark', (mark: Mark) => {
      setPlayerMark(mark);
    });

    socket.on('received_history', (history) => {
      setHistory(history);
      setCurrentMove(history.length - 1);
    });

    socket.on('received_nextMove', (nextMove) => {
      setCurrentMove(nextMove);
    });

    socket.on('received_timeLeft', (timeLeft) => {
      setTimeLeft(timeLeft);
    });

    socket.on('received_isWin', (isWin) => {
      setIsWin(isWin);
    });

    socket.on('received_isDraw', (isDraw) => {
      setIsDraw(isDraw);
    });

    socket.on('received_boardSize', (boardSize) => {
      setBoardSize(boardSize);
    });

    socket.on('game_full', (message) => {
      alert(message);
      setGameFull(true);
    });

    return () => {
      socket.off('send_playerMark');
      socket.off('received_history');
      socket.off('received_nextMove');
      socket.off('received_timeLeft');
      socket.off('received_isWin');
      socket.off('received_isDraw');
      socket.off('received_boardSize');
      socket.off('game_full');
    };
  }, [setIsWin, setIsDraw, setTimeLeft]);

  useEffect(() => {
    setXIsNext(currentMove % 2 === 0);
  }, [currentMove, setXIsNext]);

  useEffect(() => {
    if (isWin !== null || isDraw) {
      return;
    }
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
        socket.emit('send_timeLeft', timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setIsWin(false);
      socket.emit('send_isWin', false);
    }
  }, [timeLeft, isWin, isDraw, setIsWin]);

  const handlePlay = (nextSquares: Mark[], nextCoordinates: Coordinates) => {
    if (playerMark !== (xIsNext ? 'X' : 'O')) {
      return;
    }
    const nextHistory = [
      ...history.slice(0, currentMove + 1),
      { squares: nextSquares, coordinates: nextCoordinates },
    ];
    socket.emit('send_history', nextHistory);
    socket.emit('send_timeLeft', 10);
  };

  const jumpTo = (nextMove: number, description: string) => {
    socket.emit('send_nextMove', nextMove);
    if (description === 'Go to game start') {
      socket.emit('send_isWin', null);
      socket.emit('send_isDraw', null);
      socket.emit('send_timeLeft', 10);
    }
  };

  const moves = history.map((_, move) => {
    const description = move
      ? `Go to move #${move} (${history[move].coordinates?.x}, ${history[move].coordinates?.y})`
      : 'Go to game start';

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
    const newSize = boardSize === 3 ? 4 : 3;
    socket.emit('send_boardSize', newSize);
    socket.emit('send_history', [
      {
        squares: Array(newSize ** 2).fill(null),
        coordinates: null,
      },
    ]);
    socket.emit('send_isWin', null);
    socket.emit('send_isDraw', null);
    socket.emit('send_timeLeft', 10);
    setCurrentMove(0);
  };

  const handleSurrenderButton = () => {
    socket.emit('send_isWin', false);
  };

  if (gameFull) {
    return <div>The game is full. Please try again later.</div>;
  }

  return (
    <div className={`game ${bgColorClass}`}>
      <div className="game-board">
        <Board
          currentSquares={history[currentMove].squares || []}
          lines={lines}
          boardSize={boardSize}
          timeLeft={timeLeft}
          handlePlay={handlePlay}
          playerMark={playerMark}
          xIsNext={xIsNext}
        />
      </div>
      <div className="game-info">
        <div>
          {playerMark ? `You are: ${playerMark}` : 'Waiting for player mark...'}
        </div>
        {timeLeft ? `${timeLeft} seconds left.` : 'Time is Up.'}
        <ol>{moves}</ol>
      </div>
      <div className="bottom-column">
        <button onClick={handleSurrenderButton}>Surrender</button>
        <button onClick={handleBGColor}>Change BGColor</button>
        <button onClick={handleBoardSize}>
          {boardSize === 3 ? 'Change 4x4' : 'Change 3x3'}
        </button>
      </div>
    </div>
  );
}
