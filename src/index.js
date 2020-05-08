const root = document.documentElement;
const container = document.getElementById("container");
const containerRect = container.getBoundingClientRect();
const timeoutMs = 0;
let timeoutId;
let isDragging = false;

let state = {
  items: [
    {
      name: "Apples",
      orderId: 0,
      domNode: null,
    },
    {
      name: "Oranges",
      orderId: 1,
      domNode: null,
    },
    {
      name: "Bananas",
      orderId: 2,
      domNode: null,
    },
  ],
};

function render(props) {
  return props.items.map((item) => {
    const topOffsetPx = `${item.orderId * 50}px`;
    const liElement = document.createElement("li");
    liElement.id = item.name;
    liElement.append(item.name);
    liElement.style.setProperty("top", topOffsetPx);
    return liElement;
  });
}

function mountIntoDOM(elements, target) {
  target.append(...elements);
}

function bindDomNodesToState() {
  state.items.forEach((item) => {
    item.domNode = document.getElementById(item.name);
  });
}

function logEvent(e) {
  console.log(
    `${e.type}, target: ${e.target.id}, currentTarget: ${e.currentTarget.id}, timeStamp: ${e.timeStamp}`
  );
}

function setDraggingClass(element, value) {
  element.classList.toggle("dragging", value);
}

function startDragging(element, offset) {
  console.log("startDragging");
  // [dragOffsetX, dragOffsetY] = offset;
  isDragging = true;
  setDraggingClass(element, true);
}

function stopDragging(element) {
  console.log("stopDragging");
  isDragging = false;
  setDraggingClass(element, false);
}

function handleMouseDown(e) {
  logEvent(e);
  const element = e.currentTarget;
  const offset = [e.offsetX, e.offsetY];
  timeoutId = setTimeout(startDragging.bind(null, element, offset), timeoutMs);
}

function handleMouseUp(e) {
  logEvent(e);
  clearTimeout(timeoutId);
  stopDragging(e.currentTarget);
}

function init() {
  const elements = render(state);
  mountIntoDOM(elements, container);
  bindDomNodesToState();
}

init();

state.items.forEach((item) => {
  item.domNode.addEventListener("mousedown", handleMouseDown);
  item.domNode.addEventListener("mouseup", handleMouseUp);
});
