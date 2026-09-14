"use strict";


/* =====================================================
   WIZ COMMERCE - AI PRODUCT ADVISOR
===================================================== */


/* =====================================================
   PRODUCT DATA
===================================================== */

const advisorProducts = [

    {
        id: 1,
        name: "Smart LED Bulb",
        category: "Electronics",
        price: 299,
        rating: 4.6,
        reviews: 128,
        trustScore: 94,
        image: "assets/images/bulb.jpg"
    },

    {
        id: 2,
        name: "Portable Mini Fan",
        category: "Electronics",
        price: 399,
        rating: 4.5,
        reviews: 87,
        trustScore: 91,
        image: "assets/images/fan.jpg"
    },

    {
        id: 3,
        name: "Kitchen Storage Box",
        category: "Kitchen",
        price: 249,
        rating: 4.4,
        reviews: 64,
        trustScore: 89,
        image: "assets/images/storage-box.jpg"
    },

    {
        id: 4,
        name: "Wireless Bluetooth Speaker",
        category: "Electronics",
        price: 599,
        rating: 4.7,
        reviews: 214,
        trustScore: 96,
        image: "assets/images/speaker.jpg"
    },

    {
        id: 5,
        name: "Smart Watch",
        category: "Electronics",
        price: 799,
        rating: 4.5,
        reviews: 176,
        trustScore: 93,
        image: "assets/images/smartwatch.jpg"
    },

    {
        id: 6,
        name: "Cotton Casual Shirt",
        category: "Fashion",
        price: 449,
        rating: 4.3,
        reviews: 92,
        trustScore: 88,
        image: "assets/images/shirt.jpg"
    }

];


/* =====================================================
   USER SELECTIONS
===================================================== */

let selectedCategory = null;

let selectedBudget = null;

let selectedPriority = null;


/* =====================================================
   ELEMENTS
===================================================== */

const step1 =
    document.getElementById("step1");

const step2 =
    document.getElementById("step2");

const step3 =
    document.getElementById("step3");

const resultSection =
    document.getElementById("resultSection");

const progress =
    document.getElementById("progress");

const stepText =
    document.getElementById("stepText");

const step1Next =
    document.getElementById("step1Next");

const step2Next =
    document.getElementById("step2Next");

const getRecommendation =
    document.getElementById(
        "getRecommendation"
    );

const backToStep1 =
    document.getElementById(
        "backToStep1"
    );

const backToStep2 =
    document.getElementById(
        "backToStep2"
    );

const startAgain =
    document.getElementById(
        "startAgain"
    );

const recommendationProducts =
    document.getElementById(
        "recommendationProducts"
    );

const recommendationText =
    document.getElementById(
        "recommendationText"
    );


/* =====================================================
   CATEGORY SELECTION
===================================================== */

document
    .querySelectorAll(".option-btn")
    .forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    document
                        .querySelectorAll(
                            ".option-btn"
                        )
                        .forEach(
                            function (item) {
                                item.classList.remove(
                                    "selected"
                                );
                            }
                        );


                    button.classList.add(
                        "selected"
                    );


                    selectedCategory =
                        button.dataset.category;


                    step1Next.disabled =
                        false;

                }
            );

        }
    );


/* =====================================================
   BUDGET SELECTION
===================================================== */

document
    .querySelectorAll(".budget-btn")
    .forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    document
                        .querySelectorAll(
                            ".budget-btn"
                        )
                        .forEach(
                            function (item) {

                                item.classList.remove(
                                    "selected"
                                );

                            }
                        );


                    button.classList.add(
                        "selected"
                    );


                    selectedBudget =
                        Number(
                            button.dataset.budget
                        );


                    step2Next.disabled =
                        false;

                }
            );

        }
    );


/* =====================================================
   PRIORITY SELECTION
===================================================== */

document
    .querySelectorAll(".priority-btn")
    .forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    document
                        .querySelectorAll(
                            ".priority-btn"
                        )
                        .forEach(
                            function (item) {

                                item.classList.remove(
                                    "selected"
                                );

                            }
                        );


                    button.classList.add(
                        "selected"
                    );


                    selectedPriority =
                        button.dataset.priority;


                    getRecommendation.disabled =
                        false;

                }
            );

        }
    );


/* =====================================================
   STEP 1 → STEP 2
===================================================== */

step1Next.addEventListener(
    "click",
    function () {

        showStep(2);

    }
);


/* =====================================================
   STEP 2 → STEP 3
===================================================== */

step2Next.addEventListener(
    "click",
    function () {

        showStep(3);

    }
);


/* =====================================================
   STEP 2 BACK
===================================================== */

backToStep1.addEventListener(
    "click",
    function () {

        showStep(1);

    }
);


/* =====================================================
   STEP 3 BACK
===================================================== */

backToStep2.addEventListener(
    "click",
    function () {

        showStep(2);

    }
);


/* =====================================================
   SHOW STEP
===================================================== */

function showStep(
    stepNumber
) {

    step1.classList.remove(
        "active-step"
    );

    step2.classList.remove(
        "active-step"
    );

    step3.classList.remove(
        "active-step"
    );


    resultSection.classList.remove(
        "show"
    );


    if (stepNumber === 1) {

        step1.classList.add(
            "active-step"
        );

        progress.style.width =
            "33.33%";

        stepText.textContent =
            "Step 1 of 3";

    }


    if (stepNumber === 2) {

        step2.classList.add(
            "active-step"
        );

        progress.style.width =
            "66.66%";

        stepText.textContent =
            "Step 2 of 3";

    }


    if (stepNumber === 3) {

        step3.classList.add(
            "active-step"
        );

        progress.style.width =
            "100%";

        stepText.textContent =
            "Step 3 of 3";

    }

}


