const changePasswordForm = document.getElementById("password-form");
const errorDiv = document.getElementById("errorMessage");
const successDiv = document.getElementById("successMessage");
const submitButton = document.getElementById("submitButton");

console.log("changePassword.js loaded");

const handleChangePasswordSubmit = async (event) => {
    event.preventDefault();
    const oldPassword = document.getElementById("old-password");
    const password = document.getElementById("new-password");
    const confirmPassword = document.getElementById("confirm-password");

    errorDiv.textContent = "";
    successDiv.textContent = "";
    errorDiv.classList.add("hidden");
    successDiv.classList.add("hidden");

    if (password.value !== confirmPassword.value) {
        errorDiv.textContent = "Passwords do NOT match!";
        errorDiv.classList.remove("hidden");
        return;
    }

    if (oldPassword.value === confirmPassword.value) {
        errorDiv.textContent = "Hmmm, new and old password are too similar !";
        errorDiv.classList.remove("hidden");
        return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Submitting...";

    try {
        const response = await fetch("/profile/updatepassword", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ oldPassword: oldPassword.value, newPassword: confirmPassword.value }),
        });
        const data = await response.json();
        if (response.ok) {
            successDiv.textContent = data.message;
            successDiv.classList.remove("hidden");
        } else {
            errorDiv.textContent = data.message;
            errorDiv.classList.remove("hidden");
        }
    } catch (error) {
        errorDiv.textContent = "An error occurred. Please try again later.";
        errorDiv.classList.remove("hidden");
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = "Submit";
    }
};

changePasswordForm.addEventListener("submit", handleChangePasswordSubmit);
