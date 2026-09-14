"use strict";

/* =====================================================
   WIZ COMMERCE - PRODUCTS.JS
   Complete Single-Part Version
===================================================== */


/* =====================================================
   PRODUCT DATA
===================================================== */

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
        seller: "IMA Verified Store",
        verifiedSeller: true,
        image: "assets/images/bulb.jpg",
        delivery: "2-4 Days",
        warranty: "1 Year",
        returnDays: 7
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
        image: "assets/images/fan.jpg",
        delivery: "3-5 Days",
        warranty: "6 Months",
        returnDays: 7
    },

    {
        id: 3,
        name: "Kitchen Storage Box",
        category: "Kitchen",
        price: 249,
        oldPrice: 399,
        discount: 38,
        rating: 4.4,
        reviews: 64,
        trustScore: 89,
        seller: "Kitchen Hub",
        verifiedSeller: true,
        image: "assets/images/storage-box.jpg",
        delivery: "2-5 Days",
        warranty: "6 Months",
        returnDays: 7
    },

    {
        id: 4,
        name: "Wireless Bluetooth Speaker",
        category: "Electronics",
        price: 599,
        oldPrice: 999,
        discount: 40,
        rating: 4.7,
        reviews: 214,
        trustScore: 96,
        seller: "Tech World",
        verifiedSeller: true,
        image: "assets/images/speaker.jpg",
        delivery: "2-4 Days",
        warranty: "1 Year",
        returnDays: 7
    },

    {
        id: 5,
        name: "Smart Watch",
        category: "Electronics",
        price: 799,
        oldPrice: 1499,
        discount: 47,
        rating: 4.5,
        reviews: 176,
        trustScore: 93,
        seller: "Digital Store",
        verifiedSeller: true,
        image: "assets/images/smartwatch.jpg",
        delivery: "3-5 Days",
        warranty: "1 Year",
        returnDays: 7
    },

    {
        id: 6,
        name: "Cotton Casual Shirt",
        category: "Fashion",
        price: 449,
        oldPrice: 799,
        discount: 44,
        rating: 4.3,
        reviews: 92,
        trustScore: 88,
        seller: "Fashion Point",
        verifiedSeller: true,
        image: "assets/images/shirt.jpg",
        delivery: "3-6 Days",
        warranty: "No Warranty",
        returnDays: 7
    }

];


/* =====================================================
   DOM ELEMENTS
===================================================== */

const productGrid =
    document.getElementById("productGrid");

const searchInput =
    document.getElementById("searchInput");

const categorySelect =
    document.getElementById("categorySelect");

const noProducts =
    document.getElementById("noProducts");


/* =====================================================
   INITIALIZE
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        renderProducts(products);

        setupSearch();

        setupCategoryFilter();

    }
);


/* =====================================================
   RENDER PRODUCTS
===================================================== */

function renderProducts(productList) {

    if (!productGrid) {
        console.error(
            "productGrid element not found."
        );

        return;
    }


    productGrid.innerHTML = "";


    if (
        !productList ||
        productList.length === 0
    ) {

        if (noProducts) {
            noProducts.style.display =
                "block";
        }

        return;

    }


    if (noProducts) {
        noProducts.style.display =
            "none";
    }


    productList.forEach(
        function (product) {

            productGrid.innerHTML +=
                createProductCard(product);

        }
    );

}


/* =====================================================
   CREATE PRODUCT CARD
===================================================== */

function createProductCard(product) {

    return `

        <div
            class="product-card"
            data-id="${product.id}"
        >

            <div class="product-image">

                <img
                    src="${product.image}"
                    alt="${escapeHTML(product.name)}"
                    onerror="
                        this.style.display='none';
                    "
                >

                <span class="discount-badge">
                    ${product.discount}% OFF
                </span>

            </div>


            <div class="product-info">

                <span class="product-category">
                    ${escapeHTML(product.category)}
                </span>


                <h3 class="product-name">
                    ${escapeHTML(product.name)}
                </h3>


                <div class="rating">

                    ⭐ ${product.rating}

                    <span>
                        (${product.reviews})
                    </span>

                </div>


                <div class="price-row">

                    <strong class="product-price">
                        ₹${formatPrice(product.price)}
                    </strong>

                    <del>
                        ₹${formatPrice(product.oldPrice)}
                    </del>

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
                        🏪
                        ${escapeHTML(product.seller)}
                    </span>

                    ${
                        product.verifiedSeller
                            ? `
                                <span
                                    class="verified-badge"
                                >
                                    ✓ Verified
                                </span>
                              `
                            : ""
                    }

                </div>


                <div class="product-actions">

                    <button
                        type="button"
                        class="compare-btn"
                        onclick="
                            addProductToCompare(
                                ${product.id}
                            )
                        "
                    >
                        📊 Compare
                    </button>


                    <button
                        type="button"
                        class="cart-btn"
                        onclick="
                            addToCart(
                                ${product.id}
                            )
                        "
                    >
                        🛒 Cart
                    </button>

                </div>


                <button
                    type="button"
                    class="view-product-btn"
                    onclick="
                        openProductDetails(
                            ${product.id}
                        )
                    "
                >
                    View Product
                </button>

            </div>

        </div>

    `;

}


