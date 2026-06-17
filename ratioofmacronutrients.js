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

function calculateMacros() {
    const params = getQueryParams();

    const goal = (params.goal || "reduce").toLowerCase();
    const deficit = (params.deficit || "medium").toLowerCase();

    const proteinPercent = parseFloat(document.getElementById("protein").value) / 100;
    const carbsPercent = parseFloat(document.getElementById("carbs").value) / 100;
    const fatPercent = parseFloat(document.getElementById("fat").value) / 100;

    const sum = proteinPercent + carbsPercent + fatPercent;
    if (Math.abs(sum - 1) > 0.01) {
        alert("The sum of protein, carbs and fat must be 100%.");
        return;
    }

    const weight = 70;
    const height = 175;
    const age = 25;
    const gender = "male";

    let BMR =
        gender === "male"
            ? 10 * weight + 6.25 * height - 5 * age + 5
            : 10 * weight + 6.25 * height - 5 * age - 161;

    let calories;

    if (goal === "reduce") {
        if (deficit === "low") calories = BMR - 250;
        else if (deficit === "medium") calories = BMR - 500;
        else if (deficit === "high") calories = BMR - 750;
    } else if (goal === "maintain") {
        calories = BMR;
    } else if (goal === "gain") {
        if (deficit === "low") calories = BMR + 250;
        else if (deficit === "medium") calories = BMR + 500;
        else if (deficit === "high") calories = BMR + 750;
    }

    if (!calories || isNaN(calories)) {
        alert("Goal or deficit parameters are missing or invalid.");
        return;
    }

    const protein = (calories * proteinPercent) / 4;
    const fat = (calories * fatPercent) / 9;
    const carbs = (calories * carbsPercent) / 4;

    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = `
        <h3>Your Daily Macronutrient Breakdown</h3>
        <p><strong>Calories:</strong> ${calories.toFixed(0)} kcal</p>
        <p><strong>Protein:</strong> ${protein.toFixed(0)} g</p>
        <p><strong>Fat:</strong> ${fat.toFixed(0)} g</p>
        <p><strong>Carbs:</strong> ${carbs.toFixed(0)} g</p>
    `;
}

function resultRatioOfMacronutrients() {
    window.location.href = "resultratioofmacronutrients.html";
}
