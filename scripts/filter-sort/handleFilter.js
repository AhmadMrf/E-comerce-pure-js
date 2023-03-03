const initialFilters = {
  color: [],
  category: [],
  min_price: 0,
  max_price: 1000,
  inventory: "all",
  // 'all , in-stock , out-of-stock`
};

export function handleFilter(allProducts, filters = initialFilters) {
  const minPrice = 0;
  const maxPrice = 1000;
  const tempProduct = allProducts.filter((product) => {
    let colorMatched = true;
    let categoryMatched = true;
    let priceMatched = true;
    let inventoryMatched = true;
    if (filters.color.length !== 0) {
      colorMatched = product.colors.some((item) =>
        filters.color.includes(item)
      );
    }

    if (filters.category.length !== 0) {
      categoryMatched = product.category.some((item) =>
        filters.category.includes(item)
      );
    }

    if (filters.min_price !== minPrice || filters.max_price !== maxPrice) {
      priceMatched =
        product.price >= filters.min_price &&
        product.price <= filters.max_price;
    }

    switch (filters.inventory) {
      case "in-stock":
        inventoryMatched = +product.count_in_stock >= 1;
        break;
      case "out-of-stock":
        inventoryMatched = +product.count_in_stock === 0;
        break;
    }

    return colorMatched && categoryMatched && priceMatched && inventoryMatched;
  });
  return tempProduct;
}
