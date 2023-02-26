import { handleBadge } from "./manage-cart/handleBadge.js";
import { handleCart } from "./manage-cart/handleCart.js";
import { getLocalStorage } from "./utils/useLocalStorage.js";
import { insertData } from "./utils/insertData.js";
import { addEventListenerFn } from "./utils/addEventListenerFn.js";

// ---------- selectors -----------
const cartWrapper = document.querySelector(".cart-items-wrapper");
const countCartItem = document.querySelector(".item-count");
const totalPrice = document.querySelector(".total-price-amount");
const totalDiscount = document.querySelector(".total-discount-amount");

// ---------- insert local data to page --------------
let cartData = getLocalStorage("products");

function resetCart() {
  cartData = handleCart(null, "reset");
  cartWrapper.innerHTML = "";
  calcCountCartItem(countCartItem);
  calcTotalItem(totalPrice, "price");
  calcTotalItem(totalDiscount, "discount");
}
function toggleCartItem(productBtnsParent_withId, toggle) {
  const id = productBtnsParent_withId.dataset.product_id;
  const product = cartData.find((productItem) => +productItem.id === +id);

  cartData = handleCart(product, toggle);
  updateCartUi(productBtnsParent_withId, id);
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
  subTotal.textContent = +product.price * product.quantity;

  calcTotalItem(totalPrice, "price");
  calcTotalItem(totalDiscount, "discount");
  calcCountCartItem(countCartItem);
}
function mapCartItem(item) {
  const totalPrice = +item.price + (+item.price * item.discount) / 100;

  return `
  <article data-product_id='${item.id}' class="cart-item">
  <div class="item-info">
    <div class="item-image-wrapper">
      <img src="${item.image[0]}" alt="${item.name}" />
    </div>
    <div class="item-info-container">
      <h4 class="name"><a href='./product.html#${item.id}' >${
    item.name
  }</a></h4>
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

const plusButtons = cartWrapper.querySelectorAll(".item-buy-info .plus");
const minusButtons = cartWrapper.querySelectorAll(".item-buy-info .minus");
const removeItemButtons = cartWrapper.querySelectorAll(".item-buy-info .trash");
const resetCartButton = document.querySelector(".delete-cart-wrapper .trash");

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
addEventListenerFn(resetCartButton, () => {
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
// ---------- cart and favorite badge  -------------
handleBadge("favorite");
