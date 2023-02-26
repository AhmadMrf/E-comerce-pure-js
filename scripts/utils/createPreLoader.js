export function createPreLoader(parent, element, count = 1) {
  const preLoaders = Array(count).fill(element);
  parent.innerHTML = "";
  parent.insertAdjacentHTML("beforeend", preLoaders.join(""));
}
