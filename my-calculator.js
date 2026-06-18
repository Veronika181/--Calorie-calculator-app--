document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("calcBtn").addEventListener("click", calculate);
});

function calculate() {
    const ingredientsText = document.getElementById("ingredients").value;
    const baseWeight = parseFloat(document.getElementById("baseWeight").value);
    const targetWeight = parseFloat(document.getElementById("targetWeight").value);

    if (!baseWeight || !targetWeight) {
        alert("Please enter both base weight and your portion.");
        return;
    }

    const ratio = targetWeight / baseWeight;

    const lines = ingredientsText.split("\n");
    let output = "<div class='recipe'>";

    lines.forEach(line => {
        const parts = line.split("-");
        if (parts.length === 2) {
            const name = parts[0].trim();
            const grams = parseFloat(parts[1].trim());
            if (!isNaN(grams)) {
                const newAmount = (grams * ratio).toFixed(1);
                output += `<p><strong>${name}:</strong> ${newAmount} g</p>`;
            }
        }
    });

    output += "</div>";

    document.getElementById("result").innerHTML = output;
}
