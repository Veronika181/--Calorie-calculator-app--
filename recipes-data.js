window.recipeCatalog = {
  mealPreviews: {
    breakfast: [
      { title: 'Greek Yogurt Bowl', desc: 'Berries + oats + seeds', src: 'menu.png' },
      { title: 'Egg Toast Plate', desc: 'Eggs + wholegrain toast', src: 'menu.png' },
      { title: 'Protein Pancakes', desc: 'Oats + eggs + banana', src: 'menu.png' },
      { title: 'Cottage Cheese Toast', desc: 'Cottage + tomato + toast', src: 'menu.png' }
    ],
    lunch: [
      { title: 'Chicken Rice Bowl', desc: 'Chicken + rice + vegetables', src: 'menu.png' },
      { title: 'Tuna Pasta Salad', desc: 'Tuna + pasta + greens', src: 'menu.png' },
      { title: 'Turkey Wrap', desc: 'Turkey + tortilla + veggies', src: 'menu.png' },
      { title: 'Beef Quinoa Plate', desc: 'Lean beef + quinoa + salad', src: 'menu.png' }
    ],
    dinner: [
      { title: 'Salmon & Potatoes', desc: 'Salmon + potatoes + salad', src: 'menu.png' },
      { title: 'Turkey Stir-Fry', desc: 'Turkey + mixed vegetables', src: 'menu.png' },
      { title: 'Chicken Couscous', desc: 'Chicken + couscous + broccoli', src: 'menu.png' },
      { title: 'Shrimp Rice Pan', desc: 'Shrimp + rice + peppers', src: 'menu.png' }
    ]
  },
  recipeLibrary: {
    breakfast: [
      {
        title: 'Greek Yogurt Bowl',
        image: 'menu.png',
        cookingTime: 8,
        difficulty: 'Easy',
        kcal: 420,
        protein: 28,
        ingredients: [
          { name: 'Greek yogurt', amount: '200 g' },
          { name: 'Oats', amount: '40 g' },
          { name: 'Berries', amount: '80 g' },
          { name: 'Chia seeds', amount: '10 g' }
        ],
        instructions: [
          'Add yogurt to a bowl and mix in oats.',
          'Top with berries and chia seeds.',
          'Let it rest for 5 minutes and serve.'
        ]
      },
      {
        title: 'Egg Toast Plate',
        image: 'menu.png',
        cookingTime: 12,
        difficulty: 'Easy',
        kcal: 470,
        protein: 30,
        ingredients: [
          { name: 'Eggs', amount: '3 pcs' },
          { name: 'Wholegrain toast', amount: '2 slices' },
          { name: 'Avocado', amount: '70 g' }
        ],
        instructions: [
          'Cook eggs on a non-stick pan.',
          'Toast bread and spread avocado.',
          'Serve eggs over toast.'
        ]
      },
      {
        title: 'Protein Pancakes',
        image: 'menu.png',
        cookingTime: 15,
        difficulty: 'Easy',
        kcal: 510,
        protein: 32,
        ingredients: [
          { name: 'Oats', amount: '60 g' },
          { name: 'Eggs', amount: '2 pcs' },
          { name: 'Banana', amount: '1 medium' },
          { name: 'Greek yogurt', amount: '120 g' }
        ],
        instructions: [
          'Blend oats, eggs, and banana into a batter.',
          'Cook pancakes on a lightly oiled pan.',
          'Serve with yogurt on top.'
        ]
      },
      {
        title: 'Cottage Cheese Toast',
        image: 'menu.png',
        cookingTime: 10,
        difficulty: 'Easy',
        kcal: 430,
        protein: 29,
        ingredients: [
          { name: 'Wholegrain toast', amount: '2 slices' },
          { name: 'Cottage cheese', amount: '170 g' },
          { name: 'Tomato', amount: '1 medium' },
          { name: 'Olive oil', amount: '1 tsp' }
        ],
        instructions: [
          'Toast the bread slices.',
          'Top with cottage cheese and sliced tomato.',
          'Season and drizzle olive oil.'
        ]
      }
    ],
    lunch: [
      {
        title: 'Chicken Rice Bowl',
        image: 'menu.png',
        cookingTime: 25,
        difficulty: 'Medium',
        kcal: 690,
        protein: 48,
        ingredients: [
          { name: 'Chicken breast', amount: '180 g' },
          { name: 'Cooked rice', amount: '180 g' },
          { name: 'Mixed vegetables', amount: '150 g' }
        ],
        instructions: [
          'Season and sear chicken until cooked through.',
          'Stir-fry vegetables for 4-5 minutes.',
          'Plate with rice and sliced chicken.'
        ]
      },
      {
        title: 'Tuna Pasta Salad',
        image: 'menu.png',
        cookingTime: 20,
        difficulty: 'Easy',
        kcal: 610,
        protein: 38,
        ingredients: [
          { name: 'Wholegrain pasta', amount: '90 g dry' },
          { name: 'Tuna', amount: '120 g' },
          { name: 'Greek yogurt dressing', amount: '60 g' }
        ],
        instructions: [
          'Cook pasta and let it cool slightly.',
          'Mix tuna with yogurt dressing.',
          'Combine and season to taste.'
        ]
      },
      {
        title: 'Turkey Wrap',
        image: 'menu.png',
        cookingTime: 18,
        difficulty: 'Easy',
        kcal: 580,
        protein: 41,
        ingredients: [
          { name: 'Wholegrain tortilla', amount: '1 large' },
          { name: 'Turkey breast', amount: '150 g' },
          { name: 'Mixed salad', amount: '80 g' },
          { name: 'Yogurt sauce', amount: '50 g' }
        ],
        instructions: [
          'Cook turkey strips until done.',
          'Fill tortilla with turkey, salad, and sauce.',
          'Roll tightly and slice in half.'
        ]
      },
      {
        title: 'Beef Quinoa Plate',
        image: 'menu.png',
        cookingTime: 30,
        difficulty: 'Medium',
        kcal: 720,
        protein: 50,
        ingredients: [
          { name: 'Lean beef', amount: '180 g' },
          { name: 'Cooked quinoa', amount: '170 g' },
          { name: 'Roasted vegetables', amount: '180 g' }
        ],
        instructions: [
          'Sear beef to preferred doneness.',
          'Warm quinoa and roast vegetables.',
          'Serve beef sliced over quinoa with vegetables.'
        ]
      }
    ],
    dinner: [
      {
        title: 'Salmon and Potatoes',
        image: 'menu.png',
        cookingTime: 28,
        difficulty: 'Medium',
        kcal: 640,
        protein: 42,
        ingredients: [
          { name: 'Salmon fillet', amount: '170 g' },
          { name: 'Potatoes', amount: '220 g' },
          { name: 'Leafy salad', amount: '80 g' }
        ],
        instructions: [
          'Bake salmon for 15-18 minutes.',
          'Boil or roast potatoes until tender.',
          'Serve with fresh salad.'
        ]
      },
      {
        title: 'Turkey Stir-Fry',
        image: 'menu.png',
        cookingTime: 22,
        difficulty: 'Easy',
        kcal: 560,
        protein: 44,
        ingredients: [
          { name: 'Turkey strips', amount: '180 g' },
          { name: 'Mixed vegetables', amount: '200 g' },
          { name: 'Olive oil', amount: '1 tbsp' }
        ],
        instructions: [
          'Heat oil and cook turkey until golden.',
          'Add vegetables and stir-fry 5-6 minutes.',
          'Season and serve warm.'
        ]
      },
      {
        title: 'Chicken Couscous',
        image: 'menu.png',
        cookingTime: 24,
        difficulty: 'Easy',
        kcal: 590,
        protein: 46,
        ingredients: [
          { name: 'Chicken breast', amount: '170 g' },
          { name: 'Couscous', amount: '85 g dry' },
          { name: 'Broccoli', amount: '150 g' }
        ],
        instructions: [
          'Cook couscous according to package instructions.',
          'Pan-sear chicken and steam broccoli.',
          'Serve together and season with herbs.'
        ]
      },
      {
        title: 'Shrimp Rice Pan',
        image: 'menu.png',
        cookingTime: 20,
        difficulty: 'Easy',
        kcal: 540,
        protein: 39,
        ingredients: [
          { name: 'Shrimp', amount: '180 g' },
          { name: 'Cooked rice', amount: '170 g' },
          { name: 'Bell peppers', amount: '120 g' },
          { name: 'Garlic', amount: '1 clove' }
        ],
        instructions: [
          'Saute garlic and shrimp for 2-3 minutes.',
          'Add peppers and cook until softened.',
          'Mix in rice, heat through, and serve.'
        ]
      }
    ]
  }
};
