export function setFilterFromUrl(fullFilter, searchParam) {
  const { color, category, min_price, max_price, inventory } = fullFilter;

  const filter = {
    color: [],
    category: [],
    min_price,
    max_price,
    inventory,
  };
  for (let [key, value] of searchParam.entries()) {
    if (key === "color") {
      color.includes(`#${value}`) ? filter[key].push(`#${value}`) : null;
    } else if (key === "category") {
      category.includes(value) ? filter[key].push(value) : null;
    } else {
      filter[key] = value;
    }
  }
  return filter;
}
