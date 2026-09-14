/* =====================================================
   WIZ COMMERCE
   SMART PRODUCT COMPARISON JS
   PART 1/4
===================================================== */

"use strict";


/* =========================================
   GLOBAL DATA
========================================= */

let compareProducts = [];


/* =========================================
   SAMPLE PRODUCTS
========================================= */

const defaultProducts = [

    {
        id: 1,

        name:
            "Smart LED Bulb",

        price:
            299,

        oldPrice:
            499,

        rating:
            4.6,

        reviews:
            128,

        trustScore:
            94,

        seller:
            "IMA Verified Store",

        verifiedSeller:
            true,

        image:
            "assets/images/bulb.jpg",

        category:
            "Electronics",

        delivery:
            "2-4 Days",

        warranty:
            "1 Year",

        returnDays:
            7
    },


    {
        id: 2,

        name:
            "Portable Mini Fan",

        price:
            399,

        oldPrice:
            699,

        rating:
            4.5,

        reviews:
            87,

        trustScore:
            91,

        seller:
            "Smart Deals",

        verifiedSeller:
            true,

        image:
            "assets/images/fan.jpg",

        category:
            "Electronics",

        delivery:
            "3-5 Days",

        warranty:
            "6 Months",

        returnDays:
            7
    },


    {
        id: 3,

        name:
            "Kitchen Storage Box",

        price:
            249,

        oldPrice:
            399,

        rating:
            4.4,

        reviews:
            64,

        trustScore:
            89,

        seller:
            "Kitchen Hub",

        verifiedSeller:
            true,

        image:
            "assets/images/storage-box.jpg",

        category:
            "Kitchen",

        delivery:
            "2-5 Days",

        warranty:
            "6 Months",

        returnDays:
            7
    }

];


/* =========================================
   LOAD PRODUCTS
========================================= */

function loadCompareProducts() {

    const saved =
        localStorage.getItem(
            "wizCompare"
        );


    if (!saved) {

        compareProducts = [];

        return;

    }


    try {

        const parsed =
            JSON.parse(saved);


        if (
            Array.isArray(parsed)
        ) {

            compareProducts =
                parsed;

        } else {

            compareProducts = [];

        }

    } catch (error) {

        console.error(
            "Compare data error:",
            error
        );

        compareProducts = [];

    }

}


/* =========================================
   SAVE PRODUCTS
========================================= */

function saveCompareProducts() {

    localStorage.setItem(
        "wizCompare",
        JSON.stringify(
            compareProducts
        )
    );

}


/* =========================================
   FIND PRODUCT
========================================= */

function findProduct(
    productId
) {

    const id =
        Number(productId);


    /*
       First check compare data.
    */

    const existing =
        compareProducts.find(
            product =>
                Number(product.id) === id
        );


    if (existing) {

        return existing;

    }


    /*
       Then check sample products.
    */

    return defaultProducts.find(
        product =>
            Number(product.id) === id
    );

}
/* =====================================================
   COMPARE JS
   PART 2/4
===================================================== */


/* =========================================
   RENDER COMPARE PRODUCTS
========================================= */

function renderCompareProducts() {

    const table =
        document.getElementById(
            "comparisonTable"
        );


    const empty =
        document.getElementById(
            "emptyState"
        );


    if (!table || !empty) {

        return;

    }


    table.innerHTML = "";


    if (
        compareProducts.length === 0
    ) {

        table.style.display =
            "none";

        empty.style.display =
            "block";

        updateCompareCount();

        hideRecommendation();

        return;

    }


    table.style.display =
        "grid";

    empty.style.display =
        "none";


    compareProducts.forEach(
        product => {

            table.innerHTML +=
                createCompareCard(
                    product
                );

        }
    );


    updateCompareCount();

    updateRecommendation();

}


/* =========================================
   CREATE PRODUCT CARD
========================================= */

