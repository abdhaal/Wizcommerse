/* =========================================================
   WIZ COMMERCE
   PRODUCT-DETAILS.JS
   PART 1/4 — Product Data + Cart
========================================================= */

const product = {
    id: 1,
    name: "Smart LED Bulb",
    category: "Electronics",
    price: 299,
    oldPrice: 499,
    discount: 40,
    rating: 4.6,
    reviews: 128,
    trustScore: 94,
    seller: "Wiz Verified Store",
    sellerTrustScore: 96,
    customerPhotos: 48,
    deliveryDate: "18 Sep 2026"
};


/* =========================================================
   DOM ELEMENTS
========================================================= */

const videoModal =
    document.getElementById("videoModal");

const toast =
    document.getElementById("toast");


/* =========================================================
   ADD TO CART
========================================================= */

function addToCart() {

    let cart =
        JSON.parse(
            localStorage.getItem("wizCart")
        ) || [];


    const cartProduct = {

        id: product.id,

        name: product.name,

        price: product.price,

        oldPrice: product.oldPrice,

        quantity: 1,

        category: product.category

    };


    const existing =
        cart.find(
            item =>
                item.id === product.id
        );


    if (existing) {

        existing.quantity += 1;

    } else {

        cart.push(
            cartProduct
        );

    }


    localStorage.setItem(
        "wizCart",
        JSON.stringify(cart)
    );


    showToast(
        "✓ Product added to cart"
    );

}


/* =========================================================
   GET CART
========================================================= */

function getCart() {

    return JSON.parse(
        localStorage.getItem(
            "wizCart"
        )
    ) || [];

}


/* =========================================================
   CART TOTAL
========================================================= */

function getCartTotal() {

    const cart =
        getCart();


    return cart.reduce(
        (total, item) => {

            return total +
                (
                    item.price *
                    item.quantity
                );

        },
        0
    );

}


/* =========================================================
   GO TO CART
========================================================= */

function goToCart() {

    window.location.href =
        "cart.html";

}


/* =========================================================
   UPDATE CART COUNT
========================================================= */

function updateCartCount() {

    const cart =
        getCart();


    const totalItems =
        cart.reduce(
            (total, item) =>
                total +
                item.quantity,
            0
        );


    const cartElements =
        document.querySelectorAll(
            ".cart-count"
        );


    cartElements.forEach(
        element => {

            element.textContent =
                totalItems;

        }
    );

}


/* =========================================================
   PAGE LOAD
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        updateCartCount();

        console.log(
            "Wiz Commerce Product Details Loaded"
        );

    }
);
/* =========================================================
   PART 2/4
   Video + Wishlist + AI Advisor
========================================================= */


/* =========================================================
   OPEN VIDEO
========================================================= */

function openVideo() {

    if (!videoModal) return;


    videoModal.classList.add(
        "show"
    );


    document.body.style.overflow =
        "hidden";


    showToast(
        "🎥 Verified product video opened"
    );

}


/* =========================================================
   CLOSE VIDEO
========================================================= */

function closeVideo() {

    if (!videoModal) return;


    videoModal.classList.remove(
        "show"
    );


    document.body.style.overflow =
        "";

}


/* =========================================================
   VIDEO MODAL CLICK
========================================================= */

if (videoModal) {

    videoModal.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                videoModal
            ) {

                closeVideo();

            }

        }
    );

}


/* =========================================================
   ESC KEY
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape"
        ) {

            closeVideo();

        }

    }
);


/* =========================================================
   WISHLIST
========================================================= */

function toggleWishlist() {

    let wishlist =
        JSON.parse(
            localStorage.getItem(
                "wizWishlist"
            )
        ) || [];


    const index =
        wishlist.indexOf(
            product.id
        );


    if (index === -1) {

        wishlist.push(
            product.id
        );


        localStorage.setItem(
            "wizWishlist",
            JSON.stringify(
                wishlist
            )
        );


        showToast(
            "❤️ Added to wishlist"
        );

    } else {

        wishlist.splice(
            index,
            1
        );


        localStorage.setItem(
            "wizWishlist",
            JSON.stringify(
                wishlist
            )
        );


        showToast(
            "Wishlist removed"
        );

    }

}


/* =========================================================
   AI PRODUCT ADVISOR
========================================================= */

