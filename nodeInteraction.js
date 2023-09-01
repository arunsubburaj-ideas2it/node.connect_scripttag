const APP_URL = "https://testflight.apple.com/join/L5KE67vq";
const DEV_URL = "https://1416349.testfairy.com/login";
const FB_SUFFIX_URL = "https://merchantinstall.iomd.info/link";
const BUNDLE_ID = "com.iomd.i2iautofill";
class NodeInteractions {
  constructor(checkout, buyAgainData,paymentData) {
    this.isNodeAvailable = false;
    this.checkout = checkout;
    this.buyAgainData = buyAgainData;
    this.paymentData = paymentData;
    if (buyAgainData) {
      this.buyAgainData = buyAgainData;
    } else {
      this.buyAgainData = this.generateBuyAgainUrl();
    }
  }
  generateBuyAgainUrl() {
    const buyAgainData = {
      orderId: this.checkout.order_id,
    };
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
    const shippingAddress = !this.checkout.shipping_address ? this.checkout.billing_address : this.checkout.shipping_address;
    var decryptedShopInfo;
    // var encryptedShopInfo = window.sessionStorage.getItem("nodeConnectSD");
    // if (encryptedShopInfo) {
    //   var bytes = CryptoJS.AES.decrypt(encryptedShopInfo, "node-connect-profile-data");
    //   decryptedShopInfo = bytes.toString(CryptoJS.enc.Utf8);
    // }
    return {
      transactionName: "payment",
      merchant_url: location.origin,
      transactionSubName: "payment",
      buyAgain: this.buyAgainData,
      payment : this.paymentData,
      shopName: decryptedShopInfo ? JSON.parse(decryptedShopInfo).name : "",
      productData: this.generateInteractionProductData(),
      shippingAddress: {
        address1: shippingAddress.address1,
        address2: shippingAddress.address2,
        state: shippingAddress.province,
        postalCode: shippingAddress.zip,
        city: shippingAddress.city,
        country: shippingAddress.country,
        firstName: shippingAddress.first_name,
        lastName: shippingAddress.last_name,
      },
      email: this.checkout.email,
      discount: "",
      coupon: "",
      orderId: this.checkout.order_id.toString(),
      cardData: {
        cardName: `${this.checkout.credit_card.first_name} ${this.checkout.credit_card.last_name}`,
        cardNumber: `${this.checkout.credit_card.first_digits}******${this.checkout.credit_card.last_digits}`,
        cvv: "",
        expiry: `${this.checkout.credit_card.expiry_year}-${this.checkout.credit_card.expiry_month}`,
      },
      transactionId: this.generateUUID(),
      status: "",
      message: "",
      amount: this.checkout.total_price,
      transactionType: "",
      currency: this.checkout.presentment_currency,
      timestamp: new Date(Date.now()),
      via: {
        source: "node.Connect For Shopify",
        version: 1.0,
      },
      messageVersion: null,
    };
  }
  generateDLPayload() {
    const shippingAddress = !this.checkout.shipping_address ? this.checkout.billing_address : this.checkout.shipping_address;
    const _faviconAPI = "https://s2.googleusercontent.com/s2/favicons?domain=";
    var interaction, billing, shipping, sameAsShipping, checkoutInteraction, decryptedShopInfo;
    // var encryptedShopInfo = window.sessionStorage.getItem("nodeConnectSD");
    // if (encryptedShopInfo) {
    //   var bytes = CryptoJS.AES.decrypt(encryptedShopInfo, "node-connect-profile-data");
    //   decryptedShopInfo = bytes.toString(CryptoJS.enc.Utf8);
    // }
    checkoutInteraction = {
      requestType: "sendTransaction",
      dlv: "1.0.0",
      source: location.hostname,
      data: {
        transactionName: "checkout fill",
        merchant_url: location.origin,
        transactionSubName: "checkout fill",
        address1: shippingAddress.address1 ?? "",
        address2: shippingAddress.address2 ?? "",
        state: shippingAddress.province ?? "",
        postalCode: shippingAddress.zip ?? "",
        city: shippingAddress.city ?? "",
        country: shippingAddress.country ?? "",
        firstName: shippingAddress.first_name ?? "",
        lastName: shippingAddress.last_name ?? "",
        email: this.checkout.email ?? "",
        timestamp: new Date(Date.now()),
        discount: "",
        coupon: "",
        orderId: "",
        via: {
          source: "node.Connect For Shopify",
          version: 1.0,
        },
        messageVersion: null,
        merchant_name: decryptedShopInfo ? JSON.parse(decryptedShopInfo).name : this.capitalizeFirstLetter(
          this.getDomainName(location.hostname)
        ),
        merchant_favicon: _faviconAPI + location.hostname,
        isIomdPay: true,
        isIomdUsed: true,
      },
    };
    interaction = {
      requestType: "sendTransaction",
      dlv: "1.0.0",
      source: location.hostname,
      data: {
        transactionName: "payment",
        merchant_url: location.origin,
        transactionSubName: "payment",
        buyAgain: this.buyAgainData,
        payment : this.paymentData,
        productData: this.generateInteractionProductData(),
        address1: shippingAddress.address1 ?? "",
        address2: shippingAddress.address2 ?? "",
        state: shippingAddress.province ?? "",
        postalCode: shippingAddress.zip ?? "",
        city: shippingAddress.city ?? "",
        country: shippingAddress.country ?? "",
        firstName: shippingAddress.first_name ?? "",
        lastName: shippingAddress.last_name ?? "",
        email: this.checkout.email ?? "",
        discount: this.checkout.discount ?? "",
        coupon: "",
        orderId: this.checkout.order_id.toString(),
        cardName: this.checkout.credit_card ? `${this.checkout.credit_card.first_name} ${this.checkout.credit_card.last_name}`:"",
        cardNumber: this.checkout.credit_card ? `${this.checkout.credit_card.first_digits}******${this.checkout.credit_card.last_digits}`:"",
        cvv: "",
        expiry: this.checkout.credit_card ? `${this.checkout.credit_card.expiry_year}-${this.checkout.credit_card.expiry_month}`:"",
        transactionId: this.generateUUID(),
        status: "",
        message: "",
        amount: this.checkout.total_price,
        transactionType: "",
        currency: this.checkout.presentment_currency,
        timestamp: new Date(Date.now()),
        via: {
          source: "node.Connect For Shopify",
          version: 1.0,
        },
        messageVersion: null,
        merchant_name: decryptedShopInfo ? JSON.parse(decryptedShopInfo).name : this.capitalizeFirstLetter(
          this.getDomainName(location.hostname)
        ),
        merchant_favicon: _faviconAPI + location.hostname,
        transactionStatus: "Completed",
        isIomdPay: true,
        isIomdUsed: true,
      },
    };
    shipping = {
      requestType: "saveProfile",
      dlv: "1.0.0",
      source: location.hostname,
      data: {
        address1: shippingAddress.address1 ?? "",
        address2: shippingAddress.address2 ?? "",
        state: shippingAddress.province ?? "",
        postalCode: shippingAddress.zip ?? "",
        city: shippingAddress.city ?? "",
        country: shippingAddress.country ?? "",
        firstName: shippingAddress.first_name ?? "",
        lastName: shippingAddress.last_name ?? "",
        email: this.checkout.email ?? "",
        phone: this.checkout.phone ?? "",
        isAnonymous: false,
      },
    };
    sameAsShipping = this.compareAddress();
    if (!sameAsShipping) {
      billing = {
        requestType: "saveProfile",
        dlv: "1.0.0",
        source: location.hostname,
        data: {
          address1: this.checkout.billing_address.address1 ?? "",
          address2: this.checkout.billing_address.address2 ?? "",
          state: this.checkout.billing_address.province ?? "",
          postalCode: this.checkout.billing_address.zip ?? "",
          city: this.checkout.billing_address.city ?? "",
          country: this.checkout.billing_address.country ?? "",
          firstName: this.checkout.billing_address.first_name ?? "",
          lastName: this.checkout.billing_address.last_name ?? "",
          email: this.checkout.email ?? "",
          phone: this.checkout.phone ?? "",
          isAnonymous: false,
        },
      };
    }
    var interactions = sameAsShipping
      ? [checkoutInteraction, interaction, shipping]
      : [checkoutInteraction, interaction, shipping, billing];
    return { uuid: this.generateUUID(), interactions };
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
  compareAddress() {
    var returnValue = false;
    var keys = Object.keys(this.checkout.billing_address);
    if(this.checkout?.shipping_address){
      returnValue = keys.every(key => this.checkout.billing_address[key] == this.checkout.shipping_address[key]);
    }
    return returnValue;
  }
  generateDeepLinkID() {
    var payload = this.generateDLPayload();
    var payloadString = JSON.stringify(payload);
    var encryptedOrderData = CryptoJS.AES.encrypt(
      payloadString,
      "node-deep-link"
    ).toString();
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
      ["interactions",
        this.checkout.order_id,
        location.hostname,
        this.checkout.created_at];
    var encryptData = window.btoa(
      checkoutData.join("-")
    );
    return encryptData;
  }
  async generateDeepLink() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var link = location.origin.includes("nodenextgen") ? `${DEV_URL}?dlid=${this.generateDeepLinkID()}` : `${APP_URL}?dlid=${this.generateDeepLinkID()}`;
    var raw = JSON.stringify({
      dynamicLinkInfo: {
        domainUriPrefix: FB_SUFFIX_URL,
        link: link,
        androidInfo: {
          androidFallbackLink: location.origin.includes("nodenextgen") ? DEV_URL : APP_URL,
        },
        iosInfo: {
          iosFallbackLink: location.origin.includes("nodenextgen") ? DEV_URL : APP_URL,
          iosBundleId: BUNDLE_ID,
        },
        navigationInfo: {
          enableForcedRedirect: true,
        },
      },
    });
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
      return {
        ...deepLinkObj,
        copyLink: this.fetchCopyLink()
      };
    } catch (error) {
      console.log("error", error);
    }
  }

  fetchCopyLink() {
    var linkURL = location.origin.includes("nodenextgen") ? DEV_URL : APP_URL;
    return FB_SUFFIX_URL +
      "?link=" +
      linkURL +
      "?dlid=" +
      this.generateDeepLinkID() +
      "&ifl=" +
      linkURL +
      "&ibi=" +
      BUNDLE_ID +
      "&_icp=1"
  }
}