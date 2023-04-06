import { handleCart } from "./manage-cart/handleCart.js";
import { handleFavorites } from "./manage-favorites/handleFavorites.js";
import { handleBadge } from "./utils/handleBadge.js";
import { getLocalStorage } from "./utils/useLocalStorage.js";
import { getDataFromAPI } from "./getDataFromAPI/getDataFromAPI.js";
import { createPreLoader } from "./utils/createPreLoader.js";
import { changeData } from "./utils/changeData.js";
import { insertData } from "./utils/insertData.js";
import { stars } from "./utils/stars.js";
import { addEventListenerFn } from "./utils/addEventListenerFn.js";
import { handleFilter } from "./manage-filter-sort/handleFilter.js";
import { setSortAndFilterFromUrl } from "./manage-filter-sort/setSortAndFilterFromUrl.js";
import { getFilterItems } from "./manage-filter-sort/getFilterItems.js";
import { handleSort } from "./manage-filter-sort/handleSort.js";
import {
  PRODUCT_PRE_LOADER,
  BASE_URL,
  ALL_PRODUCTS_NO_PRODUCT,
} from "../assets/data/template.js";
import { getUser } from "./manage-users/getUser.js";

// slectors

const productsWrapper = document.querySelector(".products-card-wrapper");
const productCount = document.querySelector(".products-count .count");
const filterWrapper = document.querySelector(".filters-wrapper");
const filtersContent = document.querySelector(".filters");
const colorFilterWrapper = filtersContent.querySelector(
  ".color-filter .colors"
);
const priceFilterWrapper = filtersContent.querySelector(
  ".price-filter .input-wrapper"
);
const categoryFilterWrapper = filtersContent.querySelector(
  ".category-filter .categories"
);
const resetFilter = document.querySelector(".reset-filter");
const toggleFilterButton = document.querySelector(
  ".open-filter-section-button"
);
const filterTag = document.querySelector(".products-count .filtered");

const sortSelect = document.querySelector("#sort");
//*********** toggle filter menu */

// get search params

const searchParams = new URLSearchParams(location.search);

// globals
const isSignin = getUser();
let favoriteData = getLocalStorage("favorites");
let cartData = getLocalStorage("products");
let initialFilter = undefined;
let allProduct = undefined;
let filters = undefined;
let sort = undefined;

// functions

function toggleOpenFilterMenu() {
  toggleFilterButton.classList.toggle("active");
  filterWrapper.classList.toggle("active");
}

function calcCountFoundedItem(products, element) {
  let count = products.length;
  if (count) {
    count = count === 1 ? `${count} product` : `${count} products`;
  } else {
    count = `no product`;
  }
  element.textContent = count;
}
function sortProducts(e) {
  sort = e.target.value;
  updateProductList(filters);
}
function toggleFilterInputs(e) {
  const name = e.target.name;
  const value = e.target.value;
  if (name === "categories" || name === "colors") {
    const inItem = filters[name].find((item) => item === value);
    if (!inItem) {
      filters[name].push(value);
    } else {
      filters[name] = filters[name].filter((item) => item !== value);
    }
  } else if (name === "inventory") {
    filters[name] = value;
  } else {
    filters[name] = +value;
  }
  updateProductList(filters);
}
function toggleCartItem(productBtnsParent_withId, toggle = "plus") {
  const id = productBtnsParent_withId.dataset.product_id;
  const product = allProduct.find((productItem) => +productItem.id === +id);

  cartData = handleCart(product, toggle);

  updateCartButtonUi(productsWrapper, id);

  handleBadge("cart");
}
function toggleFavoriteItem(productBtnsParent_withId) {
  if (!isSignin) {
    console.log("sign in for add to favorites");
    return;
  }
  const id = productBtnsParent_withId.dataset.product_id;
  const product = allProduct.find((productItem) => +productItem.id === +id);
  favoriteData = handleFavorites(product);

  updateFavoriteButtonUi(productsWrapper, id);

  handleBadge("favorite");
}

