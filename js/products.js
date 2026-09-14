/* =========================================================
   WIZ COMMERCE
   PRODUCTS JS
   Product Listing + Search + Category + View Details
========================================================= */


/* =========================================================
   PRODUCT DATA
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
        image: "assets/images/bulb.png",
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
        image: "assets/images/fan.png",
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
        image: "assets/images/storage-box.png",
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
        image: "assets/images/speaker.png",
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
        image: "assets/images/tshirt.png",
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
        image: "assets/images/emergency-light.png",
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
        image: "assets/images/bottle.png",
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
        image: "assets/images/watch.png",
        icon: "⌚"
    }

];


/* =========================================================
   DOM READY
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        renderProducts(products);

        setupSearch();

        setupCategoryFilter();

        updateCartCount();

    }
);


/* =========================================================
   PRODUCT CONTAINER
========================================================= */

function getProductContainer() {

    return (
        document.getElementById("productsGrid") ||
        document.getElementById("productGrid") ||
        document.querySelector(".products-grid") ||
        document.querySelector(".product-grid")
    );

}


/* =========================================================
   RENDER PRODUCTS
========================================================= */

function renderProducts(productList) {

    const container =
        getProductContainer();


    if (!container) {

        console.error(
            "Product container not found."
        );

        return;

    }


    container.innerHTML = "";


    if (
        !productList ||
        productList.length === 0
    ) {

        container.innerHTML = `

            <div class="no-products">

                <div style="font-size:50px;">
                    🔍
                </div>

                <h3>
                    No products found
                </h3>

                <p>
                    Try another search or category.
                </p>

            </div>

        `;

        return;

    }


    productList.forEach(
        product => {

            const card =
                createProductCard(
                    product
                );


            container.appendChild(
                card
            );

        }
    );


    setupProductAnimations();

}


/* =========================================================
   CREATE PRODUCT CARD
========================================================= */

function createProductCard(
    product
) {

    const card =
        document.createElement(
            "article"
        );


    card.className =
        "product-card";


    card.dataset.productId =
        product.id;


    card.innerHTML = `

        <div class="product-image">

            <img
                src="${product.image}"
                alt="${product.name}"
                loading="lazy"
            >

            <span
                class="product-fallback"
                style="display:none;"
            >
                ${product.icon || "📦"}
            </span>

            <span class="discount-badge">
                ${product.discount}% OFF
            </span>

        </div>


        <div class="product-info">

            <div class="product-category">
                ${product.category}
            </div>


            <h3 class="product-title">
                ${product.name}
            </h3>


            <div class="product-rating">

                ⭐ ${product.rating}

                <span>
                    (${product.reviews})
                </span>

            </div>


            <div class="product-price">

                <strong>
                    ₹${product.price}
                </strong>

                <del>
                    ₹${product.oldPrice}
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
                    ${product.seller}
                </span>

                ${
                    product.verifiedSeller
                    ? `<span class="verified">
                            ✓ Verified
                       </span>`
                    : ""
                }

            </div>


            <div class="product-actions">

                <button
                    type="button"
                    class="view-product-btn"
                    data-product-id="${product.id}"
                >
                    View Product
                </button>


                <button
                    type="button"
                    class="quick-cart-btn"
                    data-product-id="${product.id}"
                >
                    🛒 Add to Cart
                </button>

            </div>

        </div>

    `;


    /* =========================================
       IMAGE FALLBACK
    ========================================= */

    const image =
        card.querySelector(
            "img"
        );


    const fallback =
        card.querySelector(
            ".product-fallback"
        );


    if (image) {

        image.addEventListener(
            "error",
            () => {

                image.style.display =
                    "none";

                if (fallback) {

                    fallback.style.display =
                        "flex";

                }

            }
        );

    }


    /* =========================================
       VIEW PRODUCT BUTTON
    ========================================= */

    const viewButton =
        card.querySelector(
            ".view-product-btn"
        );


    if (viewButton) {

        viewButton.addEventListener(
            "click",
            event => {

                event.preventDefault();

                event.stopPropagation();


                const id =
                    Number(
                        viewButton.dataset.productId
                    );


                viewProduct(id);

            }
        );

    }


    /* =========================================
       ADD TO CART BUTTON
    ========================================= */

    const cartButton =
        card.querySelector(
            ".quick-cart-btn"
        );


    if (cartButton) {

        cartButton.addEventListener(
            "click",
            event => {

                event.preventDefault();

                event.stopPropagation();


                const id =
                    Number(
                        cartButton.dataset.productId
                    );


                addProductToCart(id);

            }
        );

    }


    return card;

}


/* =========================================================
   VIEW PRODUCT
   THIS FIXES THE ID PROBLEM
========================================================= */

function viewProduct(
    productId
) {

    const product =
        products.find(
            item =>
                Number(item.id) ===
                Number(productId)
        );


    if (!product) {

        console.error(
            "Product not found:",
            productId
        );

        return;

    }


    console.log(
        "Opening product:",
        product.name,
        "ID:",
        product.id
    );


    window.location.href =
        `product-details.html?id=${product.id}`;

}


