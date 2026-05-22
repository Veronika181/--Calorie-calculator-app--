/* ============================
   GENDER SELECTION
============================ */

let selectedGender = null;

function selectGender(gender) {
    selectedGender = gender;
    localStorage.setItem("gender", gender);
}


/* ============================
   HEIGHT SLIDER
============================ */

function updateHeightDisplay() {
    const heightRange = document.getElementById('height');
    const heightDisplay = document.getElementById('heightDisplay');
    heightDisplay.textContent = heightRange.value + " cm";
}


/* ============================
   AGE & WEIGHT BUTTONS
============================ */

function changeValue(id, delta) {
    const display = document.getElementById(id + 'Display');
    let value = parseInt(display.textContent, 10) + delta;

    if (value < 0) value = 0;

    display.textContent = value;
}


/* ============================
   SAVE INPUT PAGE DATA
============================ */

function saveDataInputOnPage() {
    const height = parseInt(document.getElementById('height').value, 10);
    const weight = parseInt(document.getElementById('weightDisplay').textContent, 10);
    const age = parseInt(document.getElementById('ageDisplay').textContent, 10);

    const gender = localStorage.getItem("gender");

    if (!gender) {
        alert("Please select your gender.");
        return;
    }

    localStorage.setItem("height", height);
    localStorage.setItem("weight", weight);
    localStorage.setItem("age", age);

    window.location.href = "adva.html";
}


/* ============================
   NEXT & BACK BUTTONS
============================ */

function goNext() {
    saveDataInputOnPage();
}

function goBack() {
    window.history.back();
}


/* ============================
   PAGE INITIALIZATION
============================ */

document.addEventListener("DOMContentLoaded", () => {
    const heightInput = document.getElementById("height");
    if (heightInput) updateHeightDisplay();
});


function selectGender(gender, btn) {
    localStorage.setItem("gender", gender);

    document.querySelectorAll(".gender-btn").forEach(b => {
        b.classList.remove("selected");
    });

    btn.classList.add("selected");
}

function nextStepSaveDataOnPage() {
    const weight = parseInt(localStorage.getItem("weight"), 10);
    const height = parseInt(localStorage.getItem("height"), 10);
    const age = parseInt(localStorage.getItem("age"), 10);
    const gender = localStorage.getItem("gender");

    const bodyFat = document.getElementById("bodyFat").value;
    const activity = parseFloat(document.getElementById("activityLevel").value);

    let BMR;

    // --- 1) Pokud je vybrán body fat → Katch-McArdle ---
    if (bodyFat !== "") {
        const bf = parseFloat(bodyFat) / 100;
        const leanMass = weight * (1 - bf);
        BMR = 370 + (21.6 * leanMass);
    }

    // --- 2) Pokud není body fat → Mifflin-St Jeor ---
    else {
        if (gender === "male") {
            BMR = 10 * weight + 6.25 * height - 5 * age + 5;
        } else {
            BMR = 10 * weight + 6.25 * height - 5 * age - 161;
        }
    }

    // --- 3) TDEE ---
    const TDEE = BMR * activity;

    // Uložit výsledky
    localStorage.setItem("BMR", Math.round(BMR));
    localStorage.setItem("TDEE", Math.round(TDEE));

    // Přechod na výsledky
    window.location.href = "result.html";
}


function calculateCalories() {
    const TDEE = localStorage.getItem("TDEE");

    if (!TDEE) {
        document.getElementById("calorieValue").textContent = "0";
        return;
    }

    // Zobrazit výsledek
    document.getElementById("calorieValue").textContent = TDEE;

    // Animace progress kruhu
    const circle = document.querySelector(".progress-ring .progress");
    const radius = circle.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;

    circle.style.strokeDasharray = `${circumference} ${circumference}`;

    const percent = Math.min(TDEE / 4000, 1); // max 4000 kcal pro animaci
    const offset = circumference - percent * circumference;

    circle.style.strokeDashoffset = offset;
}

function goToWeightGoals() {
    window.location.href = "weightgoals.html";
}

function resultratioofmacronutrients() {
    window.location.href = "weightgoals.html";
}

