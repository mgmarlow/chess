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

export type BoardSquare = { type: AnyPieceSymbol; square: Square };

type CastleRights = Partial<Record<"k" | "K" | "q" | "Q", boolean>>;

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
    default:
      throw new Error("pawns don't use rays");
  }
};

type Flags = "x" | "m" | "p" | "c";

export interface Move {
  fromidx: number;
  from: Square;
  toidx: number;
  to: Square;
  piece: PieceSymbol;
  flags: Flags;
}

export type Moves = Partial<Record<Square, Move[]>>;

export const toUCI = (move: Move): string => {
  // TODO: if isPromotion then + move.piece. Problem is that we lose promotion
  // information in the current implementation. Maybe we should always use
  // UCI moves, which preserve promotions.
  return move.from + move.to;
};

class Chess {
  public active: Color = "w";
  public lastMove?: Move;

  private _pieces: AnyPieceSymbol[];
  private _castleRights: CastleRights;
  private _ep: number = -1;

  constructor(fen: string = INITIAL_BOARD_FEN) {
    const { pieces, active, castleRights } = parseFen(fen);
    this._pieces = pieces;
    this.active = active;
    this._castleRights = castleRights;
  }

  // Lichess puzzles follow the UCI format. There's an argument to
  // be made that the regular #move function should also use UCI.
  uciMove(uci: string) {
    const from = uci.substring(0, 2) as Square;
    const to = uci.substring(2, 4) as Square;

    const fromidx = SQUARES.indexOf(from);
    if (fromidx === -1) {
      throw new Error("invalid from square");
    }

    const toidx = SQUARES.indexOf(to);
    if (toidx === -1) {
      throw new Error("invalid to square");
    }

    const promotion = uci[4];
    // TODO: should probably actually typecheck this.
    const piece =
      promotion === undefined
        ? this._pieces[fromidx]
        : this.active === "w"
          ? promotion.toUpperCase()
          : promotion;

    let flags: Flags = "m";
    if (uci === "e1g1" || uci === "e1c1" || uci === "e8g8" || uci === "e8c8") {
      flags = "c";
    }

    const move: Move = {
      fromidx,
      from,
      toidx,
      to,
      piece: piece as PieceSymbol,
      flags,
    };

    this.move(move);
  }

  // Remaining work:
  // TODO: move into check.
  // TODO: castle into check.
  move(move: Move): boolean {
    this.lastMove = move;
    const { fromidx, from, toidx, piece, flags } = move;
    this.active = this.active === "w" ? "b" : "w";

    if (flags === "c") {
      if (toidx > fromidx) {
        this._pieces[fromidx] = ".";
        this._pieces[toidx] = piece;
        this._pieces[toidx - 1] = isWhitePiece(piece) ? "R" : "r";
        this._pieces[toidx + 1] = ".";
      } else {
        this._pieces[fromidx] = ".";
        this._pieces[toidx] = piece;
        this._pieces[toidx + 1] = isWhitePiece(piece) ? "R" : "r";
        this._pieces[toidx - 2] = ".";
      }
      this._ep = -1;
      return true;
    }

    this._pieces[fromidx] = ".";
    this._pieces[toidx] = piece;
    // If we're moving into an en passant square make sure to clean
    // up the original pawn.
    if (toidx === this._ep) {
      const offset = color(piece) === "w" ? 8 : -8;
      this._pieces[this._ep + offset] = ".";
    }

    if (Math.abs(fromidx - toidx) === 16) {
      this._ep = fromidx - toidx > 0 ? fromidx - 8 : fromidx + 8;
    } else {
      this._ep = -1;
    }

    // Update castle rights on rook/king movement.
    if (from === "e1" || from === "h1") {
      this._castleRights.K = false;
    }

    if (from === "e1" || from === "a1") {
      this._castleRights.Q = false;
    }

    if (from === "e8" || from === "h8") {
      this._castleRights.k = false;
    }

    if (from === "e8" || from === "a8") {
      this._castleRights.q = false;
    }

    return true;
  }

