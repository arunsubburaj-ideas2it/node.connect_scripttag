var css = `
#nodeInstallWrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
#nodeInstallWrapper .nodeIcon {
  background-image: url("https://cdn.shopify.com/s/files/1/0764/8424/7843/files/node_icon_7ea198d0-732c-4b5f-bbd1-3763b481be6b_480x480.png?v=1684781028");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  width: 109px;
  height: 60px;
}
#nodeInstallWrapper .actionBtns{
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
  margin: 20px;
}
div#nodeInstallWrapper>div {
  margin: 3px;
  text-align: center;
}
#nodeInstallWrapper strong {
  font-weight: bold;
  color: #000;
}
#nodeInstallWrapper .actionBtns>button, #deepLink {
  color: #1773b0;
  font-weight: bold;
}
#nodeInstallWrapper .actionBtns>button[disabled] {
  color: #919191;
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
  flex-direction: column;
  align-items: flex-start;
}

.productInfo>div {
  text-align: left;
}

.productName {
  padding-bottom: 10px;
}

div#lineItems {
  display: flex;
  flex-direction: column;
  box-shadow: 0px 0px 3px 0px #000;
  border-radius: 5px;
  margin: 20px 0 !important;
  width: 100%;
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

Shopify.Checkout.OrderStatus.addContentBox(`<div id="nodeInstallWrapper">
      <div class="nodeIcon"></div>
      <div id="lineItems"></div>
      <div>Install <span id="deepLink" onClick="installApp()" title="Install node.">node.</span> to instantly track your order with one click on your phone.</div>
      <div><span style="font-weight:bold;">NO</span> usernames, passwords, accounts</div>
    </div>`);
if (Shopify.checkout) {
  renderLineItems();
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
}, 350);
window.addEventListener("message", (event) => {
  if (event?.data?.type == "nodeAvailable") {
    isNodeAvailable = true;
    console.log("Node Available");
    var nodeContentBox = Array.from(
      document.querySelectorAll(".content-box")
    ).filter((currentEle) => currentEle.querySelector("#nodeInstallWrapper"));
    if (nodeContentBox.length > 0) {
      nodeContentBox[0].remove();
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
  var buyAgainURI = `${
    buyAgainURL.split("buy-again?")[0]
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
                  <div class='productImage' style="background-image:url(${
                    current.image_url
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
