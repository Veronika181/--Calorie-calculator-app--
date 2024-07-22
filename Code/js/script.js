function calculateCalories() {
    const height = parseInt(localStorage.getItem("height"), 10) || 0;
    const age = parseInt(localStorage.getItem('ageDisplay'), 10);
    const weight = parseInt(localStorage.getItem('weightDisplay'), 10);
    const gender = localStorage.getItem('gender');
    const bodyFat = parseFloat(localStorage.getItem('bodyFat').value) || 0;
    const activityLevel = parseFloat(localStorage.getItem('activityLevel')) || 1;

    let bmr;
    if (gender === 'male') {
        console.log(gender);
        console.log(weight);
        console.log(age);
        bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
        bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    const tdee = bmr * activityLevel;
    const totalCalories = tdee - (bodyFat ? tdee * (bodyFat / 100) : 0);
    const weightLossCalories = totalCalories - 500; 

    console.log(bmr)
    function myFunction() {
        const outputElement = document.getElementById('output');
        outputElement.textContent = 'The page has loaded and myFunction() was called!';
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

  
