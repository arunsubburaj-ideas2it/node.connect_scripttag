
  var checkoutNote = `{{checkout.note}}`;
  console.log({ checkoutNote });

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
   }, 350);
  window.addEventListener("message", (event) => {
    if (event?.data?.type == "nodeAvailable") {
      console.log("Node Available");
      var nodeContentBox = Array.from(
        document.querySelectorAll(".content-box")
      ).filter((currentEle) =>
        currentEle.textContent.includes("Install Node.")
      );
      if (nodeContentBox.length > 0) {
        nodeContentBox[0].remove();
      }
    }
  });
  function installApp() {
    window.location.href = "https://testflight.apple.com/join/L5KE67vq";
  }
