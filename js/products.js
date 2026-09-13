/* =========================================================
   WIZ COMMERCE
   PRODUCTS.JS — PART 1/4
   Product Data + Global Setup
========================================================= */

const products = [

    {
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
        verifiedSeller: true,
        customerPhotos: 48,
        icon: "💡"
    },

    {
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
        verifiedSeller: true,
        customerPhotos: 32,
        icon: "🌀"
    },

    {
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
        verifiedSeller: true,
        customerPhotos: 27,
        icon: "📦"
    },

    {
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
        verifiedSeller: true,
        customerPhotos: 82,
        icon: "🔊"
    },

    {
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
        verifiedSeller: true,
        customerPhotos: 63,
        icon: "👕"
    },

    {
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
        verifiedSeller: true,
        customerPhotos: 41,
        icon: "🔦"
    },

    {
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
        verifiedSeller: true,
        customerPhotos: 35,
        icon: "🥤"
    },

    {
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
        verifiedSeller: true,
        customerPhotos: 71,
        icon: "⌚"
    }

];


/* =========================================================
   GLOBAL VARIABLES
========================================================= */

let filteredProducts = [...products];

let wishlist =
    JSON.parse(
        localStorage.getItem("wizWishlist")
    ) || [];

let cart =
    JSON.parse(
        localStorage.getItem("wizCart")
    ) || [];

let compareList = [];


/* =========================================================
   DOM ELEMENTS
========================================================= */

const productGrid =
    document.querySelector(".product-grid");

const searchInput =
    document.querySelector(".search-box input");

const sortSelect =
    document.querySelector(".sort-area select");

const filterSidebar =
    document.querySelector(".filter-sidebar");

const cartCount =
    document.querySelector(".cart-action span");


/* =========================================================
   INITIAL LOAD
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        renderProducts(products);

        updateCartCount();

        updateWishlistButtons();

        setupSearch();

        setupFilters();

        setupSorting();

        setupNavigation();

        setupModal();

        animatePage();

    }
);


/* =========================================================
   RENDER PRODUCTS
========================================================= */

function renderProducts(productList) {

    if (!productGrid) return;

    productGrid.innerHTML = "";

    if (productList.length === 0) {

        productGrid.innerHTML = `

            <div class="no-products">

                <div class="no-products-icon">
                    🔍
                </div>

                <h3>
                    No products found
                </h3>

                <p>
                    Try changing your search
                    or filters.
                </p>

                <button
                    type="button"
                    onclick="clearAllFilters()"
                >
                    Clear Filters
                </button>

            </div>

        `;

        return;
    }


    productList.forEach(
        (product, index) => {

            const card =
                createProductCard(product);

            card.style.animationDelay =
                `${index * 0.06}s`;

            productGrid.appendChild(card);

        }
    );


    updateWishlistButtons();

      }


/* =========================================================
   WIZ COMMERCE
   PRODUCTS.JS — PART 2/4
   Product Cards + Search + Filters
========================================================= */


/* =========================================================
   CREATE PRODUCT CARD
========================================================= */

