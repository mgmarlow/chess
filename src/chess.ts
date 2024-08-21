export const INITIAL_BOARD_FEN =
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

export type Piece = "p" | "n" | "b" | "r" | "q" | "k";
export type Color = "w" | "b";

export const isWhitePiece = (str: string): str is Piece =>
  str.match(/^[PNBRQK]$/) !== null;
export const isBlackPiece = (str: string): str is Piece =>
  str.match(/^[pnbrqk]$/) !== null;
export const isPiece = (str: string): str is Piece =>
  isWhitePiece(str) || isBlackPiece(str);

const isColor = (str: string): str is Color => str === "w" || str === "b";

// chess.js represents empty squares as null, but that's kind of
// annoying since it loses information about the square rank and
// file. Instead, use a discriminated union.
export type Square =
  | {
      kind: "piece";
      square: string;
      type: Piece;
      color: Color;
    }
  | {
      kind: "empty";
      square: string;
    };

// TODO: castling and enpassant.
interface FenResult {
  squares: Square[][];
  active: Color;
  halfmove: number;
  fullmove: number;
}

export const parseFen = (fen: string): FenResult => {
  const [board, active, _castling, _enpassant, halfmove, fullmove] =
    fen.split(" ");

  if (!isColor(active)) {
    throw new Error("invalid FEN");
  }

  const squares: Square[][] = [];
  let row: Square[] = [];

  const coord = (row: number, ci: number) => "abcdefgh"[ci] + `${row + 1}`;

  const flush = () => {
    squares.push(row);
    row = [];
  };

  for (let cur = 0; cur < board.length; cur++) {
    const item = board[cur];

    if (item === "/") {
      flush();
      continue;
    }

    if (isWhitePiece(item)) {
      row.push({
        kind: "piece",
        color: "w",
        type: item,
        square: coord(squares.length, row.length),
      });
      continue;
    }

    if (isBlackPiece(item)) {
      row.push({
        kind: "piece",
        color: "b",
        type: item,
        square: coord(squares.length, row.length),
      });
      continue;
    }

    const n = parseInt(item);
    if (isNaN(n)) {
      throw new Error("invalid FEN");
    }

    for (let i = 0; i < n; i++) {
      row.push({ kind: "empty", square: coord(squares.length, row.length) });
    }
  }
  flush(); // Don't forget the final row.

  return {
    squares,
    active,
    halfmove: parseInt(halfmove),
    fullmove: parseInt(fullmove),
  };
};
