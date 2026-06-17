function changeValue(meal, change) {
    const display = document.getElementById(meal + 'Display');
    if (!display) return;

    let currentValue = parseInt(display.textContent, 10);
    if (Number.isNaN(currentValue)) currentValue = 0;

    currentValue += change;
    if (currentValue < 0) currentValue = 0;
    display.textContent = `${currentValue} Kcal`;
    updateMealSummary();
}

function extractKcal(displayId) {
    const el = document.getElementById(displayId);
    if (!el) return 0;

    const value = parseInt(el.textContent, 10);
    return Number.isNaN(value) ? 0 : value;
}

function updateMealSummary() {
    const mealIds = ['breakfastDisplay', 'snack1Display', 'lunchDisplay', 'snack2Display', 'dinnerDisplay'];
    const consumed = mealIds.reduce((sum, id) => sum + extractKcal(id), 0);

    const consumedEl = document.getElementById('meals-total');
    if (consumedEl) {
        consumedEl.textContent = `${consumed} Kcal`;
    }

    const targetEl = document.getElementById('total-calories');
    const remainingEl = document.getElementById('remaining-kcal');
    if (!remainingEl) return;

    const target = targetEl ? parseInt(targetEl.textContent, 10) : 0;
    const parsedTarget = Number.isNaN(target) ? 0 : target;
    const remaining = parsedTarget > 0 ? parsedTarget - consumed : consumed;
    remainingEl.textContent = `${remaining} Kcal`;
}

function extractKcalFromText(text) {
    const match = String(text).match(/(\d+)\s*k?cal/i);
    if (!match) return 0;

    const value = parseInt(match[1], 10);
    return Number.isNaN(value) ? 0 : value;
}

function applyFoodEntriesToMenu() {
    const rawEntries = localStorage.getItem('foodEntries');
    if (!rawEntries) return;

    let entries;
    try {
        entries = JSON.parse(rawEntries);
    } catch (error) {
        return;
    }

    const mapping = [
        { detailsId: 'breakfastDetails', displayId: 'breakfastDisplay', recipeId: 'breakfastRecipe' },
        { detailsId: 'snack1Details', displayId: 'snack1Display' },
        { detailsId: 'lunchDetails', displayId: 'lunchDisplay', recipeId: 'lunchRecipe' },
        { detailsId: 'snack2Details', displayId: 'snack2Display' },
        { detailsId: 'dinnerDetails', displayId: 'dinnerDisplay', recipeId: 'dinnerRecipe' }
    ];

    mapping.forEach(({ detailsId, displayId, recipeId }) => {
        const rawValue = entries[detailsId];
        if (!rawValue) return;

        const items = Array.isArray(rawValue)
            ? rawValue
            : String(rawValue)
                .split('\n')
                .map((item) => item.trim())
                .filter(Boolean);

        if (items.length === 0) return;

        const total = items.reduce((sum, item) => sum + extractKcalFromText(item), 0);
        const displayEl = document.getElementById(displayId);
        if (displayEl) {
            displayEl.textContent = `${total} Kcal`;
        }

        if (recipeId) {
            const recipeEl = document.getElementById(recipeId);
            if (recipeEl) {
                const preview = items.slice(0, 2).join(', ');
                recipeEl.textContent = `Foods: ${preview}${items.length > 2 ? '...' : ''}`;
            }
        }
    });

    updateMealSummary();
}

function applyRecipePlanToMenu() {
    const rawPlan = localStorage.getItem('mealPlanRecipes');
    if (!rawPlan) return;

    let plan;
    try {
        plan = JSON.parse(rawPlan);
    } catch (error) {
        return;
    }

    const mapping = [
        { meal: 'breakfast', displayId: 'breakfastDisplay', recipeId: 'breakfastRecipe' },
        { meal: 'lunch', displayId: 'lunchDisplay', recipeId: 'lunchRecipe' },
        { meal: 'dinner', displayId: 'dinnerDisplay', recipeId: 'dinnerRecipe' }
    ];

    mapping.forEach(({ meal, displayId, recipeId }) => {
        const selected = plan && plan[meal];
        if (!selected) return;

        const display = document.getElementById(displayId);
        const recipeEl = document.getElementById(recipeId);

        if (display && Number.isFinite(Number(selected.kcal))) {
            display.textContent = `${Math.round(Number(selected.kcal))} Kcal`;
        }

        if (recipeEl) {
            recipeEl.textContent = `Selected: ${selected.title}`;
        }
    });

    updateMealSummary();
}

