function toggleDropdown(dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    if (!dropdown) return;
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

function showDropdown(dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    if (!dropdown) return;
    dropdown.style.display = 'block';
}

function showQuantityInput(mealDetailsId, inputId, dropdownId) {
    const input = document.getElementById(inputId);
    const dropdown = document.getElementById(dropdownId);
    const mealDetails = document.getElementById(mealDetailsId);
    if (!input || !dropdown || !mealDetails) return;

    const foodItem = input.value.trim();
    if (!foodItem) return;

    dropdown.style.display = 'none';

    const quantityInputId = `${mealDetailsId}Quantity${Date.now()}`;

    const container = document.createElement('div');
    container.className = 'food-item-container';

    const row = document.createElement('div');

    const title = document.createElement('span');
    title.textContent = foodItem;

    const quantityInput = document.createElement('input');
    quantityInput.type = 'number';
    quantityInput.id = quantityInputId;
    quantityInput.placeholder = 'grams';
    quantityInput.min = '0';

    const confirmBtn = document.createElement('button');
    confirmBtn.type = 'button';
    confirmBtn.textContent = 'Confirm';
    confirmBtn.addEventListener('click', function () {
        confirmFood(mealDetailsId, foodItem, quantityInputId);
    });

    row.appendChild(title);
    row.appendChild(quantityInput);
    row.appendChild(confirmBtn);
    container.appendChild(row);
    mealDetails.appendChild(container);

    input.value = '';
}

function confirmFood(mealDetailsId, foodItem, quantityInputId) {
    const quantityInput = document.getElementById(quantityInputId);
    const mealDetails = document.getElementById(mealDetailsId);
    if (!quantityInput || !mealDetails) return;

    const quantity = quantityInput.value.trim();
    const quantityValue = Number(quantity);
    if (!Number.isFinite(quantityValue) || quantityValue <= 0) return;

    const foodRow = document.createElement('div');
    foodRow.className = 'food-item';

    const label = document.createElement('span');
    label.textContent = `${foodItem} (${quantityValue} grams)`;

    const favoriteBtn = document.createElement('button');
    favoriteBtn.type = 'button';
    favoriteBtn.textContent = 'Add to Favorites';
    favoriteBtn.addEventListener('click', function () {
        addToFavorites(foodItem);
    });

    foodRow.appendChild(label);
    foodRow.appendChild(favoriteBtn);
    mealDetails.appendChild(foodRow);

    const container = quantityInput.closest('.food-item-container');
    if (container) container.remove();
}

function addToFavorites(foodItem) {
    alert(foodItem + ' added to favorites!');
}