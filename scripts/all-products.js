/********** selectors ***********/
const toggleFilterButton = document.querySelector(
  ".open-filter-section-button"
);
const filterWrapper = document.querySelector(".filters-wrapper");
const toggleFilters = () => {
  toggleFilterButton.classList.toggle("active");
  filterWrapper.classList.toggle("active");
};

toggleFilterButton.addEventListener("click", toggleFilters);
