import { BASE_URL } from "../../assets/data/template.js";
import { changeData } from "../utils/changeData.js";

export function getDataFromAPI(path) {
  return new Promise((resolve, reject) => {
    fetch(`${BASE_URL}/${path}`)
      .then((res) => res.json())
      .then((data) => {
        if (path === "products") resolve(changeData(data));
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
