/* =========================================================
   WIZ COMMERCE
   PRODUCT DETAILS JS
   PART 1/4
   Dynamic Product Data + URL Product ID
========================================================= */


/* =========================================================
   PRODUCT DATABASE
========================================================= */

const productDatabase = {

    1: {
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
        image: "assets/images/bulb.png"
        deliveryDate: "18 Sep 2026"
    },

    2: {
        id: 2,
        name: "Portable Mini Fan",
        category: "Electronics",
        price: 399,
        oldPrice: 699,
        discount: 43,
        rating: 4.5,
        reviews: 87,
        trustScore: 91,
        seller: "Smart Deals",
        sellerTrustScore: 94,
        customerPhotos: 32,
        icon: "🌀",
        deliveryDate: "18 Sep 2026"
    },

    3: {
        id: 3,
        name: "Kitchen Storage Box",
        category: "Home & Kitchen",
        price: 249,
        oldPrice: 399,
        discount: 38,
        rating: 4.4,
        reviews: 64,
        trustScore: 89,
        seller: "Home Store",
        sellerTrustScore: 92,
        customerPhotos: 27,
        icon: "📦",
        deliveryDate: "19 Sep 2026"
    },

    4: {
        id: 4,
        name: "Wireless Bluetooth Speaker",
        category: "Electronics",
        price: 699,
        oldPrice: 1199,
        discount: 42,
        rating: 4.7,
        reviews: 214,
        trustScore: 96,
        seller: "Wiz Audio",
        sellerTrustScore: 97,
        customerPhotos: 82,
        icon: "🔊",
        deliveryDate: "17 Sep 2026"
    },

    5: {
        id: 5,
        name: "Premium Cotton T-Shirt",
        category: "Fashion",
        price: 349,
        oldPrice: 599,
        discount: 42,
        rating: 4.3,
        reviews: 156,
        trustScore: 88,
        seller: "Fashion Hub",
        sellerTrustScore: 90,
        customerPhotos: 63,
        icon: "👕",
        deliveryDate: "20 Sep 2026"
    },

    6: {
        id: 6,
        name: "Rechargeable Emergency Light",
        category: "Electronics",
        price: 449,
        oldPrice: 799,
        discount: 44,
        rating: 4.5,
        reviews: 103,
        trustScore: 92,
        seller: "Bright Store",
        sellerTrustScore: 94,
        customerPhotos: 41,
        icon: "🔦",
        deliveryDate: "19 Sep 2026"
    },

    7: {
        id: 7,
        name: "Stainless Steel Water Bottle",
        category: "Home & Kitchen",
        price: 299,
        oldPrice: 499,
        discount: 40,
        rating: 4.6,
        reviews: 91,
        trustScore: 93,
        seller: "Daily Needs",
        sellerTrustScore: 95,
        customerPhotos: 35,
        icon: "🥤",
        deliveryDate: "18 Sep 2026"
    },

    8: {
        id: 8,
        name: "Smart Watch",
        category: "Electronics",
        price: 899,
        oldPrice: 1599,
        discount: 44,
        rating: 4.4,
        reviews: 189,
        trustScore: 90,
        seller: "Tech World",
        sellerTrustScore: 93,
        customerPhotos: 71,
        icon: "⌚",
        deliveryDate: "18 Sep 2026"
    }

};


/* =========================================================
   READ PRODUCT ID FROM URL
========================================================= */

const urlParams =
    new URLSearchParams(
        window.location.search
    );


const productId =
    Number(
        urlParams.get("id")
    );


/* =========================================================
   SELECT PRODUCT
========================================================= */

const selectedProduct =
    productDatabase[productId] ||
    productDatabase[1];


/* =========================================================
   DOM ELEMENTS
========================================================= */

const productName =
    document.getElementById(
        "productName"
    );

const productCategory =
    document.getElementById(
        "productCategory"
    );

const productPrice =
    document.getElementById(
        "productPrice"
    );

const oldPrice =
    document.getElementById(
        "oldPrice"
    );

