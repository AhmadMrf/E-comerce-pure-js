export function getLocalStorage(key) {
  let localData = localStorage.getItem(key);
  if (!localData) {
    return [];
  } else {
    localData = JSON.parse(localData);
  }
  return localData;
}
export function setLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
  return getLocalStorage(key);
}
