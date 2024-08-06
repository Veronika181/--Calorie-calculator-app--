function toggleDropdown(id) {
    const dropdown = document.getElementById(id);
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

function showDropdown(id) {
    const dropdown = document.getElementById(id);
    dropdown.style.display = 'block';
}

function addFoodItem(detailsId, inputId) {
    const detailsBox = document.getElementById(detailsId);
    const input = document.getElementById(inputId);
    const foodItem = input.value.trim();

    if (foodItem) {
        const foodDiv = document.createElement('div');
        foodDiv.textContent = foodItem;
        detailsBox.appendChild(foodDiv);
        input.value = ''; // Clear the input field after adding the item
    }
}

function saveFoodEntries() {
    // Implement saving functionality here
}
function addFoodItem(detailsId, inputId) {
    console.log('Adding food item...'); // Debugging log
    const detailsBox = document.getElementById(detailsId);
    const input = document.getElementById(inputId);
    const foodItem = input.value.trim();

    if (foodItem) {
        console.log(`Food item to add: ${foodItem}`); // Debugging log
        const foodDiv = document.createElement('div');
        foodDiv.textContent = foodItem;
        detailsBox.appendChild(foodDiv);
        input.value = ''; // Clear the input field after adding the item
    } else {
        console.log('Input is empty'); // Debugging log
    }
}