function resetFilters() {
  filters = { ...initialFilter, categories: [], colors: [] };
  calcCountFoundedItem(allProduct, productCount);
  changeFilterIndicator(initialFilter, filters);
  updateFilterMenuUi(filters);
  updateProductList(initialFilter);
}
function changeFilterIndicator(initialFilter, filterObj) {
  const { min_price: min_priceInit, max_price: max_priceInit } = initialFilter;
  const { colors, categories, min_price, max_price, inventory } = filterObj;
  const noFilter =
    !colors.length &&
    !categories.length &&
    min_price === min_priceInit &&
    max_price === max_priceInit &&
    inventory === "all";
  toggleFilterButton.classList.toggle("filtered", !noFilter);
  filterTag.classList.toggle("hide", noFilter);
}
function updateProductList(filterObj) {
  const filteredData = handleFilter(allProduct, initialFilter, filterObj);
  const sortedData = handleSort(filteredData, sort);
  insertData(productsWrapper, sortedData, mapProduct);
  if (!filteredData.length) {
    productsWrapper.classList.add("no-grid");
    productsWrapper.innerHTML = ALL_PRODUCTS_NO_PRODUCT;
  }
  const favoritesButtons = productsWrapper.querySelectorAll(".buttons-like");
  const notAddedToCartElement =
    productsWrapper.querySelectorAll(".buttons-buy");
  const addedToCartElementPlus = productsWrapper.querySelectorAll(
    ".change-count .plus"
  );
  const addedToCartElementMinus = productsWrapper.querySelectorAll(
    ".change-count .minus"
  );

  addEventListenerFn(favoritesButtons, (e) => {
    toggleFavoriteItem(e.currentTarget.parentElement);
  });
  addEventListenerFn(notAddedToCartElement, (e) => {
    toggleCartItem(e.currentTarget.parentElement, "plus");
  });
  addEventListenerFn(addedToCartElementPlus, (e) => {
    toggleCartItem(e.currentTarget.parentElement.parentElement, "plus");
  });
  addEventListenerFn(addedToCartElementMinus, (e) => {
    toggleCartItem(e.currentTarget.parentElement.parentElement, "minus");
  });
  changeFilterIndicator(initialFilter, filterObj);
  calcCountFoundedItem(filteredData, productCount);
}
function updateFilterMenuUi(filters) {
  const { colors, categories, min_price, max_price, inventory } = filters;
  const colorElements = filtersContent.elements["colors"];
  const categoryElements = filtersContent.elements["categories"];
  const inventoryElements = filtersContent.elements["inventory"];
  const minPriceElement = filtersContent.elements["min_price"];
  const maxPriceElement = filtersContent.elements["max_price"];

  maxPriceElement.value = max_price;
  minPriceElement.value = min_price;
  inventoryElements.forEach((element) => {
    element.checked = false;
    if (element.value === inventory) element.checked = true;
  });
  categoryElements.forEach((element) => {
    element.checked = false;
    if (categories.includes(element.value)) element.checked = true;
  });
  colorElements.forEach((element) => {
    element.checked = false;
    if (colors.includes(element.value)) element.checked = true;
  });
}

