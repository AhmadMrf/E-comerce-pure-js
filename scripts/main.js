import Swiper from "../assets/swiper/swiper.js";
// ----------  html tags ----------
const body = document.body;

const aside = document.querySelector(".sidebar-content");

const toggleMenuIcon = document.querySelector(".menu");
const toggleThemeIcon = document.querySelectorAll(".toggle-theme");
// ----------  functions ----------

const toggleIcon = (e) => {
  e.currentTarget.classList.toggle("active");
};

const toggleSideBar = (e) => {
  aside.classList.toggle("active");
};

const toggleTheme = (e) => {
  let theme;
  body.dataset.theme === "light" ? (theme = "dark") : (theme = "light");
  body.dataset.theme = theme;
  localStorage.setItem("theme", theme);
};

const initialTheme = () => {
  let theme = localStorage.getItem("theme");
  if (theme) {
    body.dataset.theme = theme;
  }
};
initialTheme();
// ---------- swiper  -------------
const spaceBetween = 25;
const swiperBreakPoints = {
  320: {
    slidesPerView: 1,
    spaceBetween,
  },
  769: {
    slidesPerView: 2,
    spaceBetween,
  },
  1025: {
    slidesPerView: 3,
    spaceBetween,
  },
}
const new_product_swiper = new Swiper(".new-products-container .products-wrapper", {
  loop: true,
  slidesPerView: 1,
  spaceBetween: 16,
  navigation: {
    nextEl: ".new-products-container .key.right",
    prevEl: ".new-products-container .key.left",
  },
  breakpoints: swiperBreakPoints,
});
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
// ----------  listeners  ----------

toggleMenuIcon.addEventListener("click", (e) => {
  toggleIcon(e);
  toggleSideBar(e);
});
toggleThemeIcon.forEach((item) =>
  item.addEventListener("click", (e) => {
    toggleTheme(e);
  })
);
