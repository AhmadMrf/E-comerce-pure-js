export function insertData(parentElement, data, mapFn) {
  const mappedData = data.map(mapFn);
  parentElement.innerHTML = mappedData.join("");
}
