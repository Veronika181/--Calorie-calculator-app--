const DRAFT_KEY = 'calorieTrackerDraft';

function readDraft() {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return {};
    try {
        const parsed = JSON.parse(raw);
        return parsed && typeof parsed === 'object' ? parsed : {};
    } catch (error) {
        return {};
    }
}

function writeDraft(partial) {
    const current = readDraft();
    const next = { ...current, ...partial, updatedAt: Date.now() };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(next));
}

function setInlineMessage(id, message) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = message;
}

function selectGenderButton(gender) {
    if (!gender) return;
    document.querySelectorAll('.gender-btn').forEach((b) => {
        b.classList.remove('selected');
    });

    const target = Array.from(document.querySelectorAll('.gender-btn')).find((btn) => {
        const text = (btn.textContent || '').toLowerCase();
        return (gender === 'male' && text.includes('man')) || (gender === 'female' && text.includes('woman'));
    });

    if (target) target.classList.add('selected');
}

function updateHeightDisplay() {
    const heightRange = document.getElementById('height');
    const heightDisplay = document.getElementById('heightDisplay');
    if (!heightRange || !heightDisplay) return;
    heightDisplay.textContent = `${heightRange.value} cm`;
}

function changeValue(id, delta) {
    const display = document.getElementById(id + 'Display');
    if (!display) return;

    let value = parseInt(display.textContent, 10);
    if (Number.isNaN(value)) value = 0;
    value += delta;

    const limits = {
        age: { min: 14, max: 100 },
        weight: { min: 35, max: 250 }
    };

    const range = limits[id] || { min: 0, max: 999 };
    if (value < range.min) value = range.min;
    if (value > range.max) value = range.max;

    display.textContent = String(value);
    saveInputDraft();
}

function saveInputDraft() {
    const heightEl = document.getElementById('height');
    const weightEl = document.getElementById('weightDisplay');
    const ageEl = document.getElementById('ageDisplay');
    if (!heightEl || !weightEl || !ageEl) return;

    const gender = localStorage.getItem('gender') || '';
    writeDraft({
        height: parseInt(heightEl.value, 10),
        weight: parseInt(weightEl.textContent, 10),
        age: parseInt(ageEl.textContent, 10),
        gender
    });

    setInlineMessage('inputDraftInfo', 'Draft saved automatically.');
}

function validateInputForm() {
    const heightEl = document.getElementById('height');
    const weightEl = document.getElementById('weightDisplay');
    const ageEl = document.getElementById('ageDisplay');
    if (!heightEl || !weightEl || !ageEl) return { ok: false };

    const height = parseInt(heightEl.value, 10);
    const weight = parseInt(weightEl.textContent, 10);
    const age = parseInt(ageEl.textContent, 10);
    const gender = localStorage.getItem('gender');

    if (!gender) {
        setInlineMessage('inputValidation', 'Please select your gender.');
        return { ok: false };
    }

    if (!Number.isFinite(height) || height < 120 || height > 230) {
        setInlineMessage('inputValidation', 'Height must be between 120 and 230 cm.');
        return { ok: false };
    }

    if (!Number.isFinite(weight) || weight < 35 || weight > 250) {
        setInlineMessage('inputValidation', 'Weight must be between 35 and 250 kg.');
        return { ok: false };
    }

    if (!Number.isFinite(age) || age < 14 || age > 100) {
        setInlineMessage('inputValidation', 'Age must be between 14 and 100 years.');
        return { ok: false };
    }

    setInlineMessage('inputValidation', '');
    return { ok: true, height, weight, age, gender };
}

function saveDataInputOnPage() {
    const validation = validateInputForm();
    if (!validation.ok) {
        return;
    }

    const { height, weight, age, gender } = validation;

    localStorage.setItem('height', String(height));
    localStorage.setItem('weight', String(weight));
    localStorage.setItem('age', String(age));
    localStorage.setItem('gender', gender);
    saveInputDraft();

    window.location.href = 'advanced.html';
}

