/* =========================================================
   WIZ COMMERCE
   CHECKOUT.JS
   PART 1 OF 4
========================================================= */

"use strict";

/* =========================================================
   GLOBAL DATA
========================================================= */

let checkoutCart = [];

let selectedDelivery = "standard";

let selectedPayment = "cod";


/* =========================================================
   STORAGE KEYS
========================================================= */

const CART_KEYS = [
    "wizCart",
    "cart",
    "shoppingCart",
    "imaCart",
    "cartItems"
];

const ADDRESS_KEY = "wizDeliveryAddress";

const ORDER_KEY = "wizPaymentOrder";


/* =========================================================
   GET CART FROM LOCAL STORAGE
========================================================= */

function getCartFromStorage() {

    for (const key of CART_KEYS) {

        const stored =
            localStorage.getItem(key);

        if (!stored) {
            continue;
        }

        try {

            const data =
                JSON.parse(stored);

            if (Array.isArray(data) && data.length > 0) {

                console.log(
                    "🛒 Cart found:",
                    key
                );

                return data;

            }

        } catch (error) {

            console.warn(
                "Cart read error:",
                key
            );

        }

    }

    return [];

}


/* =========================================================
   NORMALIZE PRODUCT
========================================================= */

function normalizeProduct(item) {

    const price =
        Number(
            item.price ??
            item.salePrice ??
            item.currentPrice ??
            item.sellingPrice ??
            0
        );

    const oldPrice =
        Number(
            item.oldPrice ??
            item.originalPrice ??
            item.mrp ??
            price
        );

    const quantity =
        Number(
            item.quantity ??
            item.qty ??
            1
        );


    return {

        id:
            item.id ??
            item.productId ??
            Date.now(),

        name:
            item.name ??
            item.title ??
            item.productName ??
            "Product",

        price:
            price,

        oldPrice:
            oldPrice,

        quantity:
            quantity > 0
                ? quantity
                : 1,

        image:
            item.image ??
            item.img ??
            item.imageUrl ??
            "assets/images/product.jpg",

        seller:
            item.seller ??
            item.sellerName ??
            "Wiz Verified Seller",

        category:
            item.category ??
            "General"

    };

}


/* =========================================================
   LOAD CHECKOUT CART
========================================================= */

function loadCheckoutCart() {

    const rawCart =
        getCartFromStorage();


    checkoutCart =
        rawCart.map(
            normalizeProduct
        );


    console.log(
        "Checkout cart:",
        checkoutCart
    );


    if (checkoutCart.length === 0) {

        showEmptyCart();

        return false;

    }


    return true;

}


/* =========================================================
   TOTAL PRODUCT PRICE
========================================================= */

function getSubtotal() {

    return checkoutCart.reduce(
        function(total, product) {

            return total +
                (
                    product.price *
                    product.quantity
                );

        },
        0
    );

}


/* =========================================================
   ORIGINAL PRICE
========================================================= */

function getOriginalTotal() {

    return checkoutCart.reduce(
        function(total, product) {

            return total +
                (
                    product.oldPrice *
                    product.quantity
                );

        },
        0
    );

}


/* =========================================================
   DISCOUNT
========================================================= */

function getDiscount() {

    const original =
        getOriginalTotal();

    const subtotal =
        getSubtotal();


    return Math.max(
        0,
        original - subtotal
    );

}


/* =========================================================
   PRICE FORMAT
========================================================= */

function formatPrice(value) {

    return Number(
        value || 0
    ).toLocaleString(
        "en-IN"
    );

}


/* =========================================================
   EMPTY CART
========================================================= */

function showEmptyCart() {

    const container =
        document.getElementById(
            "checkoutItems"
        );


    if (container) {

        container.innerHTML = `

            <div class="checkout-empty">

                <div class="empty-icon">
                    🛒
                </div>

                <h2>
                    Your Cart is Empty
                </h2>

                <p>
                    Please add products
                    before checkout.
                </p>

                <button
                    type="button"
                    onclick="goToProducts()"
                >
                    Continue Shopping
                </button>

            </div>

        `;

    }


    const button =
        document.querySelector(
            ".place-order-btn"
        );


    if (button) {

        button.disabled = true;

    }

}
/* =========================================================
   PART 2 OF 4
   RENDER PRODUCTS + PRICE SUMMARY
========================================================= */


/* =========================================================
   RENDER CHECKOUT PRODUCTS
========================================================= */

