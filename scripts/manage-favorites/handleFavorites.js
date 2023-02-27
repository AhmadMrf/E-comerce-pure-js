import { setLocalStorage, getLocalStorage } from "../utils/useLocalStorage.js";
function resetFavorites() {
  return setLocalStorage("favorites", []);
}

export function handleFavorites(product = {}, doReset = false) {
  let favoriteData = getLocalStorage("favorites");
  if (doReset) {
    favoriteData = resetFavorites();
  } else if (product) {
    const isInFavorite = favoriteData.find(
      (favoriteItem) => +favoriteItem.id === +product.id
    );

    if (isInFavorite) {
      favoriteData = favoriteData.filter(
        (favoriteItem) => +favoriteItem.id !== +isInFavorite.id
      );
    } else {
      const newFavorite = { ...product, isFavorited: true };
      favoriteData = [...favoriteData, newFavorite];
    }
    setLocalStorage("favorites", favoriteData);
  }
  return favoriteData;
}
