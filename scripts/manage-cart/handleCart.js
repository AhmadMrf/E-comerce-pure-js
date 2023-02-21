import { setLocalStorage, getLocalStorage } from "../utils/useLocalStorage.js";
export function resetCart() {
  setLocalStorage("products", []);
}

export function removeitem(id) {
  let cartData = getLocalStorage("products");
  cartData = cartData.filter((cartItem) => +cartItem.id !== +id);
  setLocalStorage("products", cartData);
  return cartData;
}
export function handleCart(allProduct, id, toggle) {
  let cartData = getLocalStorage("products");
  const product = allProduct.find((productItem) => +productItem.id === +id);

  if (product) {
    const isInCart = cartData.find((cartItem) => +cartItem.id === +product.id);

    if (isInCart) {
      cartData.map((cartItem) => {
        if (+isInCart.id === +cartItem.id) {
          toggle === "plus"
            ? (cartItem.quantity += 1)
            : (cartItem.quantity -= 1);
        }
        return cartItem;
      });
      if (isInCart.quantity <= 0) cartData = removeitem(isInCart.id);
    } else {
      const newCartProduct = { ...product, quantity: 1 };
      cartData = [...cartData, newCartProduct];
    }
    setLocalStorage("products", cartData);
  }
}
