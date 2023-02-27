export function hideResetWrapper(data, wrapper) {
  console.log(5);
  console.log(data);
  console.log(wrapper);
  if (data.length > 0) {
    wrapper.classList.remove("hide");
  } else {
    wrapper.classList.add("hide");
  }
}
