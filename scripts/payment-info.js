import { getUser } from "./manage-users/getUser.js";

const paymentInfoContainer = document.querySelector(".payment-info-container");
const paymentDataJson = decodeURIComponent(location.search).slice(1);

const isSignin = getUser();

if (!paymentDataJson || !isSignin) {
  location.replace("../index.html");
} else {
  let paymentData = undefined;
  try {
    paymentData =
      paymentDataJson && JSON.parse(decodeURIComponent(paymentDataJson));
  } catch (error) {
    paymentData = null;
    console.log(error);
  }
  if (!paymentData) {
    paymentInfoContainer.textContent = "your payment info submited";
  }
  const { address, deliveryTime, paymentMethod, totalPrice } = paymentData;
  paymentInfoContainer.innerHTML = `
  
  <div class="shipping">
  your purchase will be sent to <span class="address">${address}</span> ,
  <span class="delivery">${deliveryTime}</span>.
  </div>
  <div class="payment">
  ${
    paymentMethod === "online"
      ? `paid <span class="price">${totalPrice.toFixed(2)}$</span> online`
      : `pay with cash <span class="price">${totalPrice.toFixed(2)}$</span>`
  }
  </div>
  `;
}