function createCompareCard(
    product
) {

    const verified =
        product.verifiedSeller === true;


    const image =
        product.image ||
        "assets/images/product.jpg";


    return `

        <article
            class="compare-product"
            data-id="${product.id}"
        >

            <div class="compare-image">

                <img
                    src="${image}"
                    alt="${escapeHTML(product.name)}"
                    onerror="
                        this.style.display='none';
                    "
                >

                <button
                    type="button"
                    class="remove-product"
                    onclick="removeCompareProduct(${product.id})"
                    aria-label="Remove product"
                >
                    ×
                </button>

            </div>


            <div class="compare-info">

                <h3>
                    ${escapeHTML(product.name)}
                </h3>


                <div class="compare-price">

                    ₹${formatPrice(product.price)}

                </div>


                <div class="compare-row">

                    <span>
                        Rating
                    </span>

                    <strong class="rating-value">
                        ⭐ ${product.rating || 0}
                        (${product.reviews || 0})
                    </strong>

                </div>


                <div class="compare-row">

                    <span>
                        Trust Score
                    </span>

                    <strong class="trust-value">
                        🛡️ ${product.trustScore || 0}/100
                    </strong>

                </div>


                <div class="compare-row">

                    <span>
                        Seller
                    </span>

                    <strong>
                        ${escapeHTML(
                            product.seller ||
                            "Verified Seller"
                        )}
                    </strong>

                </div>


                <div class="compare-row">

                    <span>
                        Seller Status
                    </span>

                    <strong
                        class="${
                            verified
                                ? "verified"
                                : "not-verified"
                        }"
                    >
                        ${
                            verified
                                ? "✓ Verified"
                                : "Not Verified"
                        }
                    </strong>

                </div>


                <div class="compare-row">

                    <span>
                        Delivery
                    </span>

                    <strong>
                        ${product.delivery || "3-5 Days"}
                    </strong>

                </div>


                <div class="compare-row">

                    <span>
                        Warranty
                    </span>

                    <strong>
                        ${product.warranty || "N/A"}
                    </strong>

                </div>


                <div class="compare-row">

                    <span>
                        Return
                    </span>

                    <strong>
                        ${product.returnDays || 7} Days
                    </strong>

                </div>


                <button
                    type="button"
                    class="view-product"
                    onclick="viewProduct(${product.id})"
                >
                    View Product
                </button>

            </div>

        </article>

    `;

}


/* =========================================
   REMOVE PRODUCT
========================================= */

function removeCompareProduct(
    productId
) {

    compareProducts =
        compareProducts.filter(
            product =>
                Number(product.id) !==
                Number(productId)
        );


    saveCompareProducts();

    renderCompareProducts();

}


/* =========================================
   CLEAR ALL
========================================= */

function clearCompare() {

    compareProducts = [];

    saveCompareProducts();

    renderCompareProducts();

}


/* =========================================
   UPDATE COUNT
========================================= */

function updateCompareCount() {

    const count =
        document.getElementById(
            "compareCount"
        );


    if (!count) {

        return;

    }


    const total =
        compareProducts.length;


    count.textContent =
        `${total} ${
            total === 1
                ? "product"
                : "products"
        } selected`;

              }
/* =====================================================
   COMPARE JS
   PART 3/4
===================================================== */


/* =========================================
   SMART RECOMMENDATION
========================================= */

