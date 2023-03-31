import { BASE_URL } from "../../assets/data/template.js";
import { changeData } from "../utils/changeData.js";

export function getDataFromAPI(path, query = "") {
  return new Promise((resolve, reject) => {
    fetch(`${BASE_URL}/${path}.php?${query}`)
      .then((res) => res.json())
      .then((data) => {
        if (path === "products") {
          const products = changeData(data.products);
          resolve({ ...data, products });
        }
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