function createProductCard(product) {

    const card =
        document.createElement("article");

    card.className = "product-card";

    const isWishlisted =
        wishlist.includes(product.id);


    card.innerHTML = `

        <div class="product-image">

            <span class="product-badge">
                VERIFIED
            </span>

            <button
                class="wishlist-btn"
                data-wishlist="${product.id}"
                type="button"
            >
                ${isWishlisted ? "♥" : "♡"}
            </button>

            <div class="product-placeholder">
                ${product.icon}
            </div>

            <button
                class="real-video-btn"
                data-video="${product.id}"
                type="button"
            >
                🎥 Real Product Video
            </button>

        </div>


        <div class="product-info">

            <span class="product-category">
                ${product.category}
            </span>

            <h3>
                ${product.name}
            </h3>


            <div class="rating-row">

                <span class="rating">
                    ⭐ ${product.rating}
                </span>

                <span class="review-count">
                    ${product.reviews} verified reviews
                </span>

            </div>


            <div class="price-row">

                <strong>
                    ₹${product.price}
                </strong>

                <del>
                    ₹${product.oldPrice}
                </del>

                <span class="discount">
                    ${product.discount}% OFF
                </span>

            </div>


            <div class="trust-row">

                <span>
                    🛡️ Trust Score
                </span>

                <strong>
                    ${product.trustScore}/100
                </strong>

            </div>


            <div class="seller-row">

                <span>
                    ✓
                </span>

                <span>
                    ${product.seller}
                </span>

                ${
                    product.verifiedSeller
                    ? `<span>✓ Verified Seller</span>`
                    : ""
                }

            </div>


            <div class="customer-photo">

                🖼️
                ${product.customerPhotos}
                real customer photos

            </div>


            <div class="product-actions">

                <button
                    class="compare-btn"
                    data-compare="${product.id}"
                    type="button"
                >
                    📊 Compare
                </button>

                <button
                    class="add-cart-btn"
                    data-cart="${product.id}"
                    type="button"
                >
                    🛒 Add to Cart
                </button>

            </div>

        </div>

    `;


    attachCardEvents(
        card,
        product
    );


    return card;
}


/* =========================================================
   CARD EVENTS
========================================================= */

function attachCardEvents(
    card,
    product
) {

    const wishlistButton =
        card.querySelector(
            `[data-wishlist="${product.id}"]`
        );


    const cartButton =
        card.querySelector(
            `[data-cart="${product.id}"]`
        );


    const compareButton =
        card.querySelector(
            `[data-compare="${product.id}"]`
        );


    const videoButton =
        card.querySelector(
            `[data-video="${product.id}"]`
        );


    wishlistButton?.addEventListener(
        "click",
        () => toggleWishlist(product.id)
    );


    cartButton?.addEventListener(
        "click",
        () =>
            addToCart(
                product.id,
                cartButton
            )
    );


    compareButton?.addEventListener(
        "click",
        () =>
            addToCompare(product.id)
    );


    videoButton?.addEventListener(
        "click",
        () =>
            openVideoModal(product)
    );

}


/* =========================================================
   SEARCH
========================================================= */

function setupSearch() {

    if (!searchInput) return;


    searchInput.addEventListener(
        "input",
        debounce(
            () => {
                applyAllFilters();
            },
            250
        )
    );

}


/* =========================================================
   FILTER SETUP
========================================================= */

function setupFilters() {

    if (!filterSidebar) return;


    const filterInputs =
        filterSidebar.querySelectorAll(
            "input[type='checkbox'], input[type='radio']"
        );


    filterInputs.forEach(
        input => {

            input.addEventListener(
                "change",
                applyAllFilters
            );

        }
    );


    const clearButton =
        filterSidebar.querySelector(
            ".filter-header button"
        );


    clearButton?.addEventListener(
        "click",
        clearAllFilters
    );

}


/* =========================================================
   APPLY FILTERS
========================================================= */

