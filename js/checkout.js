/* =====================================================
   WIZ COMMERCE
   CHECKOUT.JS
   PART 1/4
===================================================== */


/* =====================================================
   GLOBAL VARIABLES
===================================================== */

let checkoutCart = [];

let selectedDelivery = "standard";

let selectedPayment = "upi";


/* =====================================================
   LOCAL STORAGE HELPERS
===================================================== */

function getStoredCart() {

    const possibleKeys = [
        "wizCart",
        "cart",
        "shoppingCart",
        "imaCart"
    ];

    for (const key of possibleKeys) {

        const data =
            localStorage.getItem(key);

        if (!data)
            continue;

        try {

            const parsed =
                JSON.parse(data);

            if (Array.isArray(parsed)) {

                return parsed;

            }

        } catch (error) {

            console.log(
                "Cart parse error:",
                error
            );

        }

    }

    return [];

}


/* =====================================================
   SAVE CART
===================================================== */

function saveCart(cart) {

    localStorage.setItem(
        "wizCart",
        JSON.stringify(cart)
    );

}


/* =====================================================
   NORMALIZE CART ITEM
===================================================== */

function normalizeCartItem(item) {

    const productName =
        item.name ||
        item.title ||
        item.productName ||
        "Product";


    const quantity =
        Number(
            item.quantity ||
            item.qty ||
            1
        );


    const price =
        Number(
            item.price ||
            item.salePrice ||
            item.currentPrice ||
            0
        );


    const oldPrice =
        Number(
            item.oldPrice ||
            item.originalPrice ||
            item.mrp ||
            price
        );


    return {

        id:
            item.id,

        name:
            productName,

        price:
            price,

        oldPrice:
            oldPrice,

        quantity:
            quantity > 0
                ? quantity
                : 1,

        image:
            item.image ||
            item.img ||
            "",

        category:
            item.category ||
            "",

        seller:
            item.seller ||
            "Wiz Verified Seller"

    };

}


/* =====================================================
   LOAD CART
===================================================== */

function loadCheckoutCart() {

    const rawCart =
        getStoredCart();


    checkoutCart =
        rawCart.map(
            normalizeCartItem
        );


    if (
        checkoutCart.length === 0
    ) {

        showEmptyCheckout();

        return false;

    }


    return true;

}


/* =====================================================
   EMPTY CHECKOUT
===================================================== */

function showEmptyCheckout() {

    const container =
        document.getElementById(
            "checkoutItems"
        );


    if (container) {

        container.innerHTML = `

            <div class="empty-checkout">

                <div style="
                    font-size:45px;
                    margin-bottom:12px;
                ">
                    🛒
                </div>

                <h2>
                    Your cart is empty
                </h2>

                <p>
                    Add products to continue
                    checkout.
                </p>

                <button
                    onclick="goToProducts()"
                    style="
                        margin-top:15px;
                        padding:12px 20px;
                        border:0;
                        border-radius:8px;
                        background:#1769e0;
                        color:white;
                        cursor:pointer;
                    "
                >
                    Continue Shopping
                </button>

            </div>

        `;

    }


    const placeButton =
        document.querySelector(
            ".place-order-btn"
        );


    if (placeButton) {

        placeButton.disabled =
            true;

        placeButton.style.opacity =
            "0.5";

    }

}


/* =====================================================
   CALCULATE PRODUCT TOTAL
===================================================== */

function getProductTotal() {

    return checkoutCart.reduce(
        (
            total,
            item
        ) => {

            return total +
                (
                    Number(item.price) *
                    Number(item.quantity)
                );

        },
        0
    );

}


/* =====================================================
   CALCULATE ORIGINAL TOTAL
===================================================== */

function getOriginalTotal() {

    return checkoutCart.reduce(
        (
            total,
            item
        ) => {

            return total +
                (
                    Number(item.oldPrice) *
                    Number(item.quantity)
                );

        },
        0
    );

}


/* =====================================================
   CALCULATE DISCOUNT
===================================================== */

function getDiscount() {

    const original =
        getOriginalTotal();


    const productTotal =
        getProductTotal();


    return Math.max(
        0,
        original - productTotal
    );

           }
/* =====================================================
   PART 2/4
   RENDER PRODUCTS + PRICE
===================================================== */


/* =====================================================
   RENDER CHECKOUT PRODUCTS
===================================================== */

