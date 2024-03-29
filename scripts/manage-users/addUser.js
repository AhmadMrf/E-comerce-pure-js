import { setLocalStorage, getLocalStorage } from "../utils/useLocalStorage.js";
export function addUser(userObject) {
  const users = getLocalStorage("users");
  const newUsers = [...users, userObject];
  setLocalStorage("users", newUsers);
}
