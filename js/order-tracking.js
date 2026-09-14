/* =====================================================
   WIZ COMMERCE
   ORDER TRACKING JS
   PART 1/4
===================================================== */

"use strict";


/* =====================================================
   GET ORDER ID
===================================================== */

function getOrderId() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const urlId =
        params.get("id");


    if (urlId) {

        return urlId;

    }


    const stored =
        localStorage.getItem(
            "wizLastOrder"
        );


    if (stored) {

        try {

            const order =
                JSON.parse(
                    stored
                );


            if (
                order &&
                order.orderId
            ) {

                return order.orderId;

            }

        } catch (error) {

            console.warn(
                "Order data error:",
                error
            );

        }

    }


    return "WIZ-ORDER";

}


/* =====================================================
   GET ORDER
===================================================== */

function getOrder() {

    const keys = [

        "wizLastOrder",

        "wizPaymentOrder",

        "currentOrder"

    ];


    for (
        const key of keys
    ) {

        const data =
            localStorage.getItem(
                key
            );


        if (!data) {

            continue;

        }


        try {

            const order =
                JSON.parse(
                    data
                );


            if (order) {

                return order;

            }

        } catch (error) {

            console.warn(
                "Invalid order:",
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
   DELIVERY DATE
===================================================== */

function getDeliveryDate() {

    const date =
        new Date();


    date.setDate(
        date.getDate() + 5
    );


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );

}


/* =====================================================
   LOAD BASIC DETAILS
===================================================== */

function loadBasicDetails() {

    const order =
        getOrder();


    const orderId =
        getOrderId();


    setText(
        "orderId",
        orderId
    );


    setText(
        "expectedDelivery",
        getDeliveryDate()
    );


    setText(
        "confidenceScore",
        "94%"
    );


    setText(
        "confidenceText",
        "High Confidence"
    );


    setText(
        "orderStatus",
        "Order Confirmed"
    );


    /* ================================================
       ADDRESS
    ================================================= */

    if (order) {

        const customer =
            order.customer ||
            {};


        setText(
            "customerName",

            customer.name ||
            order.customerName ||
            "Customer"
        );


        setText(
            "deliveryAddress",

            customer.address ||
            order.address ||
            "Delivery address confirmed"
        );

    } else {

        setText(
            "customerName",
            "Customer"
        );


        setText(
            "deliveryAddress",
            "Delivery address confirmed"
        );

    }

}


/* =====================================================
   CURRENT TRACKING STATE
===================================================== */

function getCurrentTrackingState() {

    const stored =
        localStorage.getItem(
            "wizTrackingState"
        );


    if (stored) {

        const state =
            Number(stored);


        if (
            state >= 1 &&
            state <= 5
        ) {

            return state;

        }

    }


    return 2;

}


/* =====================================================
   UPDATE STEP
===================================================== */

function updateStep(
    id,
    state
) {

    const element =
        document.getElementById(
            id
        );


    if (!element) {

        return;

    }


    element.classList.remove(
        "completed",
        "active"
    );


    if (state === "completed") {

        element.classList.add(
            "completed"
        );

    }


    if (state === "active") {

        element.classList.add(
            "active"
        );

    }

}
/* =====================================================
   UPDATE TRACKING
===================================================== */

function updateTracking() {

    const state =
        getCurrentTrackingState();


    /* ================================================
       STEP 1
    ================================================= */

    if (state >= 1) {

        updateStep(
            "stepConfirmed",
            "completed"
        );

        setText(
            "confirmedTime",
            "✓ Completed"
        );

    }


    /* ================================================
       STEP 2
    ================================================= */

    if (state === 2) {

        updateStep(
            "stepPacked",
            "active"
        );

        setText(
            "packedTime",
            "● In Progress"
        );

    }

    else if (state > 2) {

        updateStep(
            "stepPacked",
            "completed"
        );

        setText(
            "packedTime",
            "✓ Completed"
        );

    }


    /* ================================================
       STEP 3
    ================================================= */

    if (state === 3) {

        updateStep(
            "stepShipped",
            "active"
        );

        setText(
            "shippedTime",
            "● In Progress"
        );

    }

    else if (state > 3) {

        updateStep(
            "stepShipped",
            "completed"
        );

        setText(
            "shippedTime",
            "✓ Completed"
        );

    }


    /* ================================================
       STEP 4
    ================================================= */

    if (state === 4) {

        updateStep(
            "stepOut",
            "active"
        );

        setText(
            "outTime",
            "● In Progress"
        );

    }

    else if (state > 4) {

        updateStep(
            "stepOut",
            "completed"
        );

        setText(
            "outTime",
            "✓ Completed"
        );

    }


    /* ================================================
       STEP 5
    ================================================= */

    if (state === 5) {

        updateStep(
            "stepDelivered",
            "completed"
        );

        setText(
            "deliveredTime",
            "✓ Delivered"
        );

    }


    updateStatusText(
        state
    );

}


/* =====================================================
   UPDATE STATUS TEXT
===================================================== */

function updateStatusText(
    state
) {

    const statuses = {

        1:
            "Order Confirmed",

        2:
            "Product Packed",

        3:
            "Shipped",

        4:
            "Out for Delivery",

        5:
            "Delivered"

    };


    setText(
        "orderStatus",
        statuses[state] ||
        "Order Confirmed"
    );

      }
/* =====================================================
   BUTTON FUNCTIONS
===================================================== */

function continueShopping() {

    window.location.href =
        "products.html";

}


function openMyOrders() {

    window.location.href =
        "my-orders.html";

}


function contactSupport() {

    window.location.href =
        "support.html";

}


/* =====================================================
   SETUP BUTTONS
===================================================== */

function setupButtons() {

    const shopButton =
        document.getElementById(
            "continueShoppingBtn"
        );


    if (shopButton) {

        shopButton.addEventListener(
            "click",
            continueShopping
        );

    }


    const ordersButton =
        document.getElementById(
            "ordersBtn"
        );


    if (ordersButton) {

        ordersButton.addEventListener(
            "click",
            openMyOrders
        );

    }


    const supportButton =
        document.getElementById(
            "supportBtn"
        );


    if (supportButton) {

        supportButton.addEventListener(
            "click",
            contactSupport
        );

    }

}


/* =====================================================
   PAGE ANIMATION
===================================================== */

function animatePage() {

    const cards =
        document.querySelectorAll(
            ".order-header-card, " +
            ".confidence-card, " +
            ".tracking-card, " +
            ".delivery-card, " +
            ".address-card, " +
            ".trust-box"
        );


    cards.forEach(
        (
            card,
            index
        ) => {

            card.style.opacity =
                "0";

            card.style.transform =
                "translateY(15px)";


            setTimeout(
                () => {

                    card.style.transition =
                        "opacity .4s ease, transform .4s ease";

                    card.style.opacity =
                        "1";

                    card.style.transform =
                        "translateY(0)";

                },
                index * 80
            );

        }
    );

}


/* =====================================================
   INITIALIZE
===================================================== */

function initializeTracking() {

    console.log(
        "📍 Wiz Commerce Tracking Loaded"
    );


    loadBasicDetails();


    updateTracking();


    setupButtons();


    animatePage();


    console.log(
        "✅ Order Tracking Ready"
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
        initializeTracking
    );

} else {

    initializeTracking();

}


/* =====================================================
   GLOBAL FUNCTIONS
===================================================== */

window.continueShopping =
    continueShopping;

window.openMyOrders =
    openMyOrders;

window.contactSupport =
    contactSupport;
