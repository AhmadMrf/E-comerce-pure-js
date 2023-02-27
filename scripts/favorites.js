import { handleBadge } from "./utils/handleBadge.js";
import { handleFavorites } from "./manage-favorites/handleFavorites.js";
import { getLocalStorage } from "./utils/useLocalStorage.js";
import { insertData } from "./utils/insertData.js";
import { addEventListenerFn } from "./utils/addEventListenerFn.js";
import { hideResetWrapper } from "./utils/hideResetWrapper.js";

// ---------- selectors -----------
const favoritesWrapper = document.querySelector(".favorite-items-wrapper");
const countFavoritesItem = document.querySelector(".item-count");
const resetFavoriteButton = document.querySelector(".delete-favorite-wrapper");
// ---------- insert local data to page --------------
let favoriteData = getLocalStorage("favorites");

function resetFavorites() {
  favoriteData = handleFavorites(null, true);
  favoritesWrapper.innerHTML = "";
  calcCountFavoritesItem(countFavoritesItem);
  hideResetWrapper(favoriteData, resetFavoriteButton);
}
function toggleFavoriteItem(productBtnsParent_withId) {
  const id = productBtnsParent_withId.dataset.product_id;
  const product = favoriteData.find((productItem) => +productItem.id === +id);

  favoriteData = handleFavorites(product);
  productBtnsParent_withId.remove();
  calcCountFavoritesItem(countFavoritesItem);
  hideResetWrapper(favoriteData, resetFavoriteButton);
}

function mapCartItem(item) {
  const isAddedToFavorite = favoriteData.find(
    (favoriteItem) => favoriteItem.id == item.id
  );
  return `
  <article data-product_id='${item.id}' class="favorite-item">
  <div class="item-info">
    <div class="item-image-wrapper">
      <img src="${item.image[0]}" alt="${item.name}" />
    </div>
    <div class="item-info-container">
      <h4 class="name"><a href='./product.html#${item.id}' >${
    item.name
  }</a></h4>
      <span class="category">${item.category}</span>
      <div class="price">
        <span class="current-price">$${+item.price}</span>
      </div>

      <div class="title favorite">
        <span>${isAddedToFavorite ? "remove from" : "add to"} favorites</span>
        <svg class="${isAddedToFavorite ? "in-favorites" : ""} heart svg">
          <use
            href="../assets/icons/svg-icons.svg#icon-Heart"
          ></use>
        </svg>
      </div>
    </div>
  </div>
</article>
  `;
}
insertData(favoritesWrapper, favoriteData, mapCartItem);

const favoriteWrapper = favoritesWrapper.querySelectorAll(".favorite");

addEventListenerFn(favoriteWrapper, (e) => {
  const parent = e.currentTarget.closest("[data-product_id]");
  toggleFavoriteItem(parent);
});
addEventListenerFn(resetFavoriteButton, () => {
  resetFavorites();
});

// ------------ calculate item counts ---------------
function calcCountFavoritesItem(element) {
  let count = favoriteData.length;
  if (count) {
    count = count === 1 ? `${count} item` : `${count} items`;
  } else {
    count = `no items`;
  }
  element.textContent = count;
}
calcCountFavoritesItem(countFavoritesItem);
hideResetWrapper(favoriteData, resetFavoriteButton);
// ---------- cart and favorite badge  -------------
handleBadge("cart");
