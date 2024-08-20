import { FunctionComponent } from 'react';
import { Mark, Coordinates } from '../../types/index';
import { Square } from '../Square';
import { css, ClassNames } from '@emotion/react';
import { status, boardRow } from './styled';

type BoardProps = {
  xIsNext: boolean;
  squares: Mark[];
  onPlay: (nextSquares: Mark[], coordinates: Coordinates) => void;
};

export const Board: FunctionComponent<BoardProps> = ({
  xIsNext,
  squares,
  onPlay,
}: BoardProps) => {
  const winnersSquares: boolean[] = Array(9).fill(false);
  const coordinates: Coordinates[] = [
    { x: 1, y: 1 },
    { x: 2, y: 1 },
    { x: 3, y: 1 },
    { x: 1, y: 2 },
    { x: 2, y: 2 },
    { x: 3, y: 2 },
    { x: 1, y: 3 },
    { x: 2, y: 3 },
    { x: 3, y: 3 },
  ];

  const calculateWinner = (squares: Mark[]) => {
    const lines = [
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
          <div className={css(boardRow)}>
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
          </div>
        </>
      )}
    </ClassNames>
  );
};
