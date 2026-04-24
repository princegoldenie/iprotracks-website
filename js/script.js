// ===============================
// IPPN iProTracks Main JavaScript
// ===============================

document.addEventListener("DOMContentLoaded", () => {
    initializeMobileMenu();
    initializeNavbarEffects();
    initializeSmoothScrolling();
    initializeScrollAnimations();
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

        if (navLinks.classList.contains("active")) {
            icon.classList.replace("fa-bars", "fa-times");
        } else {
            icon.classList.replace("fa-times", "fa-bars");
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

            const target = document.querySelector(
                this.getAttribute("href")
            );

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
Scroll Reveal Animation
=================================
*/
function initializeScrollAnimations() {
    const elements = document.querySelectorAll(
        ".stat-card, .feature-card, .section-header, .cta"
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

    elements.forEach(element => {
        element.classList.add("hidden");
        observer.observe(element);
    });
}

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("applicationForm");

    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const data = {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            phone: document.getElementById("phone").value,
            program: document.getElementById("program").value,
            interest: document.getElementById("interest").value,
            message: document.getElementById("message").value
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

});

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");

    if (!loginForm) return;

    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value;

        const savedUser = JSON.parse(
            localStorage.getItem("ippnRegisteredUser")
        );

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
});
function logout() {
    localStorage.removeItem("ippnUser");
    window.location.href = "login.html";
}
document.addEventListener("DOMContentLoaded", () => {
    const signupForm = document.getElementById("signupForm");

    if (!signupForm) return;

    signupForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const name = document.getElementById("signupName").value.trim();
        const email = document.getElementById("signupEmail").value.trim();
        const password = document.getElementById("signupPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        const user = {
            name,
            email,
            password
        };

        localStorage.setItem("ippnRegisteredUser", JSON.stringify(user));
        localStorage.setItem("ippnUser", email);

        alert("Account created successfully!");
        window.location.href = "dashboard.html";
    });
});