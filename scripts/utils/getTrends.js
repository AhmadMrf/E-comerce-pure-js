export function getTrends(data = []) {
  const trends = data.filter((item) => {
    return item.rate >= 3;
  });
  return trends;
}
