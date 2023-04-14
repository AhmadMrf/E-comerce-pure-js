import { addEventListenerFn } from "./utils/addEventListenerFn.js";
import { getUser } from "./manage-users/getUser.js";
import { signin, signup } from "./manage-users/userStates.js";
import { resetFormsInputs } from "./utils/resetFormsInputs.js";
import { validateInput } from "./utils/validateInput.js";
import { handleBadge } from "./utils/handleBadge.js";

// constants
const changeFormButtons = document.querySelectorAll(".change-form button");
const formContent = document.querySelector(".form-content");
const forms = document.forms;
const isDirectedFromCheckoutPage = new URLSearchParams(location.search).has(
  "cart"
);
const isSignin = getUser();
if (isSignin) {
  location.replace("./profile.html");
} else {
  const enteredUserInfo = {
    reset() {
      this.signin.email = false;
      this.signin.password = false;
      this.signin.rememberMe = true;
      this.signup.username = false;
      this.signup.email = false;
      this.signup.password = false;
      this.signup.password_confirm = false;
      this.signup.agreement = false;
    },
    signin: {
      email: false,
      password: false,
      rememberMe: true,
      isValidForm() {
        return !!(this.email && this.password);
      },
    },
    signup: {
      username: false,
      email: false,
      password: false,
      password_confirm: false,
      agreement: false,
      isValidForm() {
        return !!(
          this.agreement &&
          this.username &&
          this.email &&
          this.password &&
          this.password_confirm
        );
      },
    },
  };

  function checkRememberMe(rememberInput) {
    enteredUserInfo.signin.rememberMe = rememberInput.checked;
  }

  function validateForm(input) {
    const parentForm = input.form;
    const inputName = input.name;
    const inputValue = input.checked || input.value;
    const latestPassword = enteredUserInfo.signup.password;
    const errorContainerTag = input.previousElementSibling;
    const haveErrorMessage =
      errorContainerTag.classList.contains("error-validation");

    const { error, message } = validateInput(
      inputName,
      inputValue,
      latestPassword
    );

    if (error && !haveErrorMessage) {
      errorContainerTag.classList.add("error-validation");
      errorContainerTag.textContent = message;
      enteredUserInfo[parentForm.name][inputName] = false;
    } else if (!error) {
      errorContainerTag.classList.remove("error-validation");
      errorContainerTag.textContent = "";
      enteredUserInfo[parentForm.name][inputName] = inputValue;
    }

    parentForm["submit"].classList.toggle(
      "active",
      enteredUserInfo[parentForm.name].isValidForm()
    );
  }

  function getformInputsAzArray(form) {
    const inputs = [];
    for (let input of form.elements) {
      if (
        input.name === "email" ||
        input.name === "password" ||
        input.name === "username" ||
        input.name === "password_confirm" ||
        input.name === "agreement"
      ) {
        inputs.push(input);
      }
    }
    return inputs;
  }

  function hintValidation(form) {
    getformInputsAzArray(form).forEach((input) => {
      validateForm(input);
    });
  }

  let timeOut;
  function signErrorHandle(form, message) {
    const errorTag = form.firstElementChild;
    errorTag.classList.add("error-sign");
    errorTag.textContent = message;
    clearTimeout(timeOut);
    timeOut = setTimeout(() => {
      errorTag.classList.remove("error-sign");
      errorTag.textContent = "";
    }, 3000);
  }

  function handleSignin() {
    const { email, password, rememberMe } = enteredUserInfo.signin;
    const { error, message } = signin(email, password, rememberMe);
    if (error) {
      signErrorHandle(forms["signin"], message);
    } else {
      if (isDirectedFromCheckoutPage) {
        location.replace("./checkout.html");
      } else {
        location.replace("./profile.html");
      }
    }
  }
  function handleSigniup() {
    const { email, password, username } = enteredUserInfo.signup;
    const { error, message } = signup(email, password, username);
    if (error) {
      signErrorHandle(forms["signup"], message);
    } else {
      if (isDirectedFromCheckoutPage) {
        location.replace("./checkout.html");
      } else {
        location.replace("./profile.html");
      }
    }
  }

  resetFormsInputs([...forms]);
  // listeners
  addEventListenerFn(
    forms["signin"]["remember"],
    (e) => checkRememberMe(e.target),
    "change"
  );

  addEventListenerFn(
    getformInputsAzArray(forms["signin"]),
    (e) => validateForm(e.target),
    "input"
  );
  addEventListenerFn(
    getformInputsAzArray(forms["signup"]),
    (e) => validateForm(e.target),
    "input"
  );

  addEventListenerFn(changeFormButtons, () => {
    formContent.classList.toggle("signup");
    resetFormsInputs([...forms]);
    enteredUserInfo.reset();
  });
  addEventListenerFn(
    [...forms],
    (e) => {
      e.preventDefault();
      if (e.target.name === "signin" && enteredUserInfo.signin.isValidForm()) {
        handleSignin();
      } else if (
        e.target.name === "signup" &&
        enteredUserInfo.signup.isValidForm()
      ) {
        handleSigniup();
      } else {
        hintValidation(e.target);
      }
    },
    "submit"
  );
  handleBadge("cart");
  handleBadge("favorite");
}
