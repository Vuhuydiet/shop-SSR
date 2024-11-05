
const submitButton = document.querySelector('form button');

submitButton.addEventListener('click', async (event) => {
  event.preventDefault();
  const username = document.querySelector('input[name="username"]').value;
  const password = document.querySelector('input[name="password"]').value;
  const confirmPassword = document.querySelector('input[name="confirm"]').value;
  const agree = document.querySelector('#agreement').checked;
  const error = document.querySelector('.error');
  const success = document.querySelector('.success');

  if (!username || !password || !confirmPassword) {
    error.textContent = 'Please fill in all fields';
    error.style.color = 'red';
    return;
  }

  if (password !== confirmPassword) {
    error.textContent = 'Passwords do not match';
    error.style.color = 'red';
    return;
  }

  if (!agree) {
    error.textContent = 'Please agree to the terms and conditions';
    error.style.color = 'red';
    return;
  }

  const response = await fetch('/users/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    success.textContent = '';
    error.textContent = 'Username already exists';
    error.style.color = 'red';
    return;
  }
  error.textContent = '';
  success.textContent = 'User registered successfully';
  success.style.color = 'green';

});