const discount =
    document.getElementById(
        "discount"
    );

const rating =
    document.getElementById(
        "rating"
    );

const reviewCount =
    document.getElementById(
        "reviewCount"
    );

const trustScore =
    document.getElementById(
        "trustScore"
    );

const sellerName =
    document.getElementById(
        "sellerName"
    );

const sellerTrust =
    document.getElementById(
        "sellerTrust"
    );

const customerPhotos =
    document.getElementById(
        "customerPhotos"
    );

const productIcon =
    document.getElementById(
        "productIcon"
    );


/* =========================================================
   LOAD PRODUCT DETAILS
========================================================= */

function loadProductDetails() {

    if (productName)
        productName.textContent =
            selectedProduct.name;


    if (productCategory)
        productCategory.textContent =
            selectedProduct.category.toUpperCase();


    if (productPrice)
        productPrice.textContent =
            `₹${selectedProduct.price}`;


    if (oldPrice)
        oldPrice.textContent =
            `₹${selectedProduct.oldPrice}`;


    if (discount)
        discount.textContent =
            `${selectedProduct.discount}% OFF`;


    if (rating)
        rating.textContent =
            `⭐ ${selectedProduct.rating}`;


    if (reviewCount)
        reviewCount.textContent =
            `${selectedProduct.reviews} Verified Buyer Reviews`;


    if (trustScore)
        trustScore.textContent =
            `${selectedProduct.trustScore}/100`;


    if (sellerName)
        sellerName.textContent =
            selectedProduct.seller;


    if (sellerTrust)
        sellerTrust.textContent =
            `${selectedProduct.sellerTrustScore}/100`;


    if (customerPhotos)
        customerPhotos.textContent =
            selectedProduct.customerPhotos;


    if (productIcon)
        productIcon.textContent =
            selectedProduct.icon;


    document.title =
        `${selectedProduct.name} - Wiz Commerce`;

}


/* =========================================================
   INITIAL LOAD
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadProductDetails();

    }
);
/* =========================================================
   PART 2/4
   Cart + Wishlist + Real Product Video
========================================================= */


/* =========================================================
   CART FUNCTIONS
========================================================= */

function getCart() {

    return JSON.parse(
        localStorage.getItem(
            "wizCart"
        )
    ) || [];

}


/* =========================================================
   ADD TO CART
========================================================= */

function addToCart() {

    let cart =
        getCart();


    const existing =
        cart.find(
            item =>
                item.id ===
                selectedProduct.id
        );


    if (existing) {

        existing.quantity += 1;

    } else {

        cart.push({

            id: selectedProduct.id,

            name: selectedProduct.name,

            price: selectedProduct.price,

            oldPrice:
                selectedProduct.oldPrice,

            category:
                selectedProduct.category,

            icon:
                selectedProduct.icon,

            quantity: 1

        });

    }


    localStorage.setItem(
        "wizCart",
        JSON.stringify(cart)
    );


    updateCartCount();


    showToast(
        `✓ ${selectedProduct.name} added to cart`
    );

}


/* =========================================================
   UPDATE CART COUNT
========================================================= */

function updateCartCount() {

    const cart =
        getCart();


    const count =
        cart.reduce(
            (total, item) =>
                total +
                item.quantity,
            0
        );


    document
        .querySelectorAll(
            ".cart-count"
        )
        .forEach(
            element => {

                element.textContent =
                    count;

            }
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
            selectedProduct.id
        );


    if (index === -1) {

        wishlist.push(
            selectedProduct.id
        );


        showToast(
            "❤️ Added to wishlist"
        );

    } else {

        wishlist.splice(
            index,
            1
        );


        showToast(
            "♡ Removed from wishlist"
        );

    }


    localStorage.setItem(
        "wizWishlist",
        JSON.stringify(
            wishlist
        )
    );

}


/* =========================================================
   REAL PRODUCT VIDEO
========================================================= */

