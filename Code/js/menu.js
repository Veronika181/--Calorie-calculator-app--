// script.js

document.getElementById('macros-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const proteins = parseFloat(document.getElementById('proteins').value) || 0;
    const carbs = parseFloat(document.getElementById('carbs').value) || 0;
    const fats = parseFloat(document.getElementById('fats').value) || 0;
    
    // Calculate calories
    const calories = (proteins * 4) + (carbs * 4) + (fats * 9);
    
    // Update the total calories displayed
    document.getElementById('total-calories').textContent = calories;
    
    // Update the circle color based on calorie threshold
    const circle = document.querySelector('.circle');
    if (calories < 2000) {
        circle.style.background = `conic-gradient(#4caf50 ${calories / 2000 * 100}%, #f44336 ${calories / 2000 * 100}%)`;
    } else {
        circle.style.background = `conic-gradient(#f44336)`;
    }
});

document.addEventListener('DOMContentLoaded', (event) => {
    let calorieCount = 0;

    const calorieCountElement = document.getElementById('calorie-count');
    const addCalorieButton = document.getElementById('add-calorie');

    addCalorieButton.addEventListener('click', () => {
        calorieCount++;
        calorieCountElement.textContent = calorieCount;
    });
});

function changeValue(meal, change) {
    const display = document.getElementById(meal + 'Display');
    let currentValue = parseInt(display.textContent, 10);
    currentValue += change;
    if (currentValue < 0) currentValue = 0; // Prevent negative values
    display.textContent = currentValue;
}
