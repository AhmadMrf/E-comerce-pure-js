import { getLocalStorage, setLocalStorage } from "../utils/useLocalStorage.js";
import { updateUser } from "./updateUser.js";

export function handleUserFavoriteItem(isuser, state) {
  if (!isuser) return;
  const users = getLocalStorage("users");
  const activeUser = users.find((user) => user.email === isuser?.email);
  if (activeUser && (state === "enter" || state === "signin")) {
    setLocalStorage("favorites", activeUser.favorites);
  }
  if (activeUser && (state === "exit" || state === "signout")) {
    const favoritesItem = getLocalStorage("favorites");
    const updatedUser = { ...activeUser, favorites: [...favoritesItem] };
    updateUser(updatedUser);
    if (state === "exit") setLocalStorage("favorites", []);
  }
}