function updateCartButtonUi(parent, id) {
  const isAddedToCart = cartData.find((cartItem) => cartItem.id == id);

  const element = parent.querySelector(`[data-product_id="${id}"]`);

  if (!element) return;

  if (isAddedToCart) {
    element.children[1].outerHTML = `
    <div class="change-count">
    <svg class="minus pointer svg">
      <use href="../assets/icons/svg-icons.svg#icon-Minus"></use>
    </svg>
    <span>${isAddedToCart.quantity}</span>
    <svg class="plus pointer svg">
      <use href="../assets/icons/svg-icons.svg#icon-Plus"></use>
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
      <use href="../assets/icons/svg-icons.svg#icon-Bag"></use>
    </svg>
  </button>
    `;
    addEventListenerFn(element.children[1], (e) => {
      toggleCartItem(e.currentTarget.parentElement, "plus");
    });
  }
}
function updateFavoriteButtonUi(parent, id) {
  const isAddedToFavorite = favoriteData.find(
    (favoriteItem) => favoriteItem.id == id
  );

  const element = parent.querySelector(`[data-product_id="${id}"]`);

  if (!element) return;
  if (isAddedToFavorite) {
    element.children[0].firstElementChild.classList.add("in-favorites");
  } else {
    element.children[0].firstElementChild.classList.remove("in-favorites");
  }
}
function mapProduct(item = []) {
  const isAddedToCart = cartData.find((cartItem) => cartItem.id == item.id);
  const isAddedToFavorite = favoriteData.find(
    (favoriteItem) => favoriteItem.id == item.id
  );
  const colors = item.colors
    .map(
      (item) => `<span style='background-color:${item};' class="color"></span>`
    )
    .join("");
  const totalPrice = +item.price + (+item.price * item.discount) / 100;
  return `
      <article class="product swiper-slide">
              <div class="content">
                <img src="${item.images[0]}" alt="${item.name}" />
                <div class="tags">
                  <span class="tag discount">${item.discount}%</span>
                </div>
                <div data-product_id="${item.id}" class="buttons">
                  <button class="buttons-like" type="button">
                    <svg class="${
                      isAddedToFavorite ? "in-favorites" : ""
                    } svg heart">
                      <use href="../assets/icons/svg-icons.svg#icon-Heart"></use>
                    </svg>
                  </button>

                  ${
                    isAddedToCart
                      ? `
                    <div class="change-count">
                    <svg class="minus pointer svg">
                      <use href="../assets/icons/svg-icons.svg#icon-Minus"></use>
                    </svg>
                    <span>${isAddedToCart.quantity}</span>
                    <svg class="plus pointer svg">
                      <use href="../assets/icons/svg-icons.svg#icon-Plus"></use>
                    </svg>
                  </div>
                    
                    `
                      : `
                  <button class="buttons-buy" type="button">
                  <svg class="svg">
                    <use href="../assets/icons/svg-icons.svg#icon-Bag"></use>
                  </svg>
                </button>
                  `
                  }

                  
                  <a href='./product.html#${item.id}' >
                  <button class="buttons-images" type="button">
                    <svg class="svg">
                      <use
                        href="../assets/icons/svg-icons.svg#icon-Gallery"
                      ></use>
                    </svg>
                    </button>
                    </a>
                </div>
                <divs class='colors'>
                ${colors}
                </divs>
              </div>
              <div class="info">
                <div class="details">
                  <span class="category">${item.categories.join(" - ")}</span>
                  <div class="stars">
                    ${stars(+item.rate, false)}
                  </div>
                </div>
                <span class="title"><a href='./product.html#${item.id}' >${
    item.name
  }</a></span>
                <div class="price">
                  <span class="current-price">$${+item.price}</span>
                  <span class="base-price">$${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </article>
      `;
}

function mapColor(item, index) {
  return `
  <div class="input-wrapper">
  <input name="colors" type="checkbox" value="${item}" id="color_${index}">
  <label class="pointer" data-color="${item}" for="color_${index}">
    <svg style="--fill:${item};" class="svg checkbox">
      <use href="../assets/icons/svg-icons.svg#icon-Checkbox-circle"></use>
    </svg>
  </label>
</div>
  `;
}
function mapCategory(item, index) {
  return `
  <div class="input-wrapper">
  <input name="categories" type="checkbox" value="${item}" id="cat_${index}" />
  <label data-category="${item}" for="cat_${index}">
    <svg class="svg pointer checkbox">
      <use
        href="../assets/icons/svg-icons.svg#icon-Checkbox"
      ></use>
    </svg>
    <span class="pointer">${item}</span>
  </label>
</div>
  `;
}
function mapPrice(item) {
  const { minPrice, maxPrice } = item;
  return `
  <label for="price_min">
    <span class="pointer" >min</span>
    <input
      name="min_price"
      value="${minPrice}"
      placeholder="${minPrice}"
      type="number"
      step=".01"
      max="${maxPrice}"
      min="0"
      id="price_min"
    />
  </label>
  <label for="price_max">
    <span class="pointer" >max</span>
    <input
      name="max_price"
      value="${maxPrice}"
      placeholder="${maxPrice}"
      type="number"
      step=".01"
      max="${maxPrice}"
      min="0"
      id="price_max"
    />
  </label>
  `;
}

