/* ============================
   CALCULATE CALORIES
============================ */

function calculateCalories() {
    const height = parseInt(localStorage.getItem('height'), 10) || 0;
    const age = parseInt(localStorage.getItem('ageDisplay'), 10) || 0;
    const weight = parseInt(localStorage.getItem('weightDisplay'), 10) || 0;
    const gender = localStorage.getItem('gender');
    const bodyFat = parseFloat(localStorage.getItem('bodyFat')) || 0;
    const activityLevel = parseFloat(localStorage.getItem('activityLevel')) || 1;

    let bmr;

    if (gender === 'male') {
        bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
        bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    const tdee = bmr * activityLevel;
    const bodyFatReduction = bodyFat ? tdee * (bodyFat / 100) : 0;
    const totalCalories = tdee - bodyFatReduction;
    const weightLossCalories = totalCalories - 500;

    document.getElementById("bmr").textContent = Math.round(bmr);
    document.getElementById("tdee").textContent = Math.round(tdee);
    document.getElementById("totalCalories").textContent = Math.round(totalCalories);
    document.getElementById("weightLossCalories").textContent = Math.round(weightLossCalories);

    console.log({ bmr, tdee, totalCalories, weightLossCalories });
}


/* ============================
   GENDER SELECTION
============================ */

function selectGender(gender) {
    const maleBtn = document.getElementById('maleBtn');
    const femaleBtn = document.getElementById('femaleBtn');

    if (gender === 'male') {
        maleBtn.classList.add("selected");
        femaleBtn.classList.remove("selected");
        maleBtn.setAttribute('data-selected', 'true');
        femaleBtn.setAttribute('data-selected', 'false');
    } else {
        femaleBtn.classList.add("selected");
        maleBtn.classList.remove("selected");
        femaleBtn.setAttribute('data-selected', 'true');
        maleBtn.setAttribute('data-selected', 'false');
    }
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
    localStorage.setItem('height', height);

    const weight = parseInt(document.getElementById('weightDisplay').textContent, 10);
    localStorage.setItem('weightDisplay', weight);

    const age = parseInt(document.getElementById('ageDisplay').textContent, 10);
    localStorage.setItem('ageDisplay', age);

    const gender = document.querySelector('[data-selected="true"]').id === 'maleBtn' ? 'male' : 'female';
    localStorage.setItem('gender', gender);

    window.location.href = 'adva.html';
}


/* ============================
   SAVE ADVANCED PAGE DATA
============================ */

function nextStepSaveDataOnPage() {
    const bodyFat = parseInt(document.getElementById('bodyFat').value, 10);
    localStorage.setItem('bodyFat', bodyFat);

    const activityLevel = parseFloat(document.getElementById('activityLevel').value);
    localStorage.setItem('activityLevel', activityLevel);

    window.location.href = 'result.html';
}


/* ============================
   MACRONUTRIENT DISTRIBUTION
============================ */

function displayMacronutrientDistribution() {
    const totalCalories = parseFloat(document.getElementById('totalCalories').textContent);

    const breakfastCalories = 0.25 * totalCalories;
    const snack1Calories = 0.10 * totalCalories;
    const lunchCalories = 0.30 * totalCalories;
    const snack2Calories = 0.10 * totalCalories;
    const dinnerCalories = 0.15 * totalCalories;

    document.getElementById('breakfast-calories').textContent = `${breakfastCalories.toFixed(2)} Kcal`;
    document.getElementById('snack1-calories').textContent = `${snack1Calories.toFixed(2)} Kcal`;
    document.getElementById('lunch-calories').textContent = `${lunchCalories.toFixed(2)} Kcal`;
    document.getElementById('snack2-calories').textContent = `${snack2Calories.toFixed(2)} Kcal`;
    document.getElementById('dinner-calories').textContent = `${dinnerCalories.toFixed(2)} Kcal`;
}


/* ============================
   BUTTON GROUP SELECTION
============================ */

function toggleSelection(buttonGroupId) {
    const buttons = document.querySelectorAll(`#${buttonGroupId} button`);

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            buttons.forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
        });
    });
}

toggleSelection('weight-goal-group');
toggleSelection('deficit-amount-group');


/* ============================
   NEXT STEP (WEIGHT GOAL)
============================ */

function nextStep() {
    const selectedWeightGoal = document.querySelector('#weight-goal-group .selected');
    const selectedDeficitAmount = document.querySelector('#deficit-amount-group .selected');

    if (!selectedWeightGoal || !selectedDeficitAmount) {
        alert('Please select both a weight goal and a caloric deficit amount.');
        return;
    }

    alert(`Selected Weight Goal: ${selectedWeightGoal.dataset.title}\nSelected Deficit Amount: ${selectedDeficitAmount.dataset.title}`);
}


/* ============================
   PAGE INITIALIZATION
============================ */

document.addEventListener('DOMContentLoaded', () => {
    if (document.body.classList.contains('input')) {
        document.getElementById('height').addEventListener('input', updateHeightDisplay);
    }
    if (document.body.classList.contains('results')) {
        calculateCalories();
    }
    if (document.body.classList.contains('macronutrients')) {
        displayMacronutrientDistribution();
    }

const bodyFat = parseFloat(localStorage.getItem('bodyFat')) || 0;
const activityLevel = parseFloat(localStorage.getItem('activityLevel')) || 1;


function nextStepSaveDataOnPage() {
    const bodyFatSelect = document.getElementById('bodyFat');
    const activitySelect = document.getElementById('activityLevel');

    const bodyFat = bodyFatSelect.value;
    const activityLevel = activitySelect.value;

    // Kontrola, zda uživatel opravdu něco vybral
    if (bodyFat === "") {
        alert("Please select your body fat percentage.");
        return;
    }

    if (activityLevel === "") {
        alert("Please select your activity level.");
        return;
    }

    // Uložení do localStorage
    localStorage.setItem('bodyFat', parseFloat(bodyFat));
    localStorage.setItem('activityLevel', parseFloat(activityLevel));

    // Přechod na výsledkovou stránku
    window.location.href = 'result.html';
}
});
// === Uložení dat z input stránky ===
function saveDataInputOnPage() {
  const height = document.getElementById("height").value;
  const age = document.getElementById("ageDisplay").textContent;
  const weight = document.getElementById("weightDisplay").textContent;
  const gender = localStorage.getItem("gender");

  localStorage.setItem("height", height);
  localStorage.setItem("age", age);
  localStorage.setItem("weight", weight);

  window.location.href = "result.html";
}

// === Výpočet kalorií ===
function calculateCalories() {
  const height = localStorage.getItem("height");
  const age = localStorage.getItem("age");
  const weight = localStorage.getItem("weight");
  const gender = localStorage.getItem("gender");

  let bmr;

  if (gender === "male") {
    bmr = 88.36 + 13.4 * weight + 4.8 * height - 5.7 * age;
  } else {
    bmr = 447.6 + 9.2 * weight + 3.1 * height - 4.3 * age;
  }

  document.getElementById("calorieValue").textContent = Math.round(bmr);

  animateRing(Math.min(100, Math.round((bmr / 3000) * 100)));
}

// === Animace progress ringu ===
function animateRing(percent) {
  const circle = document.querySelector(".progress-ring .progress");
  const offset = 440 - (440 * percent) / 100;
  circle.style.strokeDashoffset = offset;
}
