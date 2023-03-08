import { getDataFromAPI } from "./getDataFromAPI/getDataFromAPI.js";
// import { setLocalStorage, getLocalStorage } from "./utils/useLocalStorage.js";
// import { handleBadge } from "./utils/handleBadge.js";
// ---------- toggle theme and sidebar and button

// html tags ----------
const body = document.body;
const header = document.querySelector("header");
const aside = document.querySelector(".sidebar-content");
const searchBoxes = document.querySelectorAll("header .search-box");
const toggleMenuIcon = document.querySelector(".menu");
const toggleThemeIcon = document.querySelectorAll(".toggle-theme");
// functions ----------
let allProducts = undefined;

getDataFromAPI("products").then((products) => {
  searchBoxes.forEach((searchBox) => {
    const input = searchBox.querySelector("input");
    input.removeAttribute("disabled");
    input.placeholder = "search product name";
    searchBox.classList.remove("disable");
  });
  allProducts = products;
});

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
  localStorage.setItem("theme", JSON.stringify(theme));
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
    body.dataset.theme = JSON.parse(theme);
  }
};
initialTheme();

// listeners  ----------

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
