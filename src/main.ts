import {
  init,
  classModule,
  propsModule,
  eventListenersModule,
  VNode,
} from "snabbdom";
import "./main.css";
import Ctrl from "./ctrl";
import { view } from "./view";

let vnode: VNode;

const patch = init([classModule, propsModule, eventListenersModule]);

window.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector<HTMLDivElement>("#app")!;

  const ctrl = new Ctrl(render);

  function render() {
    vnode = patch(vnode, view(ctrl));
  }

  vnode = patch(container, view(ctrl));
});
