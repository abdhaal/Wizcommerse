/* =====================================================
   WIZ COMMERCE
   CART JS
   PART 1/4
   Load Cart + Render Products
===================================================== */


/* =====================================================
   GET CART
===================================================== */

function getCart() {

    return JSON.parse(
        localStorage.getItem(
            "wizCart"
        )
    ) || [];

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
   RENDER CART
===================================================== */

function renderCart() {

    const cart =
        getCart();


    const container =
        document.getElementById(
            "cartItems"
        );


    const emptyCart =
        document.getElementById(
            "emptyCart"
        );


    if (!container) return;


    if (cart.length === 0) {

        container.innerHTML = "";

        if (emptyCart)
            emptyCart.style.display =
                "block";

        updateSummary();

        return;

    }


    if (emptyCart)
        emptyCart.style.display =
            "none";


    container.innerHTML =
        cart.map(
            (item, index) => `

        <div
            class="cart-item"
            data-id="${item.id}"
        >

            <div
                class="product-image"
            >
                ${item.icon || "📦"}
            </div>


            <div
                class="product-info"
            >

                <h3>
                    ${item.name}
                </h3>

                <div
                    class="product-category"
                >
                    ${item.category || "Product"}
                </div>

                <div
                    class="product-price"
                >
                    ₹${item.price}

                    <span
                        class="old-price"
                    >
                        ₹${item.oldPrice || item.price}
                    </span>
                </div>


                <div
                    class="quantity-box"
                >

                    <button
                        onclick="changeQuantity(${item.id}, -1)"
                    >
                        −
                    </button>

                    <span>
                        ${item.quantity}
                    </span>

                    <button
                        onclick="changeQuantity(${item.id}, 1)"
                    >
                        +
                    </button>

                </div>

            </div>


            <div
                class="item-actions"
            >

                <div
                    class="item-total"
                >
                    ₹${item.price * item.quantity}
                </div>

                <button
                    class="remove-btn"
                    onclick="removeItem(${item.id})"
                >
                    🗑 Remove
                </button>

            </div>

        </div>

    `
        ).join("");


    updateSummary();

}
/* =====================================================
   PART 2/4
   Quantity + Remove + Clear Cart
===================================================== */


/* =====================================================
   CHANGE QUANTITY
===================================================== */

function changeQuantity(
    productId,
    amount
) {

    const cart =
        getCart();


    const item =
        cart.find(
            product =>
                product.id ===
                productId
        );


    if (!item) return;


    item.quantity += amount;


    if (item.quantity <= 0) {

        const index =
            cart.indexOf(item);

        cart.splice(
            index,
            1
        );

        showToast(
            "Product removed from cart"
        );

    }


    saveCart(cart);

    renderCart();

}


/* =====================================================
   REMOVE ITEM
===================================================== */

function removeItem(
    productId
) {

    let cart =
        getCart();


    const item =
        cart.find(
            product =>
                product.id ===
                productId
        );


    if (!item) return;


    cart =
        cart.filter(
            product =>
                product.id !==
                productId
        );


    saveCart(cart);


    showToast(
        `${item.name} removed from cart`
    );


    renderCart();

}


/* =====================================================
   CLEAR CART
===================================================== */

function clearCart() {

    const cart =
        getCart();


    if (
        cart.length === 0
    ) {

        showToast(
            "Cart is already empty"
        );

        return;

    }


    const confirmClear =
        confirm(
            "Are you sure you want to clear your cart?"
        );


    if (!confirmClear)
        return;


    localStorage.removeItem(
        "wizCart"
    );


    showToast(
        "Cart cleared successfully"
    );


    renderCart();

}


/* =====================================================
   CONTINUE SHOPPING
===================================================== */

function continueShopping() {

    window.location.href =
        "products.html";

}


/* =====================================================
   GO BACK
===================================================== */

function goBack() {

    window.history.back();

}
/* =====================================================
   PART 3/4
   Transparent Price Calculation
===================================================== */


/* =====================================================
   UPDATE SUMMARY
===================================================== */

function updateSummary() {

    const cart =
        getCart();


    let subtotal =
        0;


    let originalTotal =
        0;


    cart.forEach(
        item => {

            subtotal +=
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
            subtotal
        );


    /*
       Demo pricing rules:

       ₹500 or above
       → Free delivery

       Below ₹500
       → ₹40 delivery

       Platform charge
       → 2% of subtotal
    */


    const deliveryCharge =
        subtotal === 0
            ? 0
            : subtotal >= 500
                ? 0
                : 40;


    const platformCharge =
        subtotal === 0
            ? 0
            : Math.round(
                subtotal * 0.02
            );


    const finalPrice =
        subtotal +
        deliveryCharge +
        platformCharge;


    setText(
        "subtotal",
        `₹${originalTotal}`
    );


    setText(
        "discount",
        `- ₹${discount}`
    );


    setText(
        "deliveryCharge",
        deliveryCharge === 0
            ? "FREE"
            : `₹${deliveryCharge}`
    );


    setText(
        "platformCharge",
        `₹${platformCharge}`
    );


    setText(
        "finalPrice",
        `₹${finalPrice}`
    );


    setText(
        "cartItemCount",
        getTotalItems() +
        (
            getTotalItems() === 1
                ? " item"
                : " items"
        )
    );


    const checkoutBtn =
        document.getElementById(
            "checkoutBtn"
        );


    if (checkoutBtn) {

        checkoutBtn.disabled =
            cart.length === 0;

        checkoutBtn.style.opacity =
            cart.length === 0
                ? "0.5"
                : "1";

    }

}


/* =====================================================
   GET TOTAL ITEMS
===================================================== */

function getTotalItems() {

    return getCart()
        .reduce(
            (
                total,
                item
            ) =>
                total +
                item.quantity,
            0
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
   TOTAL CART VALUE
===================================================== */

function getFinalCartValue() {

    const cart =
        getCart();


    let subtotal =
        0;


    cart.forEach(
        item => {

            subtotal +=
                item.price *
                item.quantity;

        }
    );


    const delivery =
        subtotal === 0
            ? 0
            : subtotal >= 500
                ? 0
                : 40;


    const platform =
        subtotal === 0
            ? 0
            : Math.round(
                subtotal * 0.02
            );


    return (
        subtotal +
        delivery +
        platform
    );

      }
/* =====================================================
   PART 4/4
   Checkout + Toast + Animation + Initialize
===================================================== */


/* =====================================================
   PROCEED TO CHECKOUT
===================================================== */

function proceedToCheckout() {

    const cart =
        getCart();


    if (
        cart.length === 0
    ) {

        showToast(
            "Your cart is empty"
        );

        return;

    }


    const total =
        getFinalCartValue();


    /*
       Store checkout information
       for the next page.
    */

    localStorage.setItem(
        "wizCheckoutTotal",
        total
    );


    localStorage.setItem(
        "wizCheckoutCart",
        JSON.stringify(
            cart
        )
    );


    showToast(
        "✓ Secure checkout loading..."
    );


    setTimeout(
        () => {

            window.location.href =
                "checkout.html";

        },
        700
    );

}


/* =====================================================
   TOAST
===================================================== */

function showToast(
    message
) {

    const toast =
        document.getElementById(
            "cartToast"
        );


    if (!toast) return;


    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        window.cartToastTimer
    );


    window.cartToastTimer =
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
   CART ITEM ANIMATION
===================================================== */

function animateCartItems() {

    const items =
        document.querySelectorAll(
            ".cart-item"
        );


    items.forEach(
        (item, index) => {

            item.style.opacity =
                "0";

            item.style.transform =
                "translateY(15px)";


            setTimeout(
                () => {

                    item.style.opacity =
                        "1";

                    item.style.transform =
                        "translateY(0)";

                    item.style.transition =
                        "all .4s ease";

                },
                index * 80
            );

        }
    );

}


/* =====================================================
   UPDATE CART WHEN TAB BECOMES ACTIVE
===================================================== */

window.addEventListener(
    "storage",
    () => {

        renderCart();

    }
);


/* =====================================================
   INITIALIZE
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        renderCart();

        animateCartItems();

        console.log(
            "🛒 Wiz Commerce Cart Loaded"
        );

    }
);


/* =====================================================
   GLOBAL FUNCTIONS
===================================================== */

window.changeQuantity =
    changeQuantity;

window.removeItem =
    removeItem;

window.clearCart =
    clearCart;

window.continueShopping =
    continueShopping;

window.goBack =
    goBack;

window.proceedToCheckout =
    proceedToCheckout;

window.showToast =
    showToast;
