function toggleDropdown(id) {
    const dropdown = document.getElementById(id);
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
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

    detailsBox.style.display = detailsBox.children.length > 0 ? 'block' : 'none';
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
    const foodDiv = document.createElement('div');
    foodDiv.className = 'food-entry';
    foodDiv.dataset.kcal = String(extractKcalFromText(textValue));

    const text = document.createElement('span');
    text.textContent = textValue;

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'food-remove';
    removeBtn.textContent = 'x';
    removeBtn.addEventListener('click', () => {
        foodDiv.remove();
        recalculateMealKcal(detailsId);
    });

    foodDiv.appendChild(text);
    foodDiv.appendChild(removeBtn);
    return foodDiv;
}

function saveFoodEntries() {
    const entries = {};
    document.querySelectorAll('.result-details-box').forEach((box) => {
        const items = Array.from(box.querySelectorAll('.food-entry span')).map((item) => item.textContent.trim());
        entries[box.id] = items;
    });
    localStorage.setItem('foodEntries', JSON.stringify(entries));
    alert('Food entries saved.');
}

function loadSavedFoodEntries() {
    const raw = localStorage.getItem('foodEntries');
    if (!raw) return;

    let entries;
    try {
        entries = JSON.parse(raw);
    } catch (error) {
        return;
    }

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
    loadSavedFoodEntries();
});
