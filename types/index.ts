export type Mark = 'X' | 'O' | null;

export type Coordinates = { x: number; y: number } | null;

export type BoardProps = {
  xIsNext: boolean;
  squares: Mark[];
  lines: number[][];
  boardSize: number;
  handlePlay: (nextSquares: Mark[], coordinates: Coordinates) => void;
};
