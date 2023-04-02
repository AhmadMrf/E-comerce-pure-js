import { getUser } from "./manage-users/getUser.js";
import { setLocalStorage } from "./utils/useLocalStorage.js";

const isSignin = getUser();
if (!isSignin) {
  location.href = "../index.html";
}
document.querySelector("button").addEventListener("click", () => {
  localStorage.removeItem("activeUser");
  location.href = "./login.html";
});
