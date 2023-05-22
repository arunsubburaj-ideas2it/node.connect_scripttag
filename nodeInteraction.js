class NodeInteractions {
  constructor(checkout, buyAgainData) {
    this.checkout = checkout;
    this.buyAgainData = buyAgainData;
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

  generateDeepLink(appUrl) {
    var payload = this.generatePayload();
    var payloadString = JSON.stringify(payload);
    var encryptedOrderData = CryptoJS.AES.encrypt(
      payloadString,
      "node-deep-link"
    ).toString();
    return appUrl + "?id=" + encryptedOrderData;
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
    cardArray.forEach((current) => {
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
}
