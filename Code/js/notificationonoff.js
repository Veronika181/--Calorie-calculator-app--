document.addEventListener('DOMContentLoaded', function() {
    const foodEntryToggle = document.getElementById('foodEntryToggle');
    const allNotificationsToggle = document.getElementById('allNotificationsToggle');

    function toggleButton(button) {
        const currentStatus = button.getAttribute('data-status');
        const newStatus = currentStatus === 'off' ? 'on' : 'off';
        button.setAttribute('data-status', newStatus);
        button.innerText = newStatus.charAt(0).toUpperCase() + newStatus.slice(1);
    }

    foodEntryToggle.addEventListener('click', function() {
        toggleButton(foodEntryToggle);
    });

    allNotificationsToggle.addEventListener('click', function() {
        toggleButton(allNotificationsToggle);
    });

    document.getElementById('saveButton').addEventListener('click', function() {
        const foodEntryStatus = foodEntryToggle.getAttribute('data-status');
        const allNotificationsStatus = allNotificationsToggle.getAttribute('data-status');

        alert(`Food Entry Reminder: ${foodEntryStatus}\nAll Notifications: ${allNotificationsStatus}`);
    });
});
