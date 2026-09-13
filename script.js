(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- PAGE LOAD SKELETON ---------------- */
  window.addEventListener("load", function () {
    var skel = document.getElementById("pageSkeleton");
    setTimeout(function () {
      skel.classList.add("hide");
    }, reduceMotion ? 0 : 260);
  });

  /* ---------------- HERO STAGGERED FADE-UP ---------------- */
  document.addEventListener("DOMContentLoaded", function () {
    var heroEls = document.querySelectorAll('[data-anim="fade-up"]');
    if (reduceMotion) {
      heroEls.forEach(function (el) { el.classList.add("in"); });
    } else {
      // trigger on next frame so the transition actually plays
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          heroEls.forEach(function (el) { el.classList.add("in"); });
        });
      });
    }
  });

  /* ---------------- NAVBAR SHRINK ON SCROLL ---------------- */
  (function navbarShrink() {
    var navbar = document.getElementById("navbar");
    var sentinel = document.createElement("div");
    sentinel.style.position = "absolute";
    sentinel.style.top = "40px";
    sentinel.style.height = "1px";
    sentinel.style.width = "1px";
    document.body.prepend(sentinel);

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        navbar.classList.toggle("scrolled", !entry.isIntersecting);
      });
    });
    io.observe(sentinel);
  })();

  /* ---------------- GENERIC SCROLL REVEAL (fade-in + slide-up) ---------------- */
  function setupReveal(selector, staggerMs) {
    var els = document.querySelectorAll(selector);
    if (!els.length) return;

    if (reduceMotion) {
      els.forEach(function (el) { el.classList.add("in"); });
      return;
    }

    var io = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          var siblings = Array.prototype.filter.call(
            el.parentElement.children,
            function (c) { return c.matches(selector); }
          );
          var index = siblings.indexOf(el);
          setTimeout(function () {
            el.classList.add("in");
          }, index * staggerMs);
          observer.unobserve(el);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    els.forEach(function (el) { io.observe(el); });
  }

  setupReveal(".reveal", 0);
  setupReveal(".reveal-stagger", 100);

  /* ---------------- CATEGORY / TRUST CARD ARROW & ICON ANIMATION ---------------- */
  /* handled entirely in CSS via :hover — no JS needed */

  /* ---------------- MARQUEE: build "Deals of the Day" cards ---------------- */
  (function buildMarquee() {
    var track = document.getElementById("marqueeTrack");
    if (!track) return;
    var deals = [
      { name: "Wireless Earbuds", price: "₹1,299" },
      { name: "Smart Watch", price: "₹2,499" },
      { name: "Cotton Kurta", price: "₹899" },
      { name: "Non-stick Pan Set", price: "₹1,599" },
      { name: "LED Desk Lamp", price: "₹749" },
      { name: "Face Serum", price: "₹599" },
      { name: "Bluetooth Speaker", price: "₹1,899" },
      { name: "Yoga Mat", price: "₹649" }
    ];

    function cardHTML(item) {
      return (
        '<div class="product-card">' +
        '<div class="product-thumb"></div>' +
        "<h4>" + item.name + "</h4>" +
        '<span class="price">' + item.price + "</span>" +
        "</div>"
      );
    }

    // duplicate the list so the marquee loop is seamless
    var html = deals.map(cardHTML).join("") + deals.map(cardHTML).join("");
    track.innerHTML = html;
  })();

  /* ---------------- TRENDING GRID: staggered scale+fade via IntersectionObserver ---------------- */
  (function buildTrending() {
    var grid = document.getElementById("trendingGrid");
    if (!grid) return;
    var items = [
      { name: "Running Shoes", price: "₹2,199" },
      { name: "Ceramic Mug Set", price: "₹499" },
      { name: "Backpack", price: "₹1,799" },
      { name: "Air Fryer", price: "₹3,299" }
    ];
    grid.innerHTML = items
      .map(function (item) {
        return (
          '<div class="product-card">' +
          '<div class="product-thumb"></div>' +
          "<h4>" + item.name + "</h4>" +
          '<span class="price">' + item.price + "</span>" +
          "</div>"
        );
      })
      .join("");

    setupReveal("#trendingGrid .product-card", 100);
  })();

  /* ---------------- CREATOR EARNINGS: count-up on viewport entry ---------------- */
  (function earningsCountUp() {
    var amountEl = document.getElementById("earningsAmount");
    if (!amountEl) return;
    var target = parseInt(amountEl.getAttribute("data-target"), 10) || 0;

    function animateCount() {
      if (reduceMotion) {
        amountEl.textContent = "₹" + target.toLocaleString("en-IN");
        return;
      }
      var duration = 900;
      var start = null;

      function step(ts) {
        if (start === null) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
        var current = Math.round(eased * target);
        amountEl.textContent = "₹" + current.toLocaleString("en-IN");
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    var io = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );
    io.observe(amountEl);
  })();

  /* ---------------- BUY WITH CONFIDENCE: progress line fill + pop-in steps ---------------- */
  (function stepsProgress() {
    var track = document.getElementById("stepsTrack");
    var fill = document.getElementById("stepsLineFill");
    if (!track || !fill) return;

    var steps = track.querySelectorAll(".step");

    var io = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          fill.style.width = "100%";
          steps.forEach(function (step, i) {
            setTimeout(function () {
              step.classList.add("in");
            }, i * 120);
          });
          observer.disconnect();
        });
      },
      { threshold: 0.3 }
    );
    io.observe(track);
  })();

  /* ---------------- SMOOTH SCROLL FOR ANCHOR LINKS ---------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var id = link.getAttribute("href");
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    });
  });

  /* ---------------- BUTTON RIPPLE EFFECT ---------------- */
  document.querySelectorAll(".ripple").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      if (reduceMotion) return;
      var rect = btn.getBoundingClientRect();
      var size = Math.max(rect.width, rect.height) * 1.4;
      var circle = document.createElement("span");
      circle.className = "ripple-circle";
      circle.style.width = circle.style.height = size + "px";
      circle.style.left = e.clientX - rect.left - size / 2 + "px";
      circle.style.top = e.clientY - rect.top - size / 2 + "px";
      btn.appendChild(circle);
      circle.addEventListener("animationend", function () {
        circle.remove();
      });
    });
  });
})();
                                        
