/* =====================================================
   WIZ COMMERCE
   MAIN JAVASCRIPT + ANIMATIONS
===================================================== */


/* =====================================================
   1. CART SYSTEM
===================================================== */

let cartCount =
    parseInt(localStorage.getItem("wizCartCount")) || 0;

function updateCartDisplay() {

    const cartElement =
        document.getElementById("cartCount");

    if (cartElement) {

        cartElement.textContent = cartCount;

        // Small cart bounce animation
        cartElement.animate(
            [
                {
                    transform: "scale(1)"
                },
                {
                    transform: "scale(1.4)"
                },
                {
                    transform: "scale(1)"
                }
            ],
            {
                duration: 350,
                easing: "ease-out"
            }
        );
    }
}


function addToCart(productName) {

    cartCount++;

    localStorage.setItem(
        "wizCartCount",
        cartCount
    );

    updateCartDisplay();

    showNotification(
        `✓ ${productName} added to cart`
    );
}


/* =====================================================
   2. COMPARE SYSTEM
===================================================== */

let compareProducts =
    JSON.parse(
        localStorage.getItem("wizCompare")
    ) || [];


function addToCompare(productName) {

    if (
        compareProducts.includes(productName)
    ) {

        showNotification(
            "⚠️ Product already added to compare"
        );

        return;
    }


    if (compareProducts.length >= 3) {

        showNotification(
            "⚠️ You can compare maximum 3 products"
        );

        return;
    }


    compareProducts.push(productName);


    localStorage.setItem(
        "wizCompare",
        JSON.stringify(compareProducts)
    );


    showNotification(
        `✓ ${productName} added to comparison`
    );
}


/* =====================================================
   3. NOTIFICATION ANIMATION
===================================================== */

function showNotification(message) {

    const existing =
        document.querySelector(
            ".wiz-notification"
        );

    if (existing) {
        existing.remove();
    }


    const notification =
        document.createElement("div");

    notification.className =
        "wiz-notification";

    notification.textContent =
        message;


    notification.style.position =
        "fixed";

    notification.style.bottom =
        "25px";

    notification.style.right =
        "25px";

    notification.style.zIndex =
        "99999";

    notification.style.background =
        "#0e1726";

    notification.style.color =
        "#ffffff";

    notification.style.padding =
        "14px 20px";

    notification.style.borderRadius =
        "10px";

    notification.style.fontSize =
        "13px";

    notification.style.fontWeight =
        "600";

    notification.style.boxShadow =
        "0 15px 40px rgba(0,0,0,.2)";

    notification.style.transform =
        "translateY(30px)";

    notification.style.opacity =
        "0";


    document.body.appendChild(
        notification
    );


    // Enter animation

    requestAnimationFrame(() => {

        notification.style.transition =
            "all .35s ease";

        notification.style.transform =
            "translateY(0)";

        notification.style.opacity =
            "1";

    });


    // Exit animation

    setTimeout(() => {

        notification.style.transform =
            "translateY(20px)";

        notification.style.opacity =
            "0";


        setTimeout(() => {

            notification.remove();

        }, 350);

    }, 2200);
}


/* =====================================================
   4. SCROLL REVEAL ANIMATION
===================================================== */

function setupScrollAnimations() {

    const animatedElements =
        document.querySelectorAll(
            ".trust-card, " +
            ".category-card, " +
            ".product-card, " +
            ".step, " +
            ".hero-card, " +
            ".customer-stats div"
        );


    animatedElements.forEach(
        (element, index) => {

            element.style.opacity =
                "0";

            element.style.transform =
                "translateY(35px)";

            element.style.transition =
                "opacity .6s ease, " +
                "transform .6s ease";

            // Small stagger delay
            element.dataset.delay =
                (index % 6) * 80;
        }
    );


    const observer =
        new IntersectionObserver(
            (entries) => {

                entries.forEach(
                    (entry) => {

                        if (
                            entry.isIntersecting
                        ) {

                            const element =
                                entry.target;

                            const delay =
                                parseInt(
                                    element.dataset.delay
                                ) || 0;


                            setTimeout(() => {

                                element.style.opacity =
                                    "1";

                                element.style.transform =
                                    "translateY(0)";

                            }, delay);


                            observer.unobserve(
                                element
                            );
                        }

                    }
                );

            },
            {
                threshold: 0.12
            }
        );


    animatedElements.forEach(
        element => {

            observer.observe(
                element
            );

        }
    );
}


/* =====================================================
   5. HERO ENTRANCE ANIMATION
===================================================== */

