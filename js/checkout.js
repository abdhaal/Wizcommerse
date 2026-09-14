/* =====================================================
   WIZ COMMERCE
   CHECKOUT JS
   PART 1/4
===================================================== */


/* =====================================================
   GET CART
===================================================== */

function getCart() {

    return JSON.parse(
        localStorage.getItem(
            "wizCheckoutCart"
        )
    ) ||
    JSON.parse(
        localStorage.getItem(
            "wizCart"
        )
    ) ||
    [];

}


/* =====================================================
   CHECKOUT STATE
===================================================== */

let selectedDelivery =
    "standard";


let selectedPayment =
    "cod";


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


    if (!container) return;


    if (cart.length === 0) {

        container.innerHTML = `

            <div
                style="
                    padding:20px;
                    text-align:center;
                    color:#64748b;
                    font-size:12px;
                "
            >
                Your cart is empty.
            </div>

        `;

        return;

    }


    container.innerHTML =
        cart.map(
            item => `

            <div
                class="checkout-product"
            >

                <div
                    class="checkout-product-icon"
                >
                    ${item.icon || "📦"}
                </div>


                <div
                    class="checkout-product-info"
                >

                    <strong>
                        ${item.name}
                    </strong>

                    <span>
                        Qty: ${item.quantity}
                    </span>

                </div>


                <div
                    class="checkout-product-price"
                >
                    ₹${item.price * item.quantity}
                </div>

            </div>

        `
        ).join("");

}


/* =====================================================
   CALCULATE BASE PRICE
===================================================== */

function calculateCheckout() {

    const cart =
        getCart();


    let productTotal =
        0;


    let originalTotal =
        0;


    cart.forEach(
        item => {

            productTotal +=
                item.price *
                item.quantity;


            originalTotal +=
                (
                    item.oldPrice ||
                    item.price
                ) *
                item.quantity;

        }
    );


    const discount =
        Math.max(
            0,
            originalTotal -
            productTotal
        );


    const delivery =
        selectedDelivery ===
        "express"
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
   Summary + Address + Delivery
===================================================== */


/* =====================================================
   UPDATE SUMMARY
===================================================== */

function updateCheckoutSummary() {

    const data =
        calculateCheckout();


    setText(
        "summaryProductPrice",
        `₹${data.originalTotal}`
    );


    setText(
        "summaryDiscount",
        `- ₹${data.discount}`
    );


    setText(
        "summaryDelivery",
        data.delivery === 0
            ? "FREE"
            : `₹${data.delivery}`
    );


    setText(
        "summaryPlatform",
        `₹${data.platform}`
    );


    setText(
        "summaryFinal",
        `₹${data.finalPrice}`
    );

}


/* =====================================================
   SET TEXT
===================================================== */

function setText(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (element) {

        element.textContent =
            value;

    }

}


/* =====================================================
   SAVE ADDRESS
===================================================== */

function saveAddress() {

    const name =
        document.getElementById(
            "fullName"
        )?.value.trim();


    const mobile =
        document.getElementById(
            "mobile"
        )?.value.trim();


    const pincode =
        document.getElementById(
            "pincode"
        )?.value.trim();


    const address =
        document.getElementById(
            "address"
        )?.value.trim();


    const city =
        document.getElementById(
            "city"
        )?.value.trim();


    const state =
        document.getElementById(
            "state"
        )?.value.trim();


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

    const saved =
        JSON.parse(
            localStorage.getItem(
                "wizDeliveryAddress"
            )
        );


    if (!saved) return;


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

}


/* =====================================================
   SET INPUT
===================================================== */

function setInput(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (element) {

        element.value =
            value;

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


    showToast(
        type === "express"
            ? "⚡ Express delivery selected"
            : "🚚 Standard delivery selected"
    );

       }
/* =====================================================
   PART 3/4
   Payment + Order Validation
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


    if (!paymentInfo)
        return;


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


    if (
        cart.length === 0
    ) {

        showToast(
            "⚠️ Your cart is empty"
        );

        return false;

    }


    const address =
        JSON.parse(
            localStorage.getItem(
                "wizDeliveryAddress"
            )
        );


    if (!address) {

        showToast(
            "⚠️ Please save your delivery address"
        );


        document
            .getElementById(
                "fullName"
            )
            ?.focus();


        return false;

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
            "Order Confirmed",

        createdAt:
            new Date().toISOString()

    };


    localStorage.setItem(
        "wizLastOrder",
        JSON.stringify(
            order
        )
    );


    return order;

}


/* =====================================================
   PLACE ORDER
===================================================== */

function placeOrder() {

    console.log("🛒 Place Order clicked");


    /* ================================================
       GET CART
    ================================================= */

    const cart = getCart();


    if (!cart || cart.length === 0) {

        showToast("⚠️ Your cart is empty");

        return;

    }


    /* ================================================
       CHECK ADDRESS
    ================================================= */

    if (!validateCheckout()) {

        return;

    }


    /* ================================================
       GENERATE ORDER ID
    ================================================= */

    const orderId =
        generateOrderId();


    /* ================================================
       CREATE ORDER
    ================================================= */

    const order =
        saveOrder(orderId);


    /* ================================================
       SAVE PAYMENT ORDER
    ================================================= */

    localStorage.setItem(
        "wizPaymentOrder",
        JSON.stringify(order)
    );


    localStorage.setItem(
        "currentOrder",
        JSON.stringify(order)
    );


    /* ================================================
       OPEN PAYMENT PAGE
    ================================================= */

    console.log(
        "✅ Order created:",
        order
    );


    showToast(
        "✓ Proceeding to payment..."
    );


    setTimeout(function () {

        window.location.href =
            "payment.html";

    }, 400);

}
/* =====================================================
   PART 4/4
   Navigation + Animation + Initialize
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

    const order =
        JSON.parse(
            localStorage.getItem(
                "wizLastOrder"
            )
        );


    if (!order) {

        showToast(
            "Order information not found"
        );

        return;

    }


    /*
       Demo tracking page.
       We will create the real
       order tracking page next.
    */

    window.location.href =
        `order-tracking.html?id=${order.orderId}`;

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

    const toast =
        document.getElementById(
            "checkoutToast"
        );


    if (!toast) return;


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
            () => {

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

                    card.style.opacity =
                        "1";

                    card.style.transform =
                        "translateY(0)";

                    card.style.transition =
                        "opacity .45s ease, transform .45s ease";

                },
                index * 90
            );

        }
    );

}


/* =====================================================
   INITIALIZE
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadCheckoutProducts();

        loadSavedAddress();

        updateCheckoutSummary();

        setupCheckoutAnimation();

        console.log(
            "🛒 Wiz Commerce Checkout Loaded"
        );

    }
);


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