/* =========================================================
   GLOBAL VIEW PRODUCT
========================================================= */

window.viewProduct =
    viewProduct;


/* =========================================================
   SEARCH
========================================================= */

function setupSearch() {

    const searchInput =
        document.getElementById(
            "productSearch"
        ) ||
        document.getElementById(
            "searchInput"
        ) ||
        document.querySelector(
            ".product-search"
        );


    if (!searchInput) {

        return;

    }


    searchInput.addEventListener(
        "input",
        () => {

            const keyword =
                searchInput.value
                    .trim()
                    .toLowerCase();


            const filtered =
                products.filter(
                    product => {

                        return (

                            product.name
                                .toLowerCase()
                                .includes(
                                    keyword
                                )

                            ||

                            product.category
                                .toLowerCase()
                                .includes(
                                    keyword
                                )

                            ||

                            product.seller
                                .toLowerCase()
                                .includes(
                                    keyword
                                )

                        );

                    }
                );


            renderProducts(
                filtered
            );

        }
    );

}


/* =========================================================
   CATEGORY FILTER
========================================================= */

function setupCategoryFilter() {

    const categorySelect =
        document.getElementById(
            "categoryFilter"
        ) ||
        document.getElementById(
            "categorySelect"
        );


    if (!categorySelect) {

        return;

    }


    categorySelect.addEventListener(
        "change",
        () => {

            const category =
                categorySelect.value;


            if (
                !category ||
                category === "All"
            ) {

                renderProducts(
                    products
                );

                return;

            }


            const filtered =
                products.filter(
                    product =>
                        product.category ===
                        category
                );


            renderProducts(
                filtered
            );

        }
    );

}


/* =========================================================
   CART
========================================================= */

function getCart() {

    try {

        return JSON.parse(
            localStorage.getItem(
                "wizCart"
            )
        ) || [];

    } catch (error) {

        console.error(
            "Cart error:",
            error
        );

        return [];

    }

}


/* =========================================================
   ADD PRODUCT TO CART
========================================================= */

function addProductToCart(
    productId
) {

    const product =
        products.find(
            item =>
                Number(item.id) ===
                Number(productId)
        );


    if (!product) {

        showProductToast(
            "Product not found"
        );

        return;

    }


    const cart =
        getCart();


    const existing =
        cart.find(
            item =>
                Number(item.id) ===
                Number(product.id)
        );


    if (existing) {

        existing.quantity =
            Number(
                existing.quantity || 0
            ) + 1;

    } else {

        cart.push({

            id:
                product.id,

            name:
                product.name,

            price:
                product.price,

            oldPrice:
                product.oldPrice,

            category:
                product.category,

            image:
                product.image,

            icon:
                product.icon,

            quantity:
                1

        });

    }


    localStorage.setItem(
        "wizCart",
        JSON.stringify(cart)
    );


    updateCartCount();


    showProductToast(
        `✓ ${product.name} added to cart`
    );

}


window.addProductToCart =
    addProductToCart;


/* =========================================================
   UPDATE CART COUNT
========================================================= */

function updateCartCount() {

    const cart =
        getCart();


    const count =
        cart.reduce(
            (
                total,
                item
            ) => {

                return (
                    total +
                    Number(
                        item.quantity || 0
                    )
                );

            },
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
   PRODUCT ANIMATION
========================================================= */

function setupProductAnimations() {

    const cards =
        document.querySelectorAll(
            ".product-card"
        );


    cards.forEach(
        (
            card,
            index
        ) => {

            card.style.opacity =
                "0";

            card.style.transform =
                "translateY(20px)";


            card.style.transition =
                "opacity .4s ease, transform .4s ease";


            setTimeout(
                () => {

                    card.style.opacity =
                        "1";

                    card.style.transform =
                        "translateY(0)";

                },
                index * 80
            );

        }
    );

}


/* =========================================================
   TOAST
========================================================= */

function showProductToast(
    message
) {

    let toast =
        document.getElementById(
            "productsToast"
        );


    if (!toast) {

        toast =
            document.createElement(
                "div"
            );


        toast.id =
            "productsToast";


        toast.style.cssText = `

            position:fixed;
            right:20px;
            bottom:20px;
            z-index:9999;

            background:#0f172a;
            color:#fff;

            padding:13px 18px;

            border-radius:10px;

            font-size:14px;
            font-weight:600;

            box-shadow:
                0 10px 30px
                rgba(0,0,0,.2);

            opacity:0;

            transform:
                translateY(15px);

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
        window.productsToastTimer
    );


    window.productsToastTimer =
        setTimeout(
            () => {

                toast.style.opacity =
                    "0";

                toast.style.transform =
                    "translateY(15px)";

            },
            2200
        );

}


window.showProductToast =
    showProductToast;