function applyAllFilters() {

    let result =
        [...products];


    /* SEARCH */

    const search =
        searchInput?.value
            .trim()
            .toLowerCase();


    if (search) {

        result =
            result.filter(
                product =>

                    product.name
                        .toLowerCase()
                        .includes(search)

                    ||

                    product.category
                        .toLowerCase()
                        .includes(search)

                    ||

                    product.seller
                        .toLowerCase()
                        .includes(search)
            );

    }


    /* CATEGORY */

    const selectedCategories =
        getCheckedValues(
            "input[name='category']"
        );


    if (
        selectedCategories.length
    ) {

        result =
            result.filter(
                product =>
                    selectedCategories.includes(
                        product.category
                    )
            );

    }


    /* PRICE */

    const selectedPrice =
        getCheckedValues(
            "input[name='price']"
        );


    if (selectedPrice.length) {

        result =
            result.filter(
                product =>
                    selectedPrice.some(
                        range =>
                            checkPriceRange(
                                product.price,
                                range
                            )
                    )
            );

    }


    /* RATING */

    const selectedRating =
        getCheckedValues(
            "input[name='rating']"
        );


    if (selectedRating.length) {

        const minimumRating =
            Math.max(
                ...selectedRating.map(
                    Number
                )
            );


        result =
            result.filter(
                product =>
                    product.rating >=
                    minimumRating
            );

    }


    /* TRUST SCORE */

    const selectedTrust =
        getCheckedValues(
            "input[name='trust']"
        );


    if (selectedTrust.length) {

        const minimumTrust =
            Math.max(
                ...selectedTrust.map(
                    Number
                )
            );


        result =
            result.filter(
                product =>
                    product.trustScore >=
                    minimumTrust
            );

    }


    filteredProducts =
        result;


    applySorting();

}


/* =========================================================
   PRICE RANGE CHECK
========================================================= */

function checkPriceRange(
    price,
    range
) {

    switch (range) {

        case "0-300":
            return price <= 300;

        case "301-500":
            return (
                price >= 301 &&
                price <= 500
            );

        case "501-1000":
            return (
                price >= 501 &&
                price <= 1000
            );

        case "1000+":
            return price > 1000;

        default:
            return true;

    }

}


/* =========================================================
   GET CHECKED VALUES
========================================================= */

function getCheckedValues(
    selector
) {

    return [
        ...document.querySelectorAll(
            `${selector}:checked`
        )
    ].map(
        input => input.value
    );

                      }
/* =========================================================
   WIZ COMMERCE
   PRODUCTS.JS — PART 3/4
   Sorting + Wishlist + Cart + Comparison
========================================================= */


/* =========================================================
   SORTING
========================================================= */

function setupSorting() {

    if (!sortSelect) return;


    sortSelect.addEventListener(
        "change",
        applySorting
    );

}


function applySorting() {

    let result =
        [...filteredProducts];


    const sortValue =
        sortSelect?.value ||
        "default";


    switch (sortValue) {

        case "price-low":

            result.sort(
                (a, b) =>
                    a.price - b.price
            );

            break;


        case "price-high":

            result.sort(
                (a, b) =>
                    b.price - a.price
            );

            break;


        case "rating":

            result.sort(
                (a, b) =>
                    b.rating - a.rating
            );

            break;


        case "trust":

            result.sort(
                (a, b) =>
                    b.trustScore -
                    a.trustScore
            );

            break;


        case "reviews":

            result.sort(
                (a, b) =>
                    b.reviews -
                    a.reviews
            );

            break;

    }


    renderProducts(result);

}


/* =========================================================
   CLEAR FILTERS
========================================================= */

function clearAllFilters() {

    if (searchInput) {

        searchInput.value = "";

    }


    document
        .querySelectorAll(
            ".filter-sidebar input"
        )
        .forEach(
            input => {
                input.checked = false;
            }
        );


    if (sortSelect) {

        sortSelect.selectedIndex = 0;

    }


    filteredProducts =
        [...products];


    renderProducts(
        products
    );

}


/* =========================================================
   WISHLIST
========================================================= */

function toggleWishlist(
    productId
) {

    const index =
        wishlist.indexOf(productId);


    if (index === -1) {

        wishlist.push(
            productId
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
            "Removed from wishlist"
        );

    }


    localStorage.setItem(
        "wizWishlist",
        JSON.stringify(
            wishlist
        )
    );


    updateWishlistButtons();

}


/* =========================================================
   UPDATE WISHLIST BUTTONS
========================================================= */

