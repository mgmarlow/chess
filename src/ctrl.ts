import Chess, { BoardSquare, isWhitePiece, Square } from "./chess";

export default class Ctrl {
  public selected?: Square;
  public chess: Chess;

  constructor(private render: () => void) {
    this.chess = new Chess();
  }

  get selectedMoves(): Square[] {
    if (!this.selected) {
      return [];
    }

    return this.chess.moves(this.selected);
  }

  handleClick(sq: BoardSquare) {
    if (this.selected) {
      this.chess.move(this.selected, sq.square);
      this.selected = undefined;
    } else if (isWhitePiece(sq.type)) {
      this.selected = sq.square;
    }

    this.render();

    // Might want to timeout this.
    if (this.chess.active === "b") {
      const cpuMove = this.chess.blackMove();
      this.chess.move(cpuMove.from, cpuMove.to);
      this.render();
    }
  }
}
