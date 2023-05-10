var checkoutNote = `{{checkout.note}}`;
console.log({ checkoutNote });

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
}, 750);
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
function installApp() {
  window.location.href = "https://testflight.apple.com/join/L5KE67vq";
}
