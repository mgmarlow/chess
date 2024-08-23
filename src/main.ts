import {
  h,
  init,
  classModule,
  propsModule,
  eventListenersModule,
  VNode,
} from "snabbdom";
import "./main.css";
import Chess, { BoardSquare, Square, Piece, Color } from "./chess";

interface Data {
  chess: Chess;
  selected?: Square;
}

let data: Data = { chess: new Chess() };
let vnode: VNode;

const render = () => {
  vnode = patch(vnode, view(data));
};

const patch = init([classModule, propsModule, eventListenersModule]);

const hSquare = (sq: BoardSquare, bg: Color, moveHighlight: boolean) => {
  const isSelected = data?.selected === sq.square;

  const img = ({ type, color }: Piece) =>
    `/caliente/${type.toLowerCase()}${color}.svg`;

  const contents =
    sq.kind === "piece"
      ? [h("img", { props: { src: img(sq.piece) } })]
      : undefined;

  // TODO: classnames
  return h(
    `div.square.${bg}${isSelected ? ".selected" : ""}${
      moveHighlight ? ".moveable" : ""
    }`,
    {
      on: {
        click: () => {
          if (data.selected) {
            data.chess.move(data.selected, sq.square);
            data.selected = undefined;
          } else if (sq.kind === "piece") {
            data.selected = sq.square;
          }

          render();
        },
      },
    },
    contents
  );
};

const hBoard = (chess: Chess) => {
  const moves = data?.selected === undefined ? [] : chess.moves(data.selected);

  return h(
    "div.board",
    chess.squares.map((rank, ri) =>
      h(
        "div.rank",
        rank.map((sq, fi) => {
          const bg = (ri + fi) % 2 === 0 ? "w" : "b";
          const moveHighlight = moves.indexOf(sq.square) !== -1;

          return hSquare(sq, bg, moveHighlight);
        })
      )
    )
  );
};

const view = (data: Data) => h("div.container", [hBoard(data.chess)]);

window.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector<HTMLDivElement>("#app")!;
  vnode = patch(container, view(data));
});