function heroAnimation() {

    const badge =
        document.querySelector(
            ".hero-badge"
        );

    const heading =
        document.querySelector(
            ".hero-content h1"
        );

    const paragraph =
        document.querySelector(
            ".hero-content > p"
        );

    const buttons =
        document.querySelector(
            ".hero-buttons"
        );

    const trust =
        document.querySelector(
            ".hero-trust"
        );

    const heroCard =
        document.querySelector(
            ".hero-card"
        );


    const elements = [
        badge,
        heading,
        paragraph,
        buttons,
        trust
    ];


    elements.forEach(
        (element) => {

            if (!element) return;

            element.style.opacity =
                "0";

            element.style.transform =
                "translateY(25px)";

        }
    );


    elements.forEach(
        (element, index) => {

            if (!element) return;

            setTimeout(
                () => {

                    element.style.transition =
                        "all .7s cubic-bezier(.2,.8,.2,1)";

                    element.style.opacity =
                        "1";

                    element.style.transform =
                        "translateY(0)";

                },
                150 + index * 140
            );

        }
    );


    if (heroCard) {

        heroCard.style.opacity =
            "0";

        heroCard.style.transform =
            "translateX(50px) rotate(2deg)";


        setTimeout(
            () => {

                heroCard.style.transition =
                    "all .9s cubic-bezier(.2,.8,.2,1)";

                heroCard.style.opacity =
                    "1";

                heroCard.style.transform =
                    "translateX(0) rotate(2deg)";

            },
            350
        );
    }
}


/* =====================================================
   6. HERO CARD FLOATING ANIMATION
===================================================== */

function heroFloatingAnimation() {

    const card =
        document.querySelector(
            ".hero-card"
        );

    if (!card) return;


    let direction = 1;

    setInterval(
        () => {

            card.animate(
                [
                    {
                        transform:
                            "translateY(0) rotate(2deg)"
                    },
                    {
                        transform:
                            `translateY(${
                                direction * 8
                            }px) rotate(2deg)`
                    },
                    {
                        transform:
                            "translateY(0) rotate(2deg)"
                    }
                ],
                {
                    duration: 2600,
                    easing: "ease-in-out"
                }
            );

            direction *= -1;

        },
        2600
    );
}


/* =====================================================
   7. PRODUCT CARD HOVER EFFECT
===================================================== */

function setupProductHover() {

    const cards =
        document.querySelectorAll(
            ".product-card"
        );


    cards.forEach(
        (card) => {

            card.addEventListener(
                "mouseenter",
                () => {

                    card.style.transition =
                        "transform .25s ease, box-shadow .25s ease";

                    card.style.transform =
                        "translateY(-7px)";

                    card.style.boxShadow =
                        "0 18px 45px rgba(20,40,80,.12)";

                }
            );


            card.addEventListener(
                "mouseleave",
                () => {

                    card.style.transform =
                        "translateY(0)";

                    card.style.boxShadow =
                        "none";

                }
            );

        }
    );
}


/* =====================================================
   8. CATEGORY HOVER EFFECT
===================================================== */

function setupCategoryHover() {

    const categories =
        document.querySelectorAll(
            ".category-card"
        );


    categories.forEach(
        (category) => {

            const icon =
                category.querySelector(
                    ".category-image"
                );


            category.addEventListener(
                "mouseenter",
                () => {

                    if (!icon) return;


                    icon.animate(
                        [
                            {
                                transform:
                                    "scale(1)"
                            },
                            {
                                transform:
                                    "scale(1.12) rotate(4deg)"
                            },
                            {
                                transform:
                                    "scale(1)"
                            }
                        ],
                        {
                            duration: 400,
                            easing: "ease-out"
                        }
                    );

                }
            );

        }
    );
}


/* =====================================================
   9. FEATURE ICON ANIMATION
===================================================== */

function setupFeatureAnimation() {

    const cards =
        document.querySelectorAll(
            ".trust-card"
        );


    cards.forEach(
        (card) => {

            const icon =
                card.querySelector(
                    ".trust-icon"
                );


            card.addEventListener(
                "mouseenter",
                () => {

                    if (!icon) return;


                    icon.animate(
                        [
                            {
                                transform:
                                    "scale(1)"
                            },
                            {
                                transform:
                                    "scale(1.15) rotate(-5deg)"
                            },
                            {
                                transform:
                                    "scale(1)"
                            }
                        ],
                        {
                            duration: 450,
                            easing: "ease-out"
                        }
                    );

                }
            );

        }
    );
}


/* =====================================================
   10. SEARCH ANIMATION
===================================================== */

function setupSearch() {

    const input =
        document.getElementById(
            "searchInput"
        );

    const button =
        document.getElementById(
            "searchBtn"
        );


    if (!input || !button) {
        return;
    }


    input.addEventListener(
        "focus",
        () => {

            input.parentElement.style.transition =
                "all .25s ease";

            input.parentElement.style.transform =
                "scale(1.01)";

            input.parentElement.style.boxShadow =
                "0 0 0 3px rgba(23,105,255,.10)";

        }
    );


    input.addEventListener(
        "blur",
        () => {

            input.parentElement.style.transform =
                "scale(1)";

            input.parentElement.style.boxShadow =
                "none";

        }
    );


    function performSearch() {

        const value =
            input.value.trim();


        if (!value) {

            input.animate(
                [
                    {
                        transform:
                            "translateX(0)"
                    },
                    {
                        transform:
                            "translateX(-6px)"
                    },
                    {
                        transform:
                            "translateX(6px)"
                    },
                    {
                        transform:
                            "translateX(-4px)"
                    },
                    {
                        transform:
                            "translateX(0)"
                    }
                ],
                {
                    duration: 350
                }
            );


            showNotification(
                "🔍 Please enter a product name"
            );

            return;
        }


        button.animate(
            [
                {
                    transform:
                        "scale(1)"
                },
                {
                    transform:
                        "scale(.85)"
                },
                {
                    transform:
                        "scale(1)"
                }
            ],
            {
                duration: 250
            }
        );


        setTimeout(
            () => {

                window.location.href =
                    `products.html?search=${
                        encodeURIComponent(value)
                    }`;

            },
            250
        );
    }


    button.addEventListener(
        "click",
        performSearch
    );


    input.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Enter"
            ) {

                performSearch();

            }

        }
    );
}


