const container = document.getElementById("container");
const containerRect = container.getBoundingClientRect();
const timeoutMs = 0;
let timeoutId;

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
  isDragging: false,
  draggedElement: null,
  dragOffset: {
    y: 0,
  },
  maxZIndex: 10,
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
  [state.dragOffset.x, state.dragOffset.y] = offset;
  state.isDragging = true;
  state.draggedElement = element;
  state.maxZIndex += 1;
  state.draggedElement.style.setProperty("z-index", `${state.maxZIndex}`);
  setDraggingClass(state.draggedElement, true);
  setDraggingClass(container, true);
}

function stopDragging(element) {
  console.log("stopDragging");
  state.isDragging = false;
  setDraggingClass(state.draggedElement, false);
  setDraggingClass(container, false);
  state.draggedElement = null;
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

  if (state.isDragging) {
    stopDragging(state.draggedElement);
  }
}

function handleSelect(e) {
  if (state.isDragging) {
    e.preventDefault();
  }
}

function handleMouseMove(e) {
  logEvent(e);

  if (!state.isDragging) {
    return;
  }

  const el = state.draggedElement;
  const elRect = el.getBoundingClientRect();
  const preferredY = e.clientY - containerRect.top - state.dragOffset.y;
  const y = Math.min(
    Math.max(preferredY, 0),
    containerRect.height - elRect.height
  );

  el.style.setProperty("top", `${y}px`);
}

function init() {
  const elements = render(state);
  mountIntoDOM(elements, container);
  bindDomNodesToState();
}

init();

state.items.forEach((item) => {
  item.domNode.addEventListener("mousedown", handleMouseDown);
});

document.body.addEventListener("mouseup", handleMouseUp);
document.body.addEventListener("mousemove", handleMouseMove);
document.body.addEventListener("select", handleSelect);
