var css = `
#nodeInstallWrapper {
  justify-content: center;
  align-items: center;
  flex-direction: column;
  display: none;
}
#nodeInstallWrapper.show{
  display: flex;
}
#nodeInstallWrapper .nodeIcon {
  background-image: url("https://cdn.shopify.com/s/files/1/0764/8424/7843/files/node_icon_7ea198d0-732c-4b5f-bbd1-3763b481be6b_480x480.png?v=1684781028");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  width: 109px;
  height: 60px;
}

div#nodeInstallWrapper>div {
  text-align: center;
}

#deepLink {
  color: #fff;
  font-weight: bold;
  background: #2F7C67;
  display: block;
  padding: 15px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin: 10px 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.productImage {
  width: 60px;
  height: 60px;
  min-width: 60px;
  min-height: 60px;
  background-repeat: no-repeat;
  background-size: cover;
  border: 1px solid #333;
  border-radius: 5px;
  position: relative;
  background-color: #fff;
}

.productCount {
  width: 20px;
  height: 20px;
  position: absolute;
  top: -10px;
  right: -10px;
  background-color: rgba(0,0,0,0.5);
  border-radius: 50%;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 12px;
}

.card {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 10px;
}

.productInfo {
  margin-left: 30px;
  display: flex;
  flex-direction: row;
  align-items: center;
  font-weight: bold;
  justify-content: space-between;
}

.productInfo>div {
  text-align: left;
}

.productName {
  max-width: 60%;
}

div#lineItems {
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  margin: 20px 0 !important;
  width: 100%;
  max-height: 200px;
  overflow: auto;
}
.orderInfo {
  margin: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  font-weight: bold;
  justify-content: space-between;
  flex-wrap: wrap;
}

.orderInfo>div {
  text-transform: uppercase;
}

.orderInfo .email {
  color: rgba(0,0,0,0.5);
  text-transform: lowercase;
}

.separator {
  border-bottom: 1px solid;
  width: 100%;
  border-color: #ccc;
  margin-top: 15px !important;
}

span.nodeDot {
  color: #2BA281;
  padding-left: 1px;
  font-weight: bold;
}


div#nodeInstallSkeleton {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

#nodeInstallSkeleton .nodeIcon {
  width: 75px;
  height: 50px;
  margin: 5px 0;
  border-radius: 5px;
  animation: skeleton-loading 1s linear infinite alternate;
}

.skeleton-heading {
  width: 80%;
  height: 2rem;
  margin: 8px 0;
  animation: skeleton-loading 1s linear infinite alternate;
  line-height: 30px;
  border-radius: 5px;
}

.skeleton-message {
  height: 60px;
  width: 100%;
  animation: skeleton-loading 1s linear infinite alternate;
  margin: 5px;
}

.skeleton-button {
  width: 80%;
  margin: 10px auto;
  height: 35px;
  animation: skeleton-loading 1s linear infinite alternate;
  border-radius: 5px;
}

@keyframes skeleton-loading {
  0% {
    background-color: hsl(200, 20%, 80%);
  }
  100% {
    background-color: hsl(200, 20%, 95%);
  }
}
`;
var head = document.head || document.getElementsByTagName("head")[0];
var style = document.createElement("style");
var deeplinkUrlObj, checkoutObj, interactionInstance;
head.appendChild(style);

if (style.styleSheet) {
  // This is required for IE8 and below.
  style.styleSheet.cssText = css;
} else {
  style.appendChild(document.createTextNode(css));
}

