import { FunctionComponent, memo, useMemo, useContext } from 'react';
import { CheckContext } from '../../contexts/CheckProvider';
import { Mark, Coordinates } from '../../types/index';
import { Square } from '../Square';
import { ClassNames } from '@emotion/react';
import { status, boardRow, boardRow3x3, boardRow4x4 } from './styled';

export type BoardProps = {
  currentSquares: Mark[];
  lines: number[][];
  boardSize: number;
  timeLeft: number;
  handlePlay: (nextSquares: Mark[], coordinates: Coordinates) => void;
  playerMark: Mark | null;
  xIsNext: boolean;
};

export const Board: FunctionComponent<BoardProps> = memo(
  ({
    currentSquares,
    lines,
    boardSize,
    timeLeft,
    handlePlay,
    playerMark,
    xIsNext,
  }: BoardProps) => {
    const { isWin, setIsWin, isDraw, setIsDraw } = useContext(CheckContext);
    let winnersSquares: boolean[] = Array(boardSize ** 2).fill(false);
    let coordinates: Coordinates[] = [];

    coordinates = useMemo(() => {
      for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
          coordinates.push({ x: j, y: i });
        }
      }
      return coordinates;
    }, [boardSize]);

    const calculateWinner = (squares: Mark[]) => {
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].slice();
        if (line.every((v) => squares[v] && squares[v] === squares[line[0]])) {
          line.forEach((v) => {
            winnersSquares[v] = true;
            setIsWin(true);
          });
          return squares[line[0]];
        }
      }
      return null;
    };

    const handleClick = (i: number) => {
      if (
        isWin !== null ||
        isDraw ||
        currentSquares[i] ||
        !timeLeft ||
        playerMark !== (xIsNext ? 'X' : 'O')
      ) {
        return;
      }
      const nextSquares: Mark[] = currentSquares.slice();
      nextSquares[i] = xIsNext ? 'X' : 'O';
      handlePlay(nextSquares, coordinates[i]);
    };

    const winner = calculateWinner(currentSquares);
    let statusText: string;
    if (isWin) {
      statusText = 'Winner: ' + winner;
    } else if (isDraw) {
      statusText = 'Draw';
    } else if (isWin === false) {
      statusText = 'Winner: ' + (!xIsNext ? 'X' : 'O');
    } else {
      statusText = 'Next player: ' + (xIsNext ? 'X' : 'O');
    }

    return (
      <ClassNames>
        {({ css }) => (
          <>
            <div className={css(status)}>{statusText}</div>
            <div
              className={css`
                ${boardRow};
                ${boardSize === 3 ? boardRow3x3 : boardRow4x4};
              `}
            >
              {[...Array(boardSize ** 2)].map((_, i) => (
                <Square
                  key={i}
                  value={currentSquares[i]}
                  winnersSquare={winnersSquares[i]}
                  onSquareClick={() => handleClick(i)}
                />
              ))}
            </div>
          </>
        )}
      </ClassNames>
    );
  },
);
