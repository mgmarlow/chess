import {
  h,
  init,
  patch,
  classModule,
  propsModule,
  eventListenersModule,
} from "snabbdom";
import "./main.css";

const INITIAL_BOARD_FEN =
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const WHITE_BG = "#f0d9b5";
const BLACK_BG = "#b58863";
const RANKS = 8;
const FILES = 8;

const isWhitePiece = (str: string) => str.match(/^[PNBRQK]$/);
const isBlackPiece = (str: string) => str.match(/^[pnbrqk]$/);
const isPiece = (str: string) => isWhitePiece(str) || isBlackPiece(str);

const patch = init([classModule, propsModule, eventListenersModule]);
const container = document.querySelector<HTMLDivElement>("#app")!;

type Square =
  | {
      kind: "piece";
      color: "w" | "b";
      piece: "p" | "n" | "b" | "r" | "q" | "k";
    }
  | {
      kind: "empty";
      color: "w" | "b";
    };

const hBoard = (squares: Square[][]) =>
  h(
    "div.board",
    squares.map((rank, ri) => {
      return h(
        "div.rank",
        rank.map((sq, fi) => h(`div.square.${sq.color}`))
      );
    })
  );

// tmp, todo fen
let squares = [];
for (let i = 0; i < 8; i++) {
  const row = [];
  for (let j = 0; j < 8; j++) {
    const color = (i + j) % 2 === 0 ? "w" : "b";
    row.push({ color, kind: "empty" });
  }
  squares.push(row);
}

const view = () => h("div.container", [hBoard(squares)]);

patch(container, view());
