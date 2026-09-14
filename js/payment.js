/* =====================================================
   WIZ COMMERCE
   PAYMENT JS
   PART 1/4
===================================================== */


/* =====================================================
   GET PAYMENT ORDER
===================================================== */

function getPaymentOrder() {

    return JSON.parse(
        localStorage.getItem(
            "wizPaymentOrder"
        )
    ) || null;

}


/* =====================================================
   CURRENT PAYMENT METHOD
===================================================== */

let currentMethod =
    "upi";


/* =====================================================
   LOAD PAGE
===================================================== */

function loadPaymentPage() {

    const order =
        getPaymentOrder();


    if (!order) {

        showToast(
            "⚠️ Payment information not found"
        );

        return;

    }


    loadPaymentProducts(
        order.items
    );


    loadPaymentSummary(
        order.pricing
    );


    loadAddress(
        order.address
    );


    updateDelivery(
        order.delivery
    );


    updatePayButton();

}


/* =====================================================
   LOAD PRODUCTS
===================================================== */

function loadPaymentProducts(
    items
) {

    const container =
        document.getElementById(
            "paymentProducts"
        );


    if (!container)
        return;


    if (!items || items.length === 0) {

        container.innerHTML = `
            <p style="
                color:#64748b;
                font-size:11px;
            ">
                No products found.
            </p>
        `;

        return;

    }


    container.innerHTML =
        items.map(
            item => `

            <div class="payment-product">

                <div class="product-image">

                    ${
                        item.image
                        ?
                        `<img
                            src="${item.image}"
                            alt="${item.name}"
                        >`
                        :
                        (item.icon || "📦")
                    }

                </div>


                <div class="product-details">

                    <strong>
                        ${item.name}
                    </strong>

                    <small>
                        Qty: ${item.quantity}
                    </small>

                </div>


                <div class="product-price">

                    ₹${item.price * item.quantity}

                </div>

            </div>

        `
        ).join("");

}


/* =====================================================
   LOAD SUMMARY
===================================================== */
/* =====================================================
   SET TEXT HELPER
===================================================== */

function setText(id, value) {

    const element =
        document.getElementById(id);

    if (element) {

        element.textContent =
            value;

    }

}
function loadPaymentSummary(
    pricing
) {

    if (!pricing)
        return;


    setText(
        "paymentProductPrice",
        `₹${pricing.originalTotal || 0}`
    );


    setText(
        "paymentDiscount",
        `- ₹${pricing.discount || 0}`
    );


    setText(
        "paymentDelivery",
        pricing.delivery === 0
            ? "FREE"
            : `₹${pricing.delivery}`
    );


    setText(
        "paymentPlatform",
        `₹${pricing.platform || 0}`
    );


    setText(
        "paymentFinal",
        `₹${pricing.finalPrice || 0}`
    );

      }
/* =====================================================
   PART 2/4
   METHOD + ADDRESS
===================================================== */


/* =====================================================
   SELECT PAYMENT METHOD
===================================================== */

function selectPaymentMethod(
    method
) {

    currentMethod =
        method;


    document
        .querySelectorAll(
            ".method-btn"
        )
        .forEach(
            button => {

                button.classList.toggle(
                    "active",
                    button.dataset.method ===
                    method
                );

            }
        );


    const forms = [

        "upiForm",
        "cardForm",
        "netbankingForm",
        "codForm"

    ];


    forms.forEach(
        id => {

            document
                .getElementById(id)
                ?.classList.add(
                    "hidden"
                );

        }
    );


    const selectedForm =
        document.getElementById(
            method + "Form"
        );


    if (selectedForm) {

        selectedForm.classList.remove(
            "hidden"
        );

    }


    updateFormText();

    updatePayButton();

}


/* =====================================================
   FORM TITLE
===================================================== */

function updateFormText() {

    const title =
        document.getElementById(
            "formTitle"
        );


    const subtitle =
        document.getElementById(
            "formSubtitle"
        );


    const data = {

        upi: {

            title:
                "Pay using UPI",

            subtitle:
                "Enter your UPI ID to continue"

        },

        card: {

            title:
                "Pay using Card",

            subtitle:
                "Enter your card details securely"

        },

        netbanking: {

            title:
                "Pay using Net Banking",

            subtitle:
                "Select your bank to continue"

        },

        cod: {

            title:
                "Cash on Delivery",

            subtitle:
                "Pay when your order arrives"

        }

    };


    const selected =
        data[currentMethod];


    if (!selected)
        return;


    if (title)
        title.textContent =
            selected.title;


    if (subtitle)
        subtitle.textContent =
            selected.subtitle;

}


