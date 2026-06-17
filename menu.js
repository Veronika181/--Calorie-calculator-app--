function changeValue(meal, change) {
    const display = document.getElementById(meal + 'Display');
    if (!display) return;

    let currentValue = parseInt(display.textContent, 10);
    if (Number.isNaN(currentValue)) currentValue = 0;

    currentValue += change;
    if (currentValue < 0) currentValue = 0;
    display.textContent = `${currentValue} Kcal`;
}

document.addEventListener('DOMContentLoaded', () => {
    const macrosForm = document.getElementById('macros-form');
    const proteins = document.getElementById('proteins');
    const carbs = document.getElementById('carbs');
    const fats = document.getElementById('fats');
    const totalCalories = document.getElementById('total-calories');

    if (macrosForm && proteins && carbs && fats && totalCalories) {
        macrosForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const p = parseFloat(proteins.value) || 0;
            const c = parseFloat(carbs.value) || 0;
            const f = parseFloat(fats.value) || 0;
            const calories = p * 4 + c * 4 + f * 9;

            totalCalories.textContent = `${Math.round(calories)} Kcal`;
        });

        proteins.addEventListener('input', () => {
            const el = document.getElementById('proteins-circle');
            if (el) el.textContent = `${proteins.value}g`;
        });

        carbs.addEventListener('input', () => {
            const el = document.getElementById('carbs-circle');
            if (el) el.textContent = `${carbs.value}g`;
        });

        fats.addEventListener('input', () => {
            const el = document.getElementById('fats-circle');
            if (el) el.textContent = `${fats.value}g`;
        });
    }

    const months = [
        { name: 'January', days: 31 },
        { name: 'February', days: 28 },
        { name: 'March', days: 31 },
        { name: 'April', days: 30 },
        { name: 'May', days: 31 },
        { name: 'June', days: 30 },
        { name: 'July', days: 31 },
        { name: 'August', days: 31 },
        { name: 'September', days: 30 },
        { name: 'October', days: 31 },
        { name: 'November', days: 30 },
        { name: 'December', days: 31 }
    ];

    let currentMonthIndex = new Date().getMonth();
    const monthNameElem = document.querySelector('.month-name');
    const daysContainer = document.getElementById('calendar-days');
    const selectedDateDisplay = document.getElementById('selected-date');
    const monthSelect = document.getElementById('month-select');
    const calendarContainer = document.getElementById('calendar-container');
    const showCalendarBtn = document.getElementById('show-calendar-btn1');
    const prevButton = document.querySelector('.prev');
    const nextButton = document.querySelector('.next');

    function renderCalendar(monthIndex) {
        if (!monthNameElem || !daysContainer || !monthSelect) return;

        const month = months[monthIndex];
        monthNameElem.textContent = `${month.name} 2024`;
        daysContainer.innerHTML = '';

        for (let day = 1; day <= month.days; day++) {
            const dayElem = document.createElement('li');
            dayElem.textContent = String(day);
            dayElem.addEventListener('click', function () {
                document.querySelectorAll('.days li').forEach((d) => d.classList.remove('active'));
                this.classList.add('active');
                if (selectedDateDisplay) {
                    selectedDateDisplay.textContent = `Selected date: ${month.name} ${day}, 2024`;
                }
            });
            daysContainer.appendChild(dayElem);
        }
    }

    if (monthSelect) {
        months.forEach((month, index) => {
            const option = document.createElement('option');
            option.value = String(index);
            option.textContent = month.name;
            monthSelect.appendChild(option);
        });

        monthSelect.value = String(currentMonthIndex);
        monthSelect.addEventListener('change', function () {
            currentMonthIndex = parseInt(this.value, 10);
            renderCalendar(currentMonthIndex);
        });
    }

    if (prevButton) {
        prevButton.addEventListener('click', () => {
            currentMonthIndex = (currentMonthIndex + 11) % 12;
            if (monthSelect) monthSelect.value = String(currentMonthIndex);
            renderCalendar(currentMonthIndex);
        });
    }

    if (nextButton) {
        nextButton.addEventListener('click', () => {
            currentMonthIndex = (currentMonthIndex + 1) % 12;
            if (monthSelect) monthSelect.value = String(currentMonthIndex);
            renderCalendar(currentMonthIndex);
        });
    }

    if (showCalendarBtn && calendarContainer) {
        showCalendarBtn.addEventListener('click', () => {
            calendarContainer.style.display = calendarContainer.style.display === 'none' ? 'block' : 'none';
        });
    }

    renderCalendar(currentMonthIndex);
});
