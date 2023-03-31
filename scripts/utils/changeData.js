export function changeData(data) {
  const newData = data.map((item) => {
    const images = item.images.split(",");
    const colors = item.colors.split(",");
    const categories = item.categories.split(",");
    return {
      ...item,
      // category: categories[0],
      // image: images,
      colors,

      categories,
      images,
      // colors,
    };
  });
  return newData;
}
