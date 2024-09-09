import { filterMap } from "./common";

export const INITIAL_BOARD_FEN =
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

export type EmptySymbol = ".";
export type WhitePieceSymbol = "p" | "n" | "b" | "r" | "q" | "k";
export type BlackPieceSymbol = "P" | "N" | "B" | "R" | "Q" | "K";
export type PieceSymbol = WhitePieceSymbol | BlackPieceSymbol;
export type AnyPieceSymbol = EmptySymbol | PieceSymbol;

export type Color = "w" | "b";

// prettier-ignore
export type Square =
  'a8' | 'b8' | 'c8' | 'd8' | 'e8' | 'f8' | 'g8' | 'h8' |
  'a7' | 'b7' | 'c7' | 'd7' | 'e7' | 'f7' | 'g7' | 'h7' |
  'a6' | 'b6' | 'c6' | 'd6' | 'e6' | 'f6' | 'g6' | 'h6' |
  'a5' | 'b5' | 'c5' | 'd5' | 'e5' | 'f5' | 'g5' | 'h5' |
  'a4' | 'b4' | 'c4' | 'd4' | 'e4' | 'f4' | 'g4' | 'h4' |
  'a3' | 'b3' | 'c3' | 'd3' | 'e3' | 'f3' | 'g3' | 'h3' |
  'a2' | 'b2' | 'c2' | 'd2' | 'e2' | 'f2' | 'g2' | 'h2' |
  'a1' | 'b1' | 'c1' | 'd1' | 'e1' | 'f1' | 'g1' | 'h1'

export const isWhitePiece = (str: string): str is WhitePieceSymbol =>
  str.match(/^[PNBRQK]$/) !== null;
export const isBlackPiece = (str: string): str is BlackPieceSymbol =>
  str.match(/^[pnbrqk]$/) !== null;
export const isPiece = (str: string): str is PieceSymbol =>
  isWhitePiece(str) || isBlackPiece(str);
export const isEmpty = (str: string): str is EmptySymbol => str === ".";

export const isColor = (str: string): str is Color =>
  str === "w" || str === "b";
export const color = (p: PieceSymbol): Color => (isWhitePiece(p) ? "w" : "b");

const isSameColor = (p: AnyPieceSymbol, o: AnyPieceSymbol): boolean => {
  if (!isPiece(p) || !isPiece(o)) {
    return false;
  }

  return color(p) === color(o);
};

export type BoardSquare = { type: AnyPieceSymbol; square: Square };

type CastleRights = Partial<Record<"k" | "K" | "q" | "Q", boolean>>;

// TODO: castling and enpassant.
interface FenResult {
  pieces: AnyPieceSymbol[];
  active: Color;
  castleRights: CastleRights;
  halfmove: number;
  fullmove: number;
}

