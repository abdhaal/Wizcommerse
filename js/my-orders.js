/* =====================================================
   WIZ COMMERCE
   MY ORDERS JS
   PART 1/4
===================================================== */

"use strict";


/* =====================================================
   ORDER DATA
===================================================== */

let orders = [];

let selectedOrder = null;


/* =====================================================
   GET SAVED ORDERS
===================================================== */

function loadOrders() {

    orders = [];

    const keys = [
        "wizLastOrder",
        "wizPaymentOrder",
        "currentOrder"
    ];


    keys.forEach(
        key => {

            const data =
                localStorage.getItem(
                    key
                );


            if (!data) {
                return;
            }


            try {

                const order =
                    JSON.parse(
                        data
                    );


                if (
                    order &&
                    order.orderId
                ) {

                    const exists =
                        orders.some(
                            item =>
                                item.orderId ===
                                order.orderId
                        );


                    if (!exists) {

                        orders.push(
                            order
                        );

                    }

                }

            } catch (error) {

                console.warn(
                    "Order data error:",
                    error
                );

            }

        }
    );


    /* ================================================
       DEMO ORDER
       Only shown if no real order exists
    ================================================= */

    if (
        orders.length === 0
    ) {

        const demoOrder = {

            orderId:
                "WIZ-DEMO-1001",

            status:
                "Delivered",

            createdAt:
                new Date().toISOString(),

            productName:
                "Smart LED Bulb",

            productImage:
                "assets/images/bulb.jpg",

            price:
                299,

            paymentMethod:
                "UPI",

            total:
                299

        };


        orders.push(
            demoOrder
        );

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
   FORMAT DATE
===================================================== */

function formatDate(
    value
) {

    if (!value) {

        return "Recently";

    }


    const date =
        new Date(value);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "Recently";

    }


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
   GET STATUS
===================================================== */

function getStatus(
    order
) {

    return (
        order.orderStatus ||
        order.status ||
        "Confirmed"
    );

}


/* =====================================================
   STATUS CLASS
===================================================== */

function getStatusClass(
    status
) {

    const value =
        String(
            status
        ).toLowerCase();


    if (
        value.includes(
            "deliver"
        )
    ) {

        return "status-delivered";

    }


    if (
        value.includes(
            "out"
        )
    ) {

        return "status-out";

    }


    if (
        value.includes(
            "ship"
        )
    ) {

        return "status-shipped";

    }


    if (
        value.includes(
            "pack"
        )
    ) {

        return "status-packed";

    }


    return "status-confirmed";

}


/* =====================================================
   GET PRODUCT
===================================================== */

function getProductName(
    order
) {

    return (
        order.productName ||
        order.product?.name ||
        "Wiz Commerce Product"
    );

}


function getProductImage(
    order
) {

    return (
        order.productImage ||
        order.product?.image ||
        "assets/images/bulb.jpg"
    );

}


function getOrderTotal(
    order
) {

    if (
        order.total
    ) {

        return order.total;

    }


    if (
        order.amount
    ) {

        return order.amount;

    }


    if (
        order.pricing &&
        order.pricing.finalPrice
    ) {

        return order.pricing.finalPrice;

    }


    return 0;

}


/* =====================================================
   RENDER ORDERS
===================================================== */

function renderOrders(
    list = orders
) {

    const container =
        document.getElementById(
            "ordersList"
        );


    const empty =
        document.getElementById(
            "emptyOrders"
        );


    if (!container) {
        return;
    }


    container.innerHTML =
        "";


    if (
        list.length === 0
    ) {

        empty.style.display =
            "block";

        return;

    }


    empty.style.display =
        "none";


    list.forEach(
        order => {

            container.innerHTML +=
                createOrderCard(
                    order
                );

        }
    );

      }
/* =====================================================
   CREATE ORDER CARD
===================================================== */

function createOrderCard(
    order
) {

    const status =
        getStatus(
            order
        );


    const statusClass =
        getStatusClass(
            status
        );


    const productName =
        getProductName(
            order
        );


    const image =
        getProductImage(
            order
        );


    const total =
        getOrderTotal(
            order
        );


    const date =
        formatDate(
            order.createdAt ||
            order.date
        );


    return `

        <article
            class="order-card"
        >

            <div
                class="order-top"
            >

                <div
                    class="order-number"
                >

                    <span>
                        Order ID
                    </span>

                    <strong>
                        ${order.orderId}
                    </strong>

                </div>


                <span
                    class="order-status ${statusClass}"
                >
                    ${status}
                </span>

            </div>


            <div
                class="order-body"
            >

                <div
                    class="order-product-image"
                >

                    <img
                        src="${image}"
                        alt="${productName}"
                        onerror="
                            this.style.display='none';
                            this.parentElement.innerHTML='📦';
                        "
                    >

                </div>


                <div
                    class="order-product-info"
                >

                    <h3>
                        ${productName}
                    </h3>

                    <p>
                        Wiz Commerce Verified Product
                    </p>

                    <strong>
                        ₹${formatPrice(total)}
                    </strong>

                </div>

            </div>


            <div
                class="order-bottom"
            >

                <span
                    class="order-date"
                >
                    Ordered on ${date}
                </span>


                <div
                    class="order-actions"
                >

                    <button
                        type="button"
                        class="track-btn"
                        onclick="
                            trackOrder(
                                '${order.orderId}'
                            )
                        "
                    >
                        📍 Track
                    </button>


                    <button
                        type="button"
                        class="details-btn"
                        onclick="
                            showOrderDetails(
                                '${order.orderId}'
                            )
                        "
                    >
                        View Details
                    </button>


                    ${
                        status
                        .toLowerCase()
                        .includes("deliver")
                        ?

                        `<button
                            type="button"
                            class="return-btn"
                            onclick="
                                returnOrder(
                                    '${order.orderId}'
                                )
                        ">
                            🔄 Return
                        </button>`

                        :

                        ""
                    }

                </div>

            </div>

        </article>

    `;

}


/* =====================================================
   UPDATE STATS
===================================================== */

function updateStats() {

    setText(
        "totalOrders",
        orders.length
    );


    const active =
        orders.filter(
            order =>
                !getStatus(
                    order
                )
                .toLowerCase()
                .includes(
                    "deliver"
                )
        ).length;


    const delivered =
        orders.filter(
            order =>
                getStatus(
                    order
                )
                .toLowerCase()
                .includes(
                    "deliver"
                )
        ).length;


    setText(
        "activeOrders",
        active
    );


    setText(
        "deliveredOrders",
        delivered
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
   TRACK ORDER
===================================================== */

function trackOrder(
    orderId
) {

    window.location.href =
        "order-tracking.html?id=" +
        encodeURIComponent(
            orderId
        );

}


/* =====================================================
   SHOW ORDER DETAILS
===================================================== */

function showOrderDetails(
    orderId
) {

    selectedOrder =
        orders.find(
            order =>
                order.orderId ===
                orderId
        );


    if (!selectedOrder) {
        return;
    }


    setText(
        "modalOrderId",
        selectedOrder.orderId
    );


    setText(
        "modalStatus",
        getStatus(
            selectedOrder
        )
    );


    setText(
        "modalDate",
        formatDate(
            selectedOrder.createdAt ||
            selectedOrder.date
        )
    );


    setText(
        "modalPayment",

        selectedOrder.paymentMethod ||
        selectedOrder.payment ||
        "Payment Confirmed"
    );


    setText(
        "modalTotal",

        "₹" +
        formatPrice(
            getOrderTotal(
                selectedOrder
            )
        )
    );


    const modal =
        document.getElementById(
            "orderModal"
        );


    if (modal) {

        modal.classList.add(
            "show"
        );

    }

}


/* =====================================================
   CLOSE MODAL
===================================================== */

function closeModal() {

    const modal =
        document.getElementById(
            "orderModal"
        );


    if (modal) {

        modal.classList.remove(
            "show"
        );

    }

}


/* =====================================================
   RETURN ORDER
===================================================== */

function returnOrder(
    orderId
) {

    const confirmed =
        confirm(
            "Do you want to start a return for this order?"
        );


    if (!confirmed) {

        return;

    }


    window.location.href =
        "return.html?id=" +
        encodeURIComponent(
            orderId
        );

}


/* =====================================================
   SEARCH + FILTER
===================================================== */

function filterOrders() {

    const search =
        document.getElementById(
            "orderSearch"
        )
        .value
        .toLowerCase()
        .trim();


    const filter =
        document.getElementById(
            "statusFilter"
        ).value;


    const filtered =
        orders.filter(
            order => {

                const id =
                    String(
                        order.orderId ||
                        ""
                    ).toLowerCase();


                const status =
                    getStatus(
                        order
                    ).toLowerCase();


                const searchMatch =
                    id.includes(
                        search
                    );


                let statusMatch =
                    true;


                if (
                    filter !==
                    "all"
                ) {

                    statusMatch =
                        status.includes(
                            filter
                        );

                    if (
                        filter ===
                        "out"
                    ) {

                        statusMatch =
                            status.includes(
                                "out"
                            );

                    }

                }


                return (
                    searchMatch &&
                    statusMatch
                );

            }
        );


    renderOrders(
        filtered
    );

}


/* =====================================================
   SUPPORT
===================================================== */

function contactSupport() {

    window.location.href =
        "support.html";

}


/* =====================================================
   INITIALIZE
===================================================== */

function initializeOrders() {

    console.log(
        "📦 Wiz Commerce My Orders Loaded"
    );


    loadOrders();


    updateStats();


    renderOrders();


    const search =
        document.getElementById(
            "orderSearch"
        );


    if (search) {

        search.addEventListener(
            "input",
            filterOrders
        );

    }


    const filter =
        document.getElementById(
            "statusFilter"
        );


    if (filter) {

        filter.addEventListener(
            "change",
            filterOrders
        );

    }


    const close =
        document.getElementById(
            "closeModal"
        );


    if (close) {

        close.addEventListener(
            "click",
            closeModal
        );

    }


    const track =
        document.getElementById(
            "modalTrackBtn"
        );


    if (track) {

        track.addEventListener(
            "click",
            () => {

                if (
                    selectedOrder
                ) {

                    trackOrder(
                        selectedOrder.orderId
                    );

                }

            }
        );

    }


    const shopping =
        document.getElementById(
            "startShoppingBtn"
        );


    if (shopping) {

        shopping.addEventListener(
            "click",
            () => {

                window.location.href =
                    "products.html";

            }
        );

    }


    const support =
        document.getElementById(
            "supportBtn"
        );


    if (support) {

        support.addEventListener(
            "click",
            contactSupport
        );

    }

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
        initializeOrders
    );

} else {

    initializeOrders();

}


/* =====================================================
   GLOBAL
===================================================== */

window.trackOrder =
    trackOrder;

window.showOrderDetails =
    showOrderDetails;

window.returnOrder =
    returnOrder;
