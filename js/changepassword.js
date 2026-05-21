document.getElementById('saveButton').addEventListener('click', function() {
    const email = document.getElementById('email').value;
    const oldPassword = document.getElementById('oldPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;

    if (newPassword !== confirmNewPassword) {
        alert('New passwords do not match.');
        return;
    }

    // Simulate saving changes
    alert(`Email: ${email}\nOld Password: ${oldPassword}\nNew Password: ${newPassword}`);

    // Here you would typically send the data to the server using an AJAX request or similar
});
