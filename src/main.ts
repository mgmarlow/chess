import {
  h,
  init,
  classModule,
  propsModule,
  eventListenersModule,
  VNode,
} from "snabbdom";
import "./main.css";
import { parseFen, Square, Color, INITIAL_BOARD_FEN } from "./chess";

interface Data {
  fen: string;
  selected?: string;
}

let data: Data = { fen: INITIAL_BOARD_FEN };
let vnode: VNode;

const render = () => {
  vnode = patch(vnode, view(data));
};

const patch = init([classModule, propsModule, eventListenersModule]);

const hSquare = (sq: Square, bg: Color) => {
  const contents = sq.kind === "piece" ? [sq.type] : undefined;

  let bgClass: string = bg;
  if (data?.selected === sq.square) {
    bgClass = bg === "w" ? "w-selected" : "b-selected";
  }

  return h(
    `div.square.${bgClass}`,
    {
      on: {
        click: () => {
          if (sq.kind === "piece") {
            data.selected = sq.square;
          }
          render();
        },
      },
    },
    contents
  );
};

const hBoard = (fen: string) => {
  const { squares } = parseFen(fen);

  return h(
    "div.board",
    squares.map((rank, ri) =>
      h(
        "div.rank",
        rank.map((sq, fi) => {
          const bg = (ri + fi) % 2 === 0 ? "w" : "b";
          return hSquare(sq, bg);
        })
      )
    )
  );
};

const view = (data: Data) => h("div.container", [hBoard(data.fen)]);

window.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector<HTMLDivElement>("#app")!;
  vnode = patch(container, view(data));
});
