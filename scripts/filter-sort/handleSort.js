export function handleSort(products, sort) {
  let sortedData = products;
  switch (sort) {
    case "h_price":
      sortedData = products.sort((b, a) => +a.price - +b.price);
      break;
    case "l_price":
      sortedData = products.sort((a, b) => +a.price - +b.price);
      break;
    case "h_discount":
      sortedData = products.sort((b, a) => a.discount - b.discount);
      break;
  }
  return sortedData;
}

//h_price , l_price , h_discount