/* =====================================================
   GET RECOMMENDATION
===================================================== */

getRecommendation.addEventListener(
    "click",
    function () {

        generateRecommendations();

    }
);


/* =====================================================
   GENERATE RECOMMENDATIONS
===================================================== */

function generateRecommendations() {

    let results =
        advisorProducts.filter(
            function (product) {

                const categoryMatch =
                    selectedCategory === "All" ||
                    product.category ===
                    selectedCategory;


                const budgetMatch =
                    product.price <=
                    selectedBudget;


                return (
                    categoryMatch &&
                    budgetMatch
                );

            }
        );


    /*
       If no exact products found,
       show products within category.
    */

    if (results.length === 0) {

        results =
            advisorProducts.filter(
                function (product) {

                    return (
                        selectedCategory === "All" ||
                        product.category ===
                        selectedCategory
                    );

                }
            );

    }


    /* =================================================
       PRIORITY SORTING
    ================================================= */

    if (
        selectedPriority === "trust"
    ) {

        results.sort(
            function (a, b) {

                return (
                    b.trustScore -
                    a.trustScore
                );

            }
        );

    }


    else if (
        selectedPriority === "rating"
    ) {

        results.sort(
            function (a, b) {

                return (
                    b.rating -
                    a.rating
                );

            }
        );

    }


    else if (
        selectedPriority === "price"
    ) {

        results.sort(
            function (a, b) {

                return (
                    a.price -
                    b.price
                );

            }
        );

    }


    else if (
        selectedPriority === "popular"
    ) {

        results.sort(
            function (a, b) {

                return (
                    b.reviews -
                    a.reviews
                );

            }
        );

    }


    /*
       Show maximum 3 recommendations
    */

    results =
        results.slice(0, 3);


    displayRecommendations(
        results
    );


    showResultMessage(
        results
    );


    step1.classList.remove(
        "active-step"
    );

    step2.classList.remove(
        "active-step"
    );

    step3.classList.remove(
        "active-step"
    );


    resultSection.classList.add(
        "show"
    );


    stepText.textContent =
        "Recommendation Ready";

    progress.style.width =
        "100%";

}


/* =====================================================
   DISPLAY PRODUCTS
===================================================== */

function displayRecommendations(
    results
) {

    recommendationProducts.innerHTML =
        "";


    if (
        results.length === 0
    ) {

        recommendationProducts.innerHTML = `

            <div style="
                grid-column:1/-1;
                text-align:center;
                padding:30px;
            ">

                <h3>
                    No suitable products found
                </h3>

                <p style="
                    color:#64748b;
                    margin-top:8px;
                ">
                    Try increasing your budget
                    or selecting another category.
                </p>

            </div>

        `;

        return;

    }


    results.forEach(
        function (product) {

            recommendationProducts.innerHTML += `

                <div
                    class="ai-product-card"
                >

                    <div
                        class="ai-product-image"
                    >

                        <img
                            src="${product.image}"
                            alt="${escapeHTML(
                                product.name
                            )}"
                            onerror="
                                this.style.display='none';
                            "
                        >

                    </div>


                    <div
                        class="ai-product-content"
                    >

                        <h3>
                            ${escapeHTML(
                                product.name
                            )}
                        </h3>


                        <div
                            class="ai-price"
                        >
                            ₹${formatPrice(
                                product.price
                            )}
                        </div>


                        <div
                            class="ai-rating"
                        >
                            ⭐ ${product.rating}
                            (${product.reviews} reviews)
                        </div>


                        <span
                            class="ai-trust"
                        >
                            🛡️ Trust Score:
                            ${product.trustScore}
                        </span>


                        <button
                            class="view-btn"
                            onclick="
                                viewProduct(
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
    );

}


/* =====================================================
   RECOMMENDATION MESSAGE
===================================================== */

function showResultMessage(
    results
) {

    if (
        results.length === 0
    ) {

        recommendationText.textContent =
            "We couldn't find an exact match. Try changing your requirements.";

        return;

    }


    const priorityText = {

        trust:
            "high trust",

        rating:
            "best rated",

        price:
            "best value",

        popular:
            "popular"

    };


    const selected =
        priorityText[
            selectedPriority
        ] || "suitable";


    recommendationText.textContent =
        "Based on your budget and requirements, we selected " +
        results.length +
        " " +
        selected +
        " product option(s) for you.";

}


/* =====================================================
   VIEW PRODUCT
===================================================== */

function viewProduct(
    productId
) {

    window.location.href =
        "product-details.html?id=" +
        productId;

}


/* =====================================================
   START AGAIN
===================================================== */

startAgain.addEventListener(
    "click",
    function () {

        selectedCategory = null;

        selectedBudget = null;

        selectedPriority = null;


        document
            .querySelectorAll(
                ".option-btn, .budget-btn, .priority-btn"
            )
            .forEach(
                function (button) {

                    button.classList.remove(
                        "selected"
                    );

                }
            );


        step1Next.disabled =
            true;

        step2Next.disabled =
            true;

        getRecommendation.disabled =
            true;


        recommendationProducts.innerHTML =
            "";


        showStep(1);

    }
);


/* =====================================================
   FORMAT PRICE
===================================================== */

function formatPrice(
    price
) {

    return Number(
        price
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
