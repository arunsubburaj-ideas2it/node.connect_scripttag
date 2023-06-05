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
}
#nodeInstallWrapper strong {
  font-weight: bold;
  color: #000;
}
#nodeInstallWrapper .actionBtns>button {
  color: #1773b0;
  font-weight: bold;
}
#nodeInstallWrapper .actionBtns>button[disabled] {
  color: #919191;
}
`;
var head = document.head || document.getElementsByTagName("head")[0];
var style = document.createElement("style");
var deeplinkUrl, checkoutObj, interactionInstance;
head.appendChild(style);

if (style.styleSheet) {
  // This is required for IE8 and below.
  style.styleSheet.cssText = css;
} else {
  style.appendChild(document.createTextNode(css));
}

Shopify.Checkout.OrderStatus.addContentBox(`<div id="nodeInstallWrapper">
      <div class="nodeIcon"></div>
      <div>One-click. Never type. In your pocket.</div>
      <div>Protect against spam and phishing.</div>
      <div>Privacy is <strong>your choice.</strong></div>
      <div class="actionBtns">
        <button id="deepLink" onClick="installApp()" title="Download node.">Download node.</button>
        <button id="learnMore" disabled title="Learn more">Learn more</button>
      </div>
    </div>`);
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
    ).filter((currentEle) => currentEle.textContent.includes("Download node."));
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
  if (deeplinkUrl) {
    await copyContent(deeplinkUrl);
    window.location.href = deeplinkUrl;
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
      deeplinkUrl = deeplinkRes.shortLink;
      console.log({ deeplinkUrl });
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
