export function getFilterItems(data = []) {
  const filterItems = data.reduce(
    (items, data) => {
      const categories = [
        ...new Set([...items.categories, ...data.categories]),
      ];
      const colors = [...new Set([...items.colors, ...data.colors])];
      const minPrice = Math.min(items.minPrice, +data.price);
      const maxPrice = Math.max(items.maxPrice, +data.price);

      return { categories, colors, minPrice, maxPrice };
    },
    {
      categories: [],
      colors: [],
      minPrice: 1000000,
      maxPrice: 0,
    }
  );
  return filterItems;
}
