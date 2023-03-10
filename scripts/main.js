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
  value: "",
};
const isIndex = location.pathname.includes('index')

// functions
function mapSearchResult(item) {
  return `
  <article data-id="${item.id}" class="searched-product">
  <a href="${isIndex?'./pages/':'./'}product.html#${item.id}">
    <img src="${item.image[0]}" alt="${item.name}" />
    <span>${item.name}</span>
    </a>
  </article>
  `;
}
function handleSearch(value) {
  if (!allProducts) return;
  if (!value) {
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
  searchResultWrapper.forEach((product) => {
    const resultProducts = product.querySelectorAll("article");
    addEventListenerFn(
      resultProducts,
      (e) => {
        const href = e.target.closest("article").querySelector('a').href;
        location.assign(href);
      },
      "mousedown"
    );
  });
}
function matchInputValues(value) {
  searchInputs.forEach((input) => {
    input.value = value || "";
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
    searchState.value = e.target.value;
    header.classList.toggle("active-search", searchState.value.length);
    if (!searchState.searchStarted && !searchState.serachInputTuched) {
      searchState.serachInputTuched = true;
      try {
        allProducts = await getDataFromAPI("products");
        handleSearch(searchState.value);
      } catch (err) {
        console.log(err);
      }
      return;
    }
    if (!allProducts) {
      searchResultWrapper.forEach(
        (wrapper) => (wrapper.innerHTML = "<span>loading products ...</span>")
      );
      return;
    }
    matchInputValues(searchState.value);
    handleSearch(searchState.value);
    searchState.searchStarted = true;
  },
  "input"
);
addEventListenerFn(
  clearInputButtons,
  () => {
    handleSearch();
    matchInputValues();
  },
  "mousedown"
);
window.addEventListener("scroll", toggleHeaderHeight);
