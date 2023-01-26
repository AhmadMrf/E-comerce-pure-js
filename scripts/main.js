// ----------  html tags ----------
const body = document.body;

const aside = document.querySelector(".sidebar-content");

const toggleMenuIcon = document.querySelector(".menu");
const toggleThemeIcon = document.querySelectorAll(".toggle-theme");
console.log(toggleThemeIcon);
// ----------  functions ----------

const toggleIcon = (e) => {
  e.currentTarget.classList.toggle("active");
};

const toggleSideBar = (e) => {
  aside.classList.toggle("active");
};

const toggleTheme = (e) => {
  let theme;
  body.dataset.theme === "light" ? (theme = "dark") : (theme = "light");
  body.dataset.theme = theme;
  localStorage.setItem("theme", theme);
};

const initialTheme = () => {
  let theme = localStorage.getItem("theme");
  if (theme) {
    body.dataset.theme = theme;
  }
};
initialTheme();

// ----------  listeners  ----------

toggleMenuIcon.addEventListener("click", (e) => {
  toggleIcon(e);
  toggleSideBar(e);
});
toggleThemeIcon.forEach((item) =>
  item.addEventListener("click", (e) => {
    toggleTheme(e);
  })
);
