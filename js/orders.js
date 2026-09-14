"use strict";


/* ==========================================
   WIZ COMMERCE - ORDERS PAGE
========================================== */


/* ==========================================
   ELEMENTS
========================================== */

const ordersList =
    document.getElementById("ordersList");

const emptyOrders =
    document.getElementById("emptyOrders");

const totalOrders =
    document.getElementById("totalOrders");

const activeOrders =
    document.getElementById("activeOrders");

const deliveredOrders =
    document.getElementById("deliveredOrders");

const returnOrders =
    document.getElementById("returnOrders");

const orderModal =
    document.getElementById("orderModal");

const modalContent =
    document.getElementById("modalContent");

const closeModal =
    document.getElementById("closeModal");


/* ==========================================
   CURRENT FILTER
========================================== */

let currentFilter = "all";


/* ==========================================
   LOAD ORDERS
========================================== */

function getOrders() {

    let orders = [];

    /*
       First try wizOrders.
    */

    try {

        const savedOrders =
            localStorage.getItem("wizOrders");

        if (savedOrders) {

            const parsed =
                JSON.parse(savedOrders);

            if (Array.isArray(parsed)) {

                orders = parsed;

            }

        }

    } catch (error) {

        console.error(
            "Error reading wizOrders:",
            error
        );

    }


    /*
       If no orders found,
       try old checkout/order storage.
    */

    if (orders.length === 0) {

        try {

            const oldOrder =
                localStorage.getItem("wizOrder");

            if (oldOrder) {

                const parsed =
                    JSON.parse(oldOrder);

                if (parsed) {

                    orders = [parsed];

                }

            }

        } catch (error) {

            console.error(
                "Error reading wizOrder:",
                error
            );

        }

    }


    return normalizeOrders(orders);

}


/* ==========================================
   NORMALIZE ORDERS
========================================== */

function normalizeOrders(orders) {

    return orders.map(
        function (order, index) {

            const items =
                Array.isArray(order.items)
                    ? order.items
                    : [];


            let firstItem =
                items.length > 0
                    ? items[0]
                    : null;


            const productName =
                order.productName ||
                order.product ||
                order.name ||
                (firstItem
                    ? firstItem.name
                    : "Wiz Commerce Product");


            const productImage =
                order.productImage ||
                order.image ||
                (firstItem
                    ? firstItem.image
                    : "");


            const price =
                Number(
                    order.total ||
                    order.amount ||
                    order.price ||
                    (
                        firstItem
                            ? firstItem.price
                            : 0
                    )
                );


            const orderId =
                order.orderId ||
                order.id ||
                (
                    "WIZ-" +
                    Date.now() +
                    "-" +
                    index
                );


            const date =
                order.date ||
                order.createdAt ||
                new Date().toLocaleDateString(
                    "en-IN"
                );


            let status =
                order.status ||
                "Processing";


            status =
                normalizeStatus(status);


            return {

                orderId: orderId,

                date: date,

                productName: productName,

                productImage: productImage,

                price: price,

                quantity:
                    Number(
                        order.quantity ||
                        (
                            firstItem
                                ? firstItem.quantity
                                : 1
                        )
                    ),

                status: status,

                paymentMethod:
                    order.paymentMethod ||
                    order.payment ||
                    "Online Payment",

                address:
                    order.address ||
                    order.shippingAddress ||
                    "Address not available",

                items: items

            };

        }
    );

}


/* ==========================================
   NORMALIZE STATUS
========================================== */

function normalizeStatus(status) {

    const value =
        String(status)
            .toLowerCase()
            .trim();


    if (
        value.includes("cancel")
    ) {

        return "Cancelled";

    }


    if (
        value.includes("deliver")
    ) {

        return "Delivered";

    }


    if (
        value.includes("return")
    ) {

        return "Return Requested";

    }


    if (
        value.includes("refund")
    ) {

        return "Refund Processing";

    }


    return "Processing";

}


/* ==========================================
   UPDATE SUMMARY
========================================== */

