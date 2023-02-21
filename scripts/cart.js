import { handleBadge } from "./manage-cart/handleBadge.js";
import { getLocalStorage } from "./utils/useLocalStorage.js";
import { insertData } from "./utils/insertData.js";
import { addEventListenerFn } from "./utils/addEventListenerFn.js";

// ---------- selectors
const cartWrapper = document.querySelector(".cart-items-wrapper");
const countCartItem = document.querySelector(".item-count");
const totalPrice = document.querySelector(".total-price-amount");
const totalDiscount = document.querySelector(".total-discount-amount");

// ---------- insert local data to page --------------
const cartData = getLocalStorage("products");
function toggleCartItem() {}
function mapCartItem(item) {
  const totalPrice = +item.price + (+item.price * item.discount) / 100;

  return `
  <article data-product_id='${item.id}' class="cart-item">
  <div class="item-info">
    <div class="item-image-wrapper">
      <img src="${item.image[0]}" alt="${item.name}" />
    </div>
    <div class="item-info-container">
      <h4 class="name">${item.name}</h4>
      <span class="category">${item.category}</span>
      <div class="price">
        <span class="current-price">$${+item.price}</span>
        <span class="base-price">$${totalPrice}</span>
      </div>

      <div class="title fevorite">
        <span>add to favorite</span>
        <svg class="heart svg">
          <use
            href="../assets/icons/svg-icons.svg#icon-Heart-fill"
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
      >subtotal : <span class="subtotal">$${
        +item.price * item.quantity
      }</span></span
    >

    <svg class="trash svg">
      <use href="../assets/icons/svg-icons.svg#icon-Trash"></use>
    </svg>
  </div>
</article>
  `;
}
insertData(cartWrapper, cartData, mapCartItem);

const plusButtons = cartWrapper.querySelectorAll(".change-count .plus");
const minusButtons = cartWrapper.querySelectorAll(".change-count .minus");

addEventListenerFn(plusButtons, (e) => {
  console.log("add");
});
addEventListenerFn(minusButtons, (e) => {
  console.log("remove");
});
// ------------ calculate item counts ---------------
function calcCountCartItem() {
  const count = cartData.length;
  if (count) {
    return count === 1 ? `${count} item` : `${count} items`;
  } else {
    return `no items`;
  }
}
function calcTotalItem(item) {
  const cartData = getLocalStorage("products");
  const totals = cartData.reduce(
    (total, cartItem) => {
      const price = +cartItem.price * cartItem.quantity;
      const discount = (+cartItem.price * cartItem.discount) / 100;
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
  return totals;
}

countCartItem.textContent = calcCountCartItem();

totalPrice.textContent = `$${calcTotalItem().price}`;
totalDiscount.textContent = `$${calcTotalItem().discount}`;
// ---------- cart and favorite badge  -------------
handleBadge("favorite");
