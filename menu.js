let selectedDateKey = '';

function getTodayDateKey() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function buildDateKey(year, monthIndex, day) {
    const month = String(monthIndex + 1).padStart(2, '0');
    const dayPadded = String(day).padStart(2, '0');
    return `${year}-${month}-${dayPadded}`;
}

function parseDateKey(dateKey) {
    const parts = String(dateKey).split('-');
    if (parts.length !== 3) {
        const fallback = new Date();
        return {
            year: fallback.getFullYear(),
            monthIndex: fallback.getMonth(),
            day: fallback.getDate()
        };
    }

    return {
        year: parseInt(parts[0], 10),
        monthIndex: parseInt(parts[1], 10) - 1,
        day: parseInt(parts[2], 10)
    };
}

function formatDateLabel(dateKey) {
    const { year, monthIndex, day } = parseDateKey(dateKey);
    const date = new Date(year, monthIndex, day);
    if (Number.isNaN(date.getTime())) return dateKey;

    return date.toLocaleDateString('en-GB', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
}

function getFoodEntriesByDate() {
    const raw = localStorage.getItem('foodEntriesByDate');
    if (!raw) return {};

    try {
        const parsed = JSON.parse(raw);
        return parsed && typeof parsed === 'object' ? parsed : {};
    } catch (error) {
        return {};
    }
}

function getMacrosByDate() {
    const raw = localStorage.getItem('diaryMacrosByDate');
    if (!raw) return {};

    try {
        const parsed = JSON.parse(raw);
        return parsed && typeof parsed === 'object' ? parsed : {};
    } catch (error) {
        return {};
    }
}

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
    const byDate = getFoodEntriesByDate();
    const entries = byDate[selectedDateKey];

    const mapping = [
        { detailsId: 'breakfastDetails', displayId: 'breakfastDisplay', recipeId: 'breakfastRecipe' },
        { detailsId: 'snack1Details', displayId: 'snack1Display' },
        { detailsId: 'lunchDetails', displayId: 'lunchDisplay', recipeId: 'lunchRecipe' },
        { detailsId: 'snack2Details', displayId: 'snack2Display' },
        { detailsId: 'dinnerDetails', displayId: 'dinnerDisplay', recipeId: 'dinnerRecipe' }
    ];

    mapping.forEach(({ detailsId, displayId, recipeId }) => {
        const displayEl = document.getElementById(displayId);
        if (displayEl) displayEl.textContent = '0 Kcal';

        if (recipeId) {
            const recipeEl = document.getElementById(recipeId);
            if (recipeEl) recipeEl.textContent = '';
        }

        if (!entries || !entries[detailsId]) return;

        const rawValue = entries[detailsId];
        const items = Array.isArray(rawValue)
            ? rawValue
            : String(rawValue)
                .split('\n')
                .map((item) => item.trim())
                .filter(Boolean);

        if (items.length === 0) return;

        const total = items.reduce((sum, item) => sum + extractKcalFromText(item), 0);
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

        if (display && Number.isFinite(Number(selected.kcal)) && display.textContent === '0 Kcal') {
            display.textContent = `${Math.round(Number(selected.kcal))} Kcal`;
        }

        if (recipeEl && !recipeEl.textContent) {
            recipeEl.textContent = `Selected: ${selected.title}`;
        }
    });

    updateMealSummary();
}

