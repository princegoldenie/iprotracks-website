// ===============================
// IPPN iProTracks Main JavaScript (PRODUCTION READY)
// ===============================

import { supabase } from "./supabase.js";

document.addEventListener("DOMContentLoaded", () => {
    initializeMobileMenu();
    initializeNavbarEffects();
    initializeSmoothScrolling();
    initializeScrollAnimations();
    initializeCounters();
    initializeTypewriter();
    initializeFormHandlers();
    checkAuthState();
});

/*
=================================
MOBILE MENU
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
            icon.classList.toggle("fa-bars");
            icon.classList.toggle("fa-times");
        }
    });
}

/*
=================================
NAVBAR EFFECT
=================================
*/
function initializeNavbarEffects() {
    const navbar = document.querySelector(".navbar");
    if (!navbar) return;

    window.addEventListener("scroll", () => {
        navbar.style.boxShadow =
            window.scrollY > 50
                ? "0 12px 40px rgba(0,0,0,0.18)"
                : "0 2px 15px rgba(0,0,0,0.06)";
    });
}

/*
=================================
SMOOTH SCROLL
=================================
*/
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", (e) => {
            e.preventDefault();

            const target = document.querySelector(anchor.getAttribute("href"));
            if (target) {
                target.scrollIntoView({ behavior: "smooth" });
            }
        });
    });
}

/*
=================================
SCROLL ANIMATIONS
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
    }, { threshold: 0.15 });

    elements.forEach(el => {
        el.classList.add("hidden");
        observer.observe(el);
    });
}

/*
=================================
COUNTERS
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
TYPEWRITER
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
        cursorChar: "|"
    });
}

/*
=================================
AUTH STATE CHECK (IMPORTANT)
=================================
*/
function checkAuthState() {
    const session = localStorage.getItem("ippnUser");

    if (!session && window.location.pathname.includes("dashboard")) {
        window.location.href = "login.html";
    }
}

/*
=================================
FORM HANDLERS (SUPABASE POWERED)
=================================
*/
function initializeFormHandlers() {

    // =============================
    // APPLICATION FORM
    // =============================
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

            const { error } = await supabase
                .from("applications")
                .insert([data]);

            if (error) {
                alert("Error submitting application: " + error.message);
            } else {
                alert("Application Submitted Successfully!");
                form.reset();
            }
        });
    }

    // =============================
    // SIGNUP (SUPABASE AUTH)
    // =============================
    const signupForm = document.getElementById("signupForm");

    if (signupForm) {
        signupForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const name = document.getElementById("signupName").value.trim();
            const email = document.getElementById("signupEmail").value.trim();
            const password = document.getElementById("signupPassword").value;
            const confirmPassword = document.getElementById("confirmPassword").value;

            if (password !== confirmPassword) {
                alert("Passwords do not match.");
                return;
            }

            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: name
                    }
                }
            });

            if (error) {
                alert(error.message);
                return;
            }

            const user = data.user;

            if (user) {
                const { error: profileError } = await supabase
                    .from("profiles")
                    .insert([
                        {
                            id: user.id,
                            full_name: name,
                            email,
                            role: "student"
                        }
                    ]);

                if (profileError) {
                    console.error("Profile error:", profileError.message);
                }
            }

            alert("Account created! Please verify your email.");
            window.location.href = "login.html";
        });
    }

    // =============================
    // LOGIN (SUPABASE CLEAN)
    // =============================
    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const email = document.getElementById("loginEmail").value.trim();
            const password = document.getElementById("loginPassword").value;

            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) {
                alert(error.message);
                return;
            }

            const user = data.user;

            localStorage.setItem("ippnUser", JSON.stringify({
                id: user.id,
                email: user.email,
                name: user.user_metadata?.full_name || ""
            }));

            window.location.href = "dashboard.html";
        });
    }
}

    /*
    =============================
    PAYMENT REQUEST (WEMA BANK - MANUAL APPROVAL SYSTEM)
    =============================
    */

    const paymentBtn = document.getElementById("paymentDoneBtn");

    if (paymentBtn) {
        paymentBtn.addEventListener("click", async () => {

            try {
                const user = JSON.parse(localStorage.getItem("ippnUser"));

                if (!user || !user.id) {
                    alert("Please login first to continue.");
                    return;
                }

                // Prevent double submissions (important)
                paymentBtn.disabled = true;
                paymentBtn.innerText = "Submitting...";

                const { error } = await supabase.from("payments").insert([
                    {
                        user_id: user.id,
                        amount: "course_fee",
                        bank_name: "WEMA BANK",
                        account_name: "IPPN GLOBAL ACADEMY",
                        account_number: "0127267595",
                        status: "pending"
                    }
                ]);

                if (error) {
                    console.error(error);
                    alert("Payment submission failed. Try again.");
                    paymentBtn.disabled = false;
                    paymentBtn.innerText = "I Have Made Payment";
                    return;
                }

                alert("Payment submitted successfully. Awaiting approval.");

                paymentBtn.innerText = "Submitted ✔";
                paymentBtn.style.background = "#28a745";

            } catch (err) {
                console.error(err);
                alert("Something went wrong.");
                paymentBtn.disabled = false;
                paymentBtn.innerText = "I Have Made Payment";
            }
        });
    }
/*
=================================
LOGOUT (GLOBAL SAFE)
=================================
*/
async function logout() {
    await supabase.auth.signOut();
    localStorage.removeItem("ippnUser");
    window.location.href = "login.html";
}