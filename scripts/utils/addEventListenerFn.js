export function addEventListenerFn(elements, eventHandler, event = "click") {
  if (!elements) return;
  if (elements instanceof NodeList || elements instanceof Array) {
    elements.forEach((element) => {
      element.addEventListener(event, eventHandler);
    });
  } else {
    elements.addEventListener(event, eventHandler);
  }
}
