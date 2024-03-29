import { getUser } from "./manage-users/getUser.js";
import { signout } from "./manage-users/userStates.js";
import { handleBadge } from "./utils/handleBadge.js";
import { setLocalStorage } from "./utils/useLocalStorage.js";

const isSignin = getUser();
if (!isSignin) {
  location.replace("./login.html");
} else {
  document.querySelector(".profile-container").innerHTML = `
  profile page
  <button>sign out</button>`;

  document.querySelector("button").addEventListener("click", () => {
    signout();
  });
}
handleBadge("cart");
handleBadge("favorite");
