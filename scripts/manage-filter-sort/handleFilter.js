export function handleFilter(allProducts, initialFilter, filters) {
  const { min_price: minPrice, max_price: maxPrice } = initialFilter;
  const newProduct = allProducts.filter((product) => {
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
        +product.price >= filters.min_price &&
        +product.price <= filters.max_price;
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
  return newProduct;
}
