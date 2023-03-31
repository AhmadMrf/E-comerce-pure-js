export function setSortAndFilterFromUrl(fullFilter, searchParam) {
  const { colors, categories, min_price, max_price, inventory } = fullFilter;

  const searchParams = {
    filter: {
      colors: [],
      categories: [],
      min_price,
      max_price,
      inventory,
    },
    sort: "h_price",
  };
  for (let [key, value] of searchParam.entries()) {
    if (key === "colors") {
      colors.includes(`#${value}`)
        ? searchParams.filter[key].push(`#${value}`)
        : null;
    } else if (key === "categories") {
      categories.includes(value) ? searchParams.filter[key].push(value) : null;
    } else if ("sort") {
      searchParams.sort = value;
    } else {
      searchParams.filter[key] = value;
    }
  }
  return searchParams;
}
