import { insertData } from "./utils/insertData.js";
import { handleCart } from "./manage-cart/handleCart.js";
import { handleBadge } from "./utils/handleBadge.js";
import { handleFavorites } from "./manage-favorites/handleFavorites.js";
import { getLocalStorage } from "./utils/useLocalStorage.js";
import { createPreLoader } from "./utils/createPreLoader.js";
import { changeData } from "./utils/changeData.js";
import { stars } from "./utils/stars.js";
import {
  BASE_URL,
  SINGLE_PRODUCT_PRE_LOADER,
} from "../assets/data/template.js";
import { addEventListenerFn } from "./utils/addEventListenerFn.js";
// ---------- cart and favorite badge  -------------
handleBadge("favorite");
handleBadge("cart");

// ---------- selectors ----------
const singleProductWrapper = document.querySelector(".single-product");

// ---------- get info from URL -----------
const id = +location.hash.slice(1);
// ----------- insert data ---------
let cartData = getLocalStorage("products");
let favoriteData = getLocalStorage("favorites");

let product = null;
function imageSlider(e, wrapper) {
  const mainImage = wrapper.querySelector(".main-image img");
  const smallImagesWrapper = wrapper.querySelector(".small-images-wrapper");
  const li = e.target.closest("li");
  if (li) {
    smallImagesWrapper
      .querySelectorAll("li")
      .forEach((li) => li.classList.remove("active"));
    const index = li.dataset.index;
    mainImage.src = product.image[index];
    li.classList.add("active");
  }
}
function toggleCartItem(addToCartContent, toggle) {
  cartData = handleCart(product, toggle);
  updateCartContentUi(addToCartContent);
  handleBadge("cart");
}
function toggleFavoriteItem(favoriteWrapper) {
  favoriteData = handleFavorites(product);
  updateFavoriteUi(favoriteWrapper);
  handleBadge("favorites");
}
function updateCartContentUi(wrapper) {
  const isAddedToCart = cartData.find((cartItem) => cartItem.id == product.id);
  if (isAddedToCart) {
    wrapper.innerHTML = `
    <div class="change-count">
      <svg class="minus svg">
        <use href="../assets/icons/svg-icons.svg#icon-Minus"></use>
      </svg>
      <span>${isAddedToCart.quantity}</span>
      <svg class="plus svg">
        <use href="../assets/icons/svg-icons.svg#icon-Plus"></use>
      </svg>
    </div>
    `;

    addEventListenerFn(wrapper.querySelector(".plus"), () => {
      toggleCartItem(wrapper, "plus");
    });
    addEventListenerFn(wrapper.querySelector(".minus"), () => {
      toggleCartItem(wrapper, "minus");
    });
  } else {
    wrapper.innerHTML = `
    <button class="button button-dark title">add to cart</button>
    `;
    addEventListenerFn(wrapper.querySelector(".button"), () => {
      toggleCartItem(wrapper, "plus");
    });
  }
}
function updateFavoriteUi(parent) {
  const product = favoriteData.find((productItem) => +productItem.id === id);
  const favoriteIcon = parent.querySelector(" svg.heart");
  const favoriteText = parent.querySelector(" span");
  if (!product) {
    favoriteIcon.classList.remove("in-favorites");
    favoriteText.textContent = "add to favorites";
  } else {
    favoriteIcon.classList.add("in-favorites");
    favoriteText.textContent = "remove from favorites";
  }
}
function mapSingleProduct(item) {
  const isAddedToCart = cartData.find((cartItem) => cartItem.id == item.id);
  const isAddedToFavorite = favoriteData.find(
    (favoriteItem) => favoriteItem.id == item.id
  );

  const totalPrice = +item.price + (+item.price * item.discount) / 100;

  return `
  <div class="single-product-image-wrapper">
    <div class="main-image">
      <img src="${item.image[0]}" alt="${item.name}" />
    </div>

    <ul class="small-images-wrapper">
      <li data-index='0' class="active">
        <img src="${item.image[0]}" alt="${item.name}" />
      </li>
      <li data-index='1'><img src="${item.image[1]}" alt="${item.name}" /></li>
      <li data-index='2'><img src="${item.image[2]}" alt="${item.name}" /></li>
      <li data-index='3'><img src="${item.image[3]}" alt="${item.name}" /></li>
    </ul>
  </div>
  <div class="single-product-info-wrapper">
    <div class="product-content">
      <h2 class="name">${item.name}</h2>
      <div class="price-wrapper">
        <span class="price">$${+item.price}</span>
        <span class="discount">$${totalPrice}</span>
      </div>
      <span class="category">${item.category}</span>
      <div class="rate">${stars(+item.rate, false)}</div>
      <p class="descriptoin">
        ${item.description}
      </p>
      <span class="stock"
        >inventory : <span class="stock-count">${
          item.count_in_stock
        }</span></span
      >
      <div class="title favorite">
        <span>${isAddedToFavorite ? "remove from" : "add to"} favorites</span>
        <svg class="${isAddedToFavorite ? "in-favorites" : ""} heart svg">
          <use
            href="../assets/icons/svg-icons.svg#icon-Heart"
          ></use>
        </svg>
      </div>
    </div>
    <div class="add-to-cart-content">
    ${
      isAddedToCart
        ? `
      <div class="change-count">
        <svg class="minus svg">
          <use href="../assets/icons/svg-icons.svg#icon-Minus"></use>
        </svg>
        <span>${isAddedToCart.quantity}</span>
        <svg class="plus svg">
          <use href="../assets/icons/svg-icons.svg#icon-Plus"></use>
        </svg>
      </div>
    `
        : `
    <button class="button button-dark title">add to cart</button>
    `
    }
    </div>
  </div>
  `;
}
createPreLoader(singleProductWrapper, SINGLE_PRODUCT_PRE_LOADER);

fetch(`${BASE_URL}/products/${id}`)
  .then((res) => res.json())
  .then((data) => {
    const productData = changeData([data]);
    product = productData[0];

    insertData(singleProductWrapper, productData, mapSingleProduct);

    const imageSliderWrapper = singleProductWrapper.querySelector(
      ".single-product-image-wrapper"
    );

    const favoriteWrapper = singleProductWrapper.querySelector(".favorite");

    const addToCartContent = singleProductWrapper.querySelector(
      ".add-to-cart-content"
    );
    const addToCartButton = singleProductWrapper.querySelector(
      ".add-to-cart-content .button"
    );
    const addedToCartElementMinus = singleProductWrapper.querySelector(
      ".add-to-cart-content .minus"
    );
    const addedToCartElementPlus = singleProductWrapper.querySelector(
      ".add-to-cart-content .plus"
    );

    addEventListenerFn(imageSliderWrapper, (e) => {
      imageSlider(e, imageSliderWrapper);
    });
    addEventListenerFn(favoriteWrapper, (e) => {
      toggleFavoriteItem(favoriteWrapper);
    });
    addEventListenerFn(addToCartButton, (e) => {
      toggleCartItem(addToCartContent, "plus");
    });

    addEventListenerFn(addedToCartElementMinus, (e) => {
      toggleCartItem(addToCartContent, "minus");
    });
    addEventListenerFn(addedToCartElementPlus, (e) => {
      toggleCartItem(addToCartContent, "plus");
    });
  })
  .catch((err) => console.log(err));