/* =====================================================
   PAY BUTTON TEXT
===================================================== */

function updatePayButton() {

    const buttonText =
        document.getElementById(
            "payButtonText"
        );


    if (!buttonText)
        return;


    if (
        currentMethod ===
        "cod"
    ) {

        buttonText.textContent =
            "Confirm Order";

        return;

    }


    const order =
        getPaymentOrder();


    const amount =
        order?.pricing?.finalPrice ||
        0;


    buttonText.textContent =
        `Pay ₹${amount}`;

}


/* =====================================================
   LOAD ADDRESS
===================================================== */

function loadAddress(
    address
) {

    const element =
        document.getElementById(
            "deliveryAddress"
        );


    if (!element)
        return;


    if (!address) {

        element.textContent =
            "Address not available";

        return;

    }


    element.textContent =
        `${address.name}, ${address.address},
        ${address.city}, ${address.state}
        - ${address.pincode}`;

}


/* =====================================================
   DELIVERY
===================================================== */

function updateDelivery(
    delivery
) {

    const element =
        document.getElementById(
            "deliveryInfo"
        );


    if (!element)
        return;


    if (
        delivery ===
        "express"
    ) {

        element.textContent =
            "Express Delivery · 1–2 Days";

    } else {

        element.textContent =
            "Standard Delivery · 3–5 Days";

    }

          }
/* =====================================================
   PART 3/4
   VALIDATION + PAYMENT
===================================================== */


/* =====================================================
   VALIDATE PAYMENT
===================================================== */

function validatePayment() {

    if (
        currentMethod ===
        "upi"
    ) {

        const upi =
            document.getElementById(
                "upiId"
            )?.value.trim();


        if (
            !upi ||
            !upi.includes("@")
        ) {

            showToast(
                "⚠️ Enter a valid UPI ID"
            );

            return false;

        }

    }


    if (
        currentMethod ===
        "card"
    ) {

        const number =
            document.getElementById(
                "cardNumber"
            )?.value.replace(
                /\s/g,
                ""
            );


        const expiry =
            document.getElementById(
                "cardExpiry"
            )?.value.trim();


        const cvv =
            document.getElementById(
                "cardCvv"
            )?.value.trim();


        const name =
            document.getElementById(
                "cardName"
            )?.value.trim();


        if (
            !number ||
            number.length < 16
        ) {

            showToast(
                "⚠️ Enter a valid card number"
            );

            return false;

        }


        if (
            !expiry ||
            expiry.length !== 5
        ) {

            showToast(
                "⚠️ Enter card expiry"
            );

            return false;

        }


        if (
            !cvv ||
            cvv.length !== 3
        ) {

            showToast(
                "⚠️ Enter valid CVV"
            );

            return false;

        }


        if (!name) {

            showToast(
                "⚠️ Enter card holder name"
            );

            return false;

        }

    }


    if (
        currentMethod ===
        "netbanking"
    ) {

        const bank =
            document.getElementById(
                "bankName"
            )?.value;


        if (!bank) {

            showToast(
                "⚠️ Select your bank"
            );

            return false;

        }

    }


    return true;

}


/* =====================================================
   PROCESS PAYMENT
===================================================== */

function processPayment() {

    if (
        !validatePayment()
    ) {

        return;

    }


    const order =
        getPaymentOrder();


    if (!order) {

        showToast(
            "⚠️ Order information missing"
        );

        return;

    }


    const overlay =
        document.getElementById(
            "processingOverlay"
        );


    if (overlay) {

        overlay.classList.add(
            "show"
        );

    }


    const button =
        document.getElementById(
            "payNowBtn"
        );


    if (button) {

        button.disabled =
            true;

        button.style.opacity =
            "0.7";

    }


    /*
       DEMO PAYMENT PROCESSING

       This simulates a successful
       payment for the project model.
    */

    setTimeout(
        () => {

            completePayment();

        },
        2200
    );

}

/* =====================================================
   COMPLETE PAYMENT
   PAYMENT SUCCESS → ORDER SUCCESS PAGE
===================================================== */

