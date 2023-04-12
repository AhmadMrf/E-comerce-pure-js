import { deleteCookie, setCookie } from "../utils/handleCookie.js";
import { getLocalStorage, setLocalStorage } from "../utils/useLocalStorage.js";
import { addUser } from "./addUser.js";
import { getUser } from "./getUser.js";
import { handleUserCartItem } from "./handleUserCartItem.js";
import { handleUserFavoriteItem } from "./handleUserFavoriteItem.js";

export function signin(email, password, rememberMe) {
  const users = getLocalStorage("users");
  const activeUser = users.find(
    (user) =>
      user.email.toLowerCase() === email.toLowerCase() &&
      user.password === password
  );
  if (activeUser) {
    let maxAge = undefined;
    rememberMe ? (maxAge = { "max-age": 604800 }) : null;
    setCookie("logged-in", "yes", maxAge);
    setLocalStorage("activeUser", {
      username: activeUser.username,
      email: activeUser.email,
    });
    handleUserCartItem(activeUser, "signin");
    handleUserFavoriteItem(activeUser, "signin");
    return { error: false, message: "signin done successfully" };
  } else {
    return { error: true, message: "email or password is incorrect" };
  }
}
export function signup(email, password, username) {
  const users = getLocalStorage("users");
  if (users.some((user) => user.email.toLowerCase() === email.toLowerCase())) {
    return { error: true, message: "email is already used" };
  } else {
    addUser({ email, password, username, cart: [], favorites: [] });
    setCookie("logged-in", "yes");
    setLocalStorage("activeUser", {
      username: username,
      email: email,
    });
    return { error: false, message: "signup done successfully" };
  }
}
export function signout() {
  const isSignin = getUser();
  handleUserCartItem(isSignin, "signout");
  handleUserFavoriteItem(isSignin, "signout");
  deleteCookie("logged-in");
  localStorage.removeItem("activeUser");
  setLocalStorage("favorites", []);
  setLocalStorage("products", []);
  location.href = "./login.html";
}
