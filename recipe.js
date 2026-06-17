let currentRecipeIndex = 0;
let currentMealType = "breakfast";
let currentRecipes = [];

const recipeLibrary = {
    breakfast: [
        {
            title: "Greek Yogurt Bowl",
            image: "menu.png",
            cookingTime: 8,
            difficulty: "Easy",
            kcal: 420,
            protein: 28,
            ingredients: [
                { name: "Greek yogurt", amount: "200 g" },
                { name: "Oats", amount: "40 g" },
                { name: "Berries", amount: "80 g" },
                { name: "Chia seeds", amount: "10 g" }
            ],
            instructions: [
                "Add yogurt to a bowl and mix in oats.",
                "Top with berries and chia seeds.",
                "Let it rest for 5 minutes and serve."
            ]
        },
        {
            title: "Egg Toast Plate",
            image: "menu.png",
            cookingTime: 12,
            difficulty: "Easy",
            kcal: 470,
            protein: 30,
            ingredients: [
                { name: "Eggs", amount: "3 pcs" },
                { name: "Wholegrain toast", amount: "2 slices" },
                { name: "Avocado", amount: "70 g" }
            ],
            instructions: [
                "Cook eggs on a non-stick pan.",
                "Toast bread and spread avocado.",
                "Serve eggs over toast."
            ]
        }
    ],
    lunch: [
        {
            title: "Chicken Rice Bowl",
            image: "menu.png",
            cookingTime: 25,
            difficulty: "Medium",
            kcal: 690,
            protein: 48,
            ingredients: [
                { name: "Chicken breast", amount: "180 g" },
                { name: "Cooked rice", amount: "180 g" },
                { name: "Mixed vegetables", amount: "150 g" }
            ],
            instructions: [
                "Season and sear chicken until cooked through.",
                "Stir-fry vegetables for 4-5 minutes.",
                "Plate with rice and sliced chicken."
            ]
        },
        {
            title: "Tuna Pasta Salad",
            image: "menu.png",
            cookingTime: 20,
            difficulty: "Easy",
            kcal: 610,
            protein: 38,
            ingredients: [
                { name: "Wholegrain pasta", amount: "90 g dry" },
                { name: "Tuna", amount: "120 g" },
                { name: "Greek yogurt dressing", amount: "60 g" }
            ],
            instructions: [
                "Cook pasta and let it cool slightly.",
                "Mix tuna with yogurt dressing.",
                "Combine and season to taste."
            ]
        }
    ],
    dinner: [
        {
            title: "Salmon and Potatoes",
            image: "menu.png",
            cookingTime: 28,
            difficulty: "Medium",
            kcal: 640,
            protein: 42,
            ingredients: [
                { name: "Salmon fillet", amount: "170 g" },
                { name: "Potatoes", amount: "220 g" },
                { name: "Leafy salad", amount: "80 g" }
            ],
            instructions: [
                "Bake salmon for 15-18 minutes.",
                "Boil or roast potatoes until tender.",
                "Serve with fresh salad."
            ]
        },
        {
            title: "Turkey Stir-Fry",
            image: "menu.png",
            cookingTime: 22,
            difficulty: "Easy",
            kcal: 560,
            protein: 44,
            ingredients: [
                { name: "Turkey strips", amount: "180 g" },
                { name: "Mixed vegetables", amount: "200 g" },
                { name: "Olive oil", amount: "1 tbsp" }
            ],
            instructions: [
                "Heat oil and cook turkey until golden.",
                "Add vegetables and stir-fry 5-6 minutes.",
                "Season and serve warm."
            ]
        }
    ]
};

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
    currentRecipes = recipeLibrary[currentMealType] || recipeLibrary.breakfast;
    currentRecipeIndex = 0;
    updateRecipe(currentRecipes[currentRecipeIndex]);
    updateNavButtons();
}

initRecipes();



