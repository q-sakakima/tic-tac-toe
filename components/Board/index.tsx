import { FunctionComponent } from 'react';
import { Mark, Coordinates, BoardProps } from '../../types/index';
import { Square } from '../Square';
import { css, ClassNames } from '@emotion/react';
import { status, boardRow, boardRow3x3, boardRow4x4 } from './styled';

export const Board: FunctionComponent<BoardProps> = ({
  xIsNext,
  squares,
  is3x3,
  handlePlay,
}: BoardProps) => {
  let winnersSquares: boolean[];
  let coordinates: Coordinates[] = [];
  let gridSize: number = is3x3 ? 3 ** 2 : 4 ** 2;

  winnersSquares = Array(gridSize).fill(false);

  for (let i = 1; i <= gridSize; i++) {
    for (let j = 1; j <= gridSize; j++) {
      coordinates.push({ x: j, y: i });
    }
  }

  const calculateWinner = (squares: Mark[]) => {
    let lines: number[][];

    if (is3x3) {
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

      for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (
          squares[a] &&
          squares[a] === squares[b] &&
          squares[a] === squares[c]
        ) {
          winnersSquares[a] = true;
          winnersSquares[b] = true;
          winnersSquares[c] = true;
          return squares[a];
        }
      }
      return null;
    } else if (!is3x3) {
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

      for (let i = 0; i < lines.length; i++) {
        const [a, b, c, d] = lines[i];
        if (
          squares[a] &&
          squares[a] === squares[b] &&
          squares[a] === squares[c] &&
          squares[a] === squares[d]
        ) {
          winnersSquares[a] = true;
          winnersSquares[b] = true;
          winnersSquares[c] = true;
          winnersSquares[d] = true;
          return squares[a];
        }
      }
      return null;
    }
  };

  const handleClick = (i: number) => {
    if (calculateWinner(squares) || squares[i]) {
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
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
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
              ${is3x3 ? boardRow3x3 : boardRow4x4};
            `}
          >
            {[...Array(gridSize)].map((_, i) => {
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
