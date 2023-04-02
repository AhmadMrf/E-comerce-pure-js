import { getLocalStorage, setLocalStorage } from "../utils/useLocalStorage.js";
import { addUser } from "./adduser.js";
import { getUser } from "./getUser.js";

export function signin(email, password, rememberMe) {
  const users = getLocalStorage("users");
  const activeUser = users.find(
    (user) =>
      user.email.toLowerCase() === email.toLowerCase() &&
      user.password === password
  );
  if (activeUser) {
    setLocalStorage("activeUser", {
      username: activeUser.username,
      email: activeUser.email,
    });
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
    addUser({ email, password, username });
    setLocalStorage("activeUser", {
      username: username,
      email: email,
    });
    return { error: false, message: "signup done successfully" };
  }
}
export function signout() {
  console.log("signout");
}
