document.getElementById('saveButton').addEventListener('click', function() {
    const goal = document.getElementById('goal').value;
    const dailyIncome = document.getElementById('dailyIncome').value;
    const weight = document.getElementById('weight').value;

    document.getElementById('goalValue').innerText = goal;
    document.getElementById('dailyIncomeValue').innerText = dailyIncome;
    document.getElementById('weightValue').innerText = weight;
});
