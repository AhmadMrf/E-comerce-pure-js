import { getDataFromAPI } from "./getDataFromAPI/getDataFromAPI.js";
import { addEventListenerFn } from "./utils/addEventListenerFn.js";

// html tags ----------
const body = document.body;
const header = document.querySelector("header");
const aside = document.querySelector(".sidebar-content");
const searchInputs = document.querySelectorAll("header .search-box input");
const toggleMenuIcon = document.querySelector(".menu");
const toggleThemeIcon = document.querySelectorAll(".toggle-theme");
// globals ----------
let allProducts = undefined;
let searchState = {
  searchStarted: false,
  serachInputTuched: false,
};

// functions
function handleSearch() {
  if (!allProducts) return;
}

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

addEventListenerFn(toggleMenuIcon, (e) => {
  toggleIcon(e);
  toggleSideBar(e);
});
addEventListenerFn(toggleThemeIcon, (e) => {
  toggleTheme(e);
});
addEventListenerFn(
  searchInputs,
  async (e) => {
    header.classList.toggle("active-search", e.target.value.length);
    if (!searchState.searchStarted && !searchState.serachInputTuched) {
      searchState.serachInputTuched = true;
      allProducts = await getDataFromAPI("products");
    }
    handleSearch();
    searchState.searchStarted = true;
  },
  "input"
);

window.addEventListener("scroll", toggleHeaderHeight);
