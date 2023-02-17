import {
  FULL_STAR,
  HALF_STAR,
  EMPTY_STAR,
} from "../../assets/data/template.js";
export function stars(starCount) {
  const fullStar = Math.floor(starCount);
  let haveHalfStar = starCount - fullStar ? true : false;
  const stars = Array.from({ length: 5 }, (_, i) => {
    if (i + 1 <= fullStar) {
      return FULL_STAR;
    } else if (haveHalfStar) {
      haveHalfStar = false;
      return HALF_STAR;
    } else {
      return EMPTY_STAR;
    }
  });
  return stars.join("");
}
