function getQueryParams() {
    const params = {};
    const search = window.location.search.substring(1);
    if (!search) return params;

    search.split("&").forEach(param => {
        if (!param) return;
        const [key, value] = param.split("=");
        if (!key) return;
        params[key] = decodeURIComponent(value || "");
    });

    return params;
}

function getTotalCalories(params) {
    const queryTotal = parseFloat(params.totalCalories || params.calories || "");
    if (Number.isFinite(queryTotal) && queryTotal > 0) return queryTotal;

    const saved = parseFloat(localStorage.getItem('totalCalories') || "");
    if (Number.isFinite(saved) && saved > 0) return saved;

    return 2000;
}

function getDailyMacroTotals(totalCalories) {
    const savedProtein = parseFloat(localStorage.getItem('proteinGrams') || "");
    const savedCarbs = parseFloat(localStorage.getItem('carbsGrams') || "");
    const savedFat = parseFloat(localStorage.getItem('fatGrams') || "");

    if ([savedProtein, savedCarbs, savedFat].every((v) => Number.isFinite(v) && v > 0)) {
        return {
            protein: savedProtein,
            carbs: savedCarbs,
            fat: savedFat
        };
    }

    return {
        protein: (totalCalories * 0.3) / 4,
        carbs: (totalCalories * 0.4) / 4,
        fat: (totalCalories * 0.3) / 9
    };
}

function displayMacronutrients() {
    const params = getQueryParams();
    const totalCalories = getTotalCalories(params);

    const meals = [
        { name: 'Breakfast', ratio: 0.21, class: 'result-item1' },
        { name: 'Snack 1', ratio: 0.13, class: 'result-item1' },
        { name: 'Lunch', ratio: 0.27, class: 'result-item1' },
        { name: 'Snack 2', ratio: 0.18, class: 'result-item1' },
        { name: 'Dinner', ratio: 0.20, class: 'result-item1' }
    ];

    const totals = getDailyMacroTotals(totalCalories);
    const totalProtein = totals.protein;
    const totalCarbs = totals.carbs;
    const totalFat = totals.fat;

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

    const container = document.getElementById('macronutrients');
    if (container) {
        container.innerHTML = macronutrientsHtml;
    }
}

function goToMenu() {
    const menuUrl = 'menu.html';
    window.location.href = menuUrl;
}

displayMacronutrients();