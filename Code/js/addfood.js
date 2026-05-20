function toggleDropdown(id) {
    const dropdown = document.getElementById(id);
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

function addFoodItem(detailsId, inputId) {
    const detailsBox = document.getElementById(detailsId);
    const input = document.getElementById(inputId);
    const foodItem = input.value.trim();

    if (foodItem) {
        const foodDiv = document.createElement('div');
        foodDiv.textContent = foodItem;
        detailsBox.appendChild(foodDiv);

        detailsBox.style.display = 'block'; 
        input.value = '';
    }
}
