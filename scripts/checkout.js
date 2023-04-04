import { handleBadge } from "./utils/handleBadge.js";
import { addEventListenerFn } from "./utils/addEventListenerFn.js";
import { getLocalStorage, setLocalStorage } from "./utils/useLocalStorage.js";
import { getUser } from "./manage-users/getUser.js";
// constants
const checkoutWrapper = document.querySelector(".checkout-wrapper");
const payButton = document.querySelector(".pay");
const errorAddressTag = document.querySelector(
  ".shipping-content> span:first-child"
);
const priceTag = document.querySelector(".price-amount");
const giftTag = document.querySelector(".gift-amount");
const totalPriceTag = document.querySelector(".total-price-amount");
const shippingTag = document.querySelector(".total-shipping-cost");

const errorGiftTag = document.querySelector(
  ".gift-container > span:first-child"
);
const giftContainer = document.querySelector(".gift-code");
const giftInput = giftContainer.querySelector("#gift-code");
const giftButton = giftContainer.querySelector(".add-gift");

const form = document.forms["checkout"];
const isSignin = getUser();

if (!isSignin) {
  location.href = "./login.html";
} else if (!getLocalStorage("products").length) {
  checkoutWrapper.innerHTML = `
<span> there is no cart items . </span>
<a href="./all-products.html" >go to all products page</a>
`;
} else {
  const gifts = [
    { giftCode: "20gift", discount: 20 },
    { giftCode: "30gift", discount: 30 },
    { giftCode: "free", discount: 100 },
  ];
  const priceInfo = {
    price: clacPrice(),
    shipping: dummyShippingCost(form["address"].value),
    gift: 0,
  };
  const paymentInfo = {
    totalPrice: 0,
    address: "",
    deliveryTime: "",
    paymentMethod: "",
  };
  // functions
  function checkGiftCode(code = 0) {
    return gifts.find((item) => item.giftCode === code)?.discount;
    // return > discount || undefined
  }

  function handleGift() {
    const giftCode = giftInput.value;
    if (!giftCode) return;
    const giftDiscount = checkGiftCode(giftCode);
    if (!giftDiscount) {
      errorHandle(
        "add",
        errorGiftTag,
        "error-validation",
        "gift code is incorect"
      );
    } else {
      errorHandle("add", errorGiftTag, "success", "gift code applied");
      priceInfo.gift = giftDiscount;
      showPrices();
    }
  }

  function dummyShippingCost(address) {
    return address.length > 30
      ? 200
      : address.length > 10
      ? 100
      : address.length > 1
      ? 50
      : 0;
  }

  function clacPrice() {
    let price = getLocalStorage("products").reduce(
      (totalPrice, { quantity, price, discount }) => {
        const itemPrice = (+price - +price * (discount / 100)) * +quantity;
        return (totalPrice += itemPrice);
      },
      0
    );
    return price;
  }

  function showPrices() {
    priceTag.textContent = priceInfo.price.toFixed(2);
    giftTag.textContent = priceInfo.gift + "%";
    shippingTag.textContent = priceInfo.shipping;
    totalPriceTag.textContent = (
      priceInfo.price -
      priceInfo.price * (priceInfo.gift / 100) +
      priceInfo.shipping
    ).toFixed(2);
  }
  showPrices();

  let timeout;
  function errorHandle(type, errorTag, className, message) {
    // type=add||remove
    if (type === "add") {
      errorTag.classList.add(className);
      errorTag.textContent = message;
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        errorTag.classList.remove(className);
        errorTag.textContent = "";
      }, 3000);
    } else {
      errorTag.className = "";
      errorTag.textContent = "";
    }
  }
  function hasAddress() {
    return !!form["address"].value.trim();
  }
  handleBadge("favorite");
  // listener

  addEventListenerFn(payButton, () => {
    if (hasAddress()) {
      const address = form["address"].value;
      const deliveryTime = form["time"].value;
      const paymentMethod = form["payment"].value;
      const totalPrice =
        priceInfo.price -
        priceInfo.price * (priceInfo.gift / 100) +
        priceInfo.shipping;
      paymentInfo.totalPrice = totalPrice;
      paymentInfo.address = address;
      paymentInfo.deliveryTime = deliveryTime;
      paymentInfo.paymentMethod = paymentMethod;

      const paymentData = encodeURIComponent(JSON.stringify(paymentInfo));
      setLocalStorage("products", []);
      location.replace(`./payment-info.html?${paymentData}`);
    } else {
      errorHandle(
        "add",
        errorAddressTag,
        "error-validation",
        "enter your address"
      );
    }
  });
  addEventListenerFn(
    form["address"],
    (e) => {
      if (e.target.value) {
        errorHandle("remove", errorAddressTag);
        priceInfo.shipping = dummyShippingCost(e.target.value);
        showPrices();
      }
    },
    "input"
  );
  addEventListenerFn(giftButton, () => {
    handleGift();
  });
  addEventListenerFn(
    giftInput,
    () => {
      errorHandle("remove", errorGiftTag);
    },
    "input"
  );

  addEventListenerFn(
    giftInput,
    (e) => {
      giftInput.placeholder = "20gift | 30gift | free";
    },
    "mouseenter"
  );
  addEventListenerFn(
    giftInput,
    (e) => {
      giftInput.placeholder = "enter your gift code";
    },
    "mouseleave"
  );
}
