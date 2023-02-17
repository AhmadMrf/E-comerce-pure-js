export function getCategories(data = []) {
  const allCategories = data.map((item) => {
    return item.category;
  });
  const categories = new Set(allCategories);
  return ["all", ...categories];
}
