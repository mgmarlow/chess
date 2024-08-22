export const INITIAL_BOARD_FEN =
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

export type PieceSymbol = "p" | "n" | "b" | "r" | "q" | "k";
export type Color = "w" | "b";

// prettier-ignore
export type TSquare =
  'a8' | 'b8' | 'c8' | 'd8' | 'e8' | 'f8' | 'g8' | 'h8' |
  'a7' | 'b7' | 'c7' | 'd7' | 'e7' | 'f7' | 'g7' | 'h7' |
  'a6' | 'b6' | 'c6' | 'd6' | 'e6' | 'f6' | 'g6' | 'h6' |
  'a5' | 'b5' | 'c5' | 'd5' | 'e5' | 'f5' | 'g5' | 'h5' |
  'a4' | 'b4' | 'c4' | 'd4' | 'e4' | 'f4' | 'g4' | 'h4' |
  'a3' | 'b3' | 'c3' | 'd3' | 'e3' | 'f3' | 'g3' | 'h3' |
  'a2' | 'b2' | 'c2' | 'd2' | 'e2' | 'f2' | 'g2' | 'h2' |
  'a1' | 'b1' | 'c1' | 'd1' | 'e1' | 'f1' | 'g1' | 'h1'

// For easy 1d-array -> square lookups.
// prettier-ignore
export const SQUARES: TSquare[] = [
  'a8', 'b8', 'c8', 'd8', 'e8', 'f8', 'g8', 'h8',
  'a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7',
  'a6', 'b6', 'c6', 'd6', 'e6', 'f6', 'g6', 'h6',
  'a5', 'b5', 'c5', 'd5', 'e5', 'f5', 'g5', 'h5',
  'a4', 'b4', 'c4', 'd4', 'e4', 'f4', 'g4', 'h4',
  'a3', 'b3', 'c3', 'd3', 'e3', 'f3', 'g3', 'h3',
  'a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2',
  'a1', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1'
]

export const isWhitePiece = (str: string): str is PieceSymbol =>
  str.match(/^[PNBRQK]$/) !== null;
export const isBlackPiece = (str: string): str is PieceSymbol =>
  str.match(/^[pnbrqk]$/) !== null;
export const isPiece = (str: string): str is PieceSymbol =>
  isWhitePiece(str) || isBlackPiece(str);

const isColor = (str: string): str is Color => str === "w" || str === "b";

// chess.js represents empty squares as null, but that's kind of
// annoying since it loses information about the square rank and
// file. Instead, use a discriminated union.
export interface Piece {
  type: PieceSymbol;
  color: Color;
}

export interface PieceSquare {
  kind: "piece";
  piece: Piece;
  square: TSquare;
}

export interface EmptySquare {
  kind: "empty";
  square: TSquare;
}

export type Square = PieceSquare | EmptySquare;

// TODO: castling and enpassant.
interface FenResult {
  pieces: Piece[];
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

  const pieces: Piece[] = new Array(64).fill(undefined);
  let idx = 0;
  board.split("").forEach((token) => {
    if (token === "/") {
      return;
    }

    if (isPiece(token)) {
      pieces[idx] = {
        type: token,
        color: isWhitePiece(token) ? "w" : "b",
      };

      idx++;
    } else {
      const n = parseInt(token);
      if (isNaN(n)) {
        throw new Error("invalid FEN");
      }

      for (let i = 0; i < n; i++) {
        idx++;
      }
    }
  });

  return {
    pieces,
    active,
    halfmove: parseInt(halfmove),
    fullmove: parseInt(fullmove),
  };
};

class Chess {
  private _pieces: Piece[];

  constructor(fen: string = INITIAL_BOARD_FEN) {
    const { pieces } = parseFen(fen);
    this._pieces = pieces;
  }

  move(from: TSquare, to: TSquare) {
    const startidx = SQUARES.indexOf(from);
    const endidx = SQUARES.indexOf(to);

    const piece = this._pieces[startidx];
    this._pieces[startidx] = undefined;
    this._pieces[endidx] = piece;
  }

  get squares(): Square[][] {
    const result = [];

    for (let rank = 0; rank < 8; rank++) {
      const row = [];

      for (let file = 0; file < 8; file++) {
        const idx = rank * 8 + file;

        if (this._pieces[idx]) {
          row.push({
            kind: "piece",
            piece: this._pieces[idx],
            square: SQUARES[idx],
          });
        } else {
          row.push({
            kind: "empty",
            square: SQUARES[idx],
          });
        }
      }

      result.push(row);
    }

    return result;
  }
}

export default Chess;
