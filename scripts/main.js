import { getDataFromAPI } from "./getDataFromAPI/getDataFromAPI.js";
import { addEventListenerFn } from "./utils/addEventListenerFn.js";
import { insertData } from "./utils/insertData.js";

// html tags ----------
const body = document.body;
const header = document.querySelector("header");
const aside = document.querySelector(".sidebar-content");
const searchResultWrapper = header.querySelectorAll(".search-result");
const clearInputButtons = header.querySelectorAll(".search-box svg");
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
function mapSearchResult(item) {
  return `
  <article class="searched-product">
    <img src="${item.image[0]}" alt="${item.name}" />
    <span>${item.name}</span>
  </article>
  `;
}

function handleSearch(value) {
  if (!allProducts) return;
  if (!value.length) {
    searchResultWrapper.forEach((wrapper) => (wrapper.innerHTML = ""));
    return;
  }
  const searchResult = allProducts?.filter((product) => {
    return product.name.trim().toLowerCase().includes(value.toLowerCase());
  });
  if (!searchResult?.length) {
    searchResultWrapper.forEach(
      (wrapper) => (wrapper.innerHTML = "<span>no product</span>")
    );
    return;
  }
  updateSearchResult(searchResult);
}

function updateSearchResult(searchResult) {
  insertData(searchResultWrapper[0], searchResult, mapSearchResult);
  insertData(searchResultWrapper[1], searchResult, mapSearchResult);
}
function matchInputValues(e) {
  searchInputs.forEach((input) => {
    input.value = e.target.value;
  });
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
    const value = e.target.value;
    header.classList.toggle("active-search", value.length);
    if (!searchState.searchStarted && !searchState.serachInputTuched) {
      searchState.serachInputTuched = true;
      try {
        allProducts = await getDataFromAPI("products");
      } catch (err) {
        console.log(err);
      }
    }
    matchInputValues(e);
    handleSearch(value);
    searchState.searchStarted = true;
  },
  "input"
);
// addEventListenerFn(clearInputButtons, () => {
//   searchInputs.forEach((input) => {
//     input.value = "";
//   });
// });
window.addEventListener("scroll", toggleHeaderHeight);
console.log(clearInputButtons);
