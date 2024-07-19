"use strict";

function showSection(sectionId, cssFile) {
  document.querySelectorAll('.section').forEach(function (section) {
    section.style.display = 'none';
  });
  document.getElementById(sectionId).style.display = 'block';
  document.getElementById('style-link').setAttribute('href', "css/".concat(cssFile));
}

function selectGender(gender) {
  var maleBtn = document.getElementById('maleBtn');
  var femaleBtn = document.getElementById('femaleBtn');

  if (gender === 'male') {
    maleBtn.style.backgroundColor = '#FFA500';
    femaleBtn.style.backgroundColor = '';
  } else {
    femaleBtn.style.backgroundColor = '#FFA500';
    maleBtn.style.backgroundColor = '';
  }
}

function updateHeightDisplay() {
  var heightRange = document.getElementById('height');
  var heightDisplay = document.getElementById('heightDisplay');
  heightDisplay.textContent = heightRange.value + " cm";
}

function changeValue(inputId, increment) {
  var displayId = "".concat(inputId, "Display");
  var currentValue = parseInt(document.getElementById(displayId).textContent, 10);
  currentValue += increment;
  if (currentValue < 0) currentValue = 0;
  document.getElementById(displayId).textContent = currentValue;
}

function calculateCalories() {
  var height = parseInt(document.getElementById('height').value, 10);
  var age = parseInt(document.getElementById('ageDisplay').textContent, 10);
  var weight = parseInt(document.getElementById('weightDisplay').textContent, 10);
  var gender = document.getElementById('maleBtn').style.backgroundColor ? 'male' : 'female';
  var bodyFat = parseFloat(document.getElementById('bodyFat').value);
  var activityLevel = parseFloat(document.getElementById('activityLevel').value);
  var bmr;

  if (gender === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  var tdee = bmr * activityLevel;
  var bodyFatCalories = bodyFat ? tdee * (bodyFat / 100) : 0;
  var totalCalories = tdee - bodyFatCalories;
  document.getElementById('calorieResult').textContent = "Your daily caloric needs are ".concat(totalCalories.toFixed(2), " calories.");
  showSection('result', 'styles-result.css');
} // Initialize the display values on page load


document.addEventListener("DOMContentLoaded", function () {
  updateHeightDisplay();
});