function updateWishlistButtons() {

    document
        .querySelectorAll(
            "[data-wishlist]"
        )
        .forEach(
            button => {

                const id =
                    Number(
                        button.dataset.wishlist
                    );


                if (
                    wishlist.includes(id)
                ) {

                    button.textContent =
                        "♥";

                    button.classList.add(
                        "active"
                    );

                } else {

                    button.textContent =
                        "♡";

                    button.classList.remove(
                        "active"
                    );

                }

            }
        );

}


/* =========================================================
   ADD TO CART
========================================================= */

function addToCart(
    productId,
    button
) {

    const product =
        products.find(
            item =>
                item.id === productId
        );


    if (!product) return;


    const existing =
        cart.find(
            item =>
                item.id === productId
        );


    if (existing) {

        existing.quantity += 1;

    } else {

        cart.push({

            ...product,

            quantity: 1

        });

    }


    localStorage.setItem(
        "wizCart",
        JSON.stringify(cart)
    );


    updateCartCount();


    if (button) {

        const originalText =
            button.innerHTML;


        button.innerHTML =
            "✓ Added";


        button.classList.add(
            "added"
        );


        setTimeout(
            () => {

                button.innerHTML =
                    originalText;

                button.classList.remove(
                    "added"
                );

            },
            1000
        );

    }


    showToast(
        `${product.name} added to cart`
    );

}


/* =========================================================
   CART COUNT
========================================================= */

function updateCartCount() {

    if (!cartCount) return;


    const total =
        cart.reduce(
            (sum, item) =>
                sum +
                item.quantity,
            0
        );


    cartCount.textContent =
        total;

}


/* =========================================================
   COMPARE PRODUCT
========================================================= */

function addToCompare(
    productId
) {

    const product =
        products.find(
            item =>
                item.id === productId
        );


    if (!product) return;


    const alreadyAdded =
        compareList.some(
            item =>
                item.id === productId
        );


    if (alreadyAdded) {

        showToast(
            "Product already added"
        );

        return;

    }


    if (
        compareList.length >= 3
    ) {

        showToast(
            "Maximum 3 products allowed"
        );

        return;

    }


    compareList.push(
        product
    );


    showToast(
        `${product.name} added to compare`
    );


    showCompareBar();

}


/* =========================================================
   COMPARE BAR
========================================================= */

function showCompareBar() {

    let bar =
        document.querySelector(
            ".compare-floating-bar"
        );


    if (!bar) {

        bar =
            document.createElement(
                "div"
            );

        bar.className =
            "compare-floating-bar";


        document.body.appendChild(
            bar
        );

    }


    bar.innerHTML = `

        <div class="compare-info">

            <strong>
                📊 Smart Comparison
            </strong>

            <span>
                ${compareList.length}
                products selected
            </span>

        </div>


        <button
            type="button"
            id="openCompareBtn"
        >
            Compare Now
        </button>


        <button
            type="button"
            id="clearCompareBtn"
        >
            ✕
        </button>

    `;


    document
        .getElementById(
            "openCompareBtn"
        )
        ?.addEventListener(
            "click",
            openCompareModal
        );


    document
        .getElementById(
            "clearCompareBtn"
        )
        ?.addEventListener(
            "click",
            clearCompare
        );

}


/* =========================================================
   CLEAR COMPARE
========================================================= */

function clearCompare() {

    compareList = [];


    const bar =
        document.querySelector(
            ".compare-floating-bar"
        );


    bar?.remove();


    showToast(
        "Comparison cleared"
    );

}


/* =========================================================
   OPEN COMPARE MODAL
========================================================= */

