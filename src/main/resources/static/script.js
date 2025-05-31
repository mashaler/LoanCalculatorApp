// Theme toggle button for all pages
const themeToggleBtn = document.getElementById('theme-toggle');
if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark');
        themeToggleBtn.textContent = document.body.classList.contains('dark') ? '☀️ Light Mode' : '🌙 Dark Mode';
    });
}

// Password visibility toggle
function togglePassword(inputId, button) {
    const input = document.getElementById(inputId);
    if (input.type === 'password') {
        input.type = 'text';
        button.textContent = '🙈';
    } else {
        input.type = 'password';
        button.textContent = '👁️';
    }
}

// Login form
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const authErrorDiv = document.getElementById('auth-error-message');

function showAuthError(message) {
    if (!authErrorDiv) return;
    authErrorDiv.innerText = message;
    authErrorDiv.style.display = 'block';
    authErrorDiv.style.backgroundColor = '#f8d7da';
    authErrorDiv.style.color = '#721c24';
    authErrorDiv.style.padding = '10px 15px';
    authErrorDiv.style.border = '1px solid #f5c6cb';
    authErrorDiv.style.borderRadius = '5px';
}

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        authErrorDiv.style.display = 'none';

        const username = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value;

        if (!username || !password) {
            showAuthError('Please enter both username and password.');
            return;
        }

        try {
            const res = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const text = await res.text();

            if (!res.ok) {
                showAuthError(text || 'Login failed.');
                return;
            }

            alert('Login successful!');
            loginForm.reset();
        } catch (err) {
            showAuthError('Error connecting to server.');
            console.error(err);
        }
    });
}

if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        authErrorDiv.style.display = 'none';

        const username = document.getElementById('register-username').value.trim();
        const password = document.getElementById('register-password').value;

        if (!username || !password) {
            showAuthError('Please enter both username and password.');
            return;
        }

        try {
            const res = await fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const text = await res.text();

            if (!res.ok) {
                showAuthError(text || 'Registration failed.');
                return;
            }

            alert('Registration successful! You can now log in.');
            registerForm.reset();
            // Optionally redirect to login page after registration:
            window.location.href = 'login.html';
        } catch (err) {
            showAuthError('Error connecting to server.');
            console.error(err);
        }
    });
}

// Loan calculator (only runs if button exists)
const calculateBtn = document.getElementById('calculate-btn');
const errorDiv = document.getElementById('error-message');
const resultDiv = document.getElementById('result');

if (calculateBtn) {
    calculateBtn.addEventListener('click', async () => {
        errorDiv.style.display = 'none';
        errorDiv.innerText = '';

        const principal = parseFloat(document.getElementById('principal').value);
        const months = parseInt(document.getElementById('months').value);

        if (isNaN(principal) || principal <= 0) {
            showError("Please enter a valid principal amount greater than 0.");
            return;
        }
        if (isNaN(months) || months <= 0) {
            showError("Please enter a valid number of months greater than 0.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/api/loan/calculate?principal=${principal}&months=${months}`);

            if (!response.ok) {
                const errorMsg = await response.text();
                showError("Error: " + errorMsg);
                return;
            }

            const data = await response.json();

            resultDiv.innerHTML = `
              <p><strong>Initial Amount:</strong> R${data.principal}</p>
              <p><strong>Duration:</strong> ${data.months} months</p>
              <p><strong>Total After ${data.months} Months:</strong> R${data.totalAmount}</p>
              <p><strong>Profit Made:</strong> R${data.profit}</p>
            `;
        } catch (error) {
            showError("Failed to fetch loan calculation results.");
            console.error(error);
        }
    });

    function showError(msg) {
        errorDiv.style.display = 'block';
        errorDiv.textContent = msg;
    }
}
