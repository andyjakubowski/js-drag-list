import seedData from "./seedData.js";
import utils from "./utilities.js";

const container = document.getElementById("container");
const timeoutMs = 0;
const itemHeight = 50;
let timeoutId;
let containerRect;

let state = {
  items: seedData,
  isDragging: false,
  draggedElement: null,
  dragOffset: {
    y: 0,
  },
  maxZIndex: 10,
};

function setContainerGeometry() {
  const height = state.items.length * itemHeight;
  container.style.setProperty("height", `${height}px`);
  containerRect = container.getBoundingClientRect();
}

function calculateTopOffset(orderId) {
  return `${orderId * itemHeight}px`;
}

function render(props) {
  console.log("render called with props:");
  console.log(props.items);
  return props.items.map((item, index) => {
    const topOffsetPx = calculateTopOffset(index);
    const liElement = document.createElement("li");
    liElement.id = item.name;
    liElement.dataset.orderId = index;
    liElement.append(item.name);
    liElement.style.setProperty("top", topOffsetPx);
    return liElement;
  });
}

function updateDom(items) {
  return items.map((item, index) => {
    const topOffsetPx = calculateTopOffset(index);
    const element = item.domNode;
    element.dataset.orderId = index;
    element.style.setProperty("top", topOffsetPx);
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

function setDraggingClass(element, value) {
  element.classList.toggle("dragging", value);
}

function snapIntoPosition(element) {
  console.log(
    `${element.id} has to snap into orderId: ${element.dataset.orderId}`
  );

  const offset = calculateTopOffset(element.dataset.orderId);
  element.style.setProperty("top", offset);
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
  snapIntoPosition(element);
}

function handleMouseDown(e) {
  utils.logEvent(e);
  const element = e.currentTarget;
  const offset = [e.offsetX, e.offsetY];
  timeoutId = setTimeout(startDragging.bind(null, element, offset), timeoutMs);
}

function handleMouseUp(e) {
  utils.logEvent(e);
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

function calculateOrderId(dragY, itemHeight, maxOrderId) {
  const measuredOrderId = Math.round(dragY / itemHeight);
  return utils.clamp(measuredOrderId, 0, maxOrderId);
}

function setItems(items) {
  state.items = items;
  updateDom(state.items);
}

function handleMouseMove(e) {
  if (!state.isDragging) {
    return;
  }

  const el = state.draggedElement;
  const elRect = el.getBoundingClientRect();
  const preferredY = e.pageY - containerRect.top - state.dragOffset.y;
  const y = utils.clamp(preferredY, 0, containerRect.height - elRect.height);
  const newOrderId = calculateOrderId(y, itemHeight, state.items.length - 1);

  if (newOrderId !== Number(el.dataset.orderId)) {
    const newItems = utils.move(
      state.items,
      Number(el.dataset.orderId),
      newOrderId
    );
    setItems(newItems);
  }

  el.style.setProperty("top", `${y}px`);
}

function init() {
  const elements = render(state);
  mountIntoDOM(elements, container);
  bindDomNodesToState();
  setContainerGeometry();
}

init();

state.items.forEach((item) => {
  item.domNode.addEventListener("mousedown", handleMouseDown);
});

document.body.addEventListener("mouseup", handleMouseUp);
document.body.addEventListener("mousemove", handleMouseMove);
document.body.addEventListener("select", handleSelect);
