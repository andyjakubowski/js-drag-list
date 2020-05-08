const root = document.documentElement;
const container = document.getElementById("container");
const containerRect = container.getBoundingClientRect();
const square = document.getElementById("square");
const squareRect = square.getBoundingClientRect();
const squircle = document.getElementById("squircle");
const squircleRect = squircle.getBoundingClientRect();
const timeout = 0;
let isDragging = false;
let timeoutId;
let x = 0;
let y = 0;
let dragOffsetX = 0;
let dragOffsetY = 0;
let squircleX = 360;
let squircleY = 60;

root.style.setProperty("--squircle-x", `${squircleX}px`);
root.style.setProperty("--squircle-y", `${squircleY}px`);

document.documentElement.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "s":
      console.log("---");
      break;
    case "c":
      console.clear();
      break;
  }
});

document.addEventListener("blur", (e) => {
  clearTimeout(timeoutId);
  stopDragging();
});

document.addEventListener("visibilitychange", (e) => {
  console.log(`visibilitychange; visibilityState: ${document.visibilityState}`);

  if (document.visibilityState === "hidden") {
    clearTimeout(timeoutId);
    stopDragging();
  }
});

function logEvent(e) {
  console.log(
    `${e.type}, target: ${e.target.id}, currentTarget: ${e.currentTarget.id}, timeStamp: ${e.timeStamp}`
  );
}

function logEventType(e) {
  console.log(e.type);
}

function setIsDragging(value) {
  isDragging = value;
}

function setDraggingStyle(element, value) {
  element.classList.toggle("dragging", value);
}

function startDragging(element, offset) {
  console.log("startDragging");
  [dragOffsetX, dragOffsetY] = offset;
  setIsDragging(true);
  setDraggingStyle(element, true);
}

function stopDragging() {
  console.log("stopDragging");
  setIsDragging(false);
  setDraggingStyle(square, false);
}

function handleMouseDown(e) {
  logEventType(e);
  const element = e.currentTarget;
  const offset = [e.offsetX, e.offsetY];
  timeoutId = setTimeout(startDragging.bind(null, element, offset), timeout);
}

function handleMouseUp(e) {
  logEventType(e);
  clearTimeout(timeoutId);
  stopDragging();
}

function handleMouseOut(e) {
  logEvent(e);

  if (!isDragging) {
    clearTimeout(timeoutId);
  }
}

function handleMouseLeave(e) {
  logEvent(e);

  if (isDragging) {
    // stopDragging();
  }
}

function handleMouseEnter(e) {
  logEvent(e);
}

function handleMouseOver(e) {
  e.stopPropagation();
  logEvent(e);
}

function doesOverlapSquircle() {
  const minXSquare = x;
  const maxXSquare = x + squareRect.width;
  const minXSquircle = squircleX;
  const maxXSquircle = squircleX + squircleRect.width;
  const minYSquare = y;
  const maxYSquare = y + squareRect.height;
  const minYSquircle = squircleY;
  const maxYSquircle = squircleY + squircleRect.height;

  return (
    maxXSquircle > minXSquare &&
    minXSquircle < maxXSquare &&
    maxYSquircle > minYSquare &&
    minYSquircle < maxYSquare
  );
}

function handleMouseMove(e) {
  // logEvent(e);

  if (!isDragging) {
    return;
  }

  const preferredX = e.clientX - containerRect.left - dragOffsetX;
  const preferredY = e.clientY - containerRect.top - dragOffsetY;
  x = Math.min(Math.max(preferredX, 0), containerRect.width - squareRect.width);
  y = Math.min(
    Math.max(preferredY, 0),
    containerRect.height - squareRect.height
  );

  if (doesOverlapSquircle(x, y)) {
    squircle.classList.toggle("overlapped", true);
  } else {
    squircle.classList.toggle("overlapped", false);
  }

  root.style.setProperty("--square-x", `${x}px`);
  root.style.setProperty("--square-y", `${y}px`);
}

square.addEventListener("mousedown", handleMouseDown);
document.body.addEventListener("mouseup", handleMouseUp);
// document.body.addEventListener("mouseenter", handleMouseEnter);
// document.body.addEventListener("mouseover", handleMouseOver);
// container.addEventListener("mouseover", handleMouseOver);
// container.addEventListener("mouseout", handleMouseOut);
square.addEventListener("mouseout", handleMouseOut);
// container.addEventListener("mouseleave", handleMouseLeave);
// square.addEventListener("mouseleave", handleMouseLeave);
// container.addEventListener("mousemove", handleMouseMove);
// document.body.addEventListener("mouseleave", handleMouseLeave);
document.body.addEventListener("mousemove", handleMouseMove);
