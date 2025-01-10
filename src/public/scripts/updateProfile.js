const updateForm = document.getElementById("profile-form");
const errorDiv = document.getElementById("errorMessage");
const successDiv = document.getElementById("successMessage");
const submitButton = document.getElementById("submitButton");

const handleRegisterSubmit = async (event) => {
    event.preventDefault();
    const fullName = document.getElementById("full-name");
    const phone = document.getElementById("phone");


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

updateForm.addEventListener("submit", handleRegisterSubmit);


document.getElementById("upload-button").addEventListener("click", function() {
    document.getElementById("file-input").click();
});

document.getElementById("file-input").addEventListener("change", function() {
    const fileInput = document.getElementById("file-input");
    const errorDiv = document.getElementById("errorMessage");
    const file = fileInput.files[0];
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    const maxFileSize = 2 * 1024 * 1024; // 2MB

    errorDiv.textContent = "";
    errorDiv.classList.add("hidden");

    if (!allowedTypes.includes(file.type)) {
        errorDiv.textContent = "Invalid file type. Only JPEG, PNG, and GIF are allowed.";
        errorDiv.classList.remove("hidden");
        fileInput.value = "";
        return;
    }

    if (file.size > maxFileSize) {
        errorDiv.textContent = "File size exceeds 2MB.";
        errorDiv.classList.remove("hidden");
        fileInput.value = "";
        return;
    }

    const form = document.getElementById("upload-form");
    const formData = new FormData(form);

    fetch("/uploadAvatar", {
        method: "POST",
        body: formData,
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("File uploaded successfully!");
            } else {
                alert("File upload failed!");
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("An error occurred. Please try again.");
        });
});