export const parseFen = (fen: string): FenResult => {
  const [originalBoard, active, castling, _enpassant, halfmove, fullmove] =
    fen.split(" ");
  const board = originalBoard.replace(/\//g, "");

  if (!isColor(active)) {
    throw new Error("invalid FEN: expecting active color");
  }

  let pidx = 0;
  const pieces: AnyPieceSymbol[] = new Array(64).fill(".");
  for (let i = 0; i < board.length; i++) {
    const token = board[i];
    if (isPiece(token)) {
      pieces[pidx] = token;
      pidx++;
      continue;
    }

    const n = parseInt(token);
    if (isNaN(n)) {
      throw new Error("invalid FEN: expecting integer");
    }
    pidx += n;
  }

  const castleRights: CastleRights =
    castling === "-"
      ? {}
      : castling.split("").reduce((acc: CastleRights, cur) => {
          acc[cur as "k" | "K" | "q" | "Q"] = true;
          return acc;
        }, {});

  return {
    pieces,
    active,
    castleRights,
    halfmove: parseInt(halfmove),
    fullmove: parseInt(fullmove),
  };
};

// prettier-ignore
export const SQUARES: Square[] = [
  'a8', 'b8', 'c8', 'd8', 'e8', 'f8', 'g8', 'h8',
  'a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7',
  'a6', 'b6', 'c6', 'd6', 'e6', 'f6', 'g6', 'h6',
  'a5', 'b5', 'c5', 'd5', 'e5', 'f5', 'g5', 'h5',
  'a4', 'b4', 'c4', 'd4', 'e4', 'f4', 'g4', 'h4',
  'a3', 'b3', 'c3', 'd3', 'e3', 'f3', 'g3', 'h3',
  'a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2',
  'a1', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1'
]

// Use these indices when mapping from SQUARES to mailbox
// since we have to account for the extra padding.
// prettier-ignore
const mailbox64 = [
  21, 22, 23, 24, 25, 26, 27, 28,
  31, 32, 33, 34, 35, 36, 37, 38,
  41, 42, 43, 44, 45, 46, 47, 48,
  51, 52, 53, 54, 55, 56, 57, 58,
  61, 62, 63, 64, 65, 66, 67, 68,
  71, 72, 73, 74, 75, 76, 77, 78,
  81, 82, 83, 84, 85, 86, 87, 88,
  91, 92, 93, 94, 95, 96, 97, 98
];

// prettier-ignore
const mailbox = [
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
  -1,  0,  1,  2,  3,  4,  5,  6,  7, -1,
  -1,  8,  9, 10, 11, 12, 13, 14, 15, -1,
  -1, 16, 17, 18, 19, 20, 21, 22, 23, -1,
  -1, 24, 25, 26, 27, 28, 29, 30, 31, -1,
  -1, 32, 33, 34, 35, 36, 37, 38, 39, -1,
  -1, 40, 41, 42, 43, 44, 45, 46, 47, -1,
  -1, 48, 49, 50, 51, 52, 53, 54, 55, -1,
  -1, 56, 57, 58, 59, 60, 61, 62, 63, -1,
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1
];

// Index offset for moves relative to piece.
const [N, E, S, W] = [-10, 1, 10, -1];

const rays = (p: PieceSymbol) => {
  switch (p) {
    case "p":
      return [S, S + S, S + W, S + E];
    case "P":
      return [N, N + N, N + W, N + E];
    case "n":
    case "N":
      return [
        N + N + E,
        E + N + E,
        E + S + E,
        S + S + W,
        S + S + E,
        W + S + W,
        W + N + W,
        N + N + W,
      ];
    case "b":
    case "B":
      return [N + E, S + E, S + W, N + W];
    case "r":
    case "R":
      return [N, E, S, W];
    case "q":
    case "Q":
      return [N, E, S, W, N + E, S + E, S + W, N + W];
    case "k":
    case "K":
      return [N, E, S, W, N + E, S + E, S + W, N + W];
  }
};

export type Moves = Partial<Record<Square, Square[]>>;

class Chess {
  public active: Color = "w";
  public ep: number = -1;
  public castleRights: CastleRights = {};

  private _pieces: AnyPieceSymbol[];
  private _lastMove?: Square;

  constructor(fen: string = INITIAL_BOARD_FEN) {
    const { pieces, active, castleRights } = parseFen(fen);
    this._pieces = pieces;
    this.active = active;
    this.castleRights = castleRights;
  }

  move({ from, to }: { from: Square; to: Square }) {
    const tmp = this._pieces[SQUARES.indexOf(from)];
    this._pieces[SQUARES.indexOf(from)] = ".";
    this._pieces[SQUARES.indexOf(to)] = tmp;
  }

  moves(): Moves {
    const moves: Moves = {};

    for (let i = 0; i < 64; i++) {
      const piece: AnyPieceSymbol = this._pieces[i];
      if (isEmpty(piece)) {
        continue;
      }

      const currentMoves: Square[] = [];
      if (color(piece) === this.active) {
        if (piece === "P") {
          if (this._pieces[i - 7] && isBlackPiece(this._pieces[i - 7])) {
            currentMoves.push(SQUARES[i - 7]);
          }

          if (this._pieces[i - 9] && isBlackPiece(this._pieces[i - 9])) {
            currentMoves.push(SQUARES[i - 9]);
          }

          if (isEmpty(this._pieces[i - 8])) {
            currentMoves.push(SQUARES[i - 8]);
          }

          if (i >= 48 && isEmpty(this._pieces[i - 16])) {
            currentMoves.push(SQUARES[i - 16]);
          }
        } else if (piece === "p") {
          if (this._pieces[i + 7] && isWhitePiece(this._pieces[i + 7])) {
            currentMoves.push(SQUARES[i + 7]);
          }

          if (this._pieces[i + 9] && isWhitePiece(this._pieces[i + 9])) {
            currentMoves.push(SQUARES[i + 9]);
          }

          if (isEmpty(this._pieces[i + 8])) {
            currentMoves.push(SQUARES[i + 8]);
          }

          if (i >= 48 && isEmpty(this._pieces[i + 16])) {
            currentMoves.push(SQUARES[i + 16]);
          }
        } else {
          rays(piece).forEach((dir) => {
            let cur = mailbox64[i];
            while (true) {
              const n = mailbox[cur + dir];
              if (n === -1) {
                break;
              }

              const dest = this._pieces[n];
              if (!isEmpty(dest)) {
                if (color(dest) !== color(piece)) {
                  currentMoves.push(SQUARES[n]);
                }
                break;
              }

              currentMoves.push(SQUARES[n]);

              // Stop seek for knights and kings.
              if (["n", "N", "k", "K"].includes(piece)) {
                break;
              }
              cur += dir;
            }
          });
        }
      }

      moves[SQUARES[i]] = currentMoves;
    }

    return moves;
  }

  get squares(): BoardSquare[][] {
    const result: BoardSquare[][] = [];

    for (let rank = 0; rank < 8; rank++) {
      const row: BoardSquare[] = [];

      for (let file = 0; file < 8; file++) {
        const idx = rank * 8 + file;

        row.push({ type: this._pieces[idx], square: SQUARES[idx] });
      }

      result.push(row);
    }

    return result;
  }
}

export default Chess;
