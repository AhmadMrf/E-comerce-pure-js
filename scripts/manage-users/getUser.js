import { getLocalStorage } from "../utils/useLocalStorage.js";
export function getUser() {
  const activeUser = getLocalStorage("activeUser");
  const users = getLocalStorage("users");
  const existActiveUser = users.some(
    (user) => user.email === activeUser?.email
  );

  if (!existActiveUser) {
    return null;
  }
  return activeUser;
}
