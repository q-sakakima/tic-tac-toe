import '../styles/global.css';
import '../styles/responsive.css';
import { FunctionComponent, useState } from 'react';
import { Mark, Coordinates } from '../types/index';
import { Board } from '../components/Board';

export default function Game() {
  const [history, setHistory] = useState<
    { squares: Mark[]; nextCoordinates: Coordinates }[]
  >([{ squares: Array(9).fill(null), nextCoordinates: null }]);
  const [currentMove, setCurrentMove] = useState<number>(0);
  const [bgColor, setBgColor] = useState<boolean>(false);
  const [is3x3, setIs3x3] = useState<boolean>(true);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove]?.squares;

  const handlePlay = (nextSquares: Mark[], nextCoordinates: Coordinates) => {
    const nextHistory = [
      ...history.slice(0, currentMove + 1),
      { squares: nextSquares, nextCoordinates: nextCoordinates },
    ];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  };

  const jumpTo = (nextMove: number) => {
    setCurrentMove(nextMove);
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
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  const handleBGColor = () => {
    setBgColor(!bgColor);
  };

  const bgColorClass = bgColor ? 'dark-theme' : '';

  const handleBoardSize = () => {
    setIs3x3(!is3x3);
    setHistory([
      { squares: Array(is3x3 ? 9 : 16).fill(null), nextCoordinates: null },
    ]);
    setCurrentMove(0);
  };

  return (
    <div className={`game ${bgColorClass}`}>
      <div className="game-board">
        <Board
          xIsNext={xIsNext}
          squares={currentSquares || []}
          is3x3={is3x3}
          handlePlay={handlePlay}
        />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
      <div className="bottom-column">
        <button onClick={() => handleBGColor()}>Change BGColor</button>
        <button onClick={() => handleBoardSize()}>
          {is3x3 ? 'Change 4x4' : 'Change 3x3'}
        </button>
      </div>
    </div>
  );
}
