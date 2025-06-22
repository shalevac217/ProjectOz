const validateForm = (form) => {
  const email = form.email.value;
  const password = form.password.value;

  if (!email || !password) {
    alert('Please fill in all fields');
    return false;
  }

  return true;
};

document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const form = event.target;

    if (!validateForm(form)) {
        return false;
    }

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
        const errorData = await response.json();
        console.error(`Error: ${errorData.message}`);
        alert('Login failed. Please check your credentials and try again.');
        return;
        }

        const data = await response.json();
        localStorage.setItem('userId', data.userId);
        window.location.href = '/groceries'; // Redirect to groceries page after successful login
    } catch (error) {
        console.error('Error during login:', error);
        alert('An error occurred during login. Please try again later.');
    }
});