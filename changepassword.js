const saveButton = document.getElementById('saveButton') || document.querySelector('.saveButton');

if (saveButton) {
    saveButton.addEventListener('click', function() {
        const emailInput = document.getElementById('email');
        const oldPasswordInput = document.getElementById('oldPassword');
        const newPasswordInput = document.getElementById('newPassword');
        const confirmNewPasswordInput = document.getElementById('confirmNewPassword');

        if (!emailInput || !oldPasswordInput || !newPasswordInput || !confirmNewPasswordInput) {
            return;
        }

        const email = emailInput.value.trim();
        const oldPassword = oldPasswordInput.value;
        const newPassword = newPasswordInput.value;
        const confirmNewPassword = confirmNewPasswordInput.value;

        if (!email || !oldPassword || !newPassword || !confirmNewPassword) {
            alert('Please fill in all fields.');
            return;
        }

        if (newPassword !== confirmNewPassword) {
            alert('New passwords do not match.');
            return;
        }

        alert('Password updated successfully.');

        oldPasswordInput.value = '';
        newPasswordInput.value = '';
        confirmNewPasswordInput.value = '';
    });
}
