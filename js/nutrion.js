document.getElementById('saveButton').addEventListener('click', function() {
    const goal = document.getElementById('goal').value;
    const proteins = document.getElementById('proteins').value;
    const carbs = document.getElementById('carbs').value;
    const fats = document.getElementById('fats').value;

    document.getElementById('goalValue').innerText = goal;
    document.getElementById('proteinsValue').innerText = proteins;
    document.getElementById('carbsValue').innerText = carbs;
    document.getElementById('fatsValue').innerText = fats;
});
