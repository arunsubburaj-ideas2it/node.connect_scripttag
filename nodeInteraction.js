const APP_URL = "https://testflight.apple.com/join/L5KE67vq";
const FB_SUFFIX_URL = "https://merchantinstall.iomd.info/link";
const BUNDLE_ID = "com.iomd.i2iautofill";
class NodeInteractions {
  constructor(checkout, buyAgainData) {
    this.checkout = checkout;
    this.buyAgainData = buyAgainData;
    if (buyAgainData) {
      this.buyAgainData = buyAgainData;
    } else {
      this.buyAgainData = this.generateBuyAgainUrl("NODE_C8PGB4GQ883B");
    }
  }
  generateBuyAgainUrl(couponCode) {
    const buyAgainData = {
      orderId: this.checkout.order_id,
    };
    if (couponCode) {
      buyAgainData["coupon"] = couponCode;
    }
    var encryptedOrderData = CryptoJS.AES.encrypt(
      JSON.stringify(buyAgainData),
      "node-buy-again"
    ).toString();
    var buyAgainURI =
      window.location.origin + "/pages/buy-again?" + encryptedOrderData;
    const buyAgainObj = {
      enable: "true",
      URL: buyAgainURI,
      URLValidTill: new Date("06/06/2500").toISOString(),
      discount: 5,
      discountType: "percent",
      minimumOrderValue: 0,
      discountValidTill: new Date("06/06/2500").toISOString(),
    };
    return buyAgainObj;
  }
  generatePayload() {
    return {
      transactionName: "payment",
      merchant_url: location.origin,
      transactionSubName: "payment",
      buyAgain: this.buyAgainData,
      productData: this.generateInteractionProductData(),
      shippingAddress: {
        address1: this.checkout.shipping_address.address1,
        address2: this.checkout.shipping_address.address2,
        state: this.checkout.shipping_address.province,
        postalCode: this.checkout.shipping_address.zip,
        city: this.checkout.shipping_address.city,
        country: this.checkout.shipping_address.country,
        firstName: this.checkout.shipping_address.first_name,
        lastName: this.checkout.shipping_address.last_name,
      },
      email: this.checkout.email,
      discount: "",
      coupon: "",
      orderId: this.checkout.order_id.toString(),
      cardData: {
        cardName: `${this.checkout.credit_card.first_name} ${this.checkout.credit_card.last_name}`,
        cardNumber: this.maskCardNumber(
          `${this.checkout.credit_card.first_digits}-${this.checkout.credit_card.last_digits}`
        ),
        cvv: "",
        expiry: `${this.checkout.credit_card.expiry_year}-${this.checkout.credit_card.expiry_month}`,
      },
      transactionId: "",
      status: "",
      message: "",
      amount: this.checkout.total_price,
      transactionType: "",
      currency: this.checkout.currency,
      timestamp: new Date(Date.now()),
      via: {
        source: "node.Connect For Shopify",
        version: 1.0,
      },
      messageVersion: null,
    };
  }
  generateDLPayload() {
    const _faviconAPI = "https://s2.googleusercontent.com/s2/favicons?domain=";
    return {
      requestType: "sendTransaction",
      uuid: this.generateUUID(),
      dlv: "1.0.0",
      source: location.hostname,
      data: {
        transactionName: "payment",
        merchant_url: location.origin,
        transactionSubName: "payment",
        buyAgain: this.buyAgainData,
        productData: this.generateInteractionProductData(),
        address1: this.checkout.shipping_address.address1,
        address2: this.checkout.shipping_address.address2,
        state: this.checkout.shipping_address.province,
        postalCode: this.checkout.shipping_address.zip,
        city: this.checkout.shipping_address.city,
        country: this.checkout.shipping_address.country,
        firstName: this.checkout.shipping_address.first_name,
        lastName: this.checkout.shipping_address.last_name,
        email: this.checkout.email,
        discount: this.checkout.discount,
        coupon: "",
        orderId: this.checkout.order_id.toString(),
        cardName: `${this.checkout.credit_card.first_name} ${this.checkout.credit_card.last_name}`,
        cardNumber: this.maskCardNumber(
          `${this.checkout.credit_card.first_digits}-${this.checkout.credit_card.last_digits}`
        ),
        cvv: "",
        expiry: `${this.checkout.credit_card.expiry_year}-${this.checkout.credit_card.expiry_month}`,
        transactionId: "",
        status: "",
        message: "",
        amount: this.checkout.total_price,
        transactionType: "",
        currency: this.checkout.currency,
        timestamp: new Date(Date.now()),
        via: {
          source: "node.Connect For Shopify",
          version: 1.0,
        },
        messageVersion: null,
        merchant_name: this.capitalizeFirstLetter(
          this.getDomainName(location.hostname)
        ),
        merchant_favicon: _faviconAPI + location.hostname,
        transactionStatus: "Completed",
        isIomdPay: true,
        isIomdUsed: true,
      },
    };
  }
  update() {
    const payload = this.generatePayload();
    window.postMessage(
      {
        type: "iOMDPayInteraction",
        data: payload,
      },
      "*"
    );
    console.log("new interactionPayload", payload);
  }

