import Swiper from "../assets/swiper/swiper.js";

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
  navigation: {
    nextEl: ".review-wrapper .key.right",
    prevEl: ".review-wrapper .key.left",
  },
});