createPreLoader(productsWrapper, PRODUCT_PRE_LOADER, 3);

getDataFromAPI("products")
  .then(({ error, products }) => {
    allProduct = products;
    const { categories, colors, minPrice, maxPrice } = getFilterItems(products);

    initialFilter = {
      categories: [],
      colors: [],
      min_price: minPrice,
      max_price: maxPrice,
      inventory: "all",
    };
    const { filter, sort: urlSort } = setSortAndFilterFromUrl(
      { ...initialFilter, categories, colors },
      searchParams
    );
    filters = filter;
    sort = urlSort;
    sortSelect.value = sort;

    const filteredData = handleFilter(products, initialFilter, filters);
    const sortedData = handleSort(filteredData, sort);

    insertData(colorFilterWrapper, colors, mapColor);
    insertData(priceFilterWrapper, [{ minPrice, maxPrice }], mapPrice);
    insertData(categoryFilterWrapper, categories, mapCategory);
    insertData(productsWrapper, sortedData, mapProduct);
    if (!filteredData.length) {
      productsWrapper.classList.add("no-grid");
      productsWrapper.innerHTML = ALL_PRODUCTS_NO_PRODUCT;
    }
    changeFilterIndicator(initialFilter, filters);
    updateFilterMenuUi(filters);
    const favoritesButtons = productsWrapper.querySelectorAll(".buttons-like");
    const notAddedToCartElement =
      productsWrapper.querySelectorAll(".buttons-buy");
    const addedToCartElementPlus = productsWrapper.querySelectorAll(
      ".change-count .plus"
    );
    const addedToCartElementMinus = productsWrapper.querySelectorAll(
      ".change-count .minus"
    );

    const colorFilterBtns = colorFilterWrapper.querySelectorAll("input");
    const categoryFilterBtn = categoryFilterWrapper.querySelectorAll("input");
    const priceFilterBtn = priceFilterWrapper.querySelectorAll("input");
    const inventoryFilterBtn = document.querySelectorAll(".inventories input");

    calcCountFoundedItem(filteredData, productCount);

    addEventListenerFn(favoritesButtons, (e) => {
      toggleFavoriteItem(e.currentTarget.parentElement);
    });
    addEventListenerFn(notAddedToCartElement, (e) => {
      toggleCartItem(e.currentTarget.parentElement, "plus");
    });
    addEventListenerFn(addedToCartElementPlus, (e) => {
      toggleCartItem(e.currentTarget.parentElement.parentElement, "plus");
    });
    addEventListenerFn(addedToCartElementMinus, (e) => {
      toggleCartItem(e.currentTarget.parentElement.parentElement, "minus");
    });

    addEventListenerFn(
      colorFilterBtns,
      (e) => {
        toggleFilterInputs(e);
      },
      "change"
    );
    addEventListenerFn(
      categoryFilterBtn,
      (e) => {
        toggleFilterInputs(e);
      },
      "change"
    );
    addEventListenerFn(
      priceFilterBtn,
      (e) => {
        toggleFilterInputs(e);
      },
      "change"
    );
    addEventListenerFn(
      inventoryFilterBtn,
      (e) => {
        toggleFilterInputs(e);
      },
      "change"
    );
    toggleFilterButton.classList.remove("disable");
    toggleFilterButton.addEventListener("click", toggleOpenFilterMenu);
  })
  .catch((err) => {
    console.log(err);
  });

handleBadge("cart");
handleBadge("favorite");

// listener

addEventListenerFn(resetFilter, resetFilters);
addEventListenerFn(
  sortSelect,
  (e) => {
    sortProducts(e);
  },
  "change"
);
