export function setSortAndFilterFromUrl(fullFilter, searchParam) {
  const { color, category, min_price, max_price, inventory } = fullFilter;

  const searchParams = {
    filter: {
      color: [],
      category: [],
      min_price,
      max_price,
      inventory,
    },
    sort: "h_price",
  };
  for (let [key, value] of searchParam.entries()) {
    if (key === "color") {
      color.includes(`#${value}`)
        ? searchParams.filter[key].push(`#${value}`)
        : null;
    } else if (key === "category") {
      category.includes(value) ? searchParams.filter[key].push(value) : null;
    } else if ("sort") {
      searchParams.sort = value;
    } else {
      searchParams.filter[key] = value;
    }
  }
  return searchParams;
}
