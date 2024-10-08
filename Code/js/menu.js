// script.js

document.getElementById('macros-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const proteins = parseFloat(document.getElementById('proteins').value) || 0;
    const carbs = parseFloat(document.getElementById('carbs').value) || 0;
    const fats = parseFloat(document.getElementById('fats').value) || 0;
    
    // Calculate calories
    const calories = (proteins * 4) + (carbs * 4) + (fats * 9);
    
    // Update the total calories displayed
    document.getElementById('total-calories').textContent = calories;
    
    // Update the circle color based on calorie threshold
    const circle = document.querySelector('.circle');
    if (calories < 2000) {
        circle.style.background = `conic-gradient(#4caf50 ${calories / 2000 * 100}%, #f44336 ${calories / 2000 * 100}%)`;
    } else {
        circle.style.background = `conic-gradient(#f44336)`;
    }
});

document.addEventListener('DOMContentLoaded', (event) => {
    let calorieCount = 0;

    const calorieCountElement = document.getElementById('calorie-count');
    const addCalorieButton = document.getElementById('add-calorie');

    addCalorieButton.addEventListener('click', () => {
        calorieCount++;
        calorieCountElement.textContent = calorieCount;
    });
});

function changeValue(meal, change) {
    const display = document.getElementById(meal + 'Display');
    let currentValue = parseInt(display.textContent, 10);
    currentValue += change;
    if (currentValue < 0) currentValue = 0; 
    display.textContent = currentValue;
}

document.addEventListener('DOMContentLoaded', function () {
    const months = [
        { name: 'January', days: 31 },
        { name: 'February', days: 28 }, // Leap year handling omitted
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

    let currentMonthIndex = 7; // Default to August
    const monthNameElem = document.querySelector('.month-name');
    const daysContainer = document.getElementById('calendar-days');
    const selectedDateDisplay = document.getElementById('selected-date');
    const monthSelect = document.getElementById('month-select');
    const calendarContainer = document.getElementById('calendar-container');
    const showCalendarBtn = document.getElementById('show-calendar-btn');

    function renderCalendar(monthIndex) {
        const month = months[monthIndex];
        monthNameElem.textContent = `${month.name} 2024`;
        daysContainer.innerHTML = ''; // Clear existing days

        for (let day = 1; day <= month.days; day++) {
            const dayElem = document.createElement('li');
            dayElem.textContent = day;
            dayElem.setAttribute('data-date', day);
            dayElem.addEventListener('click', function () {
                // Remove active class from all days
                document.querySelectorAll('.days li').forEach(d => d.classList.remove('active'));
                
                // Add active class to clicked day
                this.classList.add('active');
                
                // Display the selected date
                selectedDateDisplay.textContent = `Vybrané datum: ${month.name} ${day}, 2024`;
            });
            daysContainer.appendChild(dayElem);
        }
    }

    function changeMonth(increment) {
        currentMonthIndex += increment;
        if (currentMonthIndex < 0) currentMonthIndex = 11;
        if (currentMonthIndex > 11) currentMonthIndex = 0;
        renderCalendar(currentMonthIndex);
    }

    document.querySelector('.prev').addEventListener('click', () => changeMonth(-1));
    document.querySelector('.next').addEventListener('click', () => changeMonth(1));

    monthSelect.addEventListener('change', function () {
        currentMonthIndex = parseInt(this.value);
        renderCalendar(currentMonthIndex);
    });

    // Populate the month select options
    months.forEach((month, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = month.name;
        monthSelect.appendChild(option);
    });

    // Toggle calendar visibility
    showCalendarBtn.addEventListener('click', function () {
        if (calendarContainer.style.display === 'none') {
            calendarContainer.style.display = 'block';
        } else {
            calendarContainer.style.display = 'none';
        }
    });

    renderCalendar(currentMonthIndex);
});

document.getElementById('proteins').addEventListener('input', function() {
    document.getElementById('proteins-circle').textContent = this.value + 'g';
});

document.getElementById('carbs').addEventListener('input', function() {
    document.getElementById('carbs-circle').textContent = this.value + 'g';
});

document.getElementById('fats').addEventListener('input', function() {
    document.getElementById('fats-circle').textContent = this.value + 'g';
});

document.addEventListener('DOMContentLoaded', function() {
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const calendarContainer = document.getElementById('calendar-container');
    const monthNameSpan = document.querySelector('.month-name');
    const monthSelect = document.getElementById('month-select');
    const prevButton = document.getElementById('prev-month');
    const nextButton = document.getElementById('next-month');
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();

    function updateCalendar() {
        monthNameSpan.textContent = `${monthNames[currentMonth]} ${currentYear}`;
        monthSelect.innerHTML = monthNames.map((month, index) => 
            `<option value="${index}" ${index === currentMonth ? 'selected' : ''}>${month}</option>`
        ).join('');
    }

    function changeMonth(offset) {
        currentMonth += offset;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        } else if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        updateCalendar();
    }

    prevButton.addEventListener('click', () => changeMonth(-1));
    nextButton.addEventListener('click', () => changeMonth(1));
    monthSelect.addEventListener('change', () => {
        currentMonth = parseInt(monthSelect.value);
        updateCalendar();
    });

    document.getElementById('show-calendar-btn').addEventListener('click', () => {
        calendarContainer.style.display = calendarContainer.style.display === 'none' ? 'block' : 'none';
        updateCalendar();
    });

    updateCalendar();
});
