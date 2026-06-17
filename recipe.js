let currentRecipeIndex = 0;
const recipes = [
    {
        id: 1,
        title: "Chicken Curry",
        image: "menu.png",
        cookingTime: 30,
        difficulty: "Easy",
        ingredients: [
            { id: "ingredient1", name: "Chicken", amount: "200 grams" },
            { id: "ingredient2", name: "Basmati Rice", amount: "100 grams" }
        ],
        instructions: [
            "Heat oil in a large skillet over medium heat. Add the chicken and cook until browned.",
            "Add curry paste and cook for 1 minute.",
            "Stir in coconut milk and bring to a simmer.",
            "Reduce the heat and cook for 10 minutes.",
            "Serve with basmati rice."
        ]
    }
];

function updateRecipe(recipe) {
    document.querySelector('.recipe-title').textContent = recipe.title;
    document.querySelector('.recipe-image').src = recipe.image;
    document.querySelector('.recipe-meta').innerHTML = `Cooking time: <img class="clock" src="clock-basic-style.png" alt="Clock"> ${recipe.cookingTime} minutes <span>Difficulty: ${recipe.difficulty}</span>`;
    document.querySelector('.ingredients-container').innerHTML = recipe.ingredients.map(ingredient =>
        `<div class="ingredients-item">
            <label for="${ingredient.id}">${ingredient.name}</label>
            <input id="${ingredient.id}" type="number" placeholder="grams" value="${ingredient.amount}">
        </div>`
    ).join('');
    document.querySelector('.instruction').innerHTML = `<p>Instructions:</p>${recipe.instructions.map(step => `<p>${step}</p>`).join('')}`;
}

function prevRecipe() {
    if (currentRecipeIndex > 0) {
        currentRecipeIndex--;
        updateRecipe(recipes[currentRecipeIndex]);
    }
}

function nextRecipe() {
    if (currentRecipeIndex < recipes.length - 1) {
        currentRecipeIndex++;
        updateRecipe(recipes[currentRecipeIndex]);
    }
}

updateRecipe(recipes[currentRecipeIndex]);

function toggleDetails(titleElement) {
    const card = titleElement.closest(".recipe-card");
    const details = card.querySelector(".recipe-details");
    details.classList.toggle("open");
}



