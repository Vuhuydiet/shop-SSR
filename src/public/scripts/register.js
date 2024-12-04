const registerForm = document.getElementById("registerForm");
const errorDiv = document.getElementById("errorMessage");
const successDiv = document.getElementById("successMessage");

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm").value;
  const agree = document.getElementById("agreement").checked;

  errorDiv.textContent = "";
  successDiv.textContent = "";
  errorDiv.classList.add("hidden");
  successDiv.classList.add("hidden");

  if (!email || !password || !confirmPassword) {
    errorDiv.textContent = "Please fill in all fields";
    errorDiv.classList.remove("hidden");
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
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    // console.log(data);
    if (response.ok) {
      successDiv.textContent = data.message;
      successDiv.classList.remove("hidden");

      window.location.href = data.metadata.redirectUrl;

      // setTimeout(() => {
      //   window.location.href = "/users/login";
      // }, 2000);
    } else {
      errorDiv.textContent = data.message;
      errorDiv.classList.remove("hidden");
    }
  } catch (error) {
    errorDiv.textContent = "An error occurred. Please try again.";
    errorDiv.classList.remove("hidden");
  }
});
