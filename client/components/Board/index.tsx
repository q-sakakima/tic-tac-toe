import {
  FunctionComponent,
  memo,
  useCallback,
  useContext,
  useMemo,
} from 'react';
import { CheckContext } from '../../contexts/CheckProvider';
import { Mark, Coordinates } from '../../types/index';
import { Square } from '../Square';
import { css, ClassNames } from '@emotion/react';
import { status, boardRow, boardRow3x3, boardRow4x4 } from './styled';
import io from 'socket.io-client';

const socket = io('http://localhost:3500');

export type BoardProps = {
  currentSquares: Mark[];
  lines: number[][];
  boardSize: number;
  timeLeft: number;
  handlePlay: (nextSquares: Mark[], coordinates: Coordinates) => void;
};

export const Board: FunctionComponent<BoardProps> = memo(
  ({ currentSquares, lines, boardSize, timeLeft, handlePlay }: BoardProps) => {
    const { isWin, setIsWin, isDraw, setIsDraw, xIsNext, setXIsNext } =
      useContext(CheckContext);
    let winnersSquares: boolean[] = Array(boardSize ** 2).fill(false);
    let coordinates: Coordinates[] = [];

    coordinates = useMemo(() => {
      for (let i = 1; i <= boardSize ** 2; i++) {
        for (let j = 1; j <= boardSize ** 2; j++) {
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
      if (isWin !== null || isDraw || currentSquares[i] || !timeLeft) {
        return;
      }
      const nextSquares: Mark[] = currentSquares.slice();
      if (xIsNext) {
        nextSquares[i] = 'X';
      } else {
        nextSquares[i] = 'O';
      }
      handlePlay(nextSquares, coordinates[i]);
    };

    const winner = calculateWinner(currentSquares);
    let status: string;
    if (winner) {
      status = 'Winner: ' + winner;
    } else if (isDraw) {
      status = 'Draw';
    } else if (isWin === false) {
      status = 'Winner: ' + (!xIsNext ? 'X' : 'O');
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
                    value={currentSquares[i]}
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
  },
);
