/* =====================================================
   WIZ COMMERCE
   CHECKOUT JS
   PART 1/4
===================================================== */

"use strict";


/* =====================================================
   CHECKOUT STATE
===================================================== */

let selectedDelivery = "standard";

let selectedPayment = "cod";


/* =====================================================
   GET CART
===================================================== */

function getCart() {

    const keys = [
        "wizCheckoutCart",
        "wizCart",
        "cart",
        "shoppingCart",
        "cartItems"
    ];

    for (const key of keys) {

        const stored =
            localStorage.getItem(key);

        if (!stored) {
            continue;
        }

        try {

            const data =
                JSON.parse(stored);

            if (
                Array.isArray(data) &&
                data.length > 0
            ) {

                console.log(
                    "🛒 Cart loaded from:",
                    key
                );

                return data;

            }

        } catch (error) {

            console.warn(
                "Cart parsing error:",
                key
            );

        }

    }

    return [];

}


/* =====================================================
   FORMAT PRICE
===================================================== */

function formatPrice(price) {

    return Number(
        price || 0
    ).toLocaleString("en-IN");

}


/* =====================================================
   LOAD CHECKOUT PRODUCTS
===================================================== */

function loadCheckoutProducts() {

    const cart =
        getCart();


    const container =
        document.getElementById(
            "checkoutProducts"
        );


    if (!container) {

        console.warn(
            "checkoutProducts element not found"
        );

        return;

    }


    if (cart.length === 0) {

        container.innerHTML = `

            <div
                style="
                    padding:20px;
                    text-align:center;
                    color:#64748b;
                    font-size:14px;
                "
            >

                🛒 Your cart is empty.

            </div>

        `;

        return;

    }


    container.innerHTML =
        cart.map(
            item => {

                const quantity =
                    Number(
                        item.quantity ??
                        item.qty ??
                        1
                    );


                const price =
                    Number(
                        item.price ??
                        item.salePrice ??
                        0
                    );


                const total =
                    price *
                    quantity;


                return `

                    <div
                        class="checkout-product"
                    >

                        <div
                            class="checkout-product-icon"
                        >
                            ${
                                item.icon ||
                                "📦"
                            }
                        </div>


                        <div
                            class="checkout-product-info"
                        >

                            <strong>
                                ${
                                    item.name ||
                                    item.title ||
                                    "Product"
                                }
                            </strong>

                            <span>
                                Qty: ${quantity}
                            </span>

                        </div>


                        <div
                            class="checkout-product-price"
                        >

                            ₹${formatPrice(total)}

                        </div>

                    </div>

                `;

            }
        ).join("");

}


/* =====================================================
   CALCULATE CHECKOUT
===================================================== */

function calculateCheckout() {

    const cart =
        getCart();


    let productTotal = 0;

    let originalTotal = 0;


    cart.forEach(
        item => {

            const quantity =
                Number(
                    item.quantity ??
                    item.qty ??
                    1
                );


            const price =
                Number(
                    item.price ??
                    item.salePrice ??
                    0
                );


            const oldPrice =
                Number(
                    item.oldPrice ??
                    item.originalPrice ??
                    item.mrp ??
                    price
                );


            productTotal +=
                price *
                quantity;


            originalTotal +=
                oldPrice *
                quantity;

        }
    );


    const discount =
        Math.max(
            0,
            originalTotal -
            productTotal
        );


    const delivery =
        selectedDelivery === "express"
            ? 79
            : 0;


    const platform =
        productTotal > 0
            ? Math.round(
                productTotal * 0.02
            )
            : 0;


    const finalPrice =
        productTotal +
        delivery +
        platform;


    return {

        productTotal,

        originalTotal,

        discount,

        delivery,

        platform,

        finalPrice

    };

}
/* =====================================================
   PART 2/4
   SUMMARY + ADDRESS + DELIVERY
===================================================== */


/* =====================================================
   SET TEXT
===================================================== */

function setText(
    id,
    value
) {

    const element =
        document.getElementById(id);


    if (element) {

        element.textContent =
            value;

    }

}


