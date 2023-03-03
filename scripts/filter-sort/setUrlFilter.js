export function setUrlFilter(searchParam) {
  const filter = {
    color: [],
    category: [],
    min_price: 0,
    max_price: 1000,
    inventory: "all",
  };
  for (let [key, value] of searchParam.entries()) {
    if (key === "category" || key === "color") {
      if (key === "color") value = `#${value}`;
      filter[key].push(value);
    } else {
      filter[key] = value;
    }
  }
  return filter;
}