function renderCheckoutProducts() {

    const container =
        document.getElementById(
            "checkoutItems"
        );


    if (!container) {

        console.warn(
            "checkoutItems element not found"
        );

        return;

    }


    container.innerHTML =
        checkoutCart.map(
            function(product) {

                const itemTotal =
                    product.price *
                    product.quantity;


                return `

                    <div class="checkout-product">

                        <div class="checkout-product-image">

                            <img
                                src="${product.image}"
                                alt="${product.name}"
                                onerror="this.style.display='none'"
                            >

                        </div>


                        <div class="checkout-product-info">

                            <h3>
                                ${product.name}
                            </h3>

                            <p>
                                ${product.seller}
                            </p>

                            <span>
                                Quantity:
                                ${product.quantity}
                            </span>

                        </div>


                        <div class="checkout-product-price">

                            <strong>
                                ₹${formatPrice(itemTotal)}
                            </strong>

                            ${
                                product.oldPrice >
                                product.price
                                ?
                                `
                                <del>
                                    ₹${formatPrice(
                                        product.oldPrice *
                                        product.quantity
                                    )}
                                </del>
                                `
                                :
                                ""
                            }

                        </div>

                    </div>

                `;

            }
        ).join("");

}


/* =========================================================
   CALCULATE ALL PRICES
========================================================= */

function calculatePrices() {

    const subtotal =
        getSubtotal();


    const originalTotal =
        getOriginalTotal();


    const discount =
        getDiscount();


    let deliveryCharge = 0;


    if (
        selectedDelivery ===
        "express"
    ) {

        deliveryCharge = 49;

    }


    const platformCharge = 0;


    const finalTotal =
        subtotal +
        deliveryCharge +
        platformCharge;


    return {

        originalTotal:
            originalTotal,

        subtotal:
            subtotal,

        discount:
            discount,

        deliveryCharge:
            deliveryCharge,

        platformCharge:
            platformCharge,

        finalTotal:
            finalTotal

    };

}


/* =========================================================
   UPDATE PRICE ELEMENT
========================================================= */

function updatePriceElement(
    id,
    value
) {

    const element =
        document.getElementById(id);


    if (!element) {
        return;
    }


    element.textContent =
        "₹" +
        formatPrice(value);

}


/* =========================================================
   UPDATE DELIVERY ELEMENT
========================================================= */

function updateDeliveryElement(
    id,
    value
) {

    const element =
        document.getElementById(id);


    if (!element) {
        return;
    }


    if (value === 0) {

        element.textContent =
            "FREE";

    } else {

        element.textContent =
            "₹" +
            formatPrice(value);

    }

}


/* =========================================================
   UPDATE CHECKOUT SUMMARY
========================================================= */

function updateCheckoutSummary() {

    const prices =
        calculatePrices();


    console.log(
        "💰 Checkout prices:",
        prices
    );


    /* Original price */

    updatePriceElement(
        "originalTotal",
        prices.originalTotal
    );


    /* Subtotal */

    updatePriceElement(
        "subtotal",
        prices.subtotal
    );


    updatePriceElement(
        "productTotal",
        prices.subtotal
    );


    /* Discount */

    updatePriceElement(
        "discountAmount",
        prices.discount
    );


    updatePriceElement(
        "discount",
        prices.discount
    );


    /* Delivery */

    updateDeliveryElement(
        "deliveryCharge",
        prices.deliveryCharge
    );


    /* Platform charge */

    updatePriceElement(
        "platformCharge",
        prices.platformCharge
    );


    /* Final total */

    updatePriceElement(
        "finalPrice",
        prices.finalTotal
    );


    updatePriceElement(
        "totalAmount",
        prices.finalTotal
    );


    updatePriceElement(
        "grandTotal",
        prices.finalTotal
    );


    updatePriceElement(
        "checkoutTotal",
        prices.finalTotal
    );


    /* Button amount */

    updatePlaceOrderButton(
        prices.finalTotal
    );

}


/* =========================================================
   PLACE ORDER BUTTON TEXT
========================================================= */

function updatePlaceOrderButton(
    total
) {

    const button =
        document.querySelector(
            ".place-order-btn"
        );


    if (!button) {
        return;
    }


    button.innerHTML = `

        🔒
        <span>
            Place Order · ₹${formatPrice(total)}
        </span>

    `;

}


/* =========================================================
   DELIVERY SELECTION
========================================================= */

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
            function(option) {

                option.classList.toggle(
                    "active",
                    option.dataset.delivery ===
                    type
                );

            }
        );


    updateCheckoutSummary();

}


/* =========================================================
   PAYMENT SELECTION
========================================================= */

function selectPayment(
    method
) {

    selectedPayment =
        method;


    document
        .querySelectorAll(
            ".payment-option"
        )
        .forEach(
            function(option) {

                option.classList.toggle(
                    "active",
                    option.dataset.payment ===
                    method
                );

            }
        );

       }
