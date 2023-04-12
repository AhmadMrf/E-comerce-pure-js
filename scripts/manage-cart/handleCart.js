import { setLocalStorage, getLocalStorage } from "../utils/useLocalStorage.js";
function resetCart() {
  return setLocalStorage("products", []);
}

function removeitem(id) {
  let cartData = getLocalStorage("products");
  cartData = cartData.filter((cartItem) => +cartItem.id !== +id);
  setLocalStorage("products", cartData);
  return cartData;
}
export function handleCart(product = {}, toggle, count = 1) {
  let cartData = getLocalStorage("products");
  if (toggle === "reset") {
    cartData = resetCart();
  } else if (toggle === "remove") {
    cartData = removeitem(product.id);
  } else if (product) {
    const isInCart = cartData.find((cartItem) => +cartItem.id === +product.id);

    if (isInCart) {
      cartData.map((cartItem) => {
        if (+isInCart.id === +cartItem.id) {
          if (toggle === "plus") {
            cartItem.quantity += count;
            if (cartItem.quantity >= isInCart.count_in_stock) {
              cartItem.quantity = isInCart.count_in_stock;
            }
          } else {
            cartItem.quantity -= count;
          }
        }
        return cartItem;
      });
      if (isInCart.quantity <= 0) cartData = removeitem(isInCart.id);
    } else {
      if (+product.count_in_stock) {
        const newCartProduct = { ...product, quantity: count };
        cartData = [...cartData, newCartProduct];
      }
    }
    setLocalStorage("products", cartData);
  }
  return cartData;
}
