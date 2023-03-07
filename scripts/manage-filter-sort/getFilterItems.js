export function getFilterItems(data = []) {
  const filterItems = data.reduce(
    (items, data) => {
      const category = [...new Set([...items.category, ...data.category])];
      const color = [...new Set([...items.color, ...data.colors])];
      const minPrice = Math.min(items.minPrice, +data.price);
      const maxPrice = Math.max(items.maxPrice, +data.price);

      return { category, color, minPrice, maxPrice };
    },
    {
      category: [],
      color: [],
      minPrice: 1000000,
      maxPrice: 0,
    }
  );
  return filterItems;
}