function updateRecommendation() {

    const card =
        document.getElementById(
            "recommendationCard"
        );


    const name =
        document.getElementById(
            "recommendedProduct"
        );


    const text =
        document.getElementById(
            "recommendationText"
        );


    const score =
        document.getElementById(
            "recommendationScore"
        );


    if (
        !card ||
        !name ||
        !text ||
        !score
    ) {

        return;

    }


    if (
        compareProducts.length < 2
    ) {

        hideRecommendation();

        return;

    }


    /*
       Smart score formula:

       Trust Score = 40%
       Rating = 30%
       Reviews = 10%
       Price value = 20%
    */


    const scoredProducts =
        compareProducts.map(
            product => {

                const trust =
                    Number(
                        product.trustScore || 0
                    );


                const rating =
                    Number(
                        product.rating || 0
                    );


                const reviews =
                    Math.min(
                        Number(
                            product.reviews || 0
                        ),
                        200
                    );


                const price =
                    Number(
                        product.price || 0
                    );


                const priceScore =
                    price > 0
                        ? Math.max(
                            0,
                            100 -
                            (price / 10)
                        )
                        : 0;


                const smartScore =
                    (
                        trust * 0.40
                    ) +
                    (
                        rating * 20 * 0.30
                    ) +
                    (
                        reviews / 2 * 0.10
                    ) +
                    (
                        priceScore * 0.20
                    );


                return {

                    product,

                    smartScore

                };

            }
        );


    scoredProducts.sort(
        (
            a,
            b
        ) =>
            b.smartScore -
            a.smartScore
    );


    const winner =
        scoredProducts[0];


    if (!winner) {

        hideRecommendation();

        return;

    }


    name.textContent =
        winner.product.name;


    text.textContent =
        "Based on trust score, rating, reviews and price, this product offers the best overall value among your selected products.";


    score.textContent =
        Math.round(
            winner.smartScore
        );


    card.classList.add(
        "show"
    );


    markWinner(
        winner.product.id
    );

}


/* =========================================
   MARK WINNER
========================================= */

function markWinner(
    winnerId
) {

    const cards =
        document.querySelectorAll(
            ".compare-product"
        );


    cards.forEach(
        card => {

            const oldBadge =
                card.querySelector(
                    ".winner-badge"
                );


            if (oldBadge) {

                oldBadge.remove();

            }


            if (
                Number(
                    card.dataset.id
                ) ===
                Number(winnerId)
            ) {

                const badge =
                    document.createElement(
                        "div"
                    );


                badge.className =
                    "winner-badge";


                badge.textContent =
                    "🏆 BEST VALUE";


                const image =
                    card.querySelector(
                        ".compare-image"
                    );


                if (image) {

                    image.appendChild(
                        badge
                    );

                }

            }

        }
    );

}


/* =========================================
   HIDE RECOMMENDATION
========================================= */

function hideRecommendation() {

    const card =
        document.getElementById(
            "recommendationCard"
        );


    if (card) {

        card.classList.remove(
            "show"
        );

    }

}


/* =========================================
   VIEW PRODUCT
========================================= */

function viewProduct(
    productId
) {

    window.location.href =
        `product-details.html?id=${productId}`;

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
   ESCAPE HTML
========================================= */

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
   COMPARE JS
   PART 4/4
===================================================== */


/* =========================================
   ADD PRODUCT TO COMPARE
   ========================================= */

function addToCompare(
    product
) {

    if (!product) {

        return false;

    }


    const alreadyExists =
        compareProducts.some(
            item =>
                Number(item.id) ===
                Number(product.id)
        );


    if (alreadyExists) {

        alert(
            "This product is already in Compare."
        );

        return false;

    }


    if (
        compareProducts.length >= 4
    ) {

        alert(
            "You can compare up to 4 products."
        );

        return false;

    }


    compareProducts.push(
        product
    );


    saveCompareProducts();


    return true;

}


/* =========================================
   INITIALIZE
========================================= */

function initializeComparePage() {

    console.log(
        "📊 Wiz Commerce Compare Page Loaded"
    );


    loadCompareProducts();


    renderCompareProducts();


    const clearButton =
        document.getElementById(
            "clearCompare"
        );


    if (clearButton) {

        clearButton.addEventListener(
            "click",
            () => {

                if (
                    compareProducts.length === 0
                ) {

                    return;

                }


                const confirmClear =
                    confirm(
                        "Remove all products from comparison?"
                    );


                if (confirmClear) {

                    clearCompare();

                }

            }
        );

    }

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
        initializeComparePage
    );

} else {

    initializeComparePage();

}


/* =========================================
   GLOBAL FUNCTIONS
========================================= */

window.addToCompare =
    addToCompare;

window.removeCompareProduct =
    removeCompareProduct;

window.clearCompare =
    clearCompare;

window.viewProduct =
    viewProduct;
