import { h } from "snabbdom";
import { isPiece, BoardSquare, PieceSymbol, Color, color } from "./chess";
import { isObject } from "./common";
import Ctrl from "./ctrl";

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

const img = (type: PieceSymbol) =>
  `/caliente/${type.toLowerCase()}${color(type)}.svg`;

const hPromotion = (ctrl: Ctrl) => {
  const options: PieceSymbol[] = ["N", "B", "R", "Q"];

  const contents = options.map((piece) =>
    h("button.promote", { on: { click: () => ctrl.handlePromote(piece) } }, [
      h("img", { props: { src: img(piece) } }),
    ]),
  );

  return h("div.promotions", {}, [h("p", "Promote to:"), ...contents]);
};

const hSquare = (
  ctrl: Ctrl,
  sq: BoardSquare,
  bg: Color,
  moveHighlight: boolean,
) => {
  const isSelected = ctrl?.selected === sq.square;

  const contents = isPiece(sq.type)
    ? [h("img", { props: { src: img(sq.type) } })]
    : undefined;

  const classes = classnames("div.square", `.${bg}`, {
    ".selected": isSelected,
    ".moveable": moveHighlight && sq.type === ".",
    ".attackable": moveHighlight && sq.type !== ".",
    ".highlight":
      ctrl?.lastMove?.from === sq.square || ctrl?.lastMove?.to === sq.square,
  });

  return h(
    classes,
    {
      on: {
        click: () => ctrl.handleClick(sq),
      },
    },
    contents,
  );
};

const hBoard = (ctrl: Ctrl) => {
  return h(
    "div.board",
    ctrl.chess.squares.flatMap((rank, ri) =>
      rank.map((sq, fi) => {
        const bg = (ri + fi) % 2 === 0 ? "w" : "b";
        const moveHighlight =
          ctrl.selectedMoveSquares.indexOf(sq.square) !== -1;

        return hSquare(ctrl, sq, bg, moveHighlight);
      }),
    ),
  );
};

const hStatus = (ctrl: Ctrl) => {
  const content = [h("p", ctrl.status)];

  if (!ctrl.done) {
    content.push(h("button", "View solution"));
  }

  if (ctrl.state === "failure") {
    content.push(h("p", "Wrong."));
  } else if (ctrl.state === "success" && !ctrl.done) {
    content.push(h("p", "Correct! Keep going."));
  } else if (ctrl.state === "success" && ctrl.done) {
    content.push(
      h("div", [
        h("p", "Rate confidence:"),
        ...[0, 1, 2, 3, 4].map((i) => h("button", i)),
      ]),
    );
  }

  return h("div", content);
};

const hSidebar = (ctrl: Ctrl) => {
  const contents = [hStatus(ctrl)];

  if (ctrl.state === "promoting") {
    contents.push(hPromotion(ctrl));
  }

  return h("div.sidebar", contents);
};

export const view = (ctrl: Ctrl) =>
  h("main.container", [h("div.boardContainer", hBoard(ctrl)), hSidebar(ctrl)]);
