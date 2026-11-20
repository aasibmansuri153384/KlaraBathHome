// Vanilla JavaScript form validation for Klara Bath & Home (JSP + Servlet)

function validateRegisterForm() {
    const fullName = document.getElementById('fullName');
    const email = document.getElementById('email');
    const password = document.getElementById('password');

    if (fullName && fullName.value.trim().length < 2) {
        alert('Please enter your full name.');
        fullName.focus();
        return false;
    }
    if (email && !email.value.includes('@')) {
        alert('Please enter a valid email address.');
        email.focus();
        return false;
    }
    if (password && password.value.length < 6) {
        alert('Password must be at least 6 characters.');
        password.focus();
        return false;
    }
    return true;
}

function confirmDeleteProduct() {
    return confirm('Are you sure you want to delete this product?');
}
