import Swiper from "../assets/swiper/swiper.js";
// ----------  html tags ----------
const body = document.body;
const header = document.querySelector("header");
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

const handleToggleHeaderHeight = () => {
  let prevScroll = 0;
  const setClasses = () => {
    if (scrollY > 50 && scrollY > prevScroll) {
      header.classList.add("min");
      header.classList.add("hide");
    }
    if (scrollY < prevScroll) {
      header.classList.remove("hide");
    }
    if (scrollY < 50) {
      header.classList.remove("min");
      header.classList.remove("hide");
    }
  };
  return () => {
    setClasses();
    prevScroll = scrollY;
  };
};
const toggleHeaderHeight = handleToggleHeaderHeight();

const initialTheme = () => {
  let theme = localStorage.getItem("theme");
  if (theme) {
    body.dataset.theme = theme;
  }
};
initialTheme();
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
window.addEventListener("scroll", toggleHeaderHeight);
