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
export interface PieceSquare {
  kind: "piece";
  square: string;
  type: Piece;
  color: Color;
}

export interface EmptySquare {
  kind: "empty";
  square: string;
}

export type Square = PieceSquare | EmptySquare;

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

  const components = board.split("/");
  if (components.length !== 8) {
    throw new Error("invalid FEN");
  }

  const coord = (row: number, ci: number) => "abcdefgh"[ci] + `${8 - row}`;

  const squares = components
    .map((rank) => rank.split(""))
    .map((rankarr, rowi) =>
      rankarr.reduce((acc, cmp, ci) => {
        if (isPiece(cmp)) {
          acc.push({
            kind: "piece",
            color: isWhitePiece(cmp) ? "w" : "b",
            type: cmp,
            square: coord(rowi, ci),
          });
          return acc;
        }

        const n = parseInt(cmp);
        if (isNaN(n)) {
          throw new Error("invalid FEN");
        }

        for (let i = 0; i < n; i++) {
          acc.push({ kind: "empty", square: coord(rowi, ci) });
        }

        return acc;
      }, [])
    );

  return {
    squares,
    active,
    halfmove: parseInt(halfmove),
    fullmove: parseInt(fullmove),
  };
};

class Chess {
  public squares: Square[][];

  constructor(fen: string = INITIAL_BOARD_FEN) {
    const { squares } = parseFen(fen);
    this.squares = squares;
  }

  get fen(): string {
    return "";
  }
}

export default Chess;
