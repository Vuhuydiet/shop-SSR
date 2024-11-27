document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const errorDiv = document.getElementById("errorMessage");
  const successDiv = document.getElementById("successMessage");

  passwordInput.addEventListener("input", function () {
    validatePassword();
  });

  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    errorDiv.textContent = "";
    successDiv.textContent = "";
    errorDiv.classList.add("hidden");
    successDiv.classList.add("hidden");

    const email = emailInput.value;
    const password = passwordInput.value;

    if (!email || !password) {
      errorDiv.textContent = "Please fill in all fields";
      errorDiv.classList.remove("hidden");
      return;
    }

    if (!validatePassword()) {
      return;
    }

    try {
      const response = await fetch("/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        successDiv.textContent = "Login successful";
        successDiv.classList.remove("hidden");

        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      } else {
        errorDiv.textContent = data.message;
        errorDiv.classList.remove("hidden");
      }
    } catch (error) {
      errorDiv.textContent = "An error occurred. Please try again.";
      errorDiv.classList.remove("hidden");
    }
  });

  function validatePassword() {
    const password = passwordInput.value;
    if (password.length < 8) {
      errorDiv.textContent = "Password must be at least 8 characters";
      errorDiv.classList.remove("hidden");
      return false;
    }
    errorDiv.classList.add("hidden");
    return true;
  }
});