function completePayment() {

    const order =
        getPaymentOrder();


    if (!order) {

        showToast(
            "⚠️ Order information missing"
        );

        return;

    }


    /* ================================================
       GENERATE FINAL ORDER ID
    ================================================= */

    const orderId =
        generateOrderId();


    /* ================================================
       CREATE FINAL ORDER
    ================================================= */

    const finalOrder = {

        ...order,

        orderId:

            order.orderId ||
            orderId,

        paymentMethod:
            currentMethod,

        paymentStatus:
            "Paid",

        orderStatus:
            "Order Confirmed",

        trackingStatus:
            "Order Confirmed",

        createdAt:
            new Date().toISOString()

    };


    /* ================================================
       SAVE FINAL ORDER
    ================================================= */

    localStorage.setItem(
        "wizLastOrder",
        JSON.stringify(
            finalOrder
        )
    );


    localStorage.setItem(
        "wizPaymentOrder",
        JSON.stringify(
            finalOrder
        )
    );


    localStorage.setItem(
        "currentOrder",
        JSON.stringify(
            finalOrder
        )
    );


    /* ================================================
       HIDE PROCESSING OVERLAY
    ================================================= */

    const overlay =
        document.getElementById(
            "processingOverlay"
        );


    if (overlay) {

        overlay.classList.remove(
            "show"
        );

    }


    /* ================================================
       SHOW SUCCESS MESSAGE
    ================================================= */

    showToast(
        "✓ Payment successful"
    );


    /* ================================================
       OPEN ORDER SUCCESS PAGE
    ================================================= */

    setTimeout(
        function () {

            window.location.href =
                "order-success.html";

        },
        700
    );

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
   FORMAT CARD
===================================================== */

function formatCardNumber(
    input
) {

    let value =
        input.value
            .replace(
                /\D/g,
                ""
            )
            .substring(
                0,
                16
            );


    value =
        value.replace(
            /(.{4})/g,
            "$1 "
        )
        .trim();


    input.value =
        value;

}


/* =====================================================
   FORMAT EXPIRY
===================================================== */

function formatExpiry(
    input
) {

    let value =
        input.value
            .replace(
                /\D/g,
                ""
            )
            .substring(
                0,
                4
            );


    if (
        value.length >= 3
    ) {

        value =
            value.substring(
                0,
                2
            ) +
            "/" +
            value.substring(
                2
            );

    }


    input.value =
        value;

}
/* =====================================================
   PART 4/4
   SUCCESS + NAVIGATION + ANIMATION
===================================================== */


/* =====================================================
   SHOW SUCCESS
===================================================== */

function showSuccess(
    order
) {

    const orderId =
        document.getElementById(
            "successOrderId"
        );


    const amount =
        document.getElementById(
            "successAmount"
        );


    if (orderId) {

        orderId.textContent =
            order.orderId;

    }


    if (amount) {

        amount.textContent =
            `₹${order.pricing.finalPrice}`;

    }


    const success =
        document.getElementById(
            "paymentSuccess"
        );


    if (success) {

        success.classList.add(
            "show"
        );

    }


    showToast(
        "✓ Payment successful"
    );

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
            "Order not found"
        );

        return;

    }


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
   BACK TO CHECKOUT
===================================================== */

function goBackToCheckout() {

    window.location.href =
        "checkout.html";

}


/* =====================================================
   TOAST
===================================================== */

function showToast(
    message
) {

    const toast =
        document.getElementById(
            "paymentToast"
        );


    if (!toast)
        return;


    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        window.paymentToastTimer
    );


    window.paymentToastTimer =
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

function setupPaymentAnimation() {

    const elements =
        document.querySelectorAll(
            ".payment-card, .payment-trust, .order-summary, .small-summary-card"
        );


    elements.forEach(
        (element, index) => {

            element.style.opacity =
                "0";

            element.style.transform =
                "translateY(18px)";


            setTimeout(
                () => {

                    element.style.opacity =
                        "1";

                    element.style.transform =
                        "translateY(0)";

                    element.style.transition =
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

        loadPaymentPage();

        selectPaymentMethod(
            "upi"
        );

        setupPaymentAnimation();

        console.log(
            "💳 Wiz Commerce Payment Loaded"
        );

    }
);


/* =====================================================
   GLOBAL FUNCTIONS
===================================================== */

window.selectPaymentMethod =
    selectPaymentMethod;

window.processPayment =
    processPayment;

window.trackOrder =
    trackOrder;

window.continueShopping =
    continueShopping;

window.goBackToCheckout =
    goBackToCheckout;

window.formatCardNumber =
    formatCardNumber;

window.formatExpiry =
    formatExpiry;

window.showToast =
    showToast;
