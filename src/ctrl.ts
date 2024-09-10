import Chess, {
  BoardSquare,
  Move,
  Moves,
  isWhitePiece,
  Square,
  PieceSymbol,
} from "./chess";

type State = "play" | "win" | "loss" | "promoting";

export default class Ctrl {
  public selected?: Square;
  public chess: Chess;
  public moves: Moves = {};
  public state: State = "play";

  private promoteMove?: Move;

  constructor(private render: () => void) {
    this.chess = new Chess();
  }

  get selectedMoveSquares(): Square[] {
    return this.selectedMoves.map((move) => move.to);
  }

  get selectedMoves(): Move[] {
    if (!this.selected) {
      return [];
    }

    return this.moves[this.selected] || [];
  }

  move(move: Move) {
    this.chess.move(move);
    this.moves = this.chess.moves();
  }

  handlePromote(piece: PieceSymbol) {
    if (!this.promoteMove) {
      throw new Error("invalid promotion");
    }

    const move: Move = {
      ...this.promoteMove,
      piece,
      flags: "m",
    };

    this.state = "play";
    this.move(move);
    this.render();
  }

  handleClick(sq: BoardSquare) {
    if (this.selected) {
      const move = this.selectedMoves.find((move) => move.to === sq.square);
      if (move) {
        if (move.flags.includes("p")) {
          this.promoteMove = move;
          this.state = "promoting";
        } else {
          this.move(move);
        }
      }

      this.selected = undefined;
    } else if (isWhitePiece(sq.type)) {
      this.selected = sq.square;
      this.moves = this.chess.moves();
    }

    this.render();

    // Might want to timeout this.
    // if (this.chess.active === "b") {
    //   const cpuMove = this.chess.blackMove();
    //   this.chess.move(cpuMove.from, cpuMove.to);
    //   this.render();
    // }
  }
}