function openCompareModal() {

    if (
        compareList.length < 2
    ) {

        showToast(
            "Select at least 2 products"
        );

        return;

    }


    const modal =
        document.createElement(
            "div"
        );


    modal.className =
        "modal-overlay";


    modal.innerHTML = `

        <div class="product-modal compare-modal">

            <button
                class="modal-close"
                type="button"
            >
                ×
            </button>


            <h2>
                📊 Smart Product Comparison
            </h2>


            <div class="compare-table-wrapper">

                <table class="compare-table">

                    <thead>

                        <tr>

                            <th>
                                Feature
                            </th>

                            ${compareList
                                .map(
                                    product => `
                                    <th>
                                        ${product.icon}
                                        <br>
                                        ${product.name}
                                    </th>
                                `
                                )
                                .join("")}

                        </tr>

                    </thead>


                    <tbody>

                        ${createCompareRow(
                            "Price",
                            compareList.map(
                                p =>
                                    `₹${p.price}`
                            )
                        )}


                        ${createCompareRow(
                            "Rating",
                            compareList.map(
                                p =>
                                    `⭐ ${p.rating}`
                            )
                        )}


                        ${createCompareRow(
                            "Reviews",
                            compareList.map(
                                p =>
                                    p.reviews
                            )
                        )}


                        ${createCompareRow(
                            "Trust Score",
                            compareList.map(
                                p =>
                                    `${p.trustScore}/100`
                            )
                        )}


                        ${createCompareRow(
                            "Verified Seller",
                            compareList.map(
                                p =>
                                    p.verifiedSeller
                                        ? "✓ Yes"
                                        : "No"
                            )
                        )}

                    </tbody>

                </table>

            </div>

        </div>

    `;


    document.body.appendChild(
        modal
    );


    modal
        .querySelector(
            ".modal-close"
        )
        ?.addEventListener(
            "click",
            () => modal.remove()
        );


    modal.addEventListener(
        "click",
        event => {

            if (
                event.target === modal
            ) {

                modal.remove();

            }

        }
    );

}


/* =========================================================
   COMPARE ROW
========================================================= */

function createCompareRow(
    label,
    values
) {

    return `

        <tr>

            <td>
                <strong>
                    ${label}
                </strong>
            </td>

            ${values
                .map(
                    value => `
                        <td>
                            ${value}
                        </td>
                    `
                )
                .join("")}

        </tr>

    `;

          }
/* =========================================================
   WIZ COMMERCE
   PRODUCTS.JS — PART 4/4
   Video Modal + Toast + Animation + Navigation
========================================================= */


/* =========================================================
   REAL PRODUCT VIDEO MODAL
========================================================= */

function openVideoModal(product) {

    const modal =
        document.createElement(
            "div"
        );


    modal.className =
        "modal-overlay";


    modal.innerHTML = `

        <div class="product-modal">

            <button
                class="modal-close"
                type="button"
            >
                ×
            </button>


            <div class="modal-video-area">

                <div
                    class="modal-video-placeholder"
                >

                    <div class="play-icon">
                        ▶
                    </div>

                    <strong>
                        Real Product Video
                    </strong>

                    <small>
                        Actual product demonstration
                    </small>

                </div>

            </div>


            <div class="modal-content">

                <span class="verified-video">
                    🔐 Verified Product Video
                </span>


                <h2>
                    ${product.name}
                </h2>


                <p>
                    See how the actual product
                    looks and works before buying.
                </p>


                <div class="modal-trust">

                    <span>
                        🛡️ Product Trust Score
                    </span>

                    <strong>
                        ${product.trustScore}/100
                    </strong>

                </div>


                <div class="video-features">

                    <div>
                        ✓ Actual Product
                    </div>

                    <div>
                        ✓ Verified Seller
                    </div>

                    <div>
                        ✓ Quality Checked
                    </div>

                </div>


                <button
                    class="modal-buy-btn"
                    type="button"
                >
                    🛒 Add to Cart
                </button>

            </div>

        </div>

    `;


    document.body.appendChild(
        modal
    );


    modal
        .querySelector(
            ".modal-close"
        )
        ?.addEventListener(
            "click",
            () => modal.remove()
        );


    modal
        .querySelector(
            ".modal-buy-btn"
        )
        ?.addEventListener(
            "click",
            () => {

                addToCart(
                    product.id
                );

                modal.remove();

            }
        );


    modal.addEventListener(
        "click",
        event => {

            if (
                event.target === modal
            ) {

                modal.remove();

            }

        }
    );

}


