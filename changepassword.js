const saveButton = document.getElementById('saveButton') || document.querySelector('.saveButton');

if (saveButton) {
    saveButton.addEventListener('click', function() {
        const email = document.getElementById('email').value;
        const oldPassword = document.getElementById('oldPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmNewPassword = document.getElementById('confirmNewPassword').value;

        if (newPassword !== confirmNewPassword) {
            alert('New passwords do not match.');
            return;
        }

        alert(`Email: ${email}\nOld Password: ${oldPassword}\nNew Password: ${newPassword}`);
    });
}
