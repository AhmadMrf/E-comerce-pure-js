import { handleBadge } from "./utils/handleBadge.js";
import { handleCart } from "./manage-cart/handleCart.js";
import { handleFavorites } from "./manage-favorites/handleFavorites.js";
import { getLocalStorage } from "./utils/useLocalStorage.js";
import { insertData } from "./utils/insertData.js";
import { addEventListenerFn } from "./utils/addEventListenerFn.js";
import { hideResetWrapper } from "./utils/hideResetWrapper.js";

// ---------- selectors -----------
const cartWrapper = document.querySelector(".cart-items-wrapper");
const countCartItem = document.querySelector(".item-count");
const totalPrice = document.querySelector(".total-price-amount");
const totalDiscount = document.querySelector(".total-discount-amount");

// ---------- insert local data to page --------------
let cartData = getLocalStorage("products");
let favoriteData = getLocalStorage("favorites");

function resetCart() {
  cartData = handleCart(null, "reset");
  cartWrapper.innerHTML = "";
  calcCountCartItem(countCartItem);
  calcTotalItem(totalPrice, "price");
  calcTotalItem(totalDiscount, "discount");
  hideResetWrapper(cartData, resetCartWrapper);
}
function toggleCartItem(productBtnsParent_withId, toggle) {
  const id = productBtnsParent_withId.dataset.product_id;
  const product = cartData.find((productItem) => +productItem.id === +id);

  cartData = handleCart(product, toggle);
  updateCartUi(productBtnsParent_withId, id);
  hideResetWrapper(cartData, resetCartWrapper);
}
function toggleFavoriteItem(productBtnsParent_withId) {
  const id = productBtnsParent_withId.dataset.product_id;
  const product = cartData.find((productItem) => +productItem.id === +id);

  favoriteData = handleFavorites(product);
  updateFavoriteUi(productBtnsParent_withId, id);
  handleBadge("favorites");
}
function updateCartUi(parent, id) {
  const product = cartData.find((productItem) => +productItem.id === +id);
  if (!product) {
    parent.remove();
    calcCountCartItem(countCartItem);
    calcTotalItem(totalPrice, "price");
    calcTotalItem(totalDiscount, "discount");
    return;
  }

  const itemCount = parent.querySelector(".change-count span");
  const subTotal = parent.querySelector(".subtotal");
  itemCount.textContent = product.quantity;
  subTotal.textContent = (+product.price * product.quantity).toFixed(2);

  calcTotalItem(totalPrice, "price");
  calcTotalItem(totalDiscount, "discount");
  calcCountCartItem(countCartItem);
}
function updateFavoriteUi(parent, id) {
  const product = favoriteData.find((productItem) => +productItem.id === +id);
  const favoriteIcon = parent.querySelector(".favorite svg.heart");
  const favoriteText = parent.querySelector(".favorite span");
  if (!product) {
    favoriteIcon.classList.remove("in-favorites");
    favoriteText.textContent = "add to favorites";
  } else {
    favoriteIcon.classList.add("in-favorites");
    favoriteText.textContent = "remove from favorites";
  }
}

function mapCartItem(item) {
  const isAddedToFavorite = favoriteData.find(
    (favoriteItem) => +favoriteItem.id === +item.id
  );
  const totalPrice = +item.price + (+item.price * item.discount) / 100;
  const subTotal = +item.price * item.quantity;
  return `
  <article data-product_id='${item.id}' class="cart-item">
  <div class="item-info">
    <div class="item-image-wrapper">
      <img src="${item.images[0]}" alt="${item.name}" />
    </div>
    <div class="item-info-container">
      <h4 class="name"><a href='./product.html#${item.id}' >${
    item.name
  }</a></h4>
      <span class="category">${item.categories.join(" - ")}</span>
      <div class="price">
        <span class="current-price">$${+item.price}</span>
        <span class="base-price">$${totalPrice.toFixed(2)}</span>
      </div>

      <div class="title favorite">
        <span>${isAddedToFavorite ? "remove from" : "add to"} favorites</span>
        <svg class="${isAddedToFavorite ? "in-favorites" : ""} heart svg">
          <use
            href="../assets/icons/svg-icons.svg#icon-Heart"
          ></use>
        </svg>
      </div>
    </div>
  </div>
  <div class="item-buy-info">
    <div class="change-count">
      <svg class="minus svg">
        <use href="../assets/icons/svg-icons.svg#icon-Minus"></use>
      </svg>
      <span>${item.quantity}</span>
      <svg class="plus svg">
        <use href="../assets/icons/svg-icons.svg#icon-Plus"></use>
      </svg>
    </div>
    <span class="total-item title"
      >subtotal : <span class="subtotal">$${subTotal.toFixed(2)}</span></span
    >

    <svg class="trash svg">
      <use href="../assets/icons/svg-icons.svg#icon-Trash"></use>
    </svg>
  </div>
</article>
  `;
}
insertData(cartWrapper, cartData, mapCartItem);

const favoriteWrapper = cartWrapper.querySelectorAll(".favorite");
const plusButtons = cartWrapper.querySelectorAll(".item-buy-info .plus");
const minusButtons = cartWrapper.querySelectorAll(".item-buy-info .minus");
const removeItemButtons = cartWrapper.querySelectorAll(".item-buy-info .trash");
const resetCartWrapper = document.querySelector(".delete-cart-wrapper");

addEventListenerFn(favoriteWrapper, (e) => {
  const parent = e.currentTarget.closest("[data-product_id]");
  toggleFavoriteItem(parent);
});
addEventListenerFn(plusButtons, (e) => {
  const parent = e.currentTarget.closest("[data-product_id]");
  toggleCartItem(parent, "plus");
});
addEventListenerFn(minusButtons, (e) => {
  const parent = e.currentTarget.closest("[data-product_id]");
  toggleCartItem(parent, "minus");
});
addEventListenerFn(removeItemButtons, (e) => {
  const parent = e.currentTarget.closest("[data-product_id]");
  toggleCartItem(parent, "remove");
});
addEventListenerFn(resetCartWrapper, () => {
  resetCart();
});
// ------------ calculate item counts ---------------
function calcCountCartItem(element) {
  let count = cartData.length;
  if (count) {
    count = count === 1 ? `${count} item` : `${count} items`;
  } else {
    count = `no items`;
  }
  element.textContent = count;
}
function calcTotalItem(element, item) {
  const totals = cartData.reduce(
    (total, cartItem) => {
      const price = +cartItem.price * cartItem.quantity;
      const discount =
        ((+cartItem.price * cartItem.discount) / 100) * cartItem.quantity;
      return {
        price: total.price + price,
        discount: total.discount + discount,
      };
    },
    {
      price: 0,
      discount: 0,
    }
  );
  const discount = totals.discount.toFixed(2);
  const price = totals.price.toFixed(2);
  element.textContent = item === "price" ? price : discount;
}

calcCountCartItem(countCartItem);
calcTotalItem(totalPrice, "price");
calcTotalItem(totalDiscount, "discount");

hideResetWrapper(cartData, resetCartWrapper);
// ---------- cart and favorite badge  -------------
handleBadge("favorite");
