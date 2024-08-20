import { FunctionComponent } from 'react';
import { Mark, Coordinates, BoardProps } from '../../types/index';
import { Square } from '../Square';
import { css, ClassNames } from '@emotion/react';
import { status, boardRow4x4 } from './styled';

export const Board4x4: FunctionComponent<BoardProps> = ({
  xIsNext,
  squares,
  onPlay,
}: BoardProps) => {
  const winnersSquares: boolean[] = Array(16).fill(false);
  const coordinates: Coordinates[] = [
    { x: 1, y: 1 },
    { x: 2, y: 1 },
    { x: 3, y: 1 },
    { x: 4, y: 1 },
    { x: 1, y: 2 },
    { x: 2, y: 2 },
    { x: 3, y: 2 },
    { x: 4, y: 2 },
    { x: 1, y: 3 },
    { x: 2, y: 3 },
    { x: 3, y: 3 },
    { x: 4, y: 3 },
    { x: 1, y: 4 },
    { x: 2, y: 4 },
    { x: 3, y: 4 },
    { x: 4, y: 4 },
  ];

  const calculateWinner = (squares: Mark[]) => {
    const lines = [
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
    onPlay(nextSquares, coordinates[i]);
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
          <div className={css(boardRow4x4)}>
            <Square
              value={squares[0]}
              winnersSquare={winnersSquares[0]}
              onSquareClick={() => handleClick(0)}
            />
            <Square
              value={squares[1]}
              winnersSquare={winnersSquares[1]}
              onSquareClick={() => handleClick(1)}
            />
            <Square
              value={squares[2]}
              winnersSquare={winnersSquares[2]}
              onSquareClick={() => handleClick(2)}
            />
            <Square
              value={squares[3]}
              winnersSquare={winnersSquares[3]}
              onSquareClick={() => handleClick(3)}
            />
            <Square
              value={squares[4]}
              winnersSquare={winnersSquares[4]}
              onSquareClick={() => handleClick(4)}
            />
            <Square
              value={squares[5]}
              winnersSquare={winnersSquares[5]}
              onSquareClick={() => handleClick(5)}
            />
            <Square
              value={squares[6]}
              winnersSquare={winnersSquares[6]}
              onSquareClick={() => handleClick(6)}
            />
            <Square
              value={squares[7]}
              winnersSquare={winnersSquares[7]}
              onSquareClick={() => handleClick(7)}
            />
            <Square
              value={squares[8]}
              winnersSquare={winnersSquares[8]}
              onSquareClick={() => handleClick(8)}
            />
            <Square
              value={squares[9]}
              winnersSquare={winnersSquares[9]}
              onSquareClick={() => handleClick(9)}
            />
            <Square
              value={squares[10]}
              winnersSquare={winnersSquares[10]}
              onSquareClick={() => handleClick(10)}
            />
            <Square
              value={squares[11]}
              winnersSquare={winnersSquares[11]}
              onSquareClick={() => handleClick(11)}
            />
            <Square
              value={squares[12]}
              winnersSquare={winnersSquares[12]}
              onSquareClick={() => handleClick(12)}
            />
            <Square
              value={squares[13]}
              winnersSquare={winnersSquares[13]}
              onSquareClick={() => handleClick(13)}
            />
            <Square
              value={squares[14]}
              winnersSquare={winnersSquares[14]}
              onSquareClick={() => handleClick(14)}
            />
            <Square
              value={squares[15]}
              winnersSquare={winnersSquares[15]}
              onSquareClick={() => handleClick(15)}
            />
          </div>
        </>
      )}
    </ClassNames>
  );
};
