import Chess, {
  color,
  isEmpty,
  BoardSquare,
  Move,
  Moves,
  // isWhitePiece,
  Square,
  PieceSymbol,
  toUCI,
} from "./chess";
import { type Puzzle } from "./puzzle";

// TODO: board flip when black to play.
const test: Puzzle = {
  puzzleId: "00sO1",
  FEN: "1k1r4/pp3pp1/2p1p3/4b3/P3n1P1/8/KPP2PN1/3rBR1R b - - 2 31",
  moves: ["b8c7", "e1a5", "b7b6", "f1d1"],
  rating: 998,
  ratingDeviation: 85,
  popularity: 94,
  nbPlays: 293,
  themes: "advantage discoveredAttack master middlegame short",
  gameUrl: "https://lichess.org/vsfFkG0s/black#62",
  openingTags: "",
};

type State = "play" | "success" | "failure" | "promoting";

export default class Ctrl {
  public selected?: Square;
  public chess: Chess;
  public moves: Moves = {};
  public state: State = "play";
  public status: string;

  private promoteMove?: Move;
  private moveIndex: number;

  constructor(
    private render: () => void,
    private puzzle: Puzzle = test,
  ) {
    this.chess = new Chess(puzzle.FEN);
    const initialMove = puzzle.moves[0];
    this.chess.uciMove(initialMove);
    this.moves = this.chess.moves();
    this.status = this.chess.active === "w" ? "White to play" : "Black to play";
    this.moveIndex = 1;
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

  get done(): boolean {
    return this.moveIndex === this.puzzle.moves.length;
  }

  move(move: Move) {
    const correctMove = this.puzzle.moves[this.moveIndex];
    if (toUCI(move) !== correctMove) {
      this.state = "failure";
      return;
    }

    this.state = "success";
    this.chess.move(move);
    this.moves = this.chess.moves();
    this.moveIndex++;
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
    this.promoteMove = undefined;
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
    } else if (!isEmpty(sq.type) && color(sq.type) === this.chess.active) {
      this.selected = sq.square;
      this.moves = this.chess.moves();
    }

    this.render();
  }
}