/* =====================================================
   UPDATE CHECKOUT SUMMARY
===================================================== */

function updateCheckoutSummary() {

    const data =
        calculateCheckout();


    /* Product price */

    setText(
        "summaryProductPrice",
        `₹${formatPrice(
            data.originalTotal
        )}`
    );


    /* Discount */

    setText(
        "summaryDiscount",
        `- ₹${formatPrice(
            data.discount
        )}`
    );


    /* Delivery */

    setText(
        "summaryDelivery",

        data.delivery === 0
            ? "FREE"
            : `₹${formatPrice(
                data.delivery
            )}`
    );


    /* Platform */

    setText(
        "summaryPlatform",
        `₹${formatPrice(
            data.platform
        )}`
    );


    /* Final */

    setText(
        "summaryFinal",
        `₹${formatPrice(
            data.finalPrice
        )}`
    );


    console.log(
        "💰 Checkout Total:",
        data.finalPrice
    );

}


/* =====================================================
   SAVE ADDRESS
===================================================== */

function saveAddress() {

    const name =
        document.getElementById(
            "fullName"
        )?.value.trim() || "";


    const mobile =
        document.getElementById(
            "mobile"
        )?.value.trim() || "";


    const pincode =
        document.getElementById(
            "pincode"
        )?.value.trim() || "";


    const address =
        document.getElementById(
            "address"
        )?.value.trim() || "";


    const city =
        document.getElementById(
            "city"
        )?.value.trim() || "";


    const state =
        document.getElementById(
            "state"
        )?.value.trim() || "";


    /* Required fields */

    if (
        !name ||
        !mobile ||
        !pincode ||
        !address ||
        !city ||
        !state
    ) {

        showToast(
            "⚠️ Please complete your address"
        );

        return false;

    }


    /* Mobile validation */

    if (
        !/^[0-9]{10}$/.test(
            mobile
        )
    ) {

        showToast(
            "⚠️ Enter a valid 10 digit mobile number"
        );

        return false;

    }


    /* Pincode validation */

    if (
        !/^[0-9]{6}$/.test(
            pincode
        )
    ) {

        showToast(
            "⚠️ Enter a valid 6 digit PIN code"
        );

        return false;

    }


    const savedAddress = {

        name,

        mobile,

        pincode,

        address,

        city,

        state

    };


    localStorage.setItem(
        "wizDeliveryAddress",
        JSON.stringify(
            savedAddress
        )
    );


    showToast(
        "✓ Delivery address saved"
    );


    return true;

}


/* =====================================================
   LOAD SAVED ADDRESS
===================================================== */

function loadSavedAddress() {

    const stored =
        localStorage.getItem(
            "wizDeliveryAddress"
        );


    if (!stored) {
        return;
    }


    try {

        const saved =
            JSON.parse(stored);


        setInput(
            "fullName",
            saved.name
        );


        setInput(
            "mobile",
            saved.mobile
        );


        setInput(
            "pincode",
            saved.pincode
        );


        setInput(
            "address",
            saved.address
        );


        setInput(
            "city",
            saved.city
        );


        setInput(
            "state",
            saved.state
        );


    } catch (error) {

        console.warn(
            "Saved address error:",
            error
        );

    }

}


/* =====================================================
   SET INPUT
===================================================== */

function setInput(
    id,
    value
) {

    const element =
        document.getElementById(id);


    if (element) {

        element.value =
            value || "";

    }

}


/* =====================================================
   SELECT DELIVERY
===================================================== */

function selectDelivery(
    type
) {

    selectedDelivery =
        type;


    document
        .querySelectorAll(
            ".delivery-option"
        )
        .forEach(
            option => {

                const input =
                    option.querySelector(
                        "input"
                    );


                option.classList.toggle(
                    "selected",
                    input &&
                    input.value === type
                );

            }
        );


    updateCheckoutSummary();


    if (type === "express") {

        showToast(
            "⚡ Express delivery selected"
        );

    } else {

        showToast(
            "🚚 Standard delivery selected"
        );

    }

}
/* =====================================================
   PART 3/4
   PAYMENT + VALIDATION + ORDER
===================================================== */