function goNext() {
    saveDataInputOnPage();
}

function goBack() {
    window.history.back();
}

function selectGender(gender, btn) {
    localStorage.setItem('gender', gender);
    writeDraft({ gender });

    document.querySelectorAll('.gender-btn').forEach((b) => {
        b.classList.remove('selected');
    });

    if (btn) btn.classList.add('selected');
    setInlineMessage('inputValidation', '');
    setInlineMessage('inputDraftInfo', 'Draft saved automatically.');
}

function restoreInputDraft() {
    const heightEl = document.getElementById('height');
    const weightEl = document.getElementById('weightDisplay');
    const ageEl = document.getElementById('ageDisplay');
    if (!heightEl || !weightEl || !ageEl) return;

    const draft = readDraft();
    const height = parseInt(localStorage.getItem('height') || String(draft.height || ''), 10);
    const weight = parseInt(localStorage.getItem('weight') || String(draft.weight || ''), 10);
    const age = parseInt(localStorage.getItem('age') || String(draft.age || ''), 10);
    const gender = localStorage.getItem('gender') || draft.gender || '';

    if (Number.isFinite(height)) heightEl.value = String(Math.min(Math.max(height, 120), 230));
    if (Number.isFinite(weight)) weightEl.textContent = String(Math.min(Math.max(weight, 35), 250));
    if (Number.isFinite(age)) ageEl.textContent = String(Math.min(Math.max(age, 14), 100));
    if (gender) {
        localStorage.setItem('gender', gender);
        selectGenderButton(gender);
    }

    updateHeightDisplay();
}

function initInputPage() {
    const heightEl = document.getElementById('height');
    const ageEl = document.getElementById('ageDisplay');
    const weightEl = document.getElementById('weightDisplay');
    if (!heightEl || !ageEl || !weightEl) return;

    restoreInputDraft();

    heightEl.addEventListener('input', () => {
        updateHeightDisplay();
        saveInputDraft();
    });
}

function nextStepSaveDataOnPage() {
    const weight = parseInt(localStorage.getItem('weight') || '0', 10);
    const height = parseInt(localStorage.getItem('height') || '0', 10);
    const age = parseInt(localStorage.getItem('age') || '0', 10);
    const gender = localStorage.getItem('gender') || 'male';

    const bodyFatEl = document.getElementById('bodyFat');
    const activityEl = document.getElementById('activityLevel');
    if (!activityEl) return;

    const bodyFat = bodyFatEl ? bodyFatEl.value : '';
    const activity = parseFloat(activityEl.value || '1.2');

    if (![weight, height, age].every((v) => Number.isFinite(v) && v > 0)) {
        setInlineMessage('advancedValidation', 'Please complete step 1 first.');
        return;
    }

    if (!Number.isFinite(activity) || activity <= 0) {
        setInlineMessage('advancedValidation', 'Please select a valid activity level.');
        return;
    }

    setInlineMessage('advancedValidation', '');

    let bmr;

    if (bodyFat !== '') {
        const bf = parseFloat(bodyFat) / 100;
        const leanMass = weight * (1 - bf);
        bmr = 370 + 21.6 * leanMass;
    } else {
        bmr = gender === 'male'
            ? 10 * weight + 6.25 * height - 5 * age + 5
            : 10 * weight + 6.25 * height - 5 * age - 161;
    }

    const tdee = bmr * activity;

    localStorage.setItem('BMR', String(Math.round(bmr)));
    localStorage.setItem('TDEE', String(Math.round(tdee)));
    localStorage.setItem('bodyFat', bodyFat);
    localStorage.setItem('activityLevel', String(activity));
    writeDraft({ bodyFat, activityLevel: String(activity) });

    window.location.href = 'result.html';
}

