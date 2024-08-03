function toggleDropdown(dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

function showDropdown(dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    dropdown.style.display = 'block';
}

function showQuantityInput(mealDetailsId, inputId, dropdownId) {
    const foodItem = document.getElementById(inputId).value;
    if (foodItem) {
        // Hide the dropdown and show quantity input
        document.getElementById(dropdownId).style.display = 'none';
        const mealDetails = document.getElementById(mealDetailsId);
        mealDetails.innerHTML += `
            <div class="food-item-container">
                <div>
                    <span>${foodItem}</span>
                    <input type="number" id="${mealDetailsId}Quantity${Date.now()}" placeholder="grams">
                    <button onclick="confirmFood('${mealDetailsId}', '${foodItem}', '${mealDetailsId}Quantity${Date.now()}')">Confirm</button>
                </div>
            </div>
        `;
        document.getElementById(inputId).value = ''; // Clear the input field
    }
}

function confirmFood(mealDetailsId, foodItem, quantityInputId) {
    const quantity = document.getElementById(quantityInputId).value;
    if (quantity) {
        const mealDetails = document.getElementById(mealDetailsId);
        mealDetails.innerHTML += `
            <div class="food-item">
                <span>${foodItem} (${quantity} grams)</span>
                <button type="button" onclick="addToFavorites('${foodItem}')">Add to Favorites</button>
            </div>
        `;
        // Optionally remove the input field after confirmation
        const container = document.querySelector(`#${mealDetailsId} .food-item-container`);
        if (container) container.remove();
    }
}

function addToFavorites(foodItem) {
    alert(foodItem + ' added to favorites!');
}