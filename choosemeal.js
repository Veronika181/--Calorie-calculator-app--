const mealPreviews = (window.recipeCatalog && window.recipeCatalog.mealPreviews) || {};

function setValidation(message) {
    const el = document.getElementById('mealValidation');
    if (!el) return;
    el.textContent = message;
    el.style.display = message ? 'block' : 'none';
}

function showMeals(mealType) {
    document.querySelectorAll('.meal-option').forEach((el) => el.classList.remove('active'));

    const selected = document.getElementById(mealType);
    if (selected) selected.classList.add('active');

    localStorage.setItem('selectedMealType', mealType);
    setValidation('');

    const mealImages = document.getElementById('meal-images');
    if (!mealImages) return;

    const previews = mealPreviews[mealType] || [];
    mealImages.innerHTML = previews
        .map(
            (meal) => `
            <div class="meal-preview-card">
                <img src="${meal.src}" alt="${meal.title}">
                <h3>${meal.title}</h3>
                <p>${meal.desc}</p>
            </div>
        `
        )
        .join('');
    mealImages.style.display = 'grid';
}

function goToRecipePage() {
    const selectedMeal = localStorage.getItem('selectedMealType');
    if (!selectedMeal) {
        setValidation('Please select a meal first.');
        return;
    }

    const url = new URL('recipe.html', window.location.href);
    url.searchParams.set('meal', selectedMeal);
    window.location.href = url.toString();
}

document.addEventListener('DOMContentLoaded', () => {
    const selected = localStorage.getItem('selectedMealType') || 'breakfast';
    showMeals(selected);
});