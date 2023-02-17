import Swiper from "../assets/swiper/swiper.js";
import { changeData } from "./utils/changeData.js";
import { getTrends } from "./utils/getTrends.js";
import { getCategories } from "./utils/getCategories.js";
import { stars } from "./utils/stars.js";
import { createPreLoader } from "./utils/createPreLoader.js";
import { setLocalStorage, getLocalStorage } from "./utils/useLocalStorage.js";
import {
  PRODUCT_PRE_LOADER,
  BASE_URL,
  FILTER_BTN_PRE_LOADER,
  REVIEW_PRE_LOADER,
} from "../assets/data/template.js";

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
  const totalPrice = +item.price + (+item.price * item.discount) / 100;
  return `
      <article class="product swiper-slide">
              <div class="content">
                <img src="${item.image[0]}" alt="${item.name}" />
                <div class="tags">
                  <span class="tag discount">${item.discount}%</span>
                  <!-- <span class="tag new">new!</span> -->
                </div>
                <div class="buttons">
                  <button class="buttons-like" type="button">
                    <svg class="svg">
                      <use href="./assets/icons/svg-icons.svg#icon-Heart"></use>
                    </svg>
                  </button>
                  <button class="buttons-buy" type="button">
                    <svg class="svg">
                      <use href="./assets/icons/svg-icons.svg#icon-Bag"></use>
                    </svg>
                  </button>
                  <button class="buttons-images" type="button">
                    <svg class="svg">
                      <use
                        href="./assets/icons/svg-icons.svg#icon-Gallery"
                      ></use>
                    </svg>
                  </button>
                </div>
              </div>
              <div class="info">
                <div class="details">
                  <span class="category">${item.category}</span>
                  <div class="stars">
                    ${stars(+item.rate)}
                  </div>
                </div>
                <span class="title">${item.name}</span>
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
    const trends = getTrends(productsContent);
    const filterBtns = getCategories(productsContent);
    console.log(reviews);
    const mappedProduct = productsContent.map(mapProduct);
    const mappedTrends = trends.map(mapProduct);
    const mappedFilterBtns = filterBtns.map(mapFilterBtns);
    const mappedReviews = reviews.map(mapReviews);

    productsWrapper.innerHTML = mappedProduct.join("");
    trendsWrapper.innerHTML = mappedTrends.join("");
    filterBtnwrapper.innerHTML = mappedFilterBtns.join("");
    reviewsWrapper.innerHTML = mappedReviews.join("");
  })
  .catch((err) => {
    console.log(err);
  });

// fetch(`${BASE_URL}/products`)
//   .then((res) => res.json())
//   .then((data) => {
//     const productsContent = changeData(data);
//     const trends = getTrends(productsContent);
//     const filterBtns = getCategories(productsContent);

//     const mappedProduct = productsContent.map(mapProduct);
//     const mappedTrends = trends.map(mapProduct);
//     const mappedFilterBtns = filterBtns.map(mapFilterBtns);

//     productsWrapper.innerHTML = mappedProduct.join("");
//     trendsWrapper.innerHTML = mappedTrends.join("");
//     filterBtnwrapper.innerHTML = mappedFilterBtns.join("");
//   })
//   .catch((err) => {
//     console.log(err);
//   });

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
