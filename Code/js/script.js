function showSection(sectionId, cssFile) {
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
    document.getElementById('style-link').setAttribute('href', `css/${cssFile}`);
}

function selectGender(gender) {
    const maleBtn = document.getElementById('maleBtn');
    const femaleBtn = document.getElementById('femaleBtn');
    if (gender === 'male') {
        maleBtn.style.backgroundColor = '#FFA500';
        femaleBtn.style.backgroundColor = '';
    } else {
        femaleBtn.style.backgroundColor = '#FFA500';
        maleBtn.style.backgroundColor = '';
    }
}

function updateHeightDisplay() {
    const heightRange = document.getElementById('height');
    const heightDisplay = document.getElementById('heightDisplay');
    heightDisplay.textContent = heightRange.value + " cm";
}

function changeValue(inputId, increment) {
    const displayId = `${inputId}Display`;
    let currentValue = parseInt(document.getElementById(displayId).textContent, 10);
    currentValue += increment;
    if (currentValue < 0) currentValue = 0;
    document.getElementById(displayId).textContent = currentValue;
}

function calculateCalories() {
    const height = parseInt(document.getElementById('height').value, 10);
    const age = parseInt(document.getElementById('ageDisplay').textContent, 10);
    const weight = parseInt(document.getElementById('weightDisplay').textContent, 10);
    const gender = document.getElementById('maleBtn').style.backgroundColor ? 'male' : 'female';
    const bodyFat = parseFloat(document.getElementById('bodyFat').value);
    const activityLevel = parseFloat(document.getElementById('activityLevel').value);

    let bmr;
    if (gender === 'male') {
        bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
        bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    const tdee = bmr * activityLevel;
    const bodyFatCalories = bodyFat ? tdee * (bodyFat / 100) : 0;
    const totalCalories = tdee - bodyFatCalories;

    document.getElementById('calorieResult').textContent = `Your daily caloric needs are ${totalCalories.toFixed(2)} calories.`;
    showSection('result', 'styles-result.css');
}

// Initialize the display values on page load
document.addEventListener("DOMContentLoaded", function() {
    updateHeightDisplay();
});