/* =========================================================
   PART 3 OF 4
   ADDRESS + ORDER CREATION
========================================================= */


/* =========================================================
   GET INPUT
========================================================= */

function getInputValue(id) {

    const element =
        document.getElementById(id);


    if (!element) {
        return "";
    }


    return element.value.trim();

}


/* =========================================================
   SAVE ADDRESS
========================================================= */

function saveAddress() {

    const name =
        getInputValue(
            "fullName"
        );


    const phone =
        getInputValue(
            "phone"
        );


    const address =
        getInputValue(
            "address"
        );


    const city =
        getInputValue(
            "city"
        );


    const state =
        getInputValue(
            "state"
        );


    const pincode =
        getInputValue(
            "pincode"
        );


    if (!name) {

        showToast(
            "Please enter your name"
        );

        return false;

    }


    if (
        !/^[0-9]{10}$/.test(phone)
    ) {

        showToast(
            "Please enter a valid 10-digit phone number"
        );

        return false;

    }


    if (!address) {

        showToast(
            "Please enter your address"
        );

        return false;

    }


    if (!city) {

        showToast(
            "Please enter your city"
        );

        return false;

    }


    if (!state) {

        showToast(
            "Please enter your state"
        );

        return false;

    }


    if (
        !/^[0-9]{6}$/.test(pincode)
    ) {

        showToast(
            "Please enter a valid 6-digit pincode"
        );

        return false;

    }


    const deliveryAddress = {

        name:
            name,

        phone:
            phone,

        address:
            address,

        city:
            city,

        state:
            state,

        pincode:
            pincode

    };


    localStorage.setItem(
        ADDRESS_KEY,
        JSON.stringify(
            deliveryAddress
        )
    );


    return deliveryAddress;

}


/* =========================================================
   LOAD SAVED ADDRESS
========================================================= */

function loadSavedAddress() {

    const saved =
        localStorage.getItem(
            ADDRESS_KEY
        );


    if (!saved) {
        return;
    }


    try {

        const address =
            JSON.parse(saved);


        setInput(
            "fullName",
            address.name
        );


        setInput(
            "phone",
            address.phone
        );


        setInput(
            "address",
            address.address
        );


        setInput(
            "city",
            address.city
        );


        setInput(
            "state",
            address.state
        );


        setInput(
            "pincode",
            address.pincode
        );


    } catch (error) {

        console.warn(
            "Saved address error"
        );

    }

}


/* =========================================================
   SET INPUT
========================================================= */

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


/* =========================================================
   GET SAVED ADDRESS
========================================================= */

function getSavedAddress() {

    const saved =
        localStorage.getItem(
            ADDRESS_KEY
        );


    if (!saved) {
        return null;
    }


    try {

        return JSON.parse(
            saved
        );

    } catch (error) {

        return null;

    }

}


/* =========================================================
   PLACE ORDER
========================================================= */

function placeOrder() {

    console.log(
        "🛒 Place Order clicked"
    );


    if (
        checkoutCart.length === 0
    ) {

        showToast(
            "Your cart is empty"
        );

        return;

    }


    /*
       Validate address
    */

    const address =
        saveAddress();


    if (!address) {

        return;

    }


    /*
       Calculate final price
    */

    const prices =
        calculatePrices();


    /*
       Generate order ID
    */

    const orderId =
        "WIZ" +
        Date.now();


    /*
       Create order object
    */

    const order = {

        orderId:
            orderId,

        items:
            checkoutCart,

        address:
            address,

        deliveryMethod:
            selectedDelivery,

        paymentMethod:
            selectedPayment,

        pricing:
            prices,

        status:
            "Payment Pending",

        createdAt:
            new Date().toISOString()

    };


    /*
       Save order for payment page
    */

    localStorage.setItem(
        ORDER_KEY,
        JSON.stringify(
            order
        )
    );


    /*
       Also save current order
    */

    localStorage.setItem(
        "currentOrder",
        JSON.stringify(
            order
        )
    );


    console.log(
        "✅ Order created:",
        order
    );


    /*
       Button loading
    */

    const button =
        document.querySelector(
            ".place-order-btn"
        );


    if (button) {

        button.disabled =
            true;

        button.innerHTML = `
            ⏳ Opening Payment...
        `;

    }


    /*
       Open payment page
    */

    setTimeout(
        function() {

            window.location.href =
                "payment.html";

        },
        500
    );

}


/* =========================================================
   SAVE ADDRESS BUTTON
========================================================= */