function renderCheckoutProducts() {

    const container =
        document.getElementById(
            "checkoutItems"
        );


    if (!container)
        return;


    if (
        checkoutCart.length === 0
    ) {

        return;

    }


    container.innerHTML =
        checkoutCart.map(
            item => {

                const total =
                    item.price *
                    item.quantity;


                return `

                    <div class="checkout-product">

                        <div class="checkout-product-image">

                            ${
                                item.image
                                ?
                                `
                                <img
                                    src="${item.image}"
                                    alt="${item.name}"
                                >
                                `
                                :
                                `
                                <div>
                                    📦
                                </div>
                                `
                            }

                        </div>


                        <div class="checkout-product-info">

                            <h3>
                                ${item.name}
                            </h3>

                            <p>
                                ${item.seller}
                            </p>

                            <span>
                                Qty: ${item.quantity}
                            </span>

                        </div>


                        <div class="checkout-product-price">

                            <strong>
                                ₹${formatPrice(total)}
                            </strong>

                            ${
                                item.oldPrice >
                                item.price
                                ?
                                `
                                <small>
                                    ₹${formatPrice(
                                        item.oldPrice *
                                        item.quantity
                                    )}
                                </small>
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


/* =====================================================
   CALCULATE CHECKOUT
===================================================== */

function calculateCheckout() {

    const productTotal =
        getProductTotal();


    const originalTotal =
        getOriginalTotal();


    const discount =
        Math.max(
            0,
            originalTotal -
            productTotal
        );


    /*
       STANDARD DELIVERY = FREE
       EXPRESS DELIVERY = ₹49
    */

    let delivery = 0;


    if (
        selectedDelivery ===
        "express"
    ) {

        delivery = 49;

    }


    /*
       Platform charge
       Demo amount
    */

    const platform = 0;


    const finalPrice =
        productTotal +
        delivery +
        platform;


    return {

        originalTotal:
            originalTotal,

        productTotal:
            productTotal,

        discount:
            discount,

        delivery:
            delivery,

        platform:
            platform,

        finalPrice:
            finalPrice

    };

}


/* =====================================================
   UPDATE PRICE UI
===================================================== */

function updateCheckoutPrices() {

    const pricing =
        calculateCheckout();


    setPrice(
        "originalTotal",
        pricing.originalTotal
    );


    setPrice(
        "productTotal",
        pricing.productTotal
    );


    setPrice(
        "discountAmount",
        pricing.discount
    );


    setDeliveryPrice(
        "deliveryCharge",
        pricing.delivery
    );


    setPrice(
        "platformCharge",
        pricing.platform
    );


    setPrice(
        "finalPrice",
        pricing.finalPrice
    );


    /*
       Support alternative IDs
    */

    setPrice(
        "subtotal",
        pricing.productTotal
    );


    setPrice(
        "totalAmount",
        pricing.finalPrice
    );


    setPrice(
        "grandTotal",
        pricing.finalPrice
    );


    setPrice(
        "checkoutTotal",
        pricing.finalPrice
    );


    updatePlaceOrderButton(
        pricing.finalPrice
    );

}


/* =====================================================
   SET PRICE
===================================================== */

function setPrice(
    id,
    amount
) {

    const element =
        document.getElementById(
            id
        );


    if (!element)
        return;


    element.textContent =
        `₹${formatPrice(amount)}`;

}


/* =====================================================
   DELIVERY PRICE
===================================================== */

function setDeliveryPrice(
    id,
    amount
) {

    const element =
        document.getElementById(
            id
        );


    if (!element)
        return;


    if (
        Number(amount) === 0
    ) {

        element.textContent =
            "FREE";

        element.classList.add(
            "free"
        );

    } else {

        element.textContent =
            `₹${formatPrice(amount)}`;

        element.classList.remove(
            "free"
        );

    }

}


/* =====================================================
   FORMAT PRICE
===================================================== */

function formatPrice(
    amount
) {

    return Number(
        amount || 0
    ).toLocaleString(
        "en-IN"
    );

}


/* =====================================================
   UPDATE PLACE ORDER BUTTON
===================================================== */

function updatePlaceOrderButton(
    amount
) {

    const button =
        document.querySelector(
            ".place-order-btn"
        );


    if (!button)
        return;


    button.innerHTML = `

        <span>
            🔒
        </span>

        <span>
            Place Order · ₹${formatPrice(amount)}
        </span>

    `;

}


/* =====================================================
   DELIVERY METHOD
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

                option.classList.toggle(
                    "active",
                    option.dataset.delivery ===
                    type
                );

            }
        );


    updateCheckoutPrices();

}
/* =====================================================
   PART 3/4
   ADDRESS + PAYMENT + ORDER
===================================================== */


/* =====================================================
   SELECT PAYMENT
===================================================== */

function selectCheckoutPayment(
    method
) {

    selectedPayment =
        method;


    document
        .querySelectorAll(
            ".checkout-payment-option"
        )
        .forEach(
            option => {

                option.classList.toggle(
                    "active",
                    option.dataset.payment ===
                    method
                );

            }
        );


    document
        .querySelectorAll(
            ".payment-option"
        )
        .forEach(
            option => {

                option.classList.toggle(
                    "active",
                    option.dataset.payment ===
                    method
                );

            }
        );

}


/* =====================================================
   GET ADDRESS
===================================================== */

function getCheckoutAddress() {

    const saved =
        localStorage.getItem(
            "wizDeliveryAddress"
        );


    if (saved) {

        try {

            return JSON.parse(
                saved
            );

        } catch (error) {

            console.log(
                "Address parse error"
            );

        }

    }


    /*
       Try form fields
    */

    const name =
        getValue(
            "fullName"
        );


    const phone =
        getValue(
            "phone"
        );


    const address =
        getValue(
            "address"
        );


    const city =
        getValue(
            "city"
        );


    const state =
        getValue(
            "state"
        );


    const pincode =
        getValue(
            "pincode"
        );


    if (
        name ||
        phone ||
        address ||
        city ||
        state ||
        pincode
    ) {

        return {

            name,
            phone,
            address,
            city,
            state,
            pincode

        };

    }


    return null;

}


/* =====================================================
   GET INPUT VALUE
===================================================== */

function getValue(
    id
) {

    const element =
        document.getElementById(
            id
        );


    return element
        ? element.value.trim()
        : "";

}


/* =====================================================
   SAVE ADDRESS
===================================================== */

function saveDeliveryAddress() {

    const name =
        getValue(
            "fullName"
        );


    const phone =
        getValue(
            "phone"
        );


    const address =
        getValue(
            "address"
        );


    const city =
        getValue(
            "city"
        );


    const state =
        getValue(
            "state"
        );


    const pincode =
        getValue(
            "pincode"
        );


    if (!name) {

        showCheckoutToast(
            "⚠️ Enter your full name"
        );

        return false;

    }


    if (
        phone.length < 10
    ) {

        showCheckoutToast(
            "⚠️ Enter valid phone number"
        );

        return false;

    }


    if (!address) {

        showCheckoutToast(
            "⚠️ Enter delivery address"
        );

        return false;

    }


    if (!city) {

        showCheckoutToast(
            "⚠️ Enter city"
        );

        return false;

    }


    if (!state) {

        showCheckoutToast(
            "⚠️ Enter state"
        );

        return false;

    }


    if (
        pincode.length !== 6
    ) {

        showCheckoutToast(
            "⚠️ Enter valid pincode"
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
        "wizDeliveryAddress",
        JSON.stringify(
            deliveryAddress
        )
    );


    renderSavedAddress(
        deliveryAddress
    );


    return true;

}


/* =====================================================
   RENDER SAVED ADDRESS
===================================================== */

function renderSavedAddress(
    address
) {

    const element =
        document.getElementById(
            "savedAddress"
        );


    if (!element)
        return;


    element.innerHTML = `

        <strong>
            ${address.name}
        </strong>

        <p>
            ${address.address},
            ${address.city},
            ${address.state}
            - ${address.pincode}
        </p>

        <small>
            📞 ${address.phone}
        </small>

    `;

}


/* =====================================================
   LOAD SAVED ADDRESS
===================================================== */

function loadSavedAddress() {

    const address =
        getCheckoutAddress();


    if (!address)
        return;


    renderSavedAddress(
        address
    );


    /*
       Fill form fields
    */

    setValue(
        "fullName",
        address.name
    );


    setValue(
        "phone",
        address.phone
    );


    setValue(
        "address",
        address.address
    );


    setValue(
        "city",
        address.city
    );


    setValue(
        "state",
        address.state
    );


    setValue(
        "pincode",
        address.pincode
    );


}


/* =====================================================
   SET INPUT VALUE
===================================================== */

function setValue(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );


    if (element) {

        element.value =
            value || "";

    }

}


/* =====================================================
   PLACE ORDER
===================================================== */

function placeOrder() {

    /*
       Make sure cart exists
    */

    if (
        checkoutCart.length === 0
    ) {

        showCheckoutToast(
            "⚠️ Your cart is empty"
        );

        return;

    }


    /*
       Save address first
    */

    const address =
        getCheckoutAddress();


    if (!address) {

        showCheckoutToast(
            "⚠️ Please enter delivery address"
        );

        const addressSection =
            document.querySelector(
                ".address-section"
            );


        if (addressSection) {

            addressSection.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

        }

        return;

    }


    /*
       Validate address
    */

    if (
        !address.name ||
        !address.phone ||
        !address.address ||
        !address.city ||
        !address.state ||
        !address.pincode
    ) {

        showCheckoutToast(
            "⚠️ Please complete delivery address"
        );

        return;

    }


    /*
       Calculate final price
    */

    const pricing =
        calculateCheckout();


    /*
       Create payment order
    */

    const paymentOrder = {

        items:
            checkoutCart,

        address:
            address,

        delivery:
            selectedDelivery,

        payment:
            selectedPayment,

        pricing:
            pricing,

        createdAt:
            new Date().toISOString()

    };


    /*
       Save for payment page
    */

    localStorage.setItem(
        "wizPaymentOrder",
        JSON.stringify(
            paymentOrder
        )
    );


    /*
       Disable button
    */

    const button =
        document.querySelector(
            ".place-order-btn"
        );


    if (button) {

        button.disabled =
            true;

        button.innerHTML = `
            <span>
                ⏳
            </span>

            <span>
                Opening Payment...
            </span>
        `;

    }


    /*
       Open Payment Page
    */

    setTimeout(
        () => {

            window.location.href =
                "payment.html";

        },
        400
    );

}
/* =====================================================
   PART 4/4
   TOAST + INIT + NAVIGATION
===================================================== */


/* =====================================================
   TOAST
===================================================== */

function showCheckoutToast(
    message
) {

    let toast =
        document.getElementById(
            "checkoutToast"
        );


    /*
       Create toast automatically
       if HTML doesn't contain one
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

        toast.style.bottom =
            "20px";

        toast.style.right =
            "20px";

        toast.style.background =
            "#111827";

        toast.style.color =
            "#ffffff";

        toast.style.padding =
            "13px 18px";

        toast.style.borderRadius =
            "9px";

        toast.style.fontSize =
            "12px";

        toast.style.zIndex =
            "99999";

        toast.style.transition =
            "0.3s";

        document.body.appendChild(
            toast
        );

    }


    toast.textContent =
        message;

    toast.style.opacity =
        "1";

    toast.style.transform =
        "translateY(0)";


    clearTimeout(
        window.checkoutToastTimer
    );


    window.checkoutToastTimer =
        setTimeout(
            () => {

                toast.style.opacity =
                    "0";

                toast.style.transform =
                    "translateY(10px)";

            },
            2500
        );

}


/* =====================================================
   PRODUCTS PAGE
===================================================== */

function goToProducts() {

    window.location.href =
        "products.html";

}


/* =====================================================
   BACK TO CART
===================================================== */

function goBackToCart() {

    window.location.href =
        "cart.html";

}


/* =====================================================
   AUTO PLACE ORDER BUTTON
===================================================== */

function setupPlaceOrderButton() {

    const button =
        document.querySelector(
            ".place-order-btn"
        );


    if (!button)
        return;


    /*
       Remove old onclick
       event conflicts
    */

    button.onclick =
        null;


    button.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            event.stopPropagation();

            placeOrder();

        }
    );

}


/* =====================================================
   DELIVERY OPTIONS
===================================================== */

function setupDeliveryOptions() {

    document
        .querySelectorAll(
            ".delivery-option"
        )
        .forEach(
            option => {

                option.addEventListener(
                    "click",
                    () => {

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


/* =====================================================
   PAYMENT OPTIONS
===================================================== */

function setupPaymentOptions() {

    document
        .querySelectorAll(
            ".checkout-payment-option, .payment-option"
        )
        .forEach(
            option => {

                option.addEventListener(
                    "click",
                    () => {

                        const method =
                            option.dataset.payment ||
                            "upi";

                        selectCheckoutPayment(
                            method
                        );

                    }
                );

            }
        );

}


/* =====================================================
   CHECKOUT PAGE ANIMATION
===================================================== */

function checkoutAnimation() {

    const elements =
        document.querySelectorAll(
            ".checkout-card, .checkout-summary, .checkout-product"
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
                index * 70
            );

        }
    );

}


/* =====================================================
   INITIALIZE CHECKOUT
===================================================== */

function initializeCheckout() {

    console.log(
        "🛒 Wiz Commerce Checkout Loading..."
    );


    /*
       Load cart
    */

    const hasCart =
        loadCheckoutCart();


    if (!hasCart) {

        return;

    }


    /*
       Render products
    */

    renderCheckoutProducts();


    /*
       Load address
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
        "upi";


    /*
       Calculate all prices
    */

    updateCheckoutPrices();


    /*
       Setup buttons
    */

    setupPlaceOrderButton();

    setupDeliveryOptions();

    setupPaymentOptions();


    /*
       Animation
    */

    checkoutAnimation();


    console.log(
        "✅ Checkout Ready"
    );

}


/* =====================================================
   DOM READY
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        initializeCheckout();

    }
);


/* =====================================================
   GLOBAL FUNCTIONS
===================================================== */

window.placeOrder =
    placeOrder;

window.selectDelivery =
    selectDelivery;

window.selectCheckoutPayment =
    selectCheckoutPayment;

window.saveDeliveryAddress =
    saveDeliveryAddress;

window.goBackToCart =
    goBackToCart;

window.goToProducts =
    goToProducts;

window.calculateCheckout =
    calculateCheckout;