function openAIAdvisor() {

    const modal =
        document.createElement(
            "div"
        );


    modal.className =
        "modal show";


    modal.innerHTML = `

        <div
            class="modal-box"
            style="max-width:520px;"
        >

            <button
                class="close"
                onclick="this.closest('.modal').remove()"
            >
                ×
            </button>

            <h2>
                🤖 Wiz AI Product Advisor
            </h2>

            <p
                style="
                    margin-top:10px;
                    color:#64748b;
                "
            >
                Tell us what you need.
                AI will help you decide.
            </p>


            <div
                style="
                    display:grid;
                    gap:10px;
                    margin-top:20px;
                "
            >

                <button
                    class="cart-btn"
                    onclick="aiRecommendation('budget')"
                >
                    💰 Best for my budget
                </button>

                <button
                    class="cart-btn"
                    onclick="aiRecommendation('quality')"
                >
                    🛡️ Best quality
                </button>

                <button
                    class="cart-btn"
                    onclick="aiRecommendation('rating')"
                >
                    ⭐ Best rated
                </button>

            </div>

            <div
                id="aiResult"
                style="
                    margin-top:18px;
                    padding:14px;
                    background:#eff6ff;
                    border-radius:12px;
                    display:none;
                "
            ></div>

        </div>

    `;


    document.body.appendChild(
        modal
    );

}


/* =========================================================
   AI RECOMMENDATION
========================================================= */

function aiRecommendation(
    type
) {

    const result =
        document.getElementById(
            "aiResult"
        );


    if (!result) return;


    let message = "";


    if (type === "budget") {

        message =
            "💰 This product is a good budget choice at ₹299.";

    }


    if (type === "quality") {

        message =
            "🛡️ Trust Score 94/100 indicates strong product confidence.";

    }


    if (type === "rating") {

        message =
            "⭐ This product has a 4.6/5 rating from 128 verified buyers.";

    }


    result.textContent =
        message;


    result.style.display =
        "block";

}


/* =========================================================
   SEARCH
========================================================= */

function searchProduct() {

    const input =
        document.querySelector(
            ".search input"
        );


    if (!input) return;


    const value =
        input.value
            .trim();


    if (!value) {

        showToast(
            "Please enter a product name"
        );

        return;

    }


    window.location.href =
        "products.html?search=" +
        encodeURIComponent(
            value
        );

}
/* =========================================================
   PART 3/4
   Comparison + Reviews + Return + Refund
========================================================= */


/* =========================================================
   SMART COMPARISON
========================================================= */

function openComparison() {

    const modal =
        document.createElement(
            "div"
        );


    modal.className =
        "modal show";


    modal.innerHTML = `

        <div
            class="modal-box"
            style="max-width:700px;"
        >

            <button
                class="close"
                onclick="this.closest('.modal').remove()"
            >
                ×
            </button>

            <h2>
                📊 Smart Product Comparison
            </h2>

            <div
                style="
                    overflow-x:auto;
                    margin-top:18px;
                "
            >

                <table
                    style="
                        width:100%;
                        border-collapse:collapse;
                    "
                >

                    <tr>
                        <th style="padding:12px;text-align:left;">
                            Feature
                        </th>

                        <th style="padding:12px;">
                            Smart LED Bulb
                        </th>
                    </tr>

                    <tr>
                        <td style="padding:12px;">
                            Price
                        </td>

                        <td style="padding:12px;">
                            ₹299
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:12px;">
                            Rating
                        </td>

                        <td style="padding:12px;">
                            ⭐ 4.6
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:12px;">
                            Verified Reviews
                        </td>

                        <td style="padding:12px;">
                            128
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:12px;">
                            Trust Score
                        </td>

                        <td style="padding:12px;">
                            🛡️ 94/100
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:12px;">
                            Seller
                        </td>

                        <td style="padding:12px;">
                            ✓ Verified
                        </td>
                    </tr>

                </table>

            </div>

        </div>

    `;


    document.body.appendChild(
        modal
    );

}


/* =========================================================
   VERIFIED REVIEW
========================================================= */

function submitReview() {

    const review =
        prompt(
            "Write your review:"
        );


    if (!review) return;


    showToast(
        "✓ Review submitted for verification"
    );

}


/* =========================================================
   REAL CUSTOMER PHOTO
========================================================= */

function viewCustomerPhotos() {

    showToast(
        "🖼️ Showing verified customer photos"
    );


    const section =
        document.querySelector(
            ".customer-photos"
        );


    if (section) {

        section.scrollIntoView({
            behavior: "smooth"
        });

    }

}


/* =========================================================
   RETURN PRODUCT
========================================================= */

function startReturn() {

    const confirmed =
        confirm(
            "Do you want to start a return request?"
        );


    if (!confirmed) return;


    showToast(
        "🔄 Return request created successfully"
    );


    setTimeout(
        () => {

            showToast(
                "📦 Pickup will be scheduled soon"
            );

        },
        1800
    );

}


/* =========================================================
   REFUND TRACKING
========================================================= */

function trackRefund() {

    const modal =
        document.createElement(
            "div"
        );


    modal.className =
        "modal show";


    modal.innerHTML = `

        <div
            class="modal-box"
            style="max-width:500px;"
        >

            <button
                class="close"
                onclick="this.closest('.modal').remove()"
            >
                ×
            </button>

            <h2>
                🔔 Live Refund Tracking
            </h2>


            <div
                style="
                    margin-top:20px;
                    display:grid;
                    gap:15px;
                "
            >

                <div>
                    ✓ Return Request Created
                </div>

                <div>
                    ✓ Product Pickup Completed
                </div>

                <div>
                    🔄 Quality Verification
                </div>

                <div>
                    ⏳ Refund Processing
                </div>

                <div>
                    ○ Refund Credited
                </div>

            </div>


            <p
                style="
                    margin-top:20px;
                    color:#64748b;
                    font-size:13px;
                "
            >
                Demo tracking timeline for
                Wiz Commerce.
            </p>

        </div>

    `;


    document.body.appendChild(
        modal
    );

}