/* =====================================================
   SELECT PAYMENT
===================================================== */

function selectPayment(
    type
) {

    selectedPayment =
        type;


    document
        .querySelectorAll(
            ".payment-option"
        )
        .forEach(
            option => {

                const input =
                    option.querySelector(
                        "input"
                    );


                option.classList.toggle(
                    "selected",
                    input &&
                    input.value === type
                );

            }
        );


    const paymentInfo =
        document.getElementById(
            "paymentInfo"
        );


    if (!paymentInfo) {
        return;
    }


    const messages = {

        cod:
            "💵 You can pay safely when your order is delivered.",

        upi:
            "📱 UPI payment will be securely processed.",

        card:
            "💳 Your card details will be securely processed."

    };


    paymentInfo.textContent =
        messages[type] ||
        messages.cod;

}


/* =====================================================
   VALIDATE CHECKOUT
===================================================== */

function validateCheckout() {

    const cart =
        getCart();


    /* Cart check */

    if (
        cart.length === 0
    ) {

        showToast(
            "⚠️ Your cart is empty"
        );

        return false;

    }


    /* Address check */

    const stored =
        localStorage.getItem(
            "wizDeliveryAddress"
        );


    if (!stored) {

        /*
           Try saving current address
        */

        const addressSaved =
            saveAddress();


        if (!addressSaved) {

            const nameInput =
                document.getElementById(
                    "fullName"
                );


            if (nameInput) {

                nameInput.focus();

            }


            return false;

        }

    }


    return true;

}


/* =====================================================
   GENERATE ORDER ID
===================================================== */

function generateOrderId() {

    const random =
        Math.floor(
            100000 +
            Math.random() *
            900000
        );


    return `WIZ${random}`;

}


/* =====================================================
   SAVE ORDER
===================================================== */

function saveOrder(
    orderId
) {

    const cart =
        getCart();


    const address =
        JSON.parse(
            localStorage.getItem(
                "wizDeliveryAddress"
            )
        );


    const price =
        calculateCheckout();


    const order = {

        orderId,

        items:
            cart,

        address,

        delivery:
            selectedDelivery,

        payment:
            selectedPayment,

        pricing:
            price,

        status:
            "Payment Pending",

        createdAt:
            new Date().toISOString()

    };


    /* Save last order */

    localStorage.setItem(
        "wizLastOrder",
        JSON.stringify(
            order
        )
    );


    /* Save payment order */

    localStorage.setItem(
        "wizPaymentOrder",
        JSON.stringify(
            order
        )
    );


    /* Save current order */

    localStorage.setItem(
        "currentOrder",
        JSON.stringify(
            order
        )
    );


    return order;

}


/* =====================================================
   PLACE ORDER → PAYMENT PAGE
===================================================== */

function placeOrder(event) {

    if (event) {
        event.preventDefault();
    }

    console.log("🛒 PLACE ORDER BUTTON CLICKED");

    /* Create a simple order */

    const order = {

        orderId:
            "WIZ" + Date.now(),

        paymentStatus:
            "Pending",

        status:
            "Payment Pending",

        createdAt:
            new Date().toISOString()

    };


    /* Save order */

    localStorage.setItem(
        "wizPaymentOrder",
        JSON.stringify(order)
    );


    localStorage.setItem(
        "currentOrder",
        JSON.stringify(order)
    );


    console.log(
        "✅ Order saved"
    );

    console.log(
        "➡️ Opening payment.html"
    );


    /* Open payment page */

    window.location.href =
        "./payment.html";

}
/* =====================================================
   PART 4/4
   NAVIGATION + TOAST + ANIMATION + INITIALIZE
===================================================== */


/* =====================================================
   BACK TO CART
===================================================== */

function goBackToCart() {

    window.location.href =
        "cart.html";

}


/* =====================================================
   TRACK ORDER
===================================================== */

