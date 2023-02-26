import Swiper from "../assets/swiper/swiper.js";
import { changeData } from "./utils/changeData.js";
import { getTrends } from "./utils/getTrends.js";
import { getCategories } from "./utils/getCategories.js";
import { stars } from "./utils/stars.js";
import { handleCart } from "./manage-cart/handleCart.js";
import { handleBadge } from "./manage-cart/handleBadge.js";
import { createPreLoader } from "./utils/createPreLoader.js";
import { insertData } from "./utils/insertData.js";
import { addEventListenerFn } from "./utils/addEventListenerFn.js";
import { setLocalStorage, getLocalStorage } from "./utils/useLocalStorage.js";
import {
  PRODUCT_PRE_LOADER,
  BASE_URL,
  FILTER_BTN_PRE_LOADER,
  REVIEW_PRE_LOADER,
} from "../assets/data/template.js";

// ---------- global data -----------
let allProduct = undefined;
let cartData = getLocalStorage("products");

const productsWrapper = document.querySelector(
  ".new-products-container .swiper-wrapper"
);
const trendsWrapper = document.querySelector(
  ".trends-container .swiper-wrapper"
);
const reviewsWrapper = document.querySelector(
  ".reviews-container .swiper-wrapper"
);
const filterBtnwrapper = document.querySelector(".filters-wrapper");

function toggleCartItem(productBtnsParent_withId, toggle = "plus") {
  const id = productBtnsParent_withId.dataset.product_id;
  const product = allProduct.find((productItem) => +productItem.id === +id);

  cartData = handleCart(product, toggle);

  updateCartButtonUi(productsWrapper, id);
  updateCartButtonUi(trendsWrapper, id);

  handleBadge("cart");
}

function updateCartButtonUi(parent, id) {
  const isAddedToCart = cartData.find((cartItem) => cartItem.id == id);

  const element = parent.querySelector(`[data-product_id="${id}"]`);

  if (!element) return;

  if (isAddedToCart) {
    element.children[1].outerHTML = `
    <div class="change-count">
    <svg class="minus svg">
      <use href="./assets/icons/svg-icons.svg#icon-Minus"></use>
    </svg>
    <span>${isAddedToCart.quantity}</span>
    <svg class="plus svg">
      <use href="./assets/icons/svg-icons.svg#icon-Plus"></use>
    </svg>
  </div>
    `;
    addEventListenerFn(element.children[1].querySelector(".plus"), (e) => {
      toggleCartItem(e.currentTarget.parentElement.parentElement, "plus");
    });
    addEventListenerFn(element.children[1].querySelector(".minus"), (e) => {
      toggleCartItem(e.currentTarget.parentElement.parentElement, "minus");
    });
  } else {
    element.children[1].outerHTML = `
    <button class="buttons-buy" type="button">
    <svg class="svg">
      <use href="./assets/icons/svg-icons.svg#icon-Bag"></use>
    </svg>
  </button>
    `;
    addEventListenerFn(element.children[1], (e) => {
      toggleCartItem(e.currentTarget.parentElement, "plus");
    });
  }
}

function mapFilterBtns(item) {
  let active = "";
  if (item === "all") {
    active = "active";
  }
  return `
<button class='${active}' type="button">${item}</button>
  `;
}
function mapProduct(item) {
  const isAddedToCart = cartData.find((cartItem) => cartItem.id == item.id);

  const totalPrice = +item.price + (+item.price * item.discount) / 100;
  return `
      <article class="product swiper-slide">
              <div class="content">
                <img src="${item.image[0]}" alt="${item.name}" />
                <div class="tags">
                  <span class="tag discount">${item.discount}%</span>
                  <!-- <span class="tag new">new!</span> -->
                </div>
                <div data-product_id="${item.id}" class="buttons">
                  <button class="buttons-like" type="button">
                    <svg class="svg">
                      <use href="./assets/icons/svg-icons.svg#icon-Heart"></use>
                    </svg>
                  </button>

                  ${
                    isAddedToCart
                      ? `
                    <div class="change-count">
                    <svg class="minus svg">
                      <use href="./assets/icons/svg-icons.svg#icon-Minus"></use>
                    </svg>
                    <span>${isAddedToCart.quantity}</span>
                    <svg class="plus svg">
                      <use href="./assets/icons/svg-icons.svg#icon-Plus"></use>
                    </svg>
                  </div>
                    
                    `
                      : `
                  <button class="buttons-buy" type="button">
                  <svg class="svg">
                    <use href="./assets/icons/svg-icons.svg#icon-Bag"></use>
                  </svg>
                </button>
                  `
                  }

                  
                  <a href='./pages/product.html#${item.id}' >
                  <button class="buttons-images" type="button">
                    <svg class="svg">
                      <use
                        href="./assets/icons/svg-icons.svg#icon-Gallery"
                      ></use>
                    </svg>
                    </button>
                    </a>
                </div>
              </div>
              <div class="info">
                <div class="details">
                  <span class="category">${item.category}</span>
                  <div class="stars">
                    ${stars(+item.rate)}
                  </div>
                </div>
                <span class="title"><a href='./pages/product.html#${
                  item.id
                }' >${item.name}</a></span>
                <div class="price">
                  <span class="current-price">$${+item.price}</span>
                  <span class="base-price">$${totalPrice}</span>
                </div>
              </div>
            </article>
      `;
}
function mapReviews(item) {
  return `
  <div class="swiper-slide review-info">
    <div class="image-wrapper">
      <img
        src="${item.image}"
        alt="${item.auther}"
      />
    </div>
    <div class="review-info-content">
      <p>${item.description}</p>
      <span>${item.auther}</span>
    </div>
  </div>
  `;
}

