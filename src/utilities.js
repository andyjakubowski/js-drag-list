function logEvent(e) {
  console.log(
    `${e.type}, target: ${e.target.id}, currentTarget: ${e.currentTarget.id}, timeStamp: ${e.timeStamp}`
  );
}

function move(array, prevIndex, nextIndex) {
  const arrayCopy = [...array];
  const item = arrayCopy.splice(prevIndex, 1)[0];
  arrayCopy.splice(nextIndex, 0, item);
  return arrayCopy;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export default {
  logEvent,
  move,
  clamp,
};
