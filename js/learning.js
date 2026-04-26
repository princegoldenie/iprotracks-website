import { supabase } from "./supabase.js";

/*
====================================
GLOBAL STATE
====================================
*/
let currentUser = null;
let currentCourse = null;
let lessons = [];
let selectedLesson = null;

/*
====================================
INIT
====================================
*/
document.addEventListener("DOMContentLoaded", async () => {
    await getUser();
    await loadCourse();
    await loadLessons();
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

    currentUser = data.user;
}

/*
====================================
LOAD COURSE (FIRST ENROLLED)
====================================
*/
async function loadCourse() {

    const { data, error } = await supabase
        .from("enrollments")
        .select("course_id, courses(*)")
        .eq("user_id", currentUser.id)
        .limit(1)
        .single();

    if (error || !data) {
        alert("No course found");
        return;
    }

    currentCourse = data.courses;

    document.getElementById("courseTitle").innerText =
        currentCourse.title;
}

/*
====================================
LOAD LESSONS
====================================
*/
async function loadLessons() {

    const { data, error } = await supabase
        .from("lessons")
        .select("*")
        .eq("course_id", currentCourse.id)
        .order("created_at", { ascending: true });

    if (error) {
        console.error(error);
        return;
    }

    lessons = data;

    renderLessons();
}

/*
====================================
RENDER LESSON LIST
====================================
*/
function renderLessons() {
    const list = document.getElementById("lessonList");
    list.innerHTML = "";

    lessons.forEach((lesson, index) => {

        const li = document.createElement("li");

        li.innerHTML = `
            <i class="fas fa-play-circle"></i>
            ${lesson.title}
        `;

        li.addEventListener("click", () => {
            openLesson(lesson);
        });

        list.appendChild(li);
    });
}

/*
====================================
OPEN LESSON
====================================
*/
function openLesson(lesson) {

    selectedLesson = lesson;

    document.getElementById("lessonTitle").innerText = lesson.title;
    document.getElementById("lessonDesc").innerText = lesson.description;

    document.getElementById("lessonVideo").src = lesson.video_url;

    document.getElementById("lessonContent").innerHTML =
        lesson.content;
}

/*
====================================
MARK COMPLETE
====================================
*/
document.getElementById("completeBtn")?.addEventListener("click", async () => {

    if (!selectedLesson) {
        alert("Select a lesson first");
        return;
    }

    const { error } = await supabase
        .from("progress")
        .upsert({
            user_id: currentUser.id,
            lesson_id: selectedLesson.id,
            completed: true
        });

    if (error) {
        alert("Error saving progress");
        return;
    }

    alert("Lesson Completed!");
});

/*
====================================
LOGOUT
====================================
*/
window.logout = async function () {
    await supabase.auth.signOut();
    window.location.href = "login.html";
};