function updateSummary(orders) {

    const total =
        orders.length;


    const active =
        orders.filter(
            function (order) {

                return (
                    order.status !==
                    "Delivered" &&
                    order.status !==
                    "Cancelled"
                );

            }
        ).length;


    const delivered =
        orders.filter(
            function (order) {

                return (
                    order.status ===
                    "Delivered"
                );

            }
        ).length;


    const returns =
        orders.filter(
            function (order) {

                return (
                    order.status ===
                    "Return Requested" ||
                    order.status ===
                    "Refund Processing"
                );

            }
        ).length;


    totalOrders.textContent =
        total;

    activeOrders.textContent =
        active;

    deliveredOrders.textContent =
        delivered;

    returnOrders.textContent =
        returns;

}


/* ==========================================
   FILTER ORDERS
========================================== */

function filterOrders(orders) {

    if (currentFilter === "all") {

        return orders;

    }


    if (currentFilter === "active") {

        return orders.filter(
            function (order) {

                return (
                    order.status !==
                    "Delivered" &&
                    order.status !==
                    "Cancelled"
                );

            }
        );

    }


    if (currentFilter === "delivered") {

        return orders.filter(
            function (order) {

                return (
                    order.status ===
                    "Delivered"
                );

            }
        );

    }


    if (currentFilter === "cancelled") {

        return orders.filter(
            function (order) {

                return (
                    order.status ===
                    "Cancelled"
                );

            }
        );

    }


    return orders;

}


/* ==========================================
   DISPLAY ORDERS
========================================== */

function displayOrders() {

    const orders =
        getOrders();


    updateSummary(
        orders
    );


    const filteredOrders =
        filterOrders(
            orders
        );


    ordersList.innerHTML =
        "";


    if (
        filteredOrders.length === 0
    ) {

        ordersList.style.display =
            "none";

        emptyOrders.style.display =
            "block";

        return;

    }


    ordersList.style.display =
        "block";

    emptyOrders.style.display =
        "none";


    filteredOrders.forEach(
        function (order) {

            ordersList.innerHTML +=
                createOrderCard(
                    order
                );

        }
    );

}


/* ==========================================
   CREATE ORDER CARD
========================================== */

function createOrderCard(order) {

    const statusClass =
        getStatusClass(
            order.status
        );


    const safeName =
        escapeHTML(
            order.productName
        );


    const safeDate =
        escapeHTML(
            order.date
        );


    const imageHTML =
        order.productImage
            ? `
                <img
                    src="${escapeHTML(
                        order.productImage
                    )}"
                    alt="${safeName}"
                    onerror="
                        this.style.display='none';
                        this.nextElementSibling.style.display='block';
                    "
                >

                <span
                    class="product-placeholder"
                    style="display:none;"
                >
                    📦
                </span>
            `
            : `
                <span
                    class="product-placeholder"
                >
                    📦
                </span>
            `;


    const trackingButton =
        order.status === "Cancelled"
            ? ""
            : `
                <button
                    class="action-btn primary"
                    onclick="trackOrder('${escapeJS(
                        order.orderId
                    )}')"
                >
                    Track Order
                </button>
            `;


    const returnButton =
        (
            order.status === "Delivered"
        )
            ? `
                <button
                    class="action-btn"
                    onclick="returnOrder('${escapeJS(
                        order.orderId
                    )}')"
                >
                    Return
                </button>
            `
            : "";


    return `

        <article
            class="order-card"
        >

            <div
                class="order-top"
            >

                <div>

                    <div
                        class="order-id"
                    >
                        Order #${escapeHTML(
                            order.orderId
                        )}
                    </div>

                    <div
                        class="order-date"
                    >
                        Placed on ${safeDate}
                    </div>

                </div>


                <span
                    class="status ${statusClass}"
                >
                    ${escapeHTML(
                        order.status
                    )}
                </span>

            </div>


            <div
                class="order-body"
            >

                <div
                    class="order-product"
                >

                    <div
                        class="product-image"
                    >
                        ${imageHTML}
                    </div>


                    <div
                        class="product-info"
                    >

                        <h3>
                            ${safeName}
                        </h3>

                        <p>
                            Quantity:
                            ${order.quantity}
                        </p>

                        <div
                            class="product-price"
                        >
                            ₹${formatPrice(
                                order.price
                            )}
                        </div>

                    </div>

                </div>

            </div>


            <div
                class="order-bottom"
            >

                <div
                    class="order-total"
                >

                    <span>
                        Order Total
                    </span>

                    <strong>
                        ₹${formatPrice(
                            order.price
                        )}
                    </strong>

                </div>


                <div
                    class="order-actions"
                >

                    <button
                        class="action-btn"
                        onclick="viewOrder('${escapeJS(
                            order.orderId
                        )}')"
                    >
                        View Details
                    </button>

                    ${trackingButton}

                    ${returnButton}

                </div>

            </div>

        </article>

    `;

}


