const paymentInfoContainer = document.querySelector(".payment-info-container");
const paymentDataJson = decodeURIComponent(location.search).slice(1);
if (!paymentDataJson) {
  location.href = "./cart.html";
}
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
    ? `paid <span class="price">${totalPrice}$</span> online`
    : `pay with cash <span class="price">${totalPrice}$</span>`
}
</div>
`;
