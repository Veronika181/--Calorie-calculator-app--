function getQueryParams() {
    const params = {};
    const query = window.location.search.substring(1);

    if (!query) return params;

    query.split("&").forEach(param => {
        const [key, value] = param.split("=");
        if (!key) return;
        params[key] = decodeURIComponent(value || "");
    });

    return params;
}

function getBaseCalories() {
    const tdee = parseFloat(localStorage.getItem("TDEE") || "");
    if (Number.isFinite(tdee) && tdee > 0) return tdee;

    const bmr = parseFloat(localStorage.getItem("BMR") || "");
    if (Number.isFinite(bmr) && bmr > 0) return bmr;

    return 2000;
}

function getCalorieAdjustment(goal, deficit) {
    if (goal === "maintain") return 0;

    if (deficit === "low") return 250;
    if (deficit === "high") return 750;
    return 500;
}

function saveMacroPlan(calories, protein, fat, carbs, goal, deficit) {
    localStorage.setItem("totalCalories", String(Math.round(calories)));
    localStorage.setItem("proteinGrams", String(Math.round(protein)));
    localStorage.setItem("fatGrams", String(Math.round(fat)));
    localStorage.setItem("carbsGrams", String(Math.round(carbs)));

    localStorage.setItem("macroPlan", JSON.stringify({
        calories: Math.round(calories),
        protein: Math.round(protein),
        fat: Math.round(fat),
        carbs: Math.round(carbs),
        goal,
        deficit
    }));
}

function showMacroValidation(message) {
    const validation = document.getElementById("macroValidation");
    if (!validation) return;
    validation.textContent = message;
}

function calculateMacros() {
    const params = getQueryParams();

    const goal = (params.goal || "reduce").toLowerCase();
    const deficit = (params.deficit || "medium").toLowerCase();

    const proteinInput = document.getElementById("protein");
    const carbsInput = document.getElementById("carbs");
    const fatInput = document.getElementById("fat");
    const resultDiv = document.getElementById("result");

    if (!proteinInput || !carbsInput || !fatInput || !resultDiv) {
        return false;
    }

    showMacroValidation("");

    const proteinPercent = parseFloat(proteinInput.value) / 100;
    const carbsPercent = parseFloat(carbsInput.value) / 100;
    const fatPercent = parseFloat(fatInput.value) / 100;

    if (![proteinPercent, carbsPercent, fatPercent].every(Number.isFinite)) {
        showMacroValidation("Please enter valid numbers for all macronutrient fields.");
        return false;
    }

    const sum = proteinPercent + carbsPercent + fatPercent;
    if (Math.abs(sum - 1) > 0.01) {
        showMacroValidation("Protein, carbs, and fat must total exactly 100%.");
        return false;
    }

    const baseCalories = getBaseCalories();
    const adjustment = getCalorieAdjustment(goal, deficit);
    let calories = baseCalories;

    if (goal === "reduce") calories = baseCalories - adjustment;
    if (goal === "gain") calories = baseCalories + adjustment;

    calories = Math.max(1200, calories);

    if (!calories || isNaN(calories)) {
        showMacroValidation("Goal or deficit parameters are missing or invalid.");
        return false;
    }

    const protein = (calories * proteinPercent) / 4;
    const fat = (calories * fatPercent) / 9;
    const carbs = (calories * carbsPercent) / 4;

    resultDiv.innerHTML = `
        <h3>Your Daily Macronutrient Breakdown</h3>
        <p><strong>Calories:</strong> ${calories.toFixed(0)} kcal</p>
        <p><strong>Protein:</strong> ${protein.toFixed(0)} g</p>
        <p><strong>Fat:</strong> ${fat.toFixed(0)} g</p>
        <p><strong>Carbs:</strong> ${carbs.toFixed(0)} g</p>
    `;

    saveMacroPlan(calories, protein, fat, carbs, goal, deficit);
    return true;
}

function resultRatioOfMacronutrients() {
    const hasPlan = localStorage.getItem("macroPlan");
    if (!hasPlan) {
        const ok = calculateMacros();
        if (!ok) return;
    }

    const calories = localStorage.getItem("totalCalories") || "";
    const nextUrl = new URL("resultratioofmacronutrients.html", window.location.href);
    if (calories) nextUrl.searchParams.set("calories", calories);

    window.location.href = nextUrl.toString();
}

document.addEventListener("DOMContentLoaded", () => {
    calculateMacros();
});