/* =====================================================
   SEARCH
===================================================== */

function setupSearch() {

    if (!searchInput) {
        return;
    }


    searchInput.addEventListener(
        "input",
        applyFilters
    );

}


/* =====================================================
   CATEGORY FILTER
===================================================== */

function setupCategoryFilter() {

    if (!categorySelect) {
        return;
    }


    categorySelect.addEventListener(
        "change",
        applyFilters
    );

}


/* =====================================================
   APPLY SEARCH + CATEGORY
===================================================== */

function applyFilters() {

    const searchValue =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";


    const categoryValue =
        categorySelect
            ? categorySelect.value
            : "All";


    const filteredProducts =
        products.filter(
            function (product) {

                const matchesSearch =
                    product.name
                        .toLowerCase()
                        .includes(
                            searchValue
                        );


                const matchesCategory =
                    categoryValue === "All" ||
                    product.category ===
                    categoryValue;


                return (
                    matchesSearch &&
                    matchesCategory
                );

            }
        );


    renderProducts(
        filteredProducts
    );

}


/* =====================================================
   OPEN PRODUCT DETAILS
===================================================== */

function openProductDetails(
    productId
) {

    const product =
        products.find(
            function (item) {

                return Number(item.id) ===
                    Number(productId);

            }
        );


    if (!product) {

        alert(
            "Product not found."
        );

        return;

    }


    window.location.href =
        "product-details.html?id=" +
        product.id;

}


/* =====================================================
   ADD TO COMPARE
===================================================== */

function addProductToCompare(
    productId
) {

    const product =
        products.find(
            function (item) {

                return Number(item.id) ===
                    Number(productId);

            }
        );


    if (!product) {

        alert(
            "Product not found."
        );

        return;

    }


    let compareProducts = [];


    try {

        compareProducts =
            JSON.parse(
                localStorage.getItem(
                    "wizCompare"
                )
            ) || [];

    } catch (error) {

        console.error(
            "Compare storage error:",
            error
        );

        compareProducts = [];

    }


    const alreadyAdded =
        compareProducts.some(
            function (item) {

                return Number(item.id) ===
                    Number(product.id);

            }
        );


    if (alreadyAdded) {

        alert(
            "This product is already added to Compare."
        );

        window.location.href =
            "compare.html";

        return;

    }


    if (
        compareProducts.length >= 4
    ) {

        alert(
            "You can compare maximum 4 products."
        );

        return;

    }


    compareProducts.push(product);


    localStorage.setItem(
        "wizCompare",
        JSON.stringify(
            compareProducts
        )
    );


    alert(
        "✓ Product added to Compare"
    );


    window.location.href =
        "compare.html";

}


/* =====================================================
   ADD TO CART
===================================================== */

function addToCart(
    productId
) {

    const product =
        products.find(
            function (item) {

                return Number(item.id) ===
                    Number(productId);

            }
        );


    if (!product) {

        alert(
            "Product not found."
        );

        return;

    }


    let cart = [];


    try {

        cart =
            JSON.parse(
                localStorage.getItem(
                    "wizCart"
                )
            ) || [];

    } catch (error) {

        console.error(
            "Cart storage error:",
            error
        );

        cart = [];

    }


    const existing =
        cart.find(
            function (item) {

                return Number(item.id) ===
                    Number(product.id);

            }
        );


    if (existing) {

        existing.quantity =
            Number(
                existing.quantity || 1
            ) + 1;

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


    showToast(
        "✓ Product added to cart"
    );

}


/* =====================================================
   TOAST MESSAGE
===================================================== */

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


        toast.style.position =
            "fixed";

        toast.style.bottom =
            "25px";

        toast.style.left =
            "50%";

        toast.style.transform =
            "translateX(-50%)";

        toast.style.background =
            "#2563eb";

        toast.style.color =
            "#ffffff";

        toast.style.padding =
            "12px 18px";

        toast.style.borderRadius =
            "10px";

        toast.style.fontSize =
            "13px";

        toast.style.fontWeight =
            "700";

        toast.style.zIndex =
            "9999";

        toast.style.boxShadow =
            "0 8px 25px rgba(0,0,0,.2)";


        document.body.appendChild(
            toast
        );

    }


    toast.textContent =
        message;


    toast.style.display =
        "block";


    clearTimeout(
        window.wizToastTimer
    );


    window.wizToastTimer =
        setTimeout(
            function () {

                toast.style.display =
                    "none";

            },
            2200
        );

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
   ESCAPE HTML
===================================================== */

function escapeHTML(
    value
) {

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


/* =====================================================
   GLOBAL FUNCTIONS
===================================================== */

window.products =
    products;

window.renderProducts =
    renderProducts;

window.openProductDetails =
    openProductDetails;

window.addProductToCompare =
    addProductToCompare;

window.addToCart =
    addToCart;

window.applyFilters =
    applyFilters;

window.showToast =
    showToast;
