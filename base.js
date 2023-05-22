var css = `
#nodeInstallBtn {
  background-image: url("https://cdn.shopify.com/s/files/1/0734/3479/2254/files/node_icon_0540adb3-be04-401e-82a2-07bbdb8a4024_480x480.png?v=1683286464");
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  width: 60px;
  height: 60px;
  cursor: pointer;
  border-radius: 5px;
  margin-left: 50px;
  box-shadow: 0px 0px 3px 1px rgba(0, 0, 0, 0.5);
}`;
var head = document.head || document.getElementsByTagName("head")[0];
var style = document.createElement("style");
var appUrl="https://testflight.apple.com/join/L5KE67vq";
head.appendChild(style);

if (style.styleSheet) {
  // This is required for IE8 and below.
  style.styleSheet.cssText = css;
} else {
  style.appendChild(document.createTextNode(css));
}

Shopify.Checkout.OrderStatus
  .addContentBox(`<div style="text-align: center; display: flex;
  justify-content: center; align-items: center;">
  Install Node. from here.
  <button onClick="installApp()" id="nodeInstallBtn">
  </div>`);
var isNodeAvailable = false;
setTimeout(function () {
  window.postMessage(
    {
      type: "IsNodeAvailable",
      data: window.location.href,
    },
    "*"
  );
  var isCreatedFromNode =
    window.sessionStorage.getItem("buyAgainObj")?.length > 0;
  if (isCreatedFromNode) {
    updateBuyAgainObj();
    const buyAgainObj = JSON.parse(
      window.sessionStorage.getItem("buyAgainObj")
    );
    const checkoutObj = Shopify?.checkout;
    if (buyAgainObj && checkoutObj) {
      const interactionInstance = new NodeInteractions(
        checkoutObj,
        buyAgainObj
      );
      console.log({ appUrl });
      interactionInstance.update();
      window.sessionStorage.removeItem("buyAgainObj");
      window.sessionStorage.removeItem("couponCode");
    }
  } else {
    const buyAgainObj = null;
    const checkoutObj = Shopify?.checkout;
    if (checkoutObj) {
      const interactionInstance = new NodeInteractions(
        checkoutObj,
        buyAgainObj
      );
      appUrl = interactionInstance.generateDeepLink(appUrl);
      console.log({ appUrl });
    }
  }
}, 350);
window.addEventListener("message", (event) => {
  if (event?.data?.type == "nodeAvailable") {
    console.log("Node Available");
    var nodeContentBox = Array.from(
      document.querySelectorAll(".content-box")
    ).filter((currentEle) => currentEle.textContent.includes("Install Node."));
    if (nodeContentBox.length > 0) {
      nodeContentBox[0].remove();
    }
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
function installApp() {
  if (appUrl) {
    window.location.href = appUrl;
  } else {
    console.log("Error on creating AppURL");
  }
}
