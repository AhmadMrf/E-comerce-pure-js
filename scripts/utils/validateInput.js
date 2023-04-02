export function validateInput(inputType, value, password) {
  let error = false;
  let message = "";
  switch (inputType) {
    case "agreement":
      if (!value) {
        error = true;
        message = "do you agree with us terms & conditions ? ;)";
      }
      break;
    case "password":
      if (value.length < 4) {
        error = true;
        message = "Enter at least 4 characters";
      }
      break;
    case "password_confirm":
      if (value !== password) {
        error = true;
        message = "passwords does not match";
      }
      break;
    case "username":
      if (value.length < 3) {
        error = true;
        message = "user name must be at least 3 characters";
      }
      if (value.length >= 16) {
        error = true;
        message = "user name must be Maximum 15 characters";
      }
      break;
    case "email":
      const emailRegex = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/;
      if (!emailRegex.test(value)) {
        error = true;
        message = "enter a valid email";
      }
      break;

    default:
      error = true;
      message = "not match any input type";
      break;
  }
  return { error, message };
}
