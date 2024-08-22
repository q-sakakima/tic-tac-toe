import { FunctionComponent } from 'react';
import { Mark, Coordinates, BoardProps } from '../../types/index';
import { Square } from '../Square';
import { css, ClassNames } from '@emotion/react';
import { status, boardRow, boardRow3x3, boardRow4x4 } from './styled';

export const Board: FunctionComponent<BoardProps> = ({
  xIsNext,
  squares,
  lines,
  boardSize,
  isDraw,
  handlePlay,
}: BoardProps) => {
  let winnersSquares: boolean[] = Array(boardSize ** 2).fill(false);
  let coordinates: Coordinates[] = [];

  for (let i = 1; i <= boardSize ** 2; i++) {
    for (let j = 1; j <= boardSize ** 2; j++) {
      coordinates.push({ x: j, y: i });
    }
  }

  const calculateWinner = (squares: Mark[]) => {
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].slice();
      if (line.every((v) => squares[v] && squares[v] === squares[line[0]])) {
        line.forEach((v) => {
          winnersSquares[v] = true;
        });
        return squares[line[0]];
      }
    }
    return null;
  };

  const handleClick = (i: number) => {
    if (calculateWinner(squares) || isDraw || squares[i]) {
      return;
    }
    const nextSquares: Mark[] = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    handlePlay(nextSquares, coordinates[i]);
  };

  const winner = calculateWinner(squares);
  let status: string;
  if (winner) {
    status = 'Winner: ' + winner;
  } else if (isDraw) {
    status = 'Draw';
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <ClassNames>
      {({ css }) => (
        <>
          <div className={css(status)}>{status}</div>
          <div
            className={css`
              ${boardRow};
              ${boardSize === 3 ? boardRow3x3 : boardRow4x4};
            `}
          >
            {[...Array(boardSize ** 2)].map((_, i) => {
              return (
                <Square
                  key={i}
                  value={squares[i]}
                  winnersSquare={winnersSquares[i]}
                  onSquareClick={() => handleClick(i)}
                />
              );
            })}
          </div>
        </>
      )}
    </ClassNames>
  );
};