  generateDeepLinkID() {
    var payload = this.generateDLPayload();
    var payloadString = JSON.stringify(payload);
    var encryptedOrderData = CryptoJS.AES.encrypt(
      payloadString,
      "node-deep-link"
    ).toString();
    encryptedOrderData = encryptedOrderData.replace("=","%3D");
    encryptedOrderData = encryptedOrderData.replace("+","%2B");
    return encryptedOrderData;
  }

  generateInteractionProductData() {
    const productData = [];
    const lineItems = this.checkout.line_items;
    lineItems.forEach((currentItem) => {
      const currentData = {
        productName: currentItem.title,
        productId: currentItem.product_id.toString(),
        productSKU: currentItem.sku,
        quantity: currentItem.quantity.toString(),
        regularPrice: currentItem.price.toString(),
        salePrice: currentItem.price.toString(),
      };
      productData.push(currentData);
    });
    return productData;
  }
  maskCardNumber(card) {
    const cardArray = card.split("-");
    var formatedCard = "";
    cardArray.forEach((current, index) => {
      for (var i = 0; i <= 7; i++) {
        if (i <= current.length - 1) {
          formatedCard += current[i];
        } else {
          formatedCard += "*";
        }
      }
    });
    let hideNum = [];
    for (let i = 0; i < formatedCard.length; i++) {
      if (formatedCard[i].match(/\s/)) {
        hideNum.push(formatedCard[i]);
      } else if (i > 3 && i < formatedCard.length - 4) {
        hideNum.push("*");
      } else {
        hideNum.push(formatedCard[i]);
      }
    }
    return hideNum.join("");
  }
  getDomainName(url) {
    let domainName = "";
    let host;
    if (url) {
      host = url;
    } else {
      host = parentWindowLocation?.hostname;
    }

    host = host?.split(".");

    if (host) {
      const subDomainArr = ["myshopify", "indiatimes"];
      const isDomainIncluded = subDomainArr.some((v) => host?.includes(v));

      if (isDomainIncluded || host?.length > 3) {
        domainName = host[host?.length - 3];
      } else {
        domainName = host[host?.length - 2];
      }
    }

    return domainName?.toLowerCase();
  }
  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  generateUUID() {
    var checkoutData =
      this.checkout.order_id +
      location.hostname +
      this.checkout.subtotal_price +
      this.checkout.created_at;
    var encryptData = CryptoJS.AES.encrypt(
      checkoutData,
      "node-deep-link-uuid"
    ).toString();
    return encryptData;
  }
  async generateDeepLink() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    // var raw = JSON.stringify({
    //   longDynamicLink: `${FB_SUFFIX_URL}?link=${FB_SUFFIX_URL}?dlid=${this.generateDeepLinkID()}&ifl=${APP_URL}&ibi=${BUNDLE_ID}&efr='1'`,
    // });
    var raw = JSON.stringify({
      dynamicLinkInfo: {
        domainUriPrefix: FB_SUFFIX_URL,
        link: `${FB_SUFFIX_URL}?dlid=${this.generateDeepLinkID()}`,
        iosInfo: {
          iosFallbackLink: APP_URL,
          iosBundleId: BUNDLE_ID
        },
        navigationInfo: {
          enableForcedRedirect: true,
        },
      },
    })
    const url =
      "https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=AIzaSyDOAj6MJ4fl6YsuO37ocCvjH_9-vqn_glQ";
    const options = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    try {
      var deepLinkObj = await (await fetch(url, options)).json();
      return {...deepLinkObj,
        copyLink: FB_SUFFIX_URL+"?link="+FB_SUFFIX_URL+"?dlid="+this.generateDeepLinkID()+"&ifl="+APP_URL+"&ibi="+BUNDLE_ID};
    } catch (error) {
      console.log("error", error);
    }
  }
}
