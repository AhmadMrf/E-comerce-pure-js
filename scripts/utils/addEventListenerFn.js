export function addEventListenerFn([elements, eventHandler]) {
  if (!elements) return;
  if (elements instanceof NodeList || elements instanceof Array) {
    elements.forEach((element) => {
      element.addEventListener("click", eventHandler);
    });
  } else {
    elements.addEventListener("click", eventHandler);
  }
}
