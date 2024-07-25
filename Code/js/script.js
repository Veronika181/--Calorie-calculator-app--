function calculateCalories() {
    const height = parseInt(localStorage.getItem('height'), 10) || 0;
    const age = parseInt(localStorage.getItem('ageDisplay'), 10);
    const weight = parseInt(localStorage.getItem('weightDisplay'), 10);
    const gender = localStorage.getItem('gender');
    const bodyFat = parseFloat(localStorage.getItem('bodyFat').value) || 0;
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

    
    const bmrValue = document.getElementById("bmr");
    bmrValue.textContent = bmr;

    const tdeeValue = document.getElementById("tdee");
    tdeeValue.textContent = tdee;

    const totalCaloriesValue = document.getElementById("totalCalories");
    totalCaloriesValue.textContent = totalCalories;

    const weightLossCaloriesValue = document.getElementById("weightLossCalories");
    weightLossCaloriesValue.textContent =  weightLossCalories;
}
    console.log(bmr)

  

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

function changeValue(id, delta) {
    const display = document.getElementById(id + 'Display');
    let value = parseInt(display.textContent, 10) + delta;
    if (value < 0) value = 0;
    display.textContent = value;  
}

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.age-btn-left, .age-btn-right, .weight-btn-left, .weight-btn-right').forEach(btn => {
        btn.addEventListener('click', (event) => {
            const [id, delta] = [event.target.parentElement.id.replace('Display', ''), event.target.className.includes('left') ? -1 : 1];
            changeValue(id, delta);
        });
    });


    const bmr = localStorage.getItem('bmr');
    const tdee = localStorage.getItem('tdee');
    const totalCalories = localStorage.getItem('totalCalories');
    const weightLossCalories = localStorage.getItem('weightLossCalories');

    const bmrElement = document.getElementById('bmr');
    const tdeeElement = document.getElementById('tdee');
    const totalCaloriesElement = document.getElementById('totalCalories');
    const weightLossCaloriesElement = document.getElementById('weightLossCalories');

    localStorage.removeItem('bmr');
    localStorage.removeItem('tdee');
    localStorage.removeItem('totalCalories');
    localStorage.removeItem('weightLossCalories');
});

function saveDataInputOnPage() {
    const height = parseInt(document.getElementById('height').value, 10);
    console.log(height)
    window.localStorage.setItem('height', height);

    const weight = parseInt(document.getElementById('weightDisplay').textContent, 10);
    window.localStorage.setItem('weightDisplay', weight);

    const age = parseInt(document.getElementById('ageDisplay').textContent, 10);
    window.localStorage.setItem('ageDisplay', age);

    const gender = document.querySelector('[data-selected="true"]').id === 'maleBtn' ? 'male' : 'female';
    window.localStorage.setItem('gender', gender);

    window.location.href = 'adva.html';
}

function nextStepSaveDataOnPage() {
    const bodyFat = parseInt(document.getElementById('bodyFat').value, 10);
    window.localStorage.setItem('bodyFat', bodyFat);

    const activityLevel = parseFloat(document.getElementById('activityLevel').value);
    window.localStorage.setItem('activityLevel', activityLevel);

    window.location.href = 'result.html';
}



function showRecipeSection() {
    document.getElementById('recipeSection').style.display = 'block';
}

function showRecipe(mealType) {
    // Placeholder logic for showing the recipe details
    // You can replace this with actual logic to display recipe details based on mealType
    const recipeDetails = document.getElementById('recipeDetails');
    recipeDetails.style.display = 'block';
    document.getElementById('recipeTitle').innerText = `Recipe for ${mealType}`;
    document.getElementById('recipeCalories').innerText = 'Calories: 200';
    document.getElementById('recipeProtein').innerText = 'Protein: 10g';
    document.getElementById('recipeCarbs').innerText = 'Carbs: 30g';
    document.getElementById('recipeFat').innerText = 'Fat: 5g';
}

