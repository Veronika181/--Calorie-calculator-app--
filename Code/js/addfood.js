function toggleDropdown(dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    if (dropdown.style.display === 'none' || dropdown.style.display === '') {
        dropdown.style.display = 'block';
    } else {
        dropdown.style.display = 'none';
    }
}

function showDropdown(dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    dropdown.style.display = 'block';
}

function showQuantityInput(detailsId, inputId, dropdownId) {
    const foodItem = document.getElementById(inputId).value;
    if (!foodItem) {
        alert('Please enter a food item.');
        return;
    }

    const detailsBox = document.getElementById(detailsId);
    const quantityInput = document.createElement('input');
    quantityInput.type = 'number';
    quantityInput.placeholder = 'Enter quantity in grams';
    quantityInput.classList.add('quantity-input');

    const addButton = document.createElement('button');
    addButton.innerText = 'Add';
    addButton.onclick = function() {
        addFoodItem(detailsId, foodItem, quantityInput.value);
        document.getElementById(inputId).value = '';
        quantityInput.remove();
        addButton.remove();
        document.getElementById(dropdownId).style.display = 'none';
    };

    detailsBox.appendChild(quantityInput);
    detailsBox.appendChild(addButton);
}

function addFoodItem(detailsId, foodItem, quantity) {
    const detailsBox = document.getElementById(detailsId);
    const foodDetails = document.createElement('div');
    foodDetails.classList.add('food-details');
    foodDetails.innerText = `${foodItem} - ${quantity} grams`;

    detailsBox.appendChild(foodDetails);
    detailsBox.style.display = 'block';
}

function saveFoodEntries() {
    // Here you would typically save the food entries to the server or local storage
    alert('Food entries saved!');
}
