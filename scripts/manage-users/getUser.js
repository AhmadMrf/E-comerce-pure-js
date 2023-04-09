import { getCookie } from "../utils/handleCookie.js";
import { getLocalStorage } from "../utils/useLocalStorage.js";
export function getUser() {
  const rememberUser = getCookie("logged-in");
  if (!rememberUser) {
    localStorage.removeItem("activeUser");
    return null;
  }
  const activeUser = getLocalStorage("activeUser");

  if (!activeUser) return null;
  const users = getLocalStorage("users");
  const existActiveUser = users.some(
    (user) => user.email === activeUser?.email
  );

  if (!existActiveUser) {
    return null;
  }
  return activeUser;
}