function openVideo() {

    const modal =
        document.getElementById(
            "videoModal"
        );


    if (!modal) return;


    const videoTitle =
        modal.querySelector(
            "h2"
        );


    if (videoTitle) {

        videoTitle.textContent =
            `🎥 ${selectedProduct.name} — Real Product Video`;

    }


    const videoScreen =
        modal.querySelector(
            ".video-screen"
        );


    if (videoScreen) {

        videoScreen.innerHTML = `

            <div class="play">
                ▶
            </div>

            <strong>
                ${selectedProduct.name}
            </strong>

            <span>
                ✓ Verified Product Demonstration
            </span>

        `;

    }


    modal.classList.add(
        "show"
    );


    document.body.style.overflow =
        "hidden";

}


/* =========================================================
   CLOSE VIDEO
========================================================= */

function closeVideo() {

    const modal =
        document.getElementById(
            "videoModal"
        );


    if (!modal) return;


    modal.classList.remove(
        "show"
    );


    document.body.style.overflow =
        "";

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
   VIDEO MODAL OUTSIDE CLICK
========================================================= */

document.addEventListener(
    "click",
    event => {

        const modal =
            document.getElementById(
                "videoModal"
            );


        if (
            modal &&
            event.target === modal
        ) {

            closeVideo();

        }

    }
);
/* =========================================================
   PART 3/4
   AI Advisor + Smart Comparison + Trust Features
========================================================= */


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
                Let Wiz AI help you decide
                whether this product is suitable.
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
                    💰 Is it budget friendly?
                </button>

                <button
                    class="cart-btn"
                    onclick="aiRecommendation('quality')"
                >
                    🛡️ Is the quality trustworthy?
                </button>

                <button
                    class="cart-btn"
                    onclick="aiRecommendation('rating')"
                >
                    ⭐ Are buyers happy?
                </button>

            </div>


            <div
                id="aiResult"
                style="
                    margin-top:18px;
                    padding:15px;
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
   AI RESULT
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


    switch (type) {

        case "budget":

            message =
                `💰 At ₹${selectedProduct.price}, this product offers a ${selectedProduct.discount}% discount and is a budget-friendly option.`;

            break;


        case "quality":

            message =
                `🛡️ This product has a Trust Score of ${selectedProduct.trustScore}/100, indicating strong purchase confidence.`;

            break;


        case "rating":

            message =
                `⭐ ${selectedProduct.rating}/5 rating from ${selectedProduct.reviews} verified buyers shows good customer satisfaction.`;

            break;

    }


    result.textContent =
        message;


    result.style.display =
        "block";

}


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
            style="max-width:750px;"
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
                            ${selectedProduct.name}
                        </th>

                    </tr>


                    <tr>

                        <td style="padding:12px;">
                            Price
                        </td>

                        <td style="padding:12px;">
                            ₹${selectedProduct.price}
                        </td>

                    </tr>


                    <tr>

                        <td style="padding:12px;">
                            Rating
                        </td>

                        <td style="padding:12px;">
                            ⭐ ${selectedProduct.rating}
                        </td>

                    </tr>


                    <tr>

                        <td style="padding:12px;">
                            Verified Reviews
                        </td>

                        <td style="padding:12px;">
                            ${selectedProduct.reviews}
                        </td>

                    </tr>


                    <tr>

                        <td style="padding:12px;">
                            Trust Score
                        </td>

                        <td style="padding:12px;">
                            🛡️ ${selectedProduct.trustScore}/100
                        </td>

                    </tr>


                    <tr>

                        <td style="padding:12px;">
                            Seller
                        </td>

                        <td style="padding:12px;">
                            ✓ ${selectedProduct.seller}
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
   AUTHENTICITY CHECK
========================================================= */

