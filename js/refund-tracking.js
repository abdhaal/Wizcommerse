/* =====================================================
   WIZ COMMERCE
   REFUND TRACKING JS
   PART 1/4
===================================================== */

"use strict";


let returnRequest = null;


/* =========================================
   GET RETURN ID
========================================= */

function getReturnId() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    const id =
        params.get("id");


    if (id) {

        return id;

    }


    const saved =
        localStorage.getItem(
            "wizReturnRequest"
        );


    if (saved) {

        try {

            const data =
                JSON.parse(saved);

            return (
                data.returnId ||
                ""
            );

        } catch (error) {

            console.error(error);

        }

    }


    return "";

}


/* =========================================
   LOAD RETURN REQUEST
========================================= */

function loadReturnRequest() {

    const saved =
        localStorage.getItem(
            "wizReturnRequest"
        );


    if (!saved) {

        console.warn(
            "No return request found."
        );

        returnRequest = {

            returnId:
                getReturnId() ||
                "RET-000000",

            orderId:
                "WIZ-ORDER",

            amount:
                0,

            reason:
                "Return requested",

            status:
                "Return Requested",

            refundStatus:
                "Refund Pending"

        };

        return;

    }


    try {

        returnRequest =
            JSON.parse(
                saved
            );

    } catch (error) {

        console.error(
            "Return data error:",
            error
        );

        returnRequest = null;

    }

}


/* =========================================
   DISPLAY RETURN DATA
========================================= */

function displayReturnData() {

    if (!returnRequest) {

        return;

    }


    setText(
        "returnId",
        returnRequest.returnId ||
        getReturnId() ||
        "RET-000000"
    );


    setText(
        "orderId",
        returnRequest.orderId ||
        "WIZ-ORDER"
    );


    setText(
        "refundAmount",
        "₹" +
        formatPrice(
            returnRequest.amount
        )
    );


    setText(
        "returnReason",
        returnRequest.reason ||
        "-"
    );


    const productName =
        returnRequest.productName ||
        returnRequest.product?.name ||
        "Wiz Commerce Product";


    setText(
        "productName",
        productName
    );


    const image =
        returnRequest.productImage ||
        returnRequest.product?.image ||
        "assets/images/bulb.jpg";


    const imageBox =
        document.getElementById(
            "productImage"
        );


    if (imageBox) {

        imageBox.innerHTML = `

            <img
                src="${image}"
                alt="${productName}"
                onerror="
                    this.style.display='none';
                    this.parentElement.innerHTML='📦';
                "
            >

        `;

    }

}


/* =========================================
   FORMAT PRICE
========================================= */

function formatPrice(
    value
) {

    return Number(
        value || 0
    ).toLocaleString(
        "en-IN"
    );

}


/* =========================================
   SET TEXT
========================================= */

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
   REFUND TRACKING JS
   PART 2/4
===================================================== */


/* =========================================
   EXPECTED REFUND DATE
========================================= */

function setExpectedRefundDate() {

    const date =
        new Date();


    date.setDate(
        date.getDate() + 5
    );


    const formatted =
        date.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );


    setText(
        "expectedDate",
        formatted
    );

}


/* =========================================
   REQUEST TIME
========================================= */

function setRequestTime() {

    let date;


    if (
        returnRequest &&
        returnRequest.createdAt
    ) {

        date =
            new Date(
                returnRequest.createdAt
            );

    } else {

        date =
            new Date();

    }


    const formatted =
        date.toLocaleString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                hour: "2-digit",
                minute: "2-digit"
            }
        );


    setText(
        "requestTime",
        formatted
    );

}


/* =========================================
   STATUS
========================================= */

function updateCurrentStatus() {

    if (!returnRequest) {

        return;

    }


    const status =
        returnRequest.status ||
        "Return Requested";


    setText(
        "currentStatus",
        status
    );


    setText(
        "refundStatus",
        returnRequest.refundStatus ||
        "Refund Pending"
    );


    const message =
        document.getElementById(
            "statusMessage"
        );


    if (!message) {

        return;

    }


    const messages = {

        "Return Requested":
            "Your return request has been successfully received.",

        "Pickup Scheduled":
            "Your product pickup has been scheduled.",

        "Product Verification":
            "Our team is verifying the returned product.",

        "Refund Processing":
            "Your refund is currently being processed.",

        "Refund Completed":
            "Your refund has been successfully completed."

    };


    message.textContent =
        messages[status] ||
        "Your return request is being processed.";

}


/* =========================================
   APPLY STATUS STEP
========================================= */

function applyStatusStep() {

    if (!returnRequest) {

        return;

    }


    const status =
        returnRequest.status ||
        "Return Requested";


    const steps = [

        "step-request",

        "step-pickup",

        "step-verification",

        "step-refund",

        "step-completed"

    ];


    const statusIndex = {

        "Return Requested":
            0,

        "Pickup Scheduled":
            1,

        "Product Verification":
            2,

        "Refund Processing":
            3,

        "Refund Completed":
            4

    };


    const current =
        statusIndex[status] ?? 0;


    steps.forEach(
        (
            stepId,
            index
        ) => {

            const element =
                document.getElementById(
                    stepId
                );


            if (!element) {

                return;

            }


            element.classList.remove(
                "completed",
                "active"
            );


            if (
                index <
                current
            ) {

                element.classList.add(
                    "completed"
                );

                const icon =
                    element.querySelector(
                        ".timeline-icon"
                    );


                if (icon) {

                    icon.textContent =
                        "✓";

                }

            }


            if (
                index ===
                current
            ) {

                element.classList.add(
                    current === 4
                        ? "completed"
                        : "active"
                );

            }

        }
    );

}
/* =====================================================
   REFUND TRACKING JS
   PART 3/4
===================================================== */


