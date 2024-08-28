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

// TODO: castling and enpassant.
interface FenResult {
  pieces: AnyPieceSymbol[];
  active: Color;
  halfmove: number;
  fullmove: number;
}

export const parseFen = (fen: string): FenResult => {
  const [originalBoard, active, _castling, _enpassant, halfmove, fullmove] =
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

  return {
    pieces,
    active,
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

const oneOf = <T>(p: T, matches: T[]): boolean => matches.includes(p);

class Chess {
  public active: Color = "w";
  public ep: number = -1;

  private _pieces: AnyPieceSymbol[];

  constructor(fen: string = INITIAL_BOARD_FEN) {
    const { pieces, active } = parseFen(fen);
    this._pieces = pieces;
    this.active = active;
  }

  moves(sq: Square): Square[] {
    const idx = SQUARES.indexOf(sq);
    const piece = this._pieces[idx];
    if (!isPiece(piece)) {
      return [];
    }

    // Map to mailbox64 to account for the extra padding in mailbox.
    const startingIndex = mailbox64[idx];
    return rays(piece)
      .flatMap((dir) => {
        let expanded = [];
        let cur = 0;

        // Expand rays into a list of all possible index offsets.
        while (true) {
          cur = cur + dir;
          const mb: number = mailbox[cur + startingIndex];
          if (mb === -1) {
            break;
          }

          const dest = this._pieces[mb];
          if (isSameColor(piece, dest)) {
            break;
          }

          // Remove invalid moves for pawns
          if (oneOf(piece, ["p", "P"])) {
            if (oneOf(dir, [N, N + N]) && !isEmpty(dest)) {
              break;
            }

            if (oneOf(dir, [S, S + S]) && !isEmpty(dest)) {
              break;
            }

            if (
              dir === N + N &&
              isWhitePiece(piece) &&
              (idx > 55 || idx < 48)
            ) {
              break;
            }

            if (dir === S + S && isBlackPiece(piece) && (idx > 15 || idx < 8)) {
              break;
            }

            if (oneOf(dir, [N + W, N + E]) && isEmpty(dest) && mb !== this.ep) {
              break;
            }

            if (oneOf(dir, [S + W, S + E]) && isEmpty(dest) && mb !== this.ep) {
              break;
            }
            // TODO: promotions
          }

          // Stop seek for knights, kings, and pawns
          if (oneOf(piece, ["k", "K", "n", "N", "p", "P"])) {
            expanded.push(cur);
            break;
          }

          if (isPiece(dest) && isSameColor(piece, dest)) {
            break;
          } else if (isPiece(dest)) {
            expanded.push(cur);
            break;
          }

          expanded.push(cur);
        }

        return expanded;
      })
      .map((dir) => SQUARES[mailbox[dir + mailbox64[idx]]]);
  }

  move(from: Square, to: Square) {
    if (!this.moves(from).includes(to)) {
      return;
    }

    const startidx = SQUARES.indexOf(from);
    const endidx = SQUARES.indexOf(to);

    const piece = this._pieces[startidx];
    this._pieces[startidx] = ".";
    this._pieces[endidx] = piece;

    if (oneOf(piece, ["p", "P"])) {
      // Index offsets are in increments of 8, not 10, since we're using
      // SQUARES indexes and not mailbox. A little confusing.
      if (Math.abs(endidx - startidx) === 16) {
        this.ep = piece === "P" ? startidx - 8 : startidx + 8;
      } else if (endidx === this.ep) {
        const epCapture = piece === "P" ? endidx + 8 : endidx - 8;
        this._pieces[epCapture] = ".";
      } else {
        this.ep = -1;
      }
    }

    // TODO: promotion
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
