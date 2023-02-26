import {
  FULL_STAR,
  HALF_STAR,
  EMPTY_STAR,
  INDEX_EMPTY_STAR,
  INDEX_HALF_STAR,
  INDEX_FULL_STAR,
} from "../../assets/data/template.js";
export function stars(starCount, isIndex = true) {
  let fullStarIcon = INDEX_FULL_STAR;
  let halfStarIcon = INDEX_HALF_STAR;
  let emptyStarIcon = INDEX_EMPTY_STAR;
  if (!isIndex) {
    fullStarIcon = FULL_STAR;
    halfStarIcon = HALF_STAR;
    emptyStarIcon = EMPTY_STAR;
  }
  const fullStar = Math.floor(starCount);
  let haveHalfStar = starCount - fullStar ? true : false;
  const stars = Array.from({ length: 5 }, (_, i) => {
    if (i + 1 <= fullStar) {
      return fullStarIcon;
    } else if (haveHalfStar) {
      haveHalfStar = false;
      return halfStarIcon;
    } else {
      return emptyStarIcon;
    }
  });
  return stars.join("");
}
