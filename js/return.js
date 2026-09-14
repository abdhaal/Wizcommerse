/* =====================================================
   WIZ COMMERCE
   RETURN JS
   PART 1/4
===================================================== */

"use strict";


/* =========================================
   VARIABLES
========================================= */

let selectedOrder = null;


/* =========================================
   GET ORDER ID
========================================= */

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


    const saved =
        localStorage.getItem(
            "wizLastOrder"
        );


    if (saved) {

        try {

            const order =
                JSON.parse(saved);

            return (
                order.orderId ||
                ""
            );

        } catch (error) {

            console.warn(
                "Order data error:",
                error
            );

        }

    }


    return "";

}


/* =========================================
   GET ORDER DATA
========================================= */

function loadOrder() {

    const orderId =
        getOrderId();


    const possibleKeys = [

        "wizLastOrder",

        "wizPaymentOrder",

        "currentOrder"

    ];


    for (
        const key of possibleKeys
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


            if (
                order &&
                (
                    !orderId ||
                    order.orderId ===
                    orderId
                )
            ) {

                selectedOrder =
                    order;

                break;

            }

        } catch (error) {

            console.warn(
                error
            );

        }

    }


    displayOrder();

}


/* =========================================
   DISPLAY ORDER
========================================= */

function displayOrder() {

    const orderId =
        selectedOrder?.orderId ||
        getOrderId() ||
        "WIZ-ORDER";


    setText(
        "returnOrderId",
        orderId
    );


    const productName =
        selectedOrder?.productName ||
        selectedOrder?.product?.name ||
        "Wiz Commerce Product";


    setText(
        "productName",
        productName
    );


    const price =
        getOrderPrice();


    setText(
        "productPrice",
        "₹" +
        formatPrice(
            price
        )
    );


    setText(
        "refundAmount",
        "₹" +
        formatPrice(
            price
        )
    );


    const image =
        selectedOrder?.productImage ||
        selectedOrder?.product?.image ||
        "assets/images/bulb.jpg";


    const imageContainer =
        document.getElementById(
            "productImage"
        );


    if (imageContainer) {

        imageContainer.innerHTML = `

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
   PRICE
========================================= */

function getOrderPrice() {

    if (!selectedOrder) {

        return 0;

    }


    return (
        selectedOrder.total ||
        selectedOrder.amount ||
        selectedOrder.price ||
        selectedOrder.pricing?.finalPrice ||
        0
    );

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
   RETURN JS
   PART 2/4
===================================================== */


/* =========================================
   CHARACTER COUNTER
========================================= */

function setupCharacterCounter() {

    const textarea =
        document.getElementById(
            "returnMessage"
        );

    const counter =
        document.getElementById(
            "characterCount"
        );


    if (
        !textarea ||
        !counter
    ) {

        return;

    }


    textarea.addEventListener(
        "input",
        () => {

            counter.textContent =
                textarea.value.length;

        }
    );

}


/* =========================================
   REASON SELECTION
========================================= */

function getSelectedReason() {

    const selected =
        document.querySelector(
            'input[name="returnReason"]:checked'
        );


    if (!selected) {

        return "";

    }


    return selected.value;

}


/* =========================================
   VALIDATE RETURN
========================================= */

function validateReturn() {

    const reason =
        getSelectedReason();


    if (!reason) {

        alert(
            "Please select a reason for returning the product."
        );

        return false;

    }


    return true;

}


/* =========================================
   GENERATE RETURN ID
========================================= */

function generateReturnId() {

    const random =
        Math.floor(
            100000 +
            Math.random() * 900000
        );


    return (
        "RET-" +
        random
    );

}


/* =========================================
   SAVE RETURN REQUEST
========================================= */

function saveReturnRequest(
    returnId
) {

    const reason =
        getSelectedReason();


    const message =
        document.getElementById(
            "returnMessage"
        )?.value.trim() ||
        "";


    const request = {

        returnId:
            returnId,

        orderId:
            getOrderId(),

        reason:
            reason,

        message:
            message,

        amount:
            getOrderPrice(),

        status:
            "Return Requested",

        createdAt:
            new Date().toISOString(),

        refundStatus:
            "Refund Pending"

    };


    localStorage.setItem(
        "wizReturnRequest",
        JSON.stringify(
            request
        )
    );


    return request;

}


/* =========================================
   UPDATE ORDER STATUS
========================================= */

function updateOrderReturnStatus() {

    if (!selectedOrder) {

        return;

    }


    selectedOrder.returnStatus =
        "Return Requested";


    selectedOrder.status =
        "Return Requested";


    localStorage.setItem(
        "wizLastOrder",
        JSON.stringify(
            selectedOrder
        )
    );

}


/* =========================================
   SHOW SUCCESS
========================================= */

function showSuccess(
    returnId
) {

    setText(
        "returnId",
        returnId
    );


    const modal =
        document.getElementById(
            "successModal"
        );


    if (modal) {

        modal.classList.add(
            "show"
        );

    }

}
/* =====================================================
   RETURN JS
   PART 3/4
===================================================== */


/* =========================================
   SUBMIT RETURN
========================================= */

function submitReturn() {

    if (
        !validateReturn()
    ) {

        return;

    }


    const button =
        document.getElementById(
            "submitReturnBtn"
        );


    if (button) {

        button.disabled =
            true;

        button.textContent =
            "⏳ Processing...";

    }


    setTimeout(
        () => {

            const returnId =
                generateReturnId();


            saveReturnRequest(
                returnId
            );


            updateOrderReturnStatus();


            if (button) {

                button.disabled =
                    false;

                button.textContent =
                    "✓ Return Requested";

            }


            showSuccess(
                returnId
            );


            console.log(
                "Return Request:",
                returnId
            );

        },
        700
    );

}


/* =========================================
   TRACK REFUND
========================================= */

function trackRefund() {

    const request =
        localStorage.getItem(
            "wizReturnRequest"
        );


    if (!request) {

        alert(
            "Return request not found."
        );

        return;

    }


    try {

        const data =
            JSON.parse(
                request
            );


        window.location.href =
            "refund-tracking.html?id=" +
            encodeURIComponent(
                data.returnId
            );

    } catch (error) {

        console.error(
            error
        );

    }

}


/* =========================================
   GO TO ORDERS
========================================= */

function goToOrders() {

    window.location.href =
        "my-orders.html";

}


/* =========================================
   ANIMATION
========================================= */

function animatePage() {

    const elements =
        document.querySelectorAll(
            ".return-order-card, " +
            ".return-card, " +
            ".refund-card, " +
            ".return-steps, " +
            ".return-action"
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
   SETUP EVENTS
========================================= */

function setupEvents() {

    const submit =
        document.getElementById(
            "submitReturnBtn"
        );


    if (submit) {

        submit.addEventListener(
            "click",
            submitReturn
        );

    }


    const track =
        document.getElementById(
            "trackRefundBtn"
        );


    if (track) {

        track.addEventListener(
            "click",
            trackRefund
        );

    }


    const orders =
        document.getElementById(
            "myOrdersBtn"
        );


    if (orders) {

        orders.addEventListener(
            "click",
            goToOrders
        );

    }

}
/* =====================================================
   RETURN JS
   PART 4/4
===================================================== */


/* =========================================
   AUTO SAVE DRAFT
========================================= */

function setupDraftSave() {

    const textarea =
        document.getElementById(
            "returnMessage"
        );


    if (!textarea) {

        return;

    }


    textarea.addEventListener(
        "input",
        () => {

            localStorage.setItem(
                "wizReturnMessageDraft",
                textarea.value
            );

        }
    );


    const saved =
        localStorage.getItem(
            "wizReturnMessageDraft"
        );


    if (saved) {

        textarea.value =
            saved;

        const counter =
            document.getElementById(
                "characterCount"
            );


        if (counter) {

            counter.textContent =
                saved.length;

        }

    }

}


/* =========================================
   CLEAR DRAFT
========================================= */

function clearDraft() {

    localStorage.removeItem(
        "wizReturnMessageDraft"
    );

}


/* =========================================
   INITIALIZE
========================================= */

function initializeReturnPage() {

    console.log(
        "🔄 Wiz Commerce Return Page Loaded"
    );


    loadOrder();


    setupCharacterCounter();


    setupDraftSave();


    setupEvents();


    animatePage();

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
        initializeReturnPage
    );

} else {

    initializeReturnPage();

}


/* =========================================
   GLOBAL FUNCTIONS
========================================= */

window.submitReturn =
    submitReturn;

window.trackRefund =
    trackRefund;

window.goToOrders =
    goToOrders;
