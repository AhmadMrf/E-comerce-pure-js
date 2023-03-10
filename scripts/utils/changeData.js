import { CATEGORIES, COLORS } from "../../assets/data/template.js";
export function changeData(data) {
  const newData = data.map((item) => {
    const randomImageId = Math.floor(Math.random() * 400);
    const category = [
      CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)],
    ];
    const colorsCount = Math.floor(Math.random() * COLORS.length);
    const colors = COLORS.slice(0, colorsCount + 1);
    const count_in_stock = +item.count_in_stock <= 3 ? 0 : +item.count_in_stock;
    const images = [
      `https://picsum.photos/id/${randomImageId}/200/300`,
      `https://picsum.photos/id/${randomImageId + 1}/200/300`,
      `https://picsum.photos/id/${randomImageId + 2}/200/300`,
      `https://picsum.photos/id/${randomImageId + 3}/200/300`,
    ];
    return {
      ...item,
      category,
      discount: +item.discount * 10,
      rate: +item.rate / 2,
      image: images,
      colors,
      count_in_stock,
    };
  });
  return newData;
}
