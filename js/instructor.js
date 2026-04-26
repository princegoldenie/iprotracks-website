import { supabase } from "./supabase.js";

let user = null;
let courses = [];

/*
====================================
INIT
====================================
*/
document.addEventListener("DOMContentLoaded", async () => {
    await getUser();
    await loadCourses();

    document.getElementById("createCourseBtn")
        .addEventListener("click", createCourse);

    document.getElementById("addLessonBtn")
        .addEventListener("click", addLesson);
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
}

/*
====================================
CREATE COURSE
====================================
*/
async function createCourse() {

    const title = document.getElementById("courseTitle").value;
    const description = document.getElementById("courseDesc").value;

    if (!title) {
        alert("Enter course title");
        return;
    }

    const { data, error } = await supabase
        .from("courses")
        .insert([{
            title,
            description,
            instructor_id: user.id
        }])
        .select();

    if (error) {
        alert(error.message);
        return;
    }

    alert("Course created!");

    loadCourses();
}

/*
====================================
LOAD COURSES (FOR SELECT)
====================================
*/
async function loadCourses() {

    const { data } = await supabase
        .from("courses")
        .select("*")
        .eq("instructor_id", user.id);

    courses = data || [];

    const select = document.getElementById("courseSelect");
    select.innerHTML = "";

    courses.forEach(course => {
        const option = document.createElement("option");
        option.value = course.id;
        option.textContent = course.title;
        select.appendChild(option);
    });
}

/*
====================================
ADD LESSON
====================================
*/
async function addLesson() {

    const course_id = document.getElementById("courseSelect").value;
    const title = document.getElementById("lessonTitle").value;
    const video_url = document.getElementById("videoUrl").value;
    const content = document.getElementById("lessonContent").value;

    if (!course_id || !title) {
        alert("Fill required fields");
        return;
    }

    const { error } = await supabase
        .from("lessons")
        .insert([{
            course_id,
            title,
            video_url,
            content
        }]);

    if (error) {
        alert(error.message);
        return;
    }

    alert("Lesson added!");
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