/* =========================================================
   ESC KEY MODAL CLOSE
========================================================= */

function setupModal() {

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape"
            ) {

                document
                    .querySelectorAll(
                        ".modal-overlay"
                    )
                    .forEach(
                        modal =>
                            modal.remove()
                    );

            }

        }
    );

}


/* =========================================================
   NAVIGATION
========================================================= */

function setupNavigation() {

    document
        .querySelectorAll(
            ".nav-container a"
        )
        .forEach(
            link => {

                link.addEventListener(
                    "click",
                    () => {

                        document
                            .querySelectorAll(
                                ".nav-container a"
                            )
                            .forEach(
                                item =>
                                    item.classList.remove(
                                        "active"
                                    )
                            );


                        link.classList.add(
                            "active"
                        );

                    }
                );

            }
        );

}


/* =========================================================
   TOAST MESSAGE
========================================================= */

function showToast(
    message
) {

    let toast =
        document.querySelector(
            ".wiz-toast"
        );


    if (!toast) {

        toast =
            document.createElement(
                "div"
            );


        toast.className =
            "wiz-toast";


        toast.style.cssText = `

            position: fixed;
            right: 20px;
            bottom: 20px;
            z-index: 6000;

            padding: 13px 18px;

            border-radius: 10px;

            background: #0f172a;
            color: #ffffff;

            font-size: 12px;
            font-weight: 600;

            box-shadow:
                0 12px 30px
                rgba(0,0,0,.20);

            transform:
                translateY(20px);

            opacity: 0;

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
        toast.hideTimer
    );


    toast.hideTimer =
        setTimeout(
            () => {

                toast.style.opacity =
                    "0";

                toast.style.transform =
                    "translateY(20px)";

            },
            2200
        );

}


/* =========================================================
   PAGE ANIMATION
========================================================= */

function animatePage() {

    const elements =
        document.querySelectorAll(
            ".product-card, .filter-sidebar, .products-title"
        );


    if (
        !("IntersectionObserver"
            in window)
    ) {

        elements.forEach(
            element =>
                element.classList.add(
                    "visible"
                )
        );

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

                            entry.target.classList.add(
                                "visible"
                            );

                        }

                    }
                );

            },
            {
                threshold: 0.1
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
   CART BUTTON
========================================================= */

document.addEventListener(
    "click",
    event => {

        const cartButton =
            event.target.closest(
                ".cart-action"
            );


        if (
            cartButton &&
            !event.target.closest(
                ".cart-action span"
            )
        ) {

            window.location.href =
                "cart.html";

        }

    }
);


/* =========================================================
   URL CATEGORY FILTER
========================================================= */

function applyURLFilters() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const category =
        params.get(
            "category"
        );


    if (!category) return;


    const categoryInput =
        document.querySelector(
            `input[name="category"][value="${category}"]`
        );


    if (categoryInput) {

        categoryInput.checked =
            true;

        applyAllFilters();

    }

}


window.addEventListener(
    "load",
    applyURLFilters
);


/* =========================================================
   DEBOUNCE
========================================================= */

function debounce(
    callback,
    delay
) {

    let timer;


    return function (...args) {

        clearTimeout(
            timer
        );


        timer =
            setTimeout(
                () =>
                    callback.apply(
                        this,
                        args
                    ),
                delay
            );

    };

}


/* =========================================================
   GLOBAL FUNCTIONS
========================================================= */

window.clearAllFilters =
    clearAllFilters;

window.addToCart =
    addToCart;

window.toggleWishlist =
    toggleWishlist;

window.addToCompare =
    addToCompare;


/* =========================================================
   WIZ COMMERCE READY
========================================================= */

console.log(
    "🛍️ Wiz Commerce Products System Loaded Successfully"
);