function handleSaveAddress() {

    const address =
        saveAddress();


    if (address) {

        showToast(
            "✅ Address saved successfully"
        );

    }

       }
/* =========================================================
   PART 4 OF 4
   BUTTONS + ANIMATION + INITIALIZATION
========================================================= */


/* =========================================================
   TOAST MESSAGE
========================================================= */

function showToast(
    message
) {

    let toast =
        document.getElementById(
            "wizCheckoutToast"
        );


    if (!toast) {

        toast =
            document.createElement(
                "div"
            );

        toast.id =
            "wizCheckoutToast";


        toast.style.position =
            "fixed";

        toast.style.left =
            "50%";

        toast.style.bottom =
            "25px";

        toast.style.transform =
            "translateX(-50%)";

        toast.style.background =
            "#111827";

        toast.style.color =
            "#ffffff";

        toast.style.padding =
            "13px 20px";

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


    toast.style.opacity =
        "1";


    clearTimeout(
        window.wizToastTimer
    );


    window.wizToastTimer =
        setTimeout(
            function() {

                toast.style.opacity =
                    "0";

            },
            2500
        );

}


/* =========================================================
   PLACE ORDER BUTTON SETUP
========================================================= */

function setupPlaceOrder() {

    const button =
        document.querySelector(
            ".place-order-btn"
        );


    if (!button) {

        console.warn(
            "Place order button not found"
        );

        return;

    }


    /*
       Prevent HTML onclick
       conflicts
    */

    button.onclick = null;


    button.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            event.stopPropagation();

            placeOrder();

        }
    );

}


/* =========================================================
   DELIVERY BUTTON SETUP
========================================================= */

function setupDelivery() {

    document
        .querySelectorAll(
            ".delivery-option"
        )
        .forEach(
            function(option) {

                option.addEventListener(
                    "click",
                    function() {

                        const type =
                            option.dataset.delivery ||
                            "standard";


                        selectDelivery(
                            type
                        );

                    }
                );

            }
        );

}


/* =========================================================
   PAYMENT BUTTON SETUP
========================================================= */

function setupPayment() {

    document
        .querySelectorAll(
            ".payment-option"
        )
        .forEach(
            function(option) {

                option.addEventListener(
                    "click",
                    function() {

                        const method =
                            option.dataset.payment ||
                            "cod";


                        selectPayment(
                            method
                        );

                    }
                );

            }
        );

}


/* =========================================================
   CHECKOUT ANIMATION
========================================================= */

function runCheckoutAnimation() {

    const elements =
        document.querySelectorAll(
            ".checkout-card, .checkout-product, .checkout-summary, .checkout-section"
        );


    elements.forEach(
        function(element, index) {

            element.style.opacity =
                "0";

            element.style.transform =
                "translateY(15px)";


            setTimeout(
                function() {

                    element.style.transition =
                        "all .4s ease";

                    element.style.opacity =
                        "1";

                    element.style.transform =
                        "translateY(0)";

                },
                index * 70
            );

        }
    );

}


/* =========================================================
   BACK TO CART
========================================================= */

function goBackToCart() {

    window.location.href =
        "cart.html";

}


/* =========================================================
   GO TO PRODUCTS
========================================================= */

function goToProducts() {

    window.location.href =
        "products.html";

}


/* =========================================================
   INITIALIZE CHECKOUT
========================================================= */

function initializeCheckout() {

    console.log(
        "🛒 Wiz Commerce Checkout Loading..."
    );


    /*
       Load cart
    */

    const cartLoaded =
        loadCheckoutCart();


    if (!cartLoaded) {

        console.log(
            "⚠️ No products in checkout"
        );

        return;

    }


    /*
       Render products
    */

    renderCheckoutProducts();


    /*
       Load saved address
    */

    loadSavedAddress();


    /*
       Default delivery
    */

    selectedDelivery =
        "standard";


    /*
       Default payment
    */

    selectedPayment =
        "cod";


    /*
       Calculate price
    */

    updateCheckoutSummary();


    /*
       Setup buttons
    */

    setupPlaceOrder();

    setupDelivery();

    setupPayment();


    /*
       Animation
    */

    runCheckoutAnimation();


    console.log(
        "✅ Checkout Ready"
    );

}


/* =========================================================
   DOM READY
========================================================= */

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


/* =========================================================
   GLOBAL FUNCTIONS
========================================================= */

window.placeOrder =
    placeOrder;

window.selectDelivery =
    selectDelivery;

window.selectPayment =
    selectPayment;

window.saveAddress =
    saveAddress;

window.handleSaveAddress =
    handleSaveAddress;

window.goBackToCart =
    goBackToCart;

window.goToProducts =
    goToProducts;
