const registerForm = document.getElementById("registerForm");
const errorDiv = document.getElementById("errorMessage");
const successDiv = document.getElementById("successMessage");

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm").value;
  const agree = document.getElementById("agreement").checked;

  errorDiv.textContent = "";
  successDiv.textContent = "";
  errorDiv.classList.add("hidden");
  successDiv.classList.add("hidden");

  if (!username || !password || !confirmPassword) {
    errorDiv.textContent = "Please fill in all fields";
    errorDiv.classList.remove("hidden");
    console.log(1);
    return;
  }

  if (password !== confirmPassword) {
    errorDiv.textContent = "Passwords do not match";
    errorDiv.classList.remove("hidden");
    return;
  }

  if (!agree) {
    errorDiv.textContent = "Please agree to the terms and conditions";
    errorDiv.classList.remove("hidden");
    return;
  }

  try {
    const response = await fetch("/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    console.log(response);

    const data = await response.json();
    if (data.ok) {
      successDiv.textContent = data.message;
      successDiv.classList.remove("hidden");

      setTimeout(() => {
        window.location.href = "/users/login";
      }, 2000);
    } else {
      errorDiv.textContent = data.message;
      errorDiv.classList.remove("hidden");
    }
  } catch (error) {
    errorDiv.textContent = "An error occurred. Please try again.";
    errorDiv.classList.remove("hidden");
  }
});
