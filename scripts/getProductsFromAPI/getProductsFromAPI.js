import { BASE_URL } from "../../assets/data/template.js";
import { changeData } from "../utils/changeData.js";

export const productPromise = new Promise((resolve, reject) => {
  fetch(`${BASE_URL}/products`)
    .then((res) => res.json())
    .then((data) => {
      const allProducts = changeData(data);
      resolve(allProducts);
    })
    .catch((err) => {
      reject(err);
    });
});