function initAdvancedPage() {
    const activityEl = document.getElementById('activityLevel');
    const bodyFatEl = document.getElementById('bodyFat');
    if (!activityEl) return;

    const draft = readDraft();
    const savedActivity = localStorage.getItem('activityLevel') || draft.activityLevel;
    const savedBodyFat = localStorage.getItem('bodyFat') || draft.bodyFat;

    if (savedActivity) activityEl.value = String(savedActivity);
    if (bodyFatEl && savedBodyFat !== undefined && savedBodyFat !== null) {
        bodyFatEl.value = String(savedBodyFat);
    }

    activityEl.addEventListener('change', () => {
        writeDraft({ activityLevel: activityEl.value });
        setInlineMessage('advancedDraftInfo', 'Draft saved automatically.');
    });

    if (bodyFatEl) {
        bodyFatEl.addEventListener('change', () => {
            writeDraft({ bodyFat: bodyFatEl.value });
            setInlineMessage('advancedDraftInfo', 'Draft saved automatically.');
        });
    }
}

function calculateCalories() {
    const tdee = parseInt(localStorage.getItem('TDEE') || '0', 10);
    const value = document.getElementById('calorieValue');
    if (value) value.textContent = String(tdee || 0);

    const circle = document.querySelector('.progress-ring .progress');
    if (!(circle instanceof SVGCircleElement)) return;

    const radius = circle.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;
    circle.style.strokeDasharray = `${circumference} ${circumference}`;

    const percent = Math.min((tdee || 0) / 4000, 1);
    const offset = circumference - percent * circumference;
    circle.style.strokeDashoffset = String(offset);
}

function goToWeightGoals() {
    window.location.href = 'weightgoals.html';
}

function clearOnboardingData() {
    [
        'height',
        'weight',
        'age',
        'gender',
        'BMR',
        'TDEE',
        'bodyFat',
        'activityLevel'
    ].forEach((key) => localStorage.removeItem(key));
    localStorage.removeItem(DRAFT_KEY);
    window.location.href = 'input.html';
}

function resultRatioOfMacronutrients() {
    window.location.href = 'resultratioofmacronutrients.html';
}

function resultratioofmacronutrients() {
    resultRatioOfMacronutrients();
}

function showRecipeSection() {
    const section = document.getElementById('recipeSection');
    if (section) section.style.display = 'block';
}

function showRecipe(meal) {
    const details = document.getElementById('recipeDetails');
    const title = document.getElementById('recipeTitle');
    const calories = document.getElementById('recipeCalories');
    const protein = document.getElementById('recipeProtein');
    const carbs = document.getElementById('recipeCarbs');
    const fat = document.getElementById('recipeFat');

    if (!details || !title || !calories || !protein || !carbs || !fat) return;

    const recipes = {
        breakfast: { title: 'Breakfast', calories: '320 kcal', protein: '22 g', carbs: '30 g', fat: '12 g' },
        snack: { title: 'Snack', calories: '180 kcal', protein: '12 g', carbs: '18 g', fat: '6 g' },
        lunch: { title: 'Lunch', calories: '520 kcal', protein: '35 g', carbs: '50 g', fat: '18 g' },
        afternoonSnack: { title: 'Afternoon Snack', calories: '210 kcal', protein: '14 g', carbs: '22 g', fat: '7 g' },
        dinner: { title: 'Dinner', calories: '460 kcal', protein: '32 g', carbs: '36 g', fat: '16 g' }
    };

    const item = recipes[meal];
    if (!item) return;

    title.textContent = item.title;
    calories.textContent = `Calories: ${item.calories}`;
    protein.textContent = `Protein: ${item.protein}`;
    carbs.textContent = `Carbs: ${item.carbs}`;
    fat.textContent = `Fat: ${item.fat}`;
    details.style.display = 'block';
}

document.addEventListener('DOMContentLoaded', () => {
    updateHeightDisplay();
    initInputPage();
    initAdvancedPage();

    const startOverBtn = document.getElementById('startOverBtn');
    if (startOverBtn) {
        startOverBtn.addEventListener('click', clearOnboardingData);
    }
});
