// ----------  html tags ----------

const toggleMenuIcon = document.querySelector(".menu");
const toggleThemeIcon = document.querySelector(".sidebar-toggle-theme");

const aside = document.querySelector(".sidebar-content");

// ----------  functions ----------

const toggleIcon = (e) => {
  e.currentTarget.classList.toggle("active");
};

const toggleSideBar = (e) => {
  aside.classList.toggle("active");
};
// ----------  listeners  ----------

toggleMenuIcon.addEventListener("click", (e) => {
  toggleIcon(e);
  toggleSideBar(e);
});
toggleThemeIcon.addEventListener("click", toggleIcon);
