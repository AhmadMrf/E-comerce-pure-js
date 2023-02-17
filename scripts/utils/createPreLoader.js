export function createPreLoader(parent, element, count) {
  const preLoaders = Array(count).fill(element);
  parent.innerHTML = "";
  parent.insertAdjacentHTML("beforeend", preLoaders.join(""));
}