function trackOrder() {

    const stored =
        localStorage.getItem(
            "wizLastOrder"
        );


    if (!stored) {

        showToast(
            "Order information not found"
        );

        return;

    }


    try {

        const order =
            JSON.parse(stored);


        window.location.href =
            `order-tracking.html?id=${order.orderId}`;


    } catch (error) {

        showToast(
            "Unable to open order tracking"
        );

    }

}


/* =====================================================
   CONTINUE SHOPPING
===================================================== */

function continueShopping() {

    window.location.href =
        "products.html";

}


/* =====================================================
   TOAST
===================================================== */

function showToast(
    message
) {

    let toast =
        document.getElementById(
            "checkoutToast"
        );


    /*
       If toast does not exist,
       create one automatically.
    */

    if (!toast) {

        toast =
            document.createElement(
                "div"
            );


        toast.id =
            "checkoutToast";


        toast.style.position =
            "fixed";

        toast.style.left =
            "50%";

        toast.style.bottom =
            "25px";

        toast.style.transform =
            "translateX(-50%)";

        toast.style.padding =
            "12px 20px";

        toast.style.background =
            "#111827";

        toast.style.color =
            "#ffffff";

        toast.style.borderRadius =
            "10px";

        toast.style.fontSize =
            "14px";

        toast.style.fontWeight =
            "600";

        toast.style.zIndex =
            "99999";

        toast.style.boxShadow =
            "0 8px 25px rgba(0,0,0,.25)";


        document.body.appendChild(
            toast
        );

    }


    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        window.checkoutToastTimer
    );


    window.checkoutToastTimer =
        setTimeout(
            function() {

                toast.classList.remove(
                    "show"
                );

            },
            2300
        );

}


/* =====================================================
   PAGE ANIMATION
===================================================== */

function setupCheckoutAnimation() {

    const cards =
        document.querySelectorAll(
            ".checkout-card, .checkout-summary, .trust-check, .delivery-confidence, .return-promise"
        );


    cards.forEach(
        (card, index) => {

            card.style.opacity =
                "0";


            card.style.transform =
                "translateY(18px)";


            setTimeout(
                () => {

                    card.style.transition =
                        "opacity .45s ease, transform .45s ease";


                    card.style.opacity =
                        "1";


                    card.style.transform =
                        "translateY(0)";

                },
                index * 90
            );

        }
    );

}


/* =====================================================
   SET DEFAULT DELIVERY
===================================================== */

function setupDefaultDelivery() {

    const standard =
        document.querySelector(
            '.delivery-option input[value="standard"]'
        );


    if (standard) {

        standard.checked =
            true;


        selectDelivery(
            "standard"
        );

    }

}


/* =====================================================
   SET DEFAULT PAYMENT
===================================================== */

function setupDefaultPayment() {

    const cod =
        document.querySelector(
            '.payment-option input[value="cod"]'
        );


    if (cod) {

        cod.checked =
            true;


        selectPayment(
            "cod"
        );

    }

}


/* =====================================================
   INITIALIZE CHECKOUT
===================================================== */

function initializeCheckout() {

    console.log(
        "🛒 Wiz Commerce Checkout Loaded"
    );


    /* Load products */

    loadCheckoutProducts();


    /* Load address */

    loadSavedAddress();


    /* Default delivery */

    selectedDelivery =
        "standard";


    /* Default payment */

    selectedPayment =
        "cod";


    /* Update prices */

    updateCheckoutSummary();


    /* Default UI */

    setupDefaultDelivery();

    setupDefaultPayment();


    /* Animation */

    setupCheckoutAnimation();


    console.log(
        "✅ Checkout Ready"
    );

}


/* =====================================================
   DOM READY
===================================================== */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeCheckout
    );

} else {

    initializeCheckout();

}


/* =====================================================
   GLOBAL FUNCTIONS
===================================================== */

window.goBackToCart =
    goBackToCart;


window.saveAddress =
    saveAddress;


window.selectDelivery =
    selectDelivery;


window.selectPayment =
    selectPayment;


window.placeOrder =
    placeOrder;


window.trackOrder =
    trackOrder;


window.continueShopping =
    continueShopping;


window.showToast =
    showToast;
