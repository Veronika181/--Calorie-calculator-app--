let currentRecipeIndex = 0;
let currentMealType = "breakfast";
let currentRecipes = [];
const recipeLibrary = (window.recipeCatalog && window.recipeCatalog.recipeLibrary) || {};

function getSelectedMealType() {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = (params.get("meal") || "").toLowerCase();
    const fromStorage = (localStorage.getItem("selectedMealType") || "").toLowerCase();
    const meal = fromUrl || fromStorage || "breakfast";
    if (!["breakfast", "lunch", "dinner"].includes(meal)) return "breakfast";
    return meal;
}

function updateNavButtons() {
    const prevBtn = document.querySelector('.arrow-button[aria-label="Previous recipe"]');
    const nextBtn = document.querySelector('.arrow-button[aria-label="Next recipe"]');
    if (!prevBtn || !nextBtn) return;

    const hasMultiple = currentRecipes.length > 1;
    prevBtn.disabled = !hasMultiple;
    nextBtn.disabled = !hasMultiple;
    prevBtn.style.opacity = hasMultiple ? '1' : '0.5';
    nextBtn.style.opacity = hasMultiple ? '1' : '0.5';
}

function updateRecipe(recipe) {
    const titleEl = document.querySelector('.recipe-title');
    const imageEl = document.querySelector('.recipe-image');
    const metaEl = document.querySelector('.recipe-meta');
    const ingredientsEl = document.querySelector('.ingredients-container');
    const instructionEl = document.querySelector('.instruction');

    if (!titleEl || !imageEl || !metaEl || !ingredientsEl || !instructionEl) return;

    titleEl.textContent = recipe.title;
    imageEl.src = recipe.image;
    imageEl.alt = recipe.title;

    const mealLabel = currentMealType.charAt(0).toUpperCase() + currentMealType.slice(1);
    metaEl.innerHTML = `
        <span>${mealLabel}</span>
        <span>${recipe.kcal} kcal</span>
        <span>${recipe.protein} g protein</span>
        <span>${recipe.cookingTime} min</span>
        <span>${recipe.difficulty}</span>
    `;

    ingredientsEl.innerHTML = recipe.ingredients
        .map(
            (ingredient) => `
            <div class="ingredients-item">
                <label>${ingredient.name}</label>
                <span class="ingredient-amount">${ingredient.amount}</span>
            </div>
        `
        )
        .join('');

    instructionEl.innerHTML = `
        <p><strong>Instructions:</strong></p>
        ${recipe.instructions.map((step, index) => `<p>${index + 1}. ${step}</p>`).join('')}
    `;
}

function prevRecipe() {
    if (currentRecipes.length <= 1) return;
    currentRecipeIndex = (currentRecipeIndex - 1 + currentRecipes.length) % currentRecipes.length;
    updateRecipe(currentRecipes[currentRecipeIndex]);
}

function nextRecipe() {
    if (currentRecipes.length <= 1) return;
    currentRecipeIndex = (currentRecipeIndex + 1) % currentRecipes.length;
    updateRecipe(currentRecipes[currentRecipeIndex]);
}

function toggleDetails(titleElement) {
    const card = titleElement.closest('.recipe-card');
    if (!card) return;
    const details = card.querySelector('.recipe-details');
    if (!details) return;
    details.classList.toggle('open');
}

function setPlanStatus(message) {
    const status = document.getElementById('planStatus');
    if (!status) return;
    status.textContent = message;
}

function addCurrentRecipeToPlan() {
    const recipe = currentRecipes[currentRecipeIndex];
    if (!recipe) return;

    const rawPlan = localStorage.getItem('mealPlanRecipes');
    let mealPlan = {};

    if (rawPlan) {
        try {
            mealPlan = JSON.parse(rawPlan) || {};
        } catch (error) {
            mealPlan = {};
        }
    }

    mealPlan[currentMealType] = {
        title: recipe.title,
        kcal: recipe.kcal,
        protein: recipe.protein,
        difficulty: recipe.difficulty
    };

    localStorage.setItem('mealPlanRecipes', JSON.stringify(mealPlan));
    setPlanStatus(`${recipe.title} saved to ${currentMealType} plan.`);
}

function openMealPlan() {
    window.location.href = 'menu.html';
}

function initRecipes() {
    currentMealType = getSelectedMealType();
    currentRecipes = recipeLibrary[currentMealType] || recipeLibrary.breakfast || [];
    if (currentRecipes.length === 0) {
        setPlanStatus('No recipes found. Please refresh or select another meal.');
        return;
    }
    currentRecipeIndex = 0;
    updateRecipe(currentRecipes[currentRecipeIndex]);
    updateNavButtons();
}

initRecipes();



