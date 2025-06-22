const validateForm = (name, email, password, confirmPassword) => {
    // Validate the form fields
    if (!name || !email || !password || !confirmPassword) {
        alert('Please fill in all fields');
        return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        alert('Invalid email format');
        return false;
    }
    if (password.length < 6 || confirmPassword.length < 6) {
        alert('Password must be at least 6 characters long');
        return false;
    }
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return false;
    }

    return true;
};


document.getElementById('signupForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (!validateForm(name, email, password, confirmPassword)) {
        return false;
    }
    try {
        const response = await fetch('/api/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error(`Error: ${errorData.message}`);
            return;
        }

        const data = await response.json();
        localStorage.setItem('userId', data.userId);
        window.location.href = '/groceries'; // Redirect to groceries page after successful signup
    }   catch (error) {
        console.error('Error during signup:', error);
        alert('An error occurred during signup. Please try again later.');
    }

    // If validation passes, you can proceed with form submission (e.g., send data to the server)
});