/* =========================================
   SIMULATE LIVE STATUS
========================================= */

function startDemoTracking() {

    /*
       This is only for MODEL WEBSITE demo.

       It automatically moves through:
       Return Requested
       ↓
       Pickup Scheduled
       ↓
       Product Verification
       ↓
       Refund Processing
       ↓
       Refund Completed
    */


    if (!returnRequest) {

        return;

    }


    const demoEnabled =
        localStorage.getItem(
            "wizDemoRefundTracking"
        );


    if (
        demoEnabled !== "true"
    ) {

        return;

    }


    const statuses = [

        "Return Requested",

        "Pickup Scheduled",

        "Product Verification",

        "Refund Processing",

        "Refund Completed"

    ];


    let index =
        statuses.indexOf(
            returnRequest.status
        );


    if (index < 0) {

        index = 0;

    }


    const timer =
        setInterval(
            () => {

                if (
                    index >=
                    statuses.length - 1
                ) {

                    clearInterval(
                        timer
                    );

                    return;

                }


                index++;


                returnRequest.status =
                    statuses[index];


                if (
                    index ===
                    statuses.length - 1
                ) {

                    returnRequest.refundStatus =
                        "Refund Completed";

                }


                localStorage.setItem(
                    "wizReturnRequest",
                    JSON.stringify(
                        returnRequest
                    )
                );


                updateCurrentStatus();

                applyStatusStep();


                if (
                    statuses[index] ===
                    "Refund Completed"
                ) {

                    showCompletionMessage();

                }

            },
            5000
        );

}


/* =========================================
   COMPLETION MESSAGE
========================================= */

function showCompletionMessage() {

    const statusBox =
        document.querySelector(
            ".current-status"
        );


    if (!statusBox) {

        return;

    }


    statusBox.classList.add(
        "completed-status"
    );


    const icon =
        document.querySelector(
            ".status-icon"
        );


    if (icon) {

        icon.textContent =
            "✓";

        icon.style.animation =
            "none";

    }

}


/* =========================================
   SUPPORT MODAL
========================================= */

function openSupport() {

    const modal =
        document.getElementById(
            "supportModal"
        );


    if (modal) {

        modal.classList.add(
            "show"
        );

    }

}


/* =========================================
   CLOSE SUPPORT
========================================= */

function closeSupport() {

    const modal =
        document.getElementById(
            "supportModal"
        );


    if (modal) {

        modal.classList.remove(
            "show"
        );

    }

}


/* =========================================
   CONTINUE SHOPPING
========================================= */

function continueShopping() {

    window.location.href =
        "products.html";

}


/* =========================================
   MY ORDERS
========================================= */

function goToOrders() {

    window.location.href =
        "my-orders.html";

                      }
/* =====================================================
   REFUND TRACKING JS
   PART 4/4
===================================================== */


/* =========================================
   SETUP EVENTS
========================================= */

function setupEvents() {

    const supportBtn =
        document.getElementById(
            "supportBtn"
        );


    if (supportBtn) {

        supportBtn.addEventListener(
            "click",
            openSupport
        );

    }


    const closeBtn =
        document.getElementById(
            "closeSupport"
        );


    if (closeBtn) {

        closeBtn.addEventListener(
            "click",
            closeSupport
        );

    }


    const modal =
        document.getElementById(
            "supportModal"
        );


    if (modal) {

        modal.addEventListener(
            "click",
            (event) => {

                if (
                    event.target.classList
                        .contains(
                            "modal-overlay"
                        )
                ) {

                    closeSupport();

                }

            }
        );

    }


    const shopping =
        document.getElementById(
            "continueShoppingBtn"
        );


    if (shopping) {

        shopping.addEventListener(
            "click",
            continueShopping
        );

    }


    const orders =
        document.getElementById(
            "ordersBtn"
        );


    if (orders) {

        orders.addEventListener(
            "click",
            goToOrders
        );

    }

}


/* =========================================
   PAGE ANIMATION
========================================= */

function animatePage() {

    const elements =
        document.querySelectorAll(
            ".summary-card, " +
            ".current-status, " +
            ".timeline-card, " +
            ".detail-card, " +
            ".support-card, " +
            ".guarantee-card"
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
                index * 80
            );

        }
    );

}


/* =========================================
   INITIALIZE
========================================= */

function initializeTrackingPage() {

    console.log(
        "🔔 Wiz Commerce Refund Tracking Loaded"
    );


    loadReturnRequest();


    displayReturnData();


    setExpectedRefundDate();


    setRequestTime();


    updateCurrentStatus();


    applyStatusStep();


    setupEvents();


    animatePage();


    /*
       Enable this only when you want
       automatic demo status changes.

       Browser console:

       localStorage.setItem(
           "wizDemoRefundTracking",
           "true"
       );
    */

    startDemoTracking();

}


/* =========================================
   DOM READY
========================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeTrackingPage
    );

} else {

    initializeTrackingPage();

}


/* =========================================
   GLOBAL
========================================= */

window.openSupport =
    openSupport;

window.closeSupport =
    closeSupport;

window.continueShopping =
    continueShopping;

window.goToOrders =
    goToOrders;