function checkProductAuthenticity() {

    showToast(
        `🛡️ ${selectedProduct.name} passed Wiz Commerce verification`
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
                    display:grid;
                    gap:14px;
                    margin-top:20px;
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


            <p
                style="
                    margin-top:18px;
                    color:#64748b;
                "
            >
                Expected Delivery:
                <strong>
                    ${selectedProduct.deliveryDate}
                </strong>
            </p>

        </div>

    `;


    document.body.appendChild(
        modal
    );

       }
/* =========================================================
   PART 4/4
   Return + Refund + Animation + Final Setup
========================================================= */


/* =========================================================
   START RETURN
========================================================= */

function startReturn() {

    const confirmReturn =
        confirm(
            `Start return for ${selectedProduct.name}?`
        );


    if (!confirmReturn) return;


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
   LIVE REFUND TRACKING
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
                    display:grid;
                    gap:15px;
                    margin-top:20px;
                "
            >

                <div>
                    ✓ Return Request Created
                </div>

                <div>
                    ✓ Pickup Completed
                </div>

                <div>
                    🔍 Product Verification
                </div>

                <div>
                    🔄 Refund Processing
                </div>

                <div>
                    ○ Refund Credited
                </div>

            </div>


            <p
                style="
                    margin-top:18px;
                    color:#64748b;
                    font-size:13px;
                "
            >
                This is a demo live-refund
                tracking system for Wiz Commerce.
            </p>

        </div>

    `;


    document.body.appendChild(
        modal
    );

}


/* =========================================================
   CUSTOMER PHOTOS
========================================================= */

function viewCustomerPhotos() {

    const section =
        document.querySelector(
            ".customer-photos"
        );


    if (section) {

        section.scrollIntoView({
            behavior: "smooth"
        });

    }


    showToast(
        `🖼️ ${selectedProduct.customerPhotos} verified customer photos`
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
   TOAST
========================================================= */

function showToast(
    message
) {

    let toast =
        document.getElementById(
            "wizToast"
        );


    if (!toast) {

        toast =
            document.createElement(
                "div"
            );


        toast.id =
            "wizToast";


        toast.style.cssText = `

            position:fixed;
            right:20px;
            bottom:20px;
            z-index:9999;

            background:#0f172a;
            color:white;

            padding:13px 18px;

            border-radius:10px;

            font-size:13px;
            font-weight:600;

            box-shadow:
                0 10px 30px
                rgba(0,0,0,.2);

            opacity:0;
            transform:translateY(15px);

            transition:
                .3s ease;

        `;


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
        window.wizToastTimer
    );


    window.wizToastTimer =
        setTimeout(
            () => {

                toast.style.opacity =
                    "0";

                toast.style.transform =
                    "translateY(15px)";

            },
            2300
        );

}


/* =========================================================
   SCROLL ANIMATION
========================================================= */

function setupScrollAnimation() {

    const elements =
        document.querySelectorAll(
            ".product-main, .smart-card, .section"
        );


    if (
        !("IntersectionObserver"
            in window)
    ) {

        return;

    }


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
        element => {

            element.style.opacity =
                "0";

            element.style.transform =
                "translateY(25px)";

            element.style.transition =
                "opacity .6s ease, transform .6s ease";


            observer.observe(
                element
            );

        }
    );

}


/* =========================================================
   CLOSE DYNAMIC MODALS
========================================================= */

document.addEventListener(
    "click",
    event => {

        const close =
            event.target.closest(
                ".close"
            );


        if (!close) return;


        const modal =
            close.closest(
                ".modal"
            );


        modal?.remove();

    }
);


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadProductDetails();

        updateCartCount();

        setupScrollAnimation();

        console.log(
            `Wiz Commerce: ${selectedProduct.name} loaded`
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

window.toggleWishlist =
    toggleWishlist;

window.openVideo =
    openVideo;

window.closeVideo =
    closeVideo;

window.openAIAdvisor =
    openAIAdvisor;

window.openComparison =
    openComparison;

window.aiRecommendation =
    aiRecommendation;

window.checkProductAuthenticity =
    checkProductAuthenticity;

window.trackDelivery =
    trackDelivery;

window.startReturn =
    startReturn;

window.trackRefund =
    trackRefund;

window.viewCustomerPhotos =
    viewCustomerPhotos;

window.submitReview =
    submitReview;

window.showToast =
    showToast;
