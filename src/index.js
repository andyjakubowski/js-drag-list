const root = document.documentElement;
const container = document.getElementById("container");
const containerRect = container.getBoundingClientRect();
const itemApples = document.getElementById("item-apples");
const itemOranges = document.getElementById("item-oranges");
const itemBananas = document.getElementById("item-bananas");
const items = [itemApples, itemOranges, itemBananas];
const timeoutMs = 0;
let timeoutId;
let isDragging = false;

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

items.forEach((item) => {
  item.addEventListener("mousedown", handleMouseDown);
  item.addEventListener("mouseup", handleMouseUp);
});
