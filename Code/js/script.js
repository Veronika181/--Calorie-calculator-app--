function calculateCalories() {
    
    const height = localStorage.getItem("height") 


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

    console.log('Calculated total calories:', totalCalories);

    
    localStorage.setItem('calorieResult', totalCalories.toFixed(2));

    
    window.location.href = 'result.html';
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
    updateBodyFatOptions();
}

function updateHeightDisplay() {
    const heightRange = document.getElementById('height');
    const heightDisplay = document.getElementById('heightDisplay');
    heightDisplay.textContent = heightRange.value + " cm";
    calculateCalories();
}

function changeValue(id, delta) {
    const display = document.getElementById(id + 'Display');
    let value = parseInt(display.textContent, 10) + delta;
    if (value < 0) value = 0;
    display.textContent = value;
    calculateCalories();
}

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.age-btn-left, .age-btn-right, .weight-btn-left, .weight-btn-right').forEach(btn => {
        btn.addEventListener('click', (event) => {
            const [id, delta] = [event.target.parentElement.id.replace('Display', ''), event.target.className.includes('left') ? -1 : 1];
            changeValue(id, delta);
        });
    });
    document.getElementById('height').addEventListener('input', updateHeightDisplay);
});
document.addEventListener('DOMContentLoaded', function() {
    const bmr = localStorage.getItem('bmr');
    const tdee = localStorage.getItem('tdee');

    if (bmr && tdee) {
        document.getElementById('bmr').textContent = `BMR: ${bmr}`;
        document.getElementById('tdee').textContent = `TDEE: ${tdee}`;
    } else {
        document.getElementById('bmr').textContent = 'BMR: No data available';
        document.getElementById('tdee').textContent = 'TDEE: No data available';
    }

   
    localStorage.removeItem('bmr');
    localStorage.removeItem('tdee');
});


function saveDataInputOnPage(){
    const height = parseInt(document.getElementById('height').value);
    window.localStorage.setItem('height', height);

    const weight = parseInt(document.getElementById('weight').value);
    window.localStorage.setItem('weight', weight);

    const age = parseInt(document.getElementById('age').value);
    window.localStorage.setItem('age', age);

    const male = parseInt(document.getElementById('male').value);
    window.localStorage.setItem('male', male);

    const female = parseInt(document.getElementById('female').value);
    window.localStorage.setItem('female', female);

    window.location.href = 'adva.html';
}

function nextStepsaveDataOnPage(){
    const bodyFat = parseInt(document.getElementById('bodyfat').value);
    window.localStorage.setItem('bodyfat', bodyfat);

    const activityLevel = parseInt(document.getElementById('activity').value);
    window.localStorage.setItem('activity', activity);
}
  
  
