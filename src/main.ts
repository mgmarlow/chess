import {
  h,
  init,
  classModule,
  propsModule,
  eventListenersModule,
  VNode,
} from "snabbdom";
import "./main.css";
import Chess, { isPiece, BoardSquare, Square, Color, color } from "./chess";

interface Data {
  chess: Chess;
  selected?: Square;
}

let data: Data = { chess: new Chess() };
let vnode: VNode;

const isObject = (value: any) =>
  value != null && (typeof value == "object" || typeof value == "function");

const classnames = (...args: (string | Record<string, boolean>)[]) => {
  let classes = "";

  for (let i = 0; i < args.length; i++) {
    if (args[i] && typeof args[i] === "string") {
      classes += args[i];
    } else if (isObject(args[i])) {
      Object.entries(args[i]).forEach(([key, value]) => {
        if (value) {
          classes += key;
        }
      });
    }
  }

  return classes;
};

const render = () => {
  vnode = patch(vnode, view(data));
};

const patch = init([classModule, propsModule, eventListenersModule]);

const hSquare = (sq: BoardSquare, bg: Color, moveHighlight: boolean) => {
  const isSelected = data?.selected === sq.square;

  const img = ({ type }: BoardSquare) =>
    `/caliente/${type.toLowerCase()}${color(type)}.svg`;

  const contents = isPiece(sq.type)
    ? [h("img", { props: { src: img(sq) } })]
    : undefined;

  const classes = classnames("div.square", `.${bg}`, {
    ".selected": isSelected,
    ".moveable": moveHighlight,
  });

  return h(
    classes,
    {
      on: {
        click: () => {
          if (data.selected) {
            data.chess.move(data.selected, sq.square);
            data.selected = undefined;
          } else if (isPiece(sq.type)) {
            data.selected = sq.square;
          }

          render();
        },
      },
    },
    contents,
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
        }),
      ),
    ),
  );
};

const view = (data: Data) => h("div.container", [hBoard(data.chess)]);

window.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector<HTMLDivElement>("#app")!;
  vnode = patch(container, view(data));
});