function displayMacronutrientDistribution() {
    const totalCalories = parseFloat(document.getElementById('totalCalories').textContent);

    // Macronutrient distribution (example percentages)
    const breakfastCalories = 0.25 * totalCalories;
    const snack1Calories = 0.10 * totalCalories;
    const lunchCalories = 0.30 * totalCalories;
    const snack2Calories = 0.10 * totalCalories;
    const dinnerCalories = 0.15 * totalCalories;

    // Update HTML content for macronutrient distribution
    document.getElementById('breakfast-calories').textContent = `${breakfastCalories.toFixed(2)} Kcal`;
    document.getElementById('snack1-calories').textContent = `${snack1Calories.toFixed(2)} Kcal`;
    document.getElementById('lunch-calories').textContent = `${lunchCalories.toFixed(2)} Kcal`;
    document.getElementById('snack2-calories').textContent = `${snack2Calories.toFixed(2)} Kcal`;
    document.getElementById('dinner-calories').textContent = `${dinnerCalories.toFixed(2)} Kcal`;

    // Protein, Carbs, and Fat (example distribution for simplicity)
    document.getElementById('breakfast-protein').textContent = `30% of total = ${0.30 * breakfastCalories / 4} g`;
    document.getElementById('breakfast-carbs').textContent = `50% of total = ${0.50 * breakfastCalories / 4} g`;
    document.getElementById('breakfast-fat').textContent = `20% of total = ${0.20 * breakfastCalories / 9} g`;

    document.getElementById('snack1-protein').textContent = `20% of total = ${0.20 * snack1Calories / 4} g`;
    document.getElementById('snack1-carbs').textContent = `40% of total = ${0.40 * snack1Calories / 4} g`;
    document.getElementById('snack1-fat').textContent = `40% of total = ${0.40 * snack1Calories / 9} g`;

    document.getElementById('lunch-protein').textContent = `35% of total = ${0.35 * lunchCalories / 4} g`;
    document.getElementById('lunch-carbs').textContent = `45% of total = ${0.45 * lunchCalories / 4} g`;
    document.getElementById('lunch-fat').textContent = `20% of total = ${0.20 * lunchCalories / 9} g`;

    document.getElementById('snack2-protein').textContent = `15% of total = ${0.15 * snack2Calories / 4} g`;
    document.getElementById('snack2-carbs').textContent = `50% of total = ${0.50 * snack2Calories / 4} g`;
    document.getElementById('snack2-fat').textContent = `35% of total = ${0.35 * snack2Calories / 9} g`;

    document.getElementById('dinner-protein').textContent = `20% of total = ${0.20 * dinnerCalories / 4} g`;
    document.getElementById('dinner-carbs').textContent = `25% of total = ${0.25 * dinnerCalories / 4} g`;
    document.getElementById('dinner-fat').textContent = `15% of total = ${0.15 * dinnerCalories / 9} g`;
}

// Attach event listeners to ensure the functions are triggered correctly
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
});

// script.js

document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.btn-group button');

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            // Unselect all buttons
            buttons.forEach(btn => btn.classList.remove('selected'));
            // Select the clicked button
            button.classList.add('selected');
        });
    });
});


function selectweight(weight) {
   
    const reducebtn = document.getElementById('reduce');
    const maintainbtn = document.getElementById('maintain');
    const gainbtn = document.getElementById('gain');
    
  
    const buttons = [reducebtn, maintainbtn, gainbtn];
    buttons.forEach(btn => {
        btn.style.backgroundColor = '#FFA500'; 
        btn.setAttribute('data-selected', 'false');
    });

   
    const selectedBtn = document.getElementById(weight);
    if (selectedBtn) {
        selectedBtn.style.backgroundColor = '#FF4500'; 
        selectedBtn.setAttribute('data-selected', 'true');
    }
}



function selectdeficit(amount) {
 
    const lowbtn = document.getElementById('low');
    const mediumbtn = document.getElementById('medium');
    const highbtn = document.getElementById('high');
    
    
    const buttons = [lowbtn, mediumbtn, highbtn];
    buttons.forEach(btn => {
        btn.style.backgroundColor = '#FFA500'; 
        btn.setAttribute('data-selected', 'false');
    });

    const selectedBtn = document.getElementById(amount);
    if (selectedBtn) {
        selectedBtn.style.backgroundColor = '#FF4500'; 
        selectedBtn.setAttribute('data-selected', 'true');
    }
}

// script.js

document.addEventListener('DOMContentLoaded', () => {
    const buttonGroups = document.querySelectorAll('.btn-group');

    buttonGroups.forEach(group => {
        const buttons = group.querySelectorAll('button');

        buttons.forEach(button => {
            button.addEventListener('click', () => {
                // Unselect all buttons in the same group
                buttons.forEach(btn => btn.classList.remove('selected'));
                // Select the clicked button
                button.classList.add('selected');
            });
        });
    });
});
// script.js

// Funkce pro přepnutí třídy vybrané
function toggleSelection(buttonGroup) {
    const buttons = document.querySelectorAll(buttonGroup + ' button');
    
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            // Odebrání třídy 'selected' ze všech tlačítek
            buttons.forEach(btn => btn.classList.remove('selected'));
            // Přidání třídy 'selected' na kliknuté tlačítko
            button.classList.add('selected');
        });
    });
}

// script.js

// Funkce pro přepnutí třídy vybrané
function toggleSelection(buttonGroupId) {
    const buttons = document.querySelectorAll(`#${buttonGroupId} button`);
    
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            // Odebrání třídy 'selected' ze všech tlačítek v dané skupině
            buttons.forEach(btn => btn.classList.remove('selected'));
            // Přidání třídy 'selected' na kliknuté tlačítko
            button.classList.add('selected');
        });
    });
}

// Inicializace funkcí pro tlačítka
toggleSelection('weight-goal-group');
toggleSelection('deficit-amount-group');

// Funkce pro zpracování kliknutí na 'Next'
function nextStep() {
    const selectedWeightGoal = document.querySelector('#weight-goal-group .selected');
    const selectedDeficitAmount = document.querySelector('#deficit-amount-group .selected');
    
    if (!selectedWeightGoal || !selectedDeficitAmount) {
        alert('Please select both a weight goal and a caloric deficit amount.');
        return;
    }
    
    // Další logika pro přechod na další stránku nebo zpracování
    alert(`Selected Weight Goal: ${selectedWeightGoal.dataset.title}\nSelected Deficit Amount: ${selectedDeficitAmount.dataset.title}`);
}
