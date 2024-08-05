function toggleDetails(element) {
    const details = element.nextElementSibling;
    details.style.display = details.style.display === 'none' || details.style.display === '' ? 'block' : 'none';
}

function toggleEdit(button) {
    const recipeItem = button.closest('.recipe-item');
    const inputs = recipeItem.querySelectorAll('input');
    inputs.forEach(input => {
        input.disabled = !input.disabled;
    });
}

function saveChanges(button) {
    const recipeItem = button.closest('.recipe-item');
    const inputs = recipeItem.querySelectorAll('input');
    const portions = document.getElementById('portion-count').textContent;
    // Add code to save the changes (e.g., update database, local storage, etc.)
    alert('Changes saved');
}

function increasePortions() {
    const portionCount = document.getElementById('portion-count');
    portionCount.textContent = parseInt(portionCount.textContent) + 1;
}

function decreasePortions() {
    const portionCount = document.getElementById('portion-count');
    if (parseInt(portionCount.textContent) > 1) {
        portionCount.textContent = parseInt(portionCount.textContent) - 1;
    }
}
