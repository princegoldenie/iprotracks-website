import { supabase } from "./supabase.js";

let user = null;

/*
====================================
INIT
====================================
*/
document.addEventListener("DOMContentLoaded", async () => {
    await getUser();
    await loadDashboard();
});

/*
====================================
GET USER
====================================
*/
async function getUser() {

    const { data } = await supabase.auth.getUser();

    if (!data.user) {
        window.location.href = "login.html";
        return;
    }

    user = data.user;

    document.getElementById("userEmail").innerText =
        user.email;
}

/*
====================================
LOAD DASHBOARD DATA
====================================
*/
async function loadDashboard() {

    // 1. Get enrollments + courses
    const { data: enrollments } = await supabase
        .from("enrollments")
        .select("course_id, courses(*)")
        .eq("user_id", user.id);

    if (!enrollments) return;

    document.getElementById("courseCount").innerText =
        enrollments.length;

    renderCourses(enrollments);

    // 2. Get progress
    const { data: progress } = await supabase
        .from("progress")
        .select("*")
        .eq("user_id", user.id);

    let percent = 0;

    if (progress?.length) {
        percent = Math.round((progress.length / 10) * 100);
    }

    document.getElementById("progressCount").innerText =
        percent + "%";
}

/*
====================================
RENDER COURSES
====================================
*/
function renderCourses(enrollments) {

    const grid = document.getElementById("courseGrid");
    grid.innerHTML = "";

    enrollments.forEach(item => {

        const course = item.courses;

        const card = document.createElement("div");
        card.className = "course-card";

        card.innerHTML = `
            <h3>${course.title}</h3>
            <p>${course.description || "No description"}</p>

            <div class="progress-bar">
                <div class="progress-fill" style="width: 40%"></div>
            </div>

            <a href="learning.html?course=${course.id}" class="btn-primary">
                Continue Learning
            </a>
        `;

        grid.appendChild(card);
    });
}

/*
====================================
LOGOUT
====================================
*/
window.logout = async function () {
    await supabase.auth.signOut();
    window.location.href = "login.html";
};