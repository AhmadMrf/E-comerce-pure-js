export function resetFormsInputs(forms) {
  forms.forEach((form) => {
    for (let input of form.elements) {
      if (
        input.name === "email" ||
        input.name === "password" ||
        input.name === "username" ||
        input.name === "password_confirm" ||
        input.name === "agreement"
      ) {
        input.value = "";
        input.checked = false;
        input.previousElementSibling.classList.remove("error-validation");
        input.previousElementSibling.textContent = "";
      }
    }
    form["submit"].classList.remove("active");
  });
}
