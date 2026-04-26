// ===============================
// IPPN iProTracks Main JavaScript (UPGRADED)
// ===============================

document.addEventListener("DOMContentLoaded", () => {
    initializeMobileMenu();
    initializeNavbarEffects();
    initializeSmoothScrolling();
    initializeScrollAnimations();
    initializeCounters();
    initializeTypewriter();
    initializeFormHandlers();
});

/*
=================================
Mobile Navigation Toggle
=================================
*/
function initializeMobileMenu() {
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");

    if (!menuToggle || !navLinks) return;

    menuToggle.addEventListener("click", () => {
        navLinks.classList.toggle("active");

        const icon = menuToggle.querySelector("i");

        if (icon) {
            if (navLinks.classList.contains("active")) {
                icon.classList.replace("fa-bars", "fa-times");
            } else {
                icon.classList.replace("fa-times", "fa-bars");
            }
        }
    });
}

/*
=================================
Navbar Scroll Effect
=================================
*/
function initializeNavbarEffects() {
    const navbar = document.querySelector(".navbar");
    if (!navbar) return;

    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = "0 12px 40px rgba(0,0,0,0.18)";
            navbar.style.backdropFilter = "blur(10px)";
        } else {
            navbar.style.boxShadow = "0 2px 15px rgba(0,0,0,0.06)";
        }
    });
}

/*
=================================
Smooth Scrolling
=================================
*/
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();

            const target = document.querySelector(this.getAttribute("href"));

            if (target) {
                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    });
}

/*
=================================
Scroll Reveal Animation (UPGRADED)
=================================
*/
function initializeScrollAnimations() {
    const elements = document.querySelectorAll(
        ".stat-card, .feature-card, .section-header, .cta, .hero-content"
    );

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
            }
        });
    }, {
        threshold: 0.15
    });

    elements.forEach(el => {
        el.classList.add("hidden");
        observer.observe(el);
    });
}

/*
=================================
COUNTER ANIMATION (STATS)
=================================
*/
function initializeCounters() {
    const counters = document.querySelectorAll(".counter");

    counters.forEach(counter => {
        counter.innerText = "0";

        const update = () => {
            const target = +counter.getAttribute("data-target");
            const current = +counter.innerText;

            const increment = target / 80;

            if (current < target) {
                counter.innerText = Math.ceil(current + increment);
                setTimeout(update, 25);
            } else {
                counter.innerText = target;
            }
        };

        update();
    });
}

/*
=================================
TYPEWRITER EFFECT (HERO)
=================================
*/
function initializeTypewriter() {
    const el = document.getElementById("typed-text");

    if (!el || typeof Typed === "undefined") return;

    new Typed("#typed-text", {
        strings: [
            "Anywhere.",
            "While Earning.",
            "Without Limits.",
            "Across The World."
        ],
        typeSpeed: 80,
        backSpeed: 50,
        backDelay: 1500,
        loop: true,
        showCursor: true,
        cursorChar: "|"
    });
}

/*
=================================
FORM HANDLERS (SAFE WRAPPER)
=================================
*/
function initializeFormHandlers() {

    // APPLICATION FORM
    const form = document.getElementById("applicationForm");

    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const data = {
                name: document.getElementById("name")?.value || "",
                email: document.getElementById("email")?.value || "",
                phone: document.getElementById("phone")?.value || "",
                program: document.getElementById("program")?.value || "",
                interest: document.getElementById("interest")?.value || "",
                message: document.getElementById("message")?.value || ""
            };

            const response = await fetch("https://script.google.com/macros/s/AKfycbxP82KWaQsk01brFFcR7-aOlkdyZyQBIu4CDi6ZwCeOAu2-pjvE9D9R0U81lFnL58iB/exec", {
                method: "POST",
                body: JSON.stringify(data)
            });

            if (response.ok) {
                alert("Application Submitted Successfully!");
                form.reset();
            } else {
                alert("Something went wrong. Try again.");
            }
        });
    }

    // LOGIN
    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const email = document.getElementById("loginEmail").value.trim();
            const password = document.getElementById("loginPassword").value;

            const savedUser = JSON.parse(localStorage.getItem("ippnRegisteredUser"));

            if (
                savedUser &&
                savedUser.email === email &&
                savedUser.password === password
            ) {
                localStorage.setItem("ippnUser", email);
                window.location.href = "dashboard.html";
            } else {
                alert("Invalid email or password.");
            }
        });
    }

    // SIGNUP
    const signupForm = document.getElementById("signupForm");

    if (signupForm) {
        signupForm.addEventListener("submit", function (e) {
            e.preventDefault();

            const name = document.getElementById("signupName")?.value.trim();
            const email = document.getElementById("signupEmail")?.value.trim();
            const password = document.getElementById("signupPassword")?.value;
            const confirmPassword = document.getElementById("confirmPassword")?.value;

            if (password !== confirmPassword) {
                alert("Passwords do not match.");
                return;
            }

            const user = { name, email, password };

            localStorage.setItem("ippnRegisteredUser", JSON.stringify(user));
            localStorage.setItem("ippnUser", email);

            alert("Account created successfully!");
            window.location.href = "dashboard.html";
        });
    }
}

/*
=================================
LOGOUT FUNCTION (GLOBAL)
=================================
*/
function logout() {
    localStorage.removeItem("ippnUser");
    window.location.href = "login.html";
}