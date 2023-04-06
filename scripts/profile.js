import { getUser } from "./manage-users/getUser.js";
import { handleBadge } from "./utils/handleBadge.js";
import { setLocalStorage } from "./utils/useLocalStorage.js";

const isSignin = getUser();
if (!isSignin) {
  location.href = "./login.html";
} else {
  document.querySelector(".profile-container").innerHTML = `
  profile page
  <button>sign out</button>`;

  document.querySelector("button").addEventListener("click", () => {
    localStorage.removeItem("activeUser");
    location.href = "./login.html";
    setLocalStorage("favorites", []);
    setLocalStorage("products", []);
  });
}
handleBadge("cart");
handleBadge("favorite");
