import { getLocalStorage } from "./useLocalStorage.js";
const cartBadge = document.querySelector(
  ".user-info-icons-container.cart .cart-badge"
);
const favoriteBadge = document.querySelector(
  ".user-info-icons-container.favorite .favorite-badge"
);
export const handleBadge = (badge) => {
  let itemCount = 0;
  if (badge === "cart") {
    badge = cartBadge;
    itemCount = getLocalStorage("products").length;
  } else {
    badge = favoriteBadge;
    itemCount = getLocalStorage("favorites").length;
  }

  if (itemCount === 0) {
    badge.classList.add("hide");
  } else {
    badge.classList.remove("hide");
    badge.textContent = itemCount;
  }
};
