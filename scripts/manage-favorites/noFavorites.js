export function noFavorites(wrapper) {
  const isTooltip = document.body.querySelector(".tooltip.no-favorite");
  if (isTooltip) return;
  // const heartSvg = wrapper.querySelector(".heart");
  const tooltip = document.createElement("span");
  tooltip.className = "tooltip no-favorite pointer";
  tooltip.textContent = "sign in to add favorites";
  document.body.insertAdjacentElement("afterbegin", tooltip);
  let timeOut = undefined;
  const removeToolTip = () => {
    tooltip.remove();
    tooltip.removeEventListener("click", removeToolTip);
    clearTimeout(timeOut);
  };
  tooltip.addEventListener("click", removeToolTip);
  timeOut = setTimeout(() => {
    tooltip.removeEventListener("click", removeToolTip);
    removeToolTip();
  }, 3000);
}
