/* =====================================================
   WIZ COMMERCE
   ORDER SUCCESS JS
   PART 1/4
===================================================== */

"use strict";


/* =====================================================
   GET ORDER
===================================================== */

function getSuccessOrder() {

    const keys = [

        "wizPaymentOrder",

        "currentOrder",

        "wizLastOrder"

    ];


    for (
        const key of keys
    ) {

        const stored =
            localStorage.getItem(
                key
            );


        if (!stored) {
            continue;
        }


        try {

            const order =
                JSON.parse(
                    stored
                );


            if (order) {

                return order;

            }

        } catch (error) {

            console.warn(
                "Order data error:",
                error
            );

        }

    }


    return null;

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
   FORMAT PRICE
===================================================== */

function formatPrice(
    value
) {

    return Number(
        value || 0
    ).toLocaleString(
        "en-IN"
    );

}
/* =====================================================
   LOAD ORDER DETAILS
===================================================== */

function loadOrderDetails() {

    const order =
        getSuccessOrder();


    if (!order) {

        console.warn(
            "Order not found"
        );

        setText(
            "successOrderId",
            "WIZ-ORDER"
        );

        setText(
            "deliveryDate",
            "Delivery details unavailable"
        );

        return;

    }


    /* ================================================
       ORDER ID
    ================================================= */

    setText(
        "successOrderId",

        order.orderId ||
        "WIZ-ORDER"
    );


    /* ================================================
       PRICING
    ================================================= */

    const pricing =
        order.pricing ||
        {};


    setText(
        "productTotal",

        `₹${formatPrice(
            pricing.originalTotal ??
            pricing.productTotal
        )}`
    );


    setText(
        "discount",

        `- ₹${formatPrice(
            pricing.discount
        )}`
    );


    setText(
        "deliveryCharge",

        Number(
            pricing.delivery || 0
        ) === 0
            ? "FREE"
            : `₹${formatPrice(
                pricing.delivery
            )}`
    );


    setText(
        "finalAmount",

        `₹${formatPrice(
            pricing.finalPrice
        )}`
    );


    /* ================================================
       PAYMENT METHOD
    ================================================= */

    let method =
        order.payment ||
        "cod";


    const paymentNames = {

        cod:
            "Cash on Delivery",

        upi:
            "UPI",

        card:
            "Debit / Credit Card"

    };


    setText(
        "paymentMethod",

        paymentNames[method] ||
        method
    );


    /* ================================================
       DELIVERY DATE
    ================================================= */

    loadDeliveryDate();

}


/* =====================================================
   DELIVERY DATE
===================================================== */

function loadDeliveryDate() {

    const date =
        new Date();


    date.setDate(
        date.getDate() + 5
    );


    const options = {

        day:
            "numeric",

        month:
            "short",

        year:
            "numeric"

    };


    const formatted =
        date.toLocaleDateString(
            "en-IN",
            options
        );


    setText(
        "deliveryDate",
        formatted
    );

}
/* =====================================================
   TRACK ORDER
===================================================== */

function trackOrder() {

    const order =
        getSuccessOrder();


    if (
        !order ||
        !order.orderId
    ) {

        alert(
            "Order information not found."
        );

        return;

    }


    window.location.href =
        "order-tracking.html?id=" +
        encodeURIComponent(
            order.orderId
        );

}


/* =====================================================
   MY ORDERS
===================================================== */

function openMyOrders() {

    window.location.href =
        "my-orders.html";

}


/* =====================================================
   CONTINUE SHOPPING
===================================================== */

function continueShopping() {

    window.location.href =
        "products.html";

}


/* =====================================================
   BUTTON EVENTS
===================================================== */

function setupButtons() {

    const trackButton =
        document.getElementById(
            "trackOrderBtn"
        );


    if (trackButton) {

        trackButton.addEventListener(
            "click",
            trackOrder
        );

    }


    const ordersButton =
        document.getElementById(
            "myOrdersBtn"
        );


    if (ordersButton) {

        ordersButton.addEventListener(
            "click",
            openMyOrders
        );

    }


    const shopLink =
        document.querySelector(
            ".shop-link"
        );


    if (shopLink) {

        shopLink.addEventListener(
            "click",
            continueShopping
        );

    }

}
/* =====================================================
   PAGE ANIMATION
===================================================== */

function setupAnimation() {

    const elements =
        document.querySelectorAll(
            ".success-card, .order-summary, .trust-item"
        );


    elements.forEach(
        (
            element,
            index
        ) => {

            element.style.opacity =
                "0";


            element.style.transform =
                "translateY(15px)";


            setTimeout(
                () => {

                    element.style.transition =
                        "opacity .4s ease, transform .4s ease";


                    element.style.opacity =
                        "1";


                    element.style.transform =
                        "translateY(0)";

                },
                index * 100
            );

        }
    );

}


/* =====================================================
   INITIALIZE
===================================================== */

function initializeSuccessPage() {

    console.log(
        "🎉 Wiz Commerce Order Success Loaded"
    );


    loadOrderDetails();


    setupButtons();


    setupAnimation();


    console.log(
        "✅ Order Success Page Ready"
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
        initializeSuccessPage
    );

} else {

    initializeSuccessPage();

}


/* =====================================================
   GLOBAL
===================================================== */

window.trackOrder =
    trackOrder;


window.openMyOrders =
    openMyOrders;


window.continueShopping =
    continueShopping;
