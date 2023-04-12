import { setLocalStorage, getLocalStorage } from "../utils/useLocalStorage.js";
export function updateUser(userObject) {
  const users = getLocalStorage("users");
  const updatedUsers = users.map((user) => {
    if (user.email === userObject.email) {
      user = { ...userObject };
    }
    return user;
  });
  setLocalStorage("users", updatedUsers);
}
