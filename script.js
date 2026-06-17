function updateHeightDisplay() {
    const heightRange = document.getElementById('height');
    const heightDisplay = document.getElementById('heightDisplay');
    if (!heightRange || !heightDisplay) return;
    heightDisplay.textContent = `${heightRange.value} cm`;
}

function changeValue(id, delta) {
    const display = document.getElementById(id + 'Display');
    if (!display) return;

    let value = parseInt(display.textContent, 10);
    if (Number.isNaN(value)) value = 0;
    value += delta;
    if (value < 0) value = 0;

    display.textContent = String(value);
}

function saveDataInputOnPage() {
    const heightEl = document.getElementById('height');
    const weightEl = document.getElementById('weightDisplay');
    const ageEl = document.getElementById('ageDisplay');

    if (!heightEl || !weightEl || !ageEl) return;

    const height = parseInt(heightEl.value, 10);
    const weight = parseInt(weightEl.textContent, 10);
    const age = parseInt(ageEl.textContent, 10);
    const gender = localStorage.getItem('gender');

    if (!gender) {
        alert('Please select your gender.');
        return;
    }

    localStorage.setItem('height', String(height));
    localStorage.setItem('weight', String(weight));
    localStorage.setItem('age', String(age));

    window.location.href = 'advanced.html';
}

function goNext() {
    saveDataInputOnPage();
}

function goBack() {
    window.history.back();
}

function selectGender(gender, btn) {
    localStorage.setItem('gender', gender);

    document.querySelectorAll('.gender-btn').forEach((b) => {
        b.classList.remove('selected');
    });

    if (btn) btn.classList.add('selected');
}

function nextStepSaveDataOnPage() {
    const weight = parseInt(localStorage.getItem('weight') || '0', 10);
    const height = parseInt(localStorage.getItem('height') || '0', 10);
    const age = parseInt(localStorage.getItem('age') || '0', 10);
    const gender = localStorage.getItem('gender') || 'male';

    const bodyFatEl = document.getElementById('bodyFat');
    const activityEl = document.getElementById('activityLevel');
    if (!activityEl) return;

    const bodyFat = bodyFatEl ? bodyFatEl.value : '';
    const activity = parseFloat(activityEl.value || '1.2');

    let bmr;

    if (bodyFat !== '') {
        const bf = parseFloat(bodyFat) / 100;
        const leanMass = weight * (1 - bf);
        bmr = 370 + 21.6 * leanMass;
    } else {
        bmr = gender === 'male'
            ? 10 * weight + 6.25 * height - 5 * age + 5
            : 10 * weight + 6.25 * height - 5 * age - 161;
    }

    const tdee = bmr * activity;

    localStorage.setItem('BMR', String(Math.round(bmr)));
    localStorage.setItem('TDEE', String(Math.round(tdee)));

    window.location.href = 'result.html';
}

function calculateCalories() {
    const tdee = parseInt(localStorage.getItem('TDEE') || '0', 10);
    const value = document.getElementById('calorieValue');
    if (value) value.textContent = String(tdee || 0);

    const circle = document.querySelector('.progress-ring .progress');
    if (!(circle instanceof SVGCircleElement)) return;

    const radius = circle.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;
    circle.style.strokeDasharray = `${circumference} ${circumference}`;

    const percent = Math.min((tdee || 0) / 4000, 1);
    const offset = circumference - percent * circumference;
    circle.style.strokeDashoffset = String(offset);
}

function goToWeightGoals() {
    window.location.href = 'weightgoals.html';
}

function resultRatioOfMacronutrients() {
    window.location.href = 'resultratioofmacronutrients.html';
}

function resultratioofmacronutrients() {
    resultRatioOfMacronutrients();
}

function showRecipeSection() {
    const section = document.getElementById('recipeSection');
    if (section) section.style.display = 'block';
}

function showRecipe(meal) {
    const details = document.getElementById('recipeDetails');
    const title = document.getElementById('recipeTitle');
    const calories = document.getElementById('recipeCalories');
    const protein = document.getElementById('recipeProtein');
    const carbs = document.getElementById('recipeCarbs');
    const fat = document.getElementById('recipeFat');

    if (!details || !title || !calories || !protein || !carbs || !fat) return;

    const recipes = {
        breakfast: { title: 'Breakfast', calories: '320 kcal', protein: '22 g', carbs: '30 g', fat: '12 g' },
        snack: { title: 'Snack', calories: '180 kcal', protein: '12 g', carbs: '18 g', fat: '6 g' },
        lunch: { title: 'Lunch', calories: '520 kcal', protein: '35 g', carbs: '50 g', fat: '18 g' },
        afternoonSnack: { title: 'Afternoon Snack', calories: '210 kcal', protein: '14 g', carbs: '22 g', fat: '7 g' },
        dinner: { title: 'Dinner', calories: '460 kcal', protein: '32 g', carbs: '36 g', fat: '16 g' }
    };

    const item = recipes[meal];
    if (!item) return;

    title.textContent = item.title;
    calories.textContent = `Calories: ${item.calories}`;
    protein.textContent = `Protein: ${item.protein}`;
    carbs.textContent = `Carbs: ${item.carbs}`;
    fat.textContent = `Fat: ${item.fat}`;
    details.style.display = 'block';
}

document.addEventListener('DOMContentLoaded', () => {
    updateHeightDisplay();
});
