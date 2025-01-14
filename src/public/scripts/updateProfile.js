const updateForm = document.getElementById("profile-form");
const errorDiv = document.getElementById("errorMessage");
const successDiv = document.getElementById("successMessage");
const submitButton = document.getElementById("submitButton");
const avatarInput = document.getElementById("avatarInput");
const avatarPreview = document.getElementById("avatarPreview");

const handleRegisterSubmit = async (event) => {
    event.preventDefault();
    const fullName = document.getElementById("full-name");
    const phone = document.getElementById("phone");

    console.log(fullName.value);

    errorDiv.textContent = "";
    successDiv.textContent = "";
    errorDiv.classList.add("hidden");
    successDiv.classList.add("hidden");

    if (fullName.value === "" || phone.value === "") {
        errorDiv.textContent = "All fields are required!";
        errorDiv.classList.remove("hidden");
        return;
    }

    if (fullName.value.match(/\d+/g)) {
        errorDiv.textContent = "Name must not contain numbers!";
        errorDiv.classList.remove("hidden");
        return;
    }

    if (phone.value.length < 10) {
        errorDiv.textContent = "Phone number must be at least 10 characters!";
        errorDiv.classList.remove("hidden");
        return;
    }

    if (phone.value.length > 12) {
        errorDiv.textContent = "Phone number must be at most 12 characters!";
        errorDiv.classList.remove("hidden");
        return;
    }

    if (phone.value.match(/\D+/g)) {
        errorDiv.textContent = "Phone number must contain only numbers!";
        errorDiv.classList.remove("hidden");
        return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Submitting...";

    try {
        const response = await fetch("/profile/updateprofile", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ fullName: fullName.value, numberPhone: phone.value }),
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
        errorDiv.textContent = "An error occurred. Please try again.";
        errorDiv.classList.remove("hidden");
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = "Submit";
    }
};

const handleAvatarChange = async (event) => {
    const file = event.target.files[0];
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    const maxFileSize = 2 * 1024 * 1024; // 2MB
    const statusDiv = document.getElementById("status-text");
    errorDiv.textContent = "";
    errorDiv.classList.add("hidden");

    if (!file) {
        errorDiv.textContent = "No file selected!";
        errorDiv.classList.remove("hidden");
        return;
    }

    if (!allowedTypes.includes(file.type)) {
        errorDiv.textContent = "Invalid file type. Only JPEG, PNG, and GIF are allowed.";
        errorDiv.classList.remove("hidden");
        return;
    }

    if (file.size > maxFileSize) {
        errorDiv.textContent = "File size exceeds 2MB.";
        errorDiv.classList.remove("hidden");
        return;
    }

    statusDiv.textContent = "Uploading...";

    // Preview the selected avatar
    const reader = new FileReader();
    reader.onload = (e) => {
        avatarPreview.src = e.target.result;
    };
    reader.readAsDataURL(file);
    const formData = new FormData();
    formData.append("avatar", file);
    try {
        const response = await fetch("/profile/uploadAvatar", {
            method: "POST",
            body: formData,
        });
        const data = await response.json();
        if (response.ok) {
            successDiv.textContent = data.message;
            successDiv.classList.remove("hidden");
        } else {
            errorDiv.textContent = data.message || "Failed to upload avatar.";
            errorDiv.classList.remove("hidden");
        }
    } catch (error) {
        console.error("Error uploading avatar:", error);
        errorDiv.textContent = "An error occurred while uploading the avatar. Please try again.";
        errorDiv.classList.remove("hidden");
    }
    statusDiv.textContent = "Click on avatar to change";
};


updateForm.addEventListener("submit", handleRegisterSubmit);
avatarInput.addEventListener("change", handleAvatarChange);
