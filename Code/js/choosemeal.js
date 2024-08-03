function showMeals(mealType) {
    // Remove 'active' class from all meal options
    document.querySelectorAll('.meal-option').forEach(el => el.classList.remove('active'));
    
    // Add 'active' class to the clicked meal option
    document.getElementById(mealType).classList.add('active');
    
    // Display meal images based on the selected meal
    const mealImages = document.getElementById('meal-images');
    let htmlContent = '';

    // Define images and names for each meal type
    const meals = {
        breakfast: [
            { src: 'breakfast1.jpg', alt: 'Breakfast 1' },
            { src: 'breakfast2.jpg', alt: 'Breakfast 2' }
        ],
        lunch: [
            { src: 'lunch1.jpg', alt: 'Lunch 1' },
            { src: 'lunch2.jpg', alt: 'Lunch 2' }
        ],
        dinner: [
            { src: 'dinner1.jpg', alt: 'Dinner 1' },
            { src: 'dinner2.jpg', alt: 'Dinner 2' }
        ]
    };

    meals[mealType].forEach(meal => {
        htmlContent += `<img src="${meal.src}" alt="${meal.alt}">`;
    });

    mealImages.innerHTML = htmlContent;
    mealImages.style.display = 'block';
}