function getQueryParams() {
    const params = {};
    window.location.search.substring(1).split("&").forEach(param => {
        const [key, value] = param.split("=");
        params[key] = decodeURIComponent(value);
    });
    return params;
}

function displayMacronutrients() {
    const params = getQueryParams();
    const totalCalories = parseFloat(params.totalCalories);
    const proteinPercentage = 15;
    const carbsPercentage = 15;
    const fatPercentage = 35;

    const meals = [
        { name: 'Breakfast', ratio: 0.21, class: 'result-item1' },
        { name: 'Snack 1', ratio: 0.13, class: 'result-item1' },
        { name: 'Lunch', ratio: 0.27, class: 'result-item1' },
        { name: 'Snack 2', ratio: 0.18, class: 'result-item1' },
        { name: 'Dinner', ratio: 0.20, class: 'result-item1' }
    ];

    const totalProtein = (totalCalories * (proteinPercentage / 100)) / 4;
    const totalCarbs = (totalCalories * (carbsPercentage / 100)) / 4;
    const totalFat = (totalCalories * (fatPercentage / 100)) / 9;

    let macronutrientsHtml = '';
    meals.forEach(meal => {
        const mealCalories = totalCalories * meal.ratio;
        const mealProtein = totalProtein * meal.ratio;
        const mealCarbs = totalCarbs * meal.ratio;
        const mealFat = totalFat * meal.ratio;

        macronutrientsHtml += `
            <div class="${meal.class}" title="${meal.name} intake">
                <div class="result-title-box">
                    <h2>${meal.name}</h2>
                </div>
                <div class="result-details-box">
                    <div class="result-details">
                        <p class="result-value"><span>Calories:</span> ${mealCalories.toFixed(2)} kcal</p>
                        <p class="result-value"><span>Protein:</span> ${mealProtein.toFixed(2)} g</p>
                        <p class="result-value"><span>Carbs:</span> ${mealCarbs.toFixed(2)} g</p>
                        <p class="result-value"><span>Fat:</span> ${mealFat.toFixed(2)} g</p>
                    </div>
                </div>
            </div>
        `;
    });

    document.getElementById('macronutrients').innerHTML = macronutrientsHtml;
}

function goToMenu() {
    const menuUrl = 'menu.html';
    window.location.href = menuUrl;
}

displayMacronutrients();