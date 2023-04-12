import { handleCart } from "../manage-cart/handleCart.js";
import { getCookie, setCookie } from "../utils/handleCookie.js";
import { getLocalStorage, setLocalStorage } from "../utils/useLocalStorage.js";
import { updateUser } from "./updateUser.js";

export function handleUserCartItem(isUser, state) {
  const users = getLocalStorage("users");
  const activeUser = users.find((user) => user.email === isUser?.email);

  if (activeUser && state === "enter") {
    setLocalStorage("products", [...activeUser.cart]);
    // setLocalStorage("favorites", activeUser.favorites);
  }
  if (activeUser && state === "signin") {
    let newCartItems = [];
    for (const cartItem of activeUser.cart) {
      newCartItems = handleCart(cartItem, "plus", cartItem.quantity);
    }

    setLocalStorage("products", [...newCartItems]);
    // setLocalStorage("favorites", activeUser.favorites);
  }
  if (activeUser && (state === "exit" || state === "signout")) {
    const cartItems = getLocalStorage("products");
    // const favoritesItems = getLocalStorage("favorites");
    const updatedUser = { ...activeUser, cart: [...cartItems] };
    updateUser(updatedUser);
    if (state === "exit") setLocalStorage("products", []);
  }

  if (!activeUser && state === "enter") {
    const showPrevCart = getCookie("save-cart");
    if (!showPrevCart) {
      setLocalStorage("products", []);
    }
  }
  if (!activeUser && state === "exit") {
    setCookie("save-cart", "true", { "max-age": 10 });
  }
}
