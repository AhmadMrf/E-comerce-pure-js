export function hideResetWrapper(data, wrapper) {
  if (data.length > 0) {
    wrapper.classList.add("show");
  } else {
    wrapper.classList.remove("show");
  }
}