/* =========================================================
   FAKE PRODUCT DETECTION
========================================================= */

function checkProductAuthenticity() {

    showToast(
        "🛡️ Product authenticity verified — Low risk"
    );

}


/* =========================================================
   DELIVERY TRACKING
========================================================= */

function trackDelivery() {

    const modal =
        document.createElement(
            "div"
        );


    modal.className =
        "modal show";


    modal.innerHTML = `

        <div
            class="modal-box"
            style="max-width:500px;"
        >

            <button
                class="close"
                onclick="this.closest('.modal').remove()"
            >
                ×
            </button>

            <h2>
                🚚 Delivery Tracking
            </h2>

            <div
                style="
                    margin-top:20px;
                    display:grid;
                    gap:14px;
                "
            >

                <div>
                    ✓ Order Confirmed
                </div>

                <div>
                    ✓ Seller Packed
                </div>

                <div>
                    🚚 Shipped
                </div>

                <div>
                    📍 Out for Delivery
                </div>

                <div>
                    ○ Delivered
                </div>

            </div>

            <strong
                style="
                    display:block;
                    margin-top:20px;
                "
            >
                Delivery Confidence: 94%
            </strong>

        </div>

    `;


    document.body.appendChild(
        modal
    );

      }
/* =========================================================
   PART 4/4
   Toast + Animation + Interactions
========================================================= */


/* =========================================================
   TOAST
========================================================= */

function showToast(
    message
) {

    if (!toast) return;


    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        window.wizToastTimer
    );


    window.wizToastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            2500
        );

}


/* =========================================================
   SCROLL ANIMATION
========================================================= */

function setupScrollAnimation() {

    const elements =
        document.querySelectorAll(
            ".product-main, .smart-card, .section, .feature"
        );


    if (
        !("IntersectionObserver"
            in window)
    ) {

        elements.forEach(
            element =>
                element.style.opacity =
                    "1"
        );

        return;

    }


    elements.forEach(
        element => {

            element.style.opacity =
                "0";

            element.style.transform =
                "translateY(25px)";

            element.style.transition =
                "opacity .6s ease, transform .6s ease";

        }
    );


    const observer =
        new IntersectionObserver(
            entries => {

                entries.forEach(
                    entry => {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.style.opacity =
                                "1";

                            entry.target.style.transform =
                                "translateY(0)";

                            observer.unobserve(
                                entry.target
                            );

                        }

                    }
                );

            },
            {
                threshold: 0.12
            }
        );


    elements.forEach(
        element =>
            observer.observe(
                element
            )
    );

}


/* =========================================================
   BUTTON RIPPLE EFFECT
========================================================= */

function setupButtonAnimation() {

    document.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    "button"
                );


            if (!button) return;


            button.classList.add(
                "clicked"
            );


            setTimeout(
                () => {

                    button.classList.remove(
                        "clicked"
                    );

                },
                180
            );

        }
    );

}


/* =========================================================
   SEARCH ENTER
========================================================= */

function setupSearch() {

    const input =
        document.querySelector(
            ".search input"
        );


    if (!input) return;


    input.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter"
            ) {

                searchProduct();

            }

        }
    );

}


/* =========================================================
   MODAL CLEANUP
========================================================= */

document.addEventListener(
    "click",
    event => {

        const closeButton =
            event.target.closest(
                ".close"
            );


        if (
            closeButton
        ) {

            const modal =
                closeButton.closest(
                    ".modal"
                );


            modal?.remove();

        }

    }
);


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        updateCartCount();

        setupScrollAnimation();

        setupButtonAnimation();

        setupSearch();

        console.log(
            "🚀 Wiz Commerce Product Details Ready"
        );

    }
);


/* =========================================================
   GLOBAL FUNCTIONS
========================================================= */

window.addToCart =
    addToCart;

window.goToCart =
    goToCart;

window.openVideo =
    openVideo;

window.closeVideo =
    closeVideo;

window.toggleWishlist =
    toggleWishlist;

window.openAIAdvisor =
    openAIAdvisor;

window.openComparison =
    openComparison;

window.submitReview =
    submitReview;

window.viewCustomerPhotos =
    viewCustomerPhotos;

window.startReturn =
    startReturn;

window.trackRefund =
    trackRefund;

window.checkProductAuthenticity =
    checkProductAuthenticity;

window.trackDelivery =
    trackDelivery;

window.searchProduct =
    searchProduct;

window.showToast =
    showToast;