/* =====================================================
   11. BUTTON CLICK RIPPLE
===================================================== */

function setupButtonRipple() {

    const buttons =
        document.querySelectorAll(
            ".btn, " +
            ".cart-btn, " +
            ".compare-btn, " +
            ".video-btn"
        );


    buttons.forEach(
        (button) => {

            button.style.position =
                "relative";

            button.style.overflow =
                "hidden";


            button.addEventListener(
                "click",
                function(event) {

                    const ripple =
                        document.createElement(
                            "span"
                        );


                    const rect =
                        button.getBoundingClientRect();


                    const size =
                        Math.max(
                            rect.width,
                            rect.height
                        );


                    ripple.style.position =
                        "absolute";

                    ripple.style.width =
                        size + "px";

                    ripple.style.height =
                        size + "px";

                    ripple.style.borderRadius =
                        "50%";

                    ripple.style.background =
                        "rgba(255,255,255,.25)";

                    ripple.style.left =
                        (
                            event.clientX -
                            rect.left -
                            size / 2
                        ) + "px";

                    ripple.style.top =
                        (
                            event.clientY -
                            rect.top -
                            size / 2
                        ) + "px";

                    ripple.style.pointerEvents =
                        "none";

                    ripple.style.transform =
                        "scale(0)";

                    ripple.style.opacity =
                        "1";


                    button.appendChild(
                        ripple
                    );


                    ripple.animate(
                        [
                            {
                                transform:
                                    "scale(0)",
                                opacity: 1
                            },
                            {
                                transform:
                                    "scale(2)",
                                opacity: 0
                            }
                        ],
                        {
                            duration: 550,
                            easing: "ease-out"
                        }
                    );


                    setTimeout(
                        () => {

                            ripple.remove();

                        },
                        600
                    );

                }
            );

        }
    );
}


/* =====================================================
   12. STEP ICON ANIMATION
===================================================== */

function setupStepAnimation() {

    const steps =
        document.querySelectorAll(
            ".step"
        );


    steps.forEach(
        (step) => {

            const icon =
                step.querySelector(
                    ".step-icon"
                );


            step.addEventListener(
                "mouseenter",
                () => {

                    if (!icon) return;


                    icon.animate(
                        [
                            {
                                transform:
                                    "scale(1)"
                            },
                            {
                                transform:
                                    "scale(1.15)"
                            },
                            {
                                transform:
                                    "scale(1)"
                            }
                        ],
                        {
                            duration: 400
                        }
                    );

                }
            );

        }
    );
}


/* =====================================================
   13. BACK TO TOP BUTTON
===================================================== */

function createBackToTop() {

    const button =
        document.createElement(
            "button"
        );


    button.innerHTML =
        "↑";


    button.className =
        "wiz-back-top";


    button.style.position =
        "fixed";

    button.style.right =
        "22px";

    button.style.bottom =
        "22px";

    button.style.width =
        "42px";

    button.style.height =
        "42px";

    button.style.border =
        "none";

    button.style.borderRadius =
        "50%";

    button.style.background =
        "#1769ff";

    button.style.color =
        "white";

    button.style.fontSize =
        "20px";

    button.style.cursor =
        "pointer";

    button.style.zIndex =
        "9998";

    button.style.opacity =
        "0";

    button.style.transform =
        "translateY(20px)";

    button.style.pointerEvents =
        "none";

    button.style.transition =
        "all .3s ease";


    document.body.appendChild(
        button
    );


    window.addEventListener(
        "scroll",
        () => {

            if (
                window.scrollY > 500
            ) {

                button.style.opacity =
                    "1";

                button.style.transform =
                    "translateY(0)";

                button.style.pointerEvents =
                    "auto";

            } else {

                button.style.opacity =
                    "0";

                button.style.transform =
                    "translateY(20px)";

                button.style.pointerEvents =
                    "none";

            }

        }
    );


    button.addEventListener(
        "click",
        () => {

            window.scrollTo(
                {
                    top: 0,
                    behavior: "smooth"
                }
            );

        }
    );
}


/* =====================================================
   14. PAGE LOAD
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        updateCartDisplay();

        heroAnimation();

        heroFloatingAnimation();

        setupScrollAnimations();

        setupProductHover();

        setupCategoryHover();

        setupFeatureAnimation();

        setupSearch();

        setupButtonRipple();

        setupStepAnimation();

        createBackToTop();

    }
);