  isEmpty(idx: number): boolean;
  isEmpty(sq: Square): boolean;
  isEmpty(arg: Square | number) {
    if (typeof arg === "number") {
      return isEmpty(this._pieces[arg]);
    }

    return isEmpty(this._pieces[SQUARES.indexOf(arg)]);
  }

  private buildMove(from: number, to: number, flags: Flags = "m"): Move {
    const piece = this._pieces[from];
    if (isEmpty(piece)) {
      throw new Error("invalid move: empty piece");
    }

    // Promotions.
    if (piece === "P" && to >= 0 && to <= 7) {
      flags = "p";
    }

    if (piece === "p" && to >= 56 && to <= 63) {
      flags = "p";
    }

    return {
      fromidx: from,
      toidx: to,
      from: SQUARES[from],
      to: SQUARES[to],
      piece,
      flags,
    };
  }

  // Note that en passant attack squares are empty, whereas normal pawn
  // attack squares require an occupant.
  private isPawnAttackTarget(destidx: number, fromColor: Color): boolean {
    const isDifferentColor: boolean =
      !isEmpty(this._pieces[destidx]) &&
      fromColor === color(this._pieces[destidx]);

    return destidx === this._ep || isDifferentColor;
  }

  moves(): Moves {
    const moves: Moves = {};

    for (let i = 0; i < 64; i++) {
      const piece: AnyPieceSymbol = this._pieces[i];
      if (isEmpty(piece)) {
        continue;
      }

      const currentMoves: Move[] = [];
      if (color(piece) === this.active) {
        // For pawns, don't bother with rays. It just adds extra complexity.
        if (piece === "P") {
          if (this.isPawnAttackTarget(i - 7, "w")) {
            currentMoves.push(this.buildMove(i, i - 7));
          }

          if (this.isPawnAttackTarget(i - 9, "w")) {
            currentMoves.push(this.buildMove(i, i - 9));
          }

          if (this.isEmpty(i - 8)) {
            currentMoves.push(this.buildMove(i, i - 8));
          }

          if (i >= 48 && this.isEmpty(i - 16)) {
            currentMoves.push(this.buildMove(i, i - 16));
          }
        } else if (piece === "p") {
          if (this.isPawnAttackTarget(i + 7, "b")) {
            currentMoves.push(this.buildMove(i, i + 7));
          }

          if (this.isPawnAttackTarget(i + 9, "b")) {
            currentMoves.push(this.buildMove(i, i + 9));
          }

          if (this.isEmpty(i + 8)) {
            currentMoves.push(this.buildMove(i, i + 8));
          }

          if (i <= 15 && this.isEmpty(i + 16)) {
            currentMoves.push(this.buildMove(i, i + 16));
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
                  currentMoves.push(this.buildMove(i, n));
                }
                break;
              }

              currentMoves.push(this.buildMove(i, n));

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

    // Castling.
    if (this.active === "w") {
      moves["e1"] = moves["e1"] || [];
      if (this._castleRights.K && this.isEmpty("f1") && this.isEmpty("g1")) {
        moves["e1"].push(this.buildMove(60, 62, "c"));
      }

      if (
        this._castleRights.Q &&
        this.isEmpty("d1") &&
        this.isEmpty("c1") &&
        this.isEmpty("b1")
      ) {
        moves["e1"].push(this.buildMove(60, 58, "c"));
      }
    } else {
      moves["e8"] = moves["e8"] || [];
      if (this._castleRights.k && this.isEmpty("f8") && this.isEmpty("g8")) {
        moves["e8"].push(this.buildMove(4, 6, "c"));
      }

      if (
        this._castleRights.q &&
        this.isEmpty("d8") &&
        this.isEmpty("c8") &&
        this.isEmpty("b8")
      ) {
        moves["e8"].push(this.buildMove(4, 2, "c"));
      }
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