document.addEventListener('DOMContentLoaded', () => {
    selectedDateKey = localStorage.getItem('diarySelectedDate') || getTodayDateKey();
    localStorage.setItem('diarySelectedDate', selectedDateKey);

    const macrosForm = document.getElementById('macros-form');
    const proteins = document.getElementById('proteins');
    const carbs = document.getElementById('carbs');
    const fats = document.getElementById('fats');
    const totalCalories = document.getElementById('total-calories');

    function renderMacroCircles(p, c, f) {
        const proteinsCircle = document.getElementById('proteins-circle');
        const carbsCircle = document.getElementById('carbs-circle');
        const fatsCircle = document.getElementById('fats-circle');

        if (proteinsCircle) proteinsCircle.textContent = p > 0 ? `${p}g` : 'P';
        if (carbsCircle) carbsCircle.textContent = c > 0 ? `${c}g` : 'C';
        if (fatsCircle) fatsCircle.textContent = f > 0 ? `${f}g` : 'F';
    }

    function loadMacrosForSelectedDate() {
        if (!proteins || !carbs || !fats || !totalCalories) return;

        const macrosByDate = getMacrosByDate();
        const dayMacros = macrosByDate[selectedDateKey];

        if (!dayMacros) {
            proteins.value = '';
            carbs.value = '';
            fats.value = '';
            totalCalories.textContent = '0 Kcal';
            renderMacroCircles(0, 0, 0);
            return;
        }

        const p = Number(dayMacros.proteins) || 0;
        const c = Number(dayMacros.carbs) || 0;
        const f = Number(dayMacros.fats) || 0;
        const calories = Number(dayMacros.targetCalories) || (p * 4 + c * 4 + f * 9);

        proteins.value = p > 0 ? String(p) : '';
        carbs.value = c > 0 ? String(c) : '';
        fats.value = f > 0 ? String(f) : '';
        totalCalories.textContent = `${Math.round(calories)} Kcal`;
        renderMacroCircles(p, c, f);
    }

    function saveMacrosForSelectedDate(p, c, f, targetCalories) {
        const macrosByDate = getMacrosByDate();
        macrosByDate[selectedDateKey] = {
            proteins: p,
            carbs: c,
            fats: f,
            targetCalories: Math.round(targetCalories)
        };

        localStorage.setItem('diaryMacrosByDate', JSON.stringify(macrosByDate));
    }

    if (macrosForm && proteins && carbs && fats && totalCalories) {
        macrosForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const p = parseFloat(proteins.value) || 0;
            const c = parseFloat(carbs.value) || 0;
            const f = parseFloat(fats.value) || 0;
            const calories = p * 4 + c * 4 + f * 9;

            totalCalories.textContent = `${Math.round(calories)} Kcal`;
            saveMacrosForSelectedDate(p, c, f, calories);
            updateMealSummary();
        });

        proteins.addEventListener('input', () => {
            const p = parseFloat(proteins.value) || 0;
            const c = parseFloat(carbs.value) || 0;
            const f = parseFloat(fats.value) || 0;
            renderMacroCircles(p, c, f);
        });

        carbs.addEventListener('input', () => {
            const p = parseFloat(proteins.value) || 0;
            const c = parseFloat(carbs.value) || 0;
            const f = parseFloat(fats.value) || 0;
            renderMacroCircles(p, c, f);
        });

        fats.addEventListener('input', () => {
            const p = parseFloat(proteins.value) || 0;
            const c = parseFloat(carbs.value) || 0;
            const f = parseFloat(fats.value) || 0;
            renderMacroCircles(p, c, f);
        });
    }

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const selected = parseDateKey(selectedDateKey);
    let currentMonthIndex = selected.monthIndex;
    let currentYear = selected.year;

    const monthNameElem = document.querySelector('.month-name');
    const daysContainer = document.getElementById('calendar-days');
    const selectedDateDisplay = document.getElementById('selected-date');
    const monthSelect = document.getElementById('month-select');
    const calendarContainer = document.getElementById('calendar-container');
    const showCalendarBtn = document.getElementById('show-calendar-btn1');
    const prevButton = document.querySelector('.prev');
    const nextButton = document.querySelector('.next');

    function getDaysInMonth(year, monthIndex) {
        return new Date(year, monthIndex + 1, 0).getDate();
    }

    function updateSelectedDateText() {
        if (selectedDateDisplay) {
            selectedDateDisplay.textContent = `Selected date: ${formatDateLabel(selectedDateKey)}`;
        }
    }

    function renderCalendar(monthIndex) {
        if (!monthNameElem || !daysContainer || !monthSelect) return;

        monthNameElem.textContent = `${months[monthIndex]} ${currentYear}`;
        daysContainer.innerHTML = '';

        const daysInMonth = getDaysInMonth(currentYear, monthIndex);

        for (let day = 1; day <= daysInMonth; day++) {
            const dayElem = document.createElement('li');
            dayElem.textContent = String(day);

            const dayKey = buildDateKey(currentYear, monthIndex, day);
            if (dayKey === selectedDateKey) {
                dayElem.classList.add('active');
            }

            dayElem.addEventListener('click', function () {
                selectedDateKey = dayKey;
                localStorage.setItem('diarySelectedDate', selectedDateKey);

                document.querySelectorAll('.days li').forEach((d) => d.classList.remove('active'));
                this.classList.add('active');

                updateSelectedDateText();
                loadMacrosForSelectedDate();
                applyFoodEntriesToMenu();
                applyRecipePlanToMenu();
            });

            daysContainer.appendChild(dayElem);
        }
    }

    if (monthSelect) {
        months.forEach((month, index) => {
            const option = document.createElement('option');
            option.value = String(index);
            option.textContent = month;
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
            currentMonthIndex -= 1;
            if (currentMonthIndex < 0) {
                currentMonthIndex = 11;
                currentYear -= 1;
            }
            if (monthSelect) monthSelect.value = String(currentMonthIndex);
            renderCalendar(currentMonthIndex);
        });
    }

    if (nextButton) {
        nextButton.addEventListener('click', () => {
            currentMonthIndex += 1;
            if (currentMonthIndex > 11) {
                currentMonthIndex = 0;
                currentYear += 1;
            }
            if (monthSelect) monthSelect.value = String(currentMonthIndex);
            renderCalendar(currentMonthIndex);
        });
    }

    if (showCalendarBtn && calendarContainer) {
        showCalendarBtn.addEventListener('click', () => {
            calendarContainer.style.display = calendarContainer.style.display === 'none' ? 'block' : 'none';
        });
    }

    updateSelectedDateText();
    renderCalendar(currentMonthIndex);
    loadMacrosForSelectedDate();
    applyFoodEntriesToMenu();
    applyRecipePlanToMenu();
    updateMealSummary();
});