Shopify.Checkout.OrderStatus.addContentBox(`
<div id="nodeInstallSkeleton">
    <div class="nodeIcon"></div>
    <div class="skeleton-heading"></div>
    <div class="skeleton-message"></div>
    <div class="skeleton-button"></div>
</div>
<div id="nodeInstallWrapper">
  <div class="nodeIcon"></div>
  <h2 style="text-align: center; width: 100%; margin-bottom: 10px;">Want to manage your orders and keep your personal email private?</h2>
  <div class="benefits" style="text-align: left;
  ">Get a tokenized email to prevent spam and phishing attempts. Save and manage all your orders instantly and
      securely only on your phone using <b>node.</b></div>
  <button id="deepLink" onclick="installApp()">
      <svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 -960 960 960" width="16"
          style="fill: #fff;margin-right: 5px;">
          <path
              d="M263.717-96Q234-96 213-117.15T192-168v-384q0-29.7 21.15-50.85Q234.3-624 264-624h24v-96q0-79.68 56.226-135.84t136-56.16Q560-912 616-855.84T672-720v96h24q29.7 0 50.85 21.15Q768-581.7 768-552v384q0 29.7-21.162 50.85Q725.676-96 695.96-96H263.717Zm.283-72h432v-384H264v384Zm216.212-120Q510-288 531-309.212q21-21.213 21-51Q552-390 530.788-411q-21.213-21-51-21Q450-432 429-410.788q-21 21.213-21 51Q408-330 429.212-309q21.213 21 51 21ZM360-624h240v-96q0-50-35-85t-85-35q-50 0-85 35t-35 85v96Zm-96 456v-384 384Z">
          </path>
      </svg>
      <span class="buttonMsg">Securely manage orders with node<span class="nodeDot">.</span></span>
  </button>
  <div style=" color: #afafaf; font-size: 12px;">100% private. Instant &amp; secure access on your phone.</div>
  <div class="separator"></div>
  <div class="orderInfo">
      <div class="orderNo"></div>
      <div class="email"></div>
  </div>
  <div id="lineItems">
  </div>
</div>`);
var nodeContentBox = Array.from(
  document.querySelectorAll(".content-box")
).filter((currentEle) => currentEle.querySelector("#nodeInstallWrapper"));
if (nodeContentBox.length > 0) {
  document.querySelector(".section__content").prepend(nodeContentBox[0]);
}
if (Shopify.checkout) {
  renderLineItems();
  document.querySelector("#nodeInstallWrapper .orderNo").innerText = document.querySelector(".os-order-number").innerText;
  document.querySelector("#nodeInstallWrapper .orderInfo .email").innerText = Shopify.checkout.email;
}
var isNodeAvailable = false;
setTimeout(async function () {
  window.postMessage(
    {
      type: "IsNodeAvailable",
      data: window.location.href,
    },
    "*"
  );
  var isBuyAgainExist =
    window.sessionStorage.getItem("buyAgainObj")?.length > 0;
  var buyAgainObj;
  if (isBuyAgainExist) {
    updateBuyAgainObj();
    buyAgainObj = JSON.parse(window.sessionStorage.getItem("buyAgainObj"));
  } else {
    buyAgainObj = null;
  }
  checkoutObj = Shopify?.checkout;
  interactionInstance = new NodeInteractions(checkoutObj, buyAgainObj);
  handleDeepLink();
  setTimeout(function () {
    document.getElementById("nodeInstallSkeleton").style.display = "none";
    document.getElementById("nodeInstallWrapper").style.display = "flex";
  }, 2000);
}, 350);
window.addEventListener("message", (event) => {
  if (event?.data?.type == "nodeAvailable") {
    isNodeAvailable = true;
    console.log("Node Available");
    var nodeContentBox = Array.from(
      document.querySelectorAll(".content-box")
    ).filter((currentEle) => currentEle.querySelector("#nodeInstallWrapper"));
    if (nodeContentBox.length > 0) {
      nodeContentBox[0].querySelector("#nodeInstallWrapper h2").innerText = "Your order has automatically and instantly been added to your node."
      nodeContentBox[0].querySelector("#nodeInstallWrapper .benefits").style.display = "none";
      nodeContentBox[0].querySelector("#deepLink .buttonMsg").innerHTML = "See your order on your node<span class='nodeDot'>.</span>"
    }
    handleInteraction();
  }
});
function updateBuyAgainObj() {
  var buyAgainString = window.sessionStorage.getItem("buyAgainObj");
  var buyAgainObj = JSON.parse(buyAgainString);
  var buyAgainURL = buyAgainObj?.URL;
  var cipherData = buyAgainURL.split("buy-again?")[1];
  var bytes = CryptoJS.AES.decrypt(cipherData, "node-buy-again");
  var decryptedData = bytes.toString(CryptoJS.enc.Utf8);
  console.log(decryptedData);
  var decryptedObj = JSON.parse(decryptedData);
  console.log(decryptedObj);
  decryptedObj["orderId"] = Shopify.checkout.order_id;
  console.log(decryptedObj);
  var encryptedOrderData = CryptoJS.AES.encrypt(
    JSON.stringify(decryptedObj),
    "node-buy-again"
  ).toString();
  var buyAgainURI = `${buyAgainURL.split("buy-again?")[0]
    }buy-again?${encryptedOrderData}`;
  console.log(buyAgainURI);
  buyAgainObj["URL"] = buyAgainURI;
  console.log(buyAgainObj);
  window.sessionStorage.setItem("buyAgainObj", JSON.stringify(buyAgainObj));
}
async function installApp() {
  if (deeplinkUrlObj) {
    await copyContent(deeplinkUrlObj.copyLink);
    window.location.href = deeplinkUrlObj.shortLink;
  } else {
    console.log("Error on creating Deeplink url");
  }
}
function handleInteraction() {
  if (interactionInstance) {
    interactionInstance.update();
    window.sessionStorage.removeItem("buyAgainObj");
    window.sessionStorage.removeItem("couponCode");
  }
}
async function handleDeepLink() {
  try {
    if (interactionInstance) {
      deeplinkRes = await interactionInstance.generateDeepLink();
      deeplinkUrlObj = deeplinkRes;
      console.log({ deeplinkUrlObj });
      window.sessionStorage.removeItem("buyAgainObj");
      window.sessionStorage.removeItem("couponCode");
    }
  } catch (error) {
    console.log("Error while creating deeplink", error);
  }
}

async function copyContent(text) {
  try {
    await navigator.clipboard.writeText(text);
    console.log("Content copied to clipboard");
  } catch (err) {
    console.error("Failed to copy: ", err);
  }
}

function renderLineItems() {
  var lineItems = Shopify.checkout.line_items;
  var cards = "";
  lineItems.forEach((current, index) => {
    cards += `
              <div class='card'>
                  <div class='productImage' style="background-image:url(${current.image_url
      })">
                      <div class='productCount'>${current.quantity}</div>
                  </div>
                  <div class='productInfo'>
                      <div class='productName'>${current.title}</div>
                      <div class='productPrice'>${generatePriceString(
        current.price
      )}</div>
                  </div>
              </div>
          `;
    // var separater = "<div class='separator'></div>";
    // if (lineItems.length != 1 && index != lineItems.length - 1) {
    //   cards += separater;
    // }
  });
  document.getElementById("lineItems").innerHTML = cards;
}

function generatePriceString(price) {
  var currency = Shopify.checkout.currency;
  var locale = "en-US";
  const options = { style: "currency", currency };
  const numberFormat = new Intl.NumberFormat(locale, options);

  const parts = numberFormat.format(price);
  console.log(parts);
  return parts;
}