createPreLoader(trendsWrapper, PRODUCT_PRE_LOADER, 3);
createPreLoader(productsWrapper, PRODUCT_PRE_LOADER, 3);
createPreLoader(filterBtnwrapper, FILTER_BTN_PRE_LOADER, 4);
createPreLoader(reviewsWrapper, REVIEW_PRE_LOADER, 3);

Promise.all([
  fetch(`${BASE_URL}/products`).then((res) => res.json()),
  fetch(`${BASE_URL}/reviews`).then((res) => res.json()),
])
  .then((allData) => {
    const [products, reviews] = allData;
    const productsContent = changeData(products);
    allProduct = productsContent;
    const trends = getTrends(productsContent);
    const filterBtns = getCategories(productsContent);

    insertData(productsWrapper, productsContent, mapProduct);
    insertData(trendsWrapper, trends, mapProduct);
    insertData(filterBtnwrapper, filterBtns, mapFilterBtns);
    insertData(reviewsWrapper, reviews, mapReviews);

    const notAddedToCartElement = [
      ...productsWrapper.querySelectorAll(".buttons-buy"),
      ...trendsWrapper.querySelectorAll(".buttons-buy"),
    ];
    const addedToCartElementPlus = [
      ...productsWrapper.querySelectorAll(".change-count .plus"),
      ...trendsWrapper.querySelectorAll(".change-count .plus"),
    ];
    const addedToCartElementMinus = [
      ...productsWrapper.querySelectorAll(".change-count .minus"),
      ...trendsWrapper.querySelectorAll(".change-count .minus"),
    ];

    addEventListenerFn(notAddedToCartElement, (e) => {
      toggleCartItem(e.currentTarget.parentElement, "plus");
    });
    addEventListenerFn(addedToCartElementPlus, (e) => {
      toggleCartItem(e.currentTarget.parentElement.parentElement, "plus");
    });
    addEventListenerFn(addedToCartElementMinus, (e) => {
      toggleCartItem(e.currentTarget.parentElement.parentElement, "minus");
    });
  })
  .catch((err) => {
    console.log(err);
  });

// ---------- cart and favorite badge  -------------

handleBadge("cart");
handleBadge("favorite");

// ---------- swiper  -------------
const swiperBreakPoints = {
  320: {
    slidesPerView: 1,
    spaceBetween: 25,
  },
  769: {
    slidesPerView: 2,
    spaceBetween: 30,
  },
  1025: {
    slidesPerView: 3,
    spaceBetween: 35,
  },
};
const new_product_swiper = new Swiper(
  ".new-products-container .products-wrapper",
  {
    loop: true,
    slidesPerView: 1,
    spaceBetween: 16,
    navigation: {
      nextEl: ".new-products-container .key.right",
      prevEl: ".new-products-container .key.left",
    },
    breakpoints: swiperBreakPoints,
  }
);
const trends_swiper = new Swiper(".trends-container .products-wrapper", {
  loop: true,
  slidesPerView: 1,
  spaceBetween: 16,
  navigation: {
    nextEl: ".trends-container .key.right",
    prevEl: ".trends-container .key.left",
  },
  breakpoints: swiperBreakPoints,
});

const reviews_swiper = new Swiper(".review-wrapper", {
  loop: true,
  slidesPerView: 1,
  spaceBetween: 25,
  navigation: {
    nextEl: ".review-wrapper .key.right",
    prevEl: ".review-wrapper .key.left",
  },
});