document.addEventListener('DOMContentLoaded', () => {
    applyRecipePlanToMenu();
    applyFoodEntriesToMenu();

    const macrosForm = document.getElementById('macros-form');
    const proteins = document.getElementById('proteins');
    const carbs = document.getElementById('carbs');
    const fats = document.getElementById('fats');
    const totalCalories = document.getElementById('total-calories');

    if (macrosForm && proteins && carbs && fats && totalCalories) {
        macrosForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const p = parseFloat(proteins.value) || 0;
            const c = parseFloat(carbs.value) || 0;
            const f = parseFloat(fats.value) || 0;
            const calories = p * 4 + c * 4 + f * 9;

            totalCalories.textContent = `${Math.round(calories)} Kcal`;
            updateMealSummary();
        });

        proteins.addEventListener('input', () => {
            const el = document.getElementById('proteins-circle');
            if (el) el.textContent = `${proteins.value}g`;
        });

        carbs.addEventListener('input', () => {
            const el = document.getElementById('carbs-circle');
            if (el) el.textContent = `${carbs.value}g`;
        });

        fats.addEventListener('input', () => {
            const el = document.getElementById('fats-circle');
            if (el) el.textContent = `${fats.value}g`;
        });
    }

    const months = [
        { name: 'January', days: 31 },
        { name: 'February', days: 28 },
        { name: 'March', days: 31 },
        { name: 'April', days: 30 },
        { name: 'May', days: 31 },
        { name: 'June', days: 30 },
        { name: 'July', days: 31 },
        { name: 'August', days: 31 },
        { name: 'September', days: 30 },
        { name: 'October', days: 31 },
        { name: 'November', days: 30 },
        { name: 'December', days: 31 }
    ];

    let currentMonthIndex = new Date().getMonth();
    const monthNameElem = document.querySelector('.month-name');
    const daysContainer = document.getElementById('calendar-days');
    const selectedDateDisplay = document.getElementById('selected-date');
    const monthSelect = document.getElementById('month-select');
    const calendarContainer = document.getElementById('calendar-container');
    const showCalendarBtn = document.getElementById('show-calendar-btn1');
    const prevButton = document.querySelector('.prev');
    const nextButton = document.querySelector('.next');

    function renderCalendar(monthIndex) {
        if (!monthNameElem || !daysContainer || !monthSelect) return;

        const month = months[monthIndex];
        monthNameElem.textContent = `${month.name} 2024`;
        daysContainer.innerHTML = '';

        for (let day = 1; day <= month.days; day++) {
            const dayElem = document.createElement('li');
            dayElem.textContent = String(day);
            dayElem.addEventListener('click', function () {
                document.querySelectorAll('.days li').forEach((d) => d.classList.remove('active'));
                this.classList.add('active');
                if (selectedDateDisplay) {
                    selectedDateDisplay.textContent = `Selected date: ${month.name} ${day}, 2024`;
                }
            });
            daysContainer.appendChild(dayElem);
        }
    }

    if (monthSelect) {
        months.forEach((month, index) => {
            const option = document.createElement('option');
            option.value = String(index);
            option.textContent = month.name;
            monthSelect.appendChild(option);
        });

        monthSelect.value = String(currentMonthIndex);
        monthSelect.addEventListener('change', function () {
            currentMonthIndex = parseInt(this.value, 10);
            renderCalendar(currentMonthIndex);
        });
    }

    if (prevButton) {
        prevButton.addEventListener('click', () => {
            currentMonthIndex = (currentMonthIndex + 11) % 12;
            if (monthSelect) monthSelect.value = String(currentMonthIndex);
            renderCalendar(currentMonthIndex);
        });
    }

    if (nextButton) {
        nextButton.addEventListener('click', () => {
            currentMonthIndex = (currentMonthIndex + 1) % 12;
            if (monthSelect) monthSelect.value = String(currentMonthIndex);
            renderCalendar(currentMonthIndex);
        });
    }

    if (showCalendarBtn && calendarContainer) {
        showCalendarBtn.addEventListener('click', () => {
            calendarContainer.style.display = calendarContainer.style.display === 'none' ? 'block' : 'none';
        });
    }

    renderCalendar(currentMonthIndex);
    updateMealSummary();
});
