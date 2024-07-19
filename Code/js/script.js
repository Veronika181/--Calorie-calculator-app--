function showSection(sectionId, cssFile) {
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(sectionId).style.display = 'block';
    if (cssFile) {
        document.getElementById('style-link').setAttribute('href', `css/${cssFile}`);
    }
}

function selectGender(gender) {
    const maleBtn = document.getElementById('maleBtn');
    const femaleBtn = document.getElementById('femaleBtn');
    if (gender === 'male') {
        maleBtn.style.backgroundColor = '#FFA500';
        femaleBtn.style.backgroundColor = '';
        maleBtn.setAttribute('data-selected', 'true');
        femaleBtn.setAttribute('data-selected', 'false');
    } else {
        femaleBtn.style.backgroundColor = '#FFA500';
        maleBtn.style.backgroundColor = '';
        femaleBtn.setAttribute('data-selected', 'true');
        maleBtn.setAttribute('data-selected', 'false');
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
    const gender = document.querySelector('[data-selected="true"]').id === 'maleBtn' ? 'male' : 'female';
    const bodyFat = parseFloat(document.getElementById('bodyFat').value) || 0;
    const activityLevel = parseFloat(document.getElementById('activityLevel').value) || 1;

    let bmr;
    if (gender === 'male') {
        bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
        bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    const tdee = bmr * activityLevel;
    const bodyFatCalories = bodyFat ? tdee * (bodyFat / 100) : 0;
    const totalCalories = tdee - bodyFatCalories;

    // Display the total calorie value directly
    document.getElementById('calorieResult').textContent = `Your daily caloric needs are ${totalCalories.toFixed(2)} calories.`;

    // Show the result section
    showSection('resultSection', 'styles-result.css');
}

// Event listeners to trigger calculation on input change
document.getElementById('height').addEventListener('input', updateHeightDisplay);
document.getElementById('age').addEventListener('input', updateAgeDisplay);
document.getElementById('weight').addEventListener('input', updateWeightDisplay);
document.getElementById('bodyFat').addEventListener('change', calculateCalories);
document.getElementById('activityLevel').addEventListener('input', calculateCalories);

function selectGender(gender) {
    const maleBtn = document.getElementById('maleBtn');
    const femaleBtn = document.getElementById('femaleBtn');
    if (gender === 'male') {
        maleBtn.style.backgroundColor = '#FFA500';
        femaleBtn.style.backgroundColor = '';
        maleBtn.setAttribute('data-selected', 'true');
        femaleBtn.setAttribute('data-selected', 'false');
    } else {
        femaleBtn.style.backgroundColor = '#FFA500';
        maleBtn.style.backgroundColor = '';
        femaleBtn.setAttribute('data-selected', 'true');
        maleBtn.setAttribute('data-selected', 'false');
    }
    updateBodyFatOptions(); // Update options based on gender
}

function updateBodyFatOptions() {
    const bodyFatSelect = document.getElementById('bodyFat');
    const gender = document.querySelector('[data-selected="true"]').id === 'maleBtn' ? 'male' : 'female';

    bodyFatSelect.innerHTML = '';
    bodyFatSelect.innerHTML = '<option value="" disabled selected>Select body fat percentage</option>';

    const options = gender === 'male' ? [3, 6, 10, 15, 20, 25, 30, 35, 40] : [10, 15, 20, 25, 30, 35, 40, 45, 50];

    options.forEach(value => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = `${value}%`;
        bodyFatSelect.appendChild(option);
    });

    calculateCalories(); // Recalculate when options are updated
}

function updateHeightDisplay() {
    const heightRange = document.getElementById('height');
    const heightDisplay = document.getElementById('heightDisplay');
    heightDisplay.textContent = heightRange.value + " cm";
    calculateCalories(); // Recalculate when height is updated
}

function updateAgeDisplay() {
    const ageInput = document.getElementById('age');
    const ageDisplay = document.getElementById('ageDisplay');
    ageDisplay.textContent = ageInput.value;
    calculateCalories(); // Recalculate when age is updated
}

function updateWeightDisplay() {
    const weightInput = document.getElementById('weight');
    const weightDisplay = document.getElementById('weightDisplay');
    weightDisplay.textContent = weightInput.value;
    calculateCalories(); // Recalculate when weight is updated
}

document.addEventListener('DOMContentLoaded', function() {
    updateBodyFatOptions(); // Initialize body fat options based on default gender
    calculateCalories(); // Initial calculation
});
function nextPage() {
    // Calculate the calories before redirecting
    calculateCalories();

    // Store the result in local storage
    const calorieResult = document.getElementById('calorieResult').textContent;
    localStorage.setItem('calorieResult', calorieResult);

    // Redirect to result.html
    window.location.href = 'result.html';
}