/* ==========================================
   STATUS CLASS
========================================== */

function getStatusClass(status) {

    if (
        status === "Delivered"
    ) {

        return "status-delivered";

    }


    if (
        status === "Cancelled"
    ) {

        return "status-cancelled";

    }


    return "status-active";

}


/* ==========================================
   VIEW ORDER
========================================== */

function viewOrder(orderId) {

    const orders =
        getOrders();


    const order =
        orders.find(
            function (item) {

                return (
                    String(
                        item.orderId
                    ) ===
                    String(orderId)
                );

            }
        );


    if (!order) {

        return;

    }


    modalContent.innerHTML = `

        <div
            class="detail-row"
        >

            <span>
                Order ID
            </span>

            <strong>
                ${escapeHTML(
                    order.orderId
                )}
            </strong>

        </div>


        <div
            class="detail-row"
        >

            <span>
                Order Date
            </span>

            <strong>
                ${escapeHTML(
                    order.date
                )}
            </strong>

        </div>


        <div
            class="detail-row"
        >

            <span>
                Product
            </span>

            <strong>
                ${escapeHTML(
                    order.productName
                )}
            </strong>

        </div>


        <div
            class="detail-row"
        >

            <span>
                Quantity
            </span>

            <strong>
                ${order.quantity}
            </strong>

        </div>


        <div
            class="detail-row"
        >

            <span>
                Total
            </span>

            <strong>
                ₹${formatPrice(
                    order.price
                )}
            </strong>

        </div>


        <div
            class="detail-row"
        >

            <span>
                Payment
            </span>

            <strong>
                ${escapeHTML(
                    order.paymentMethod
                )}
            </strong>

        </div>


        <div
            class="detail-row"
        >

            <span>
                Status
            </span>

            <strong>
                ${escapeHTML(
                    order.status
                )}
            </strong>

        </div>


        <div
            class="detail-row"
        >

            <span>
                Address
            </span>

            <strong>
                ${escapeHTML(
                    order.address
                )}
            </strong>

        </div>

    `;


    orderModal.classList.add(
        "show"
    );

}


/* ==========================================
   TRACK ORDER
========================================== */

function trackOrder(orderId) {

    window.location.href =
        "order-tracking.html?id=" +
        encodeURIComponent(
            orderId
        );

}


/* ==========================================
   RETURN ORDER
========================================== */

function returnOrder(orderId) {

    window.location.href =
        "return.html?id=" +
        encodeURIComponent(
            orderId
        );

}


/* ==========================================
   FILTER BUTTONS
========================================== */

document
    .querySelectorAll(".filter-btn")
    .forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    document
                        .querySelectorAll(
                            ".filter-btn"
                        )
                        .forEach(
                            function (item) {

                                item.classList.remove(
                                    "active"
                                );

                            }
                        );


                    button.classList.add(
                        "active"
                    );


                    currentFilter =
                        button.dataset.filter;


                    displayOrders();

                }
            );

        }
    );


/* ==========================================
   CLOSE MODAL
========================================== */

closeModal.addEventListener(
    "click",
    function () {

        orderModal.classList.remove(
            "show"
        );

    }
);


/* ==========================================
   CLOSE MODAL OUTSIDE
========================================== */

orderModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target ===
            orderModal
        ) {

            orderModal.classList.remove(
                "show"
            );

        }

    }
);


/* ==========================================
   FORMAT PRICE
========================================== */

function formatPrice(price) {

    return Number(
        price || 0
    ).toLocaleString(
        "en-IN"
    );

}


/* ==========================================
   ESCAPE HTML
========================================== */

function escapeHTML(value) {

    return String(
        value ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* ==========================================
   ESCAPE JAVASCRIPT
========================================== */

function escapeJS(value) {

    return String(
        value ?? ""
    )
        .replace(
            /\\/g,
            "\\\\"
        )
        .replace(
            /'/g,
            "\\'"
        )
        .replace(
            /"/g,
            '\\"'
        );

}


/* ==========================================
   INITIAL LOAD
========================================== */

displayOrders();
