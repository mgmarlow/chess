import {
  h,
  init,
  classModule,
  propsModule,
  eventListenersModule,
  VNode,
} from "snabbdom";
import "./main.css";
import Chess, { Square, PieceSquare, Color, INITIAL_BOARD_FEN } from "./chess";

interface Data {
  chess: Chess;
  selected?: string;
}

let data: Data = { chess: new Chess(INITIAL_BOARD_FEN) };
let vnode: VNode;

const render = () => {
  vnode = patch(vnode, view(data));
};

const patch = init([classModule, propsModule, eventListenersModule]);

const hSquare = (sq: Square, bg: Color) => {
  let bgClass: string = bg;
  if (data?.selected === sq.square) {
    bgClass = bg === "w" ? "w-selected" : "b-selected";
  }

  const img = ({ type, color }: PieceSquare) =>
    `/caliente/${type.toLowerCase()}${color}.svg`;

  const contents =
    sq.kind === "piece" ? [h("img", { props: { src: img(sq) } })] : undefined;

  return h(
    `div.square.${bgClass}`,
    {
      on: {
        click: () => {
          if (sq.kind === "piece") {
            data.selected = sq.square;
          }
          console.log(sq.square);
          render();
        },
      },
    },
    contents,
  );
};

const hBoard = (squares: Square[][]) =>
  h(
    "div.board",
    squares.map((rank, ri) =>
      h(
        "div.rank",
        rank.map((sq, fi) => {
          const bg = (ri + fi) % 2 === 0 ? "w" : "b";
          return hSquare(sq, bg);
        }),
      ),
    ),
  );

const view = (data: Data) => h("div.container", [hBoard(data.chess.squares)]);

window.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector<HTMLDivElement>("#app")!;
  vnode = patch(container, view(data));
});
