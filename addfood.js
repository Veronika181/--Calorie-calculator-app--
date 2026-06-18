function getTodayDateKey() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function formatDateLabel(dateKey) {
    const parts = String(dateKey).split('-');
    if (parts.length !== 3) return dateKey;

    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);

    const date = new Date(year, month, day);
    if (Number.isNaN(date.getTime())) return dateKey;

    return date.toLocaleDateString('en-GB', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
}

function getActiveDateKey() {
    return localStorage.getItem('diarySelectedDate') || getTodayDateKey();
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

function initMealTabs() {
    const tabs = document.querySelectorAll('.meal-tab');
    tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            tabs.forEach((t) => t.classList.remove('active'));
            document.querySelectorAll('.meal-panel').forEach((p) => p.classList.remove('active'));

            tab.classList.add('active');
            const panelId = `panel-${tab.dataset.meal}`;
            const panel = document.getElementById(panelId);
            if (panel) panel.classList.add('active');
        });
    });
}

function updateDailyTotal() {
    const displays = ['breakfastDisplay', 'snack1Display', 'lunchDisplay', 'dinnerDisplay'];
    const total = displays.reduce((sum, id) => {
        const el = document.getElementById(id);
        if (!el) return sum;
        const value = parseInt(el.textContent, 10);
        return sum + (Number.isNaN(value) ? 0 : value);
    }, 0);

    const totalEl = document.getElementById('daily-total');
    if (totalEl) totalEl.textContent = `${total} Kcal`;
}

// Legacy: kept for backwards compatibility if any old HTML calls it.
function toggleDropdown(id) {
    const dropdown = document.getElementById(id);
    if (dropdown) dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

function extractKcalFromText(text) {
    const match = text.match(/(\d+)\s*k?cal/i);
    if (!match) return 0;

    const value = parseInt(match[1], 10);
    return Number.isNaN(value) ? 0 : value;
}

function getDisplayIdFromDetailsId(detailsId) {
    const mealPrefix = detailsId.replace('Details', '');
    return `${mealPrefix}Display`;
}

function recalculateMealKcal(detailsId) {
    const detailsBox = document.getElementById(detailsId);
    if (!detailsBox) return;

    const total = Array.from(detailsBox.querySelectorAll('.food-entry')).reduce((sum, item) => {
        const kcalValue = parseInt(item.dataset.kcal || '0', 10);
        return sum + (Number.isNaN(kcalValue) ? 0 : kcalValue);
    }, 0);

    const displayId = getDisplayIdFromDetailsId(detailsId);
    const displayEl = document.getElementById(displayId);
    if (displayEl) {
        displayEl.textContent = `${total} Kcal`;
    }

    updateDailyTotal();
}

function addFoodItem(detailsId, inputId) {
    const detailsBox = document.getElementById(detailsId);
    const input = document.getElementById(inputId);
    const foodItem = input.value.trim();

    if (foodItem) {
        const foodDiv = createFoodEntryElement(foodItem, detailsId);
        detailsBox.appendChild(foodDiv);

        recalculateMealKcal(detailsId);
        input.value = '';
    }
}

function showDropdown(id) {
    toggleDropdown(id);
}

function createFoodEntryElement(textValue, detailsId) {
    const kcal = extractKcalFromText(textValue);

    const foodDiv = document.createElement('div');
    foodDiv.className = 'food-entry';
    foodDiv.dataset.kcal = String(kcal);

    const name = document.createElement('span');
    name.className = 'food-entry-name';
    name.textContent = textValue;

    const kcalSpan = document.createElement('span');
    kcalSpan.className = 'food-entry-kcal';
    kcalSpan.textContent = kcal > 0 ? `${kcal} kcal` : '';

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'food-remove';
    removeBtn.title = 'Remove';
    removeBtn.textContent = '\xd7';
    removeBtn.addEventListener('click', () => {
        foodDiv.remove();
        recalculateMealKcal(detailsId);
    });

    foodDiv.appendChild(name);
    foodDiv.appendChild(kcalSpan);
    foodDiv.appendChild(removeBtn);
    return foodDiv;
}

function saveFoodEntries() {
    const dateKey = getActiveDateKey();
    const byDate = getFoodEntriesByDate();
    const entries = {};

    document.querySelectorAll('.result-details-box').forEach((box) => {
        const items = Array.from(box.querySelectorAll('.food-entry span')).map((item) => item.textContent.trim());
        entries[box.id] = items;
    });

    byDate[dateKey] = entries;
    localStorage.setItem('foodEntriesByDate', JSON.stringify(byDate));

    // Keep legacy key in sync for compatibility with old code paths.
    localStorage.setItem('foodEntries', JSON.stringify(entries));
    alert('Food entries saved for selected day.');
}

function loadSavedFoodEntries() {
    const dateKey = getActiveDateKey();
    const byDate = getFoodEntriesByDate();

    let entries = byDate[dateKey];

    // Backward compatibility with previous single-key storage.
    if (!entries) {
        const rawLegacy = localStorage.getItem('foodEntries');
        if (rawLegacy) {
            try {
                entries = JSON.parse(rawLegacy);
            } catch (error) {
                entries = null;
            }
        }
    }

    if (!entries || typeof entries !== 'object') return;

    Object.entries(entries).forEach(([detailsId, value]) => {
        const detailsBox = document.getElementById(detailsId);
        if (!detailsBox) return;

        const items = Array.isArray(value)
            ? value
            : String(value)
                .split('\n')
                .map((item) => item.trim())
                .filter(Boolean);

        items.forEach((itemText) => {
            const node = createFoodEntryElement(itemText, detailsId);
            detailsBox.appendChild(node);
        });

        recalculateMealKcal(detailsId);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initMealTabs();

    const dateLabel = document.getElementById('active-date-label');
    if (dateLabel) {
        dateLabel.textContent = formatDateLabel(getActiveDateKey());
    }

    loadSavedFoodEntries();
    updateDailyTotal();
});
