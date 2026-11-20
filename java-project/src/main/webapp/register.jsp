<%@ include file="includes/header.jsp" %>

<div class="container py-5">
    <div class="row justify-content-center">
        <div class="col-md-6">
            <div class="bg-white border rounded p-4 p-md-5">
                <h1 class="h3 fw-bold mb-2" style="font-family: Georgia, serif;">Create Account</h1>
                <p class="text-muted small mb-4">Register to shop bathroom ware and homeware essentials.</p>

                <% if (request.getAttribute("error") != null) { %>
                    <div class="alert alert-danger small"><%= request.getAttribute("error") %></div>
                <% } %>

                <form action="register" method="post" onsubmit="return validateRegister();">
                    <div class="mb-3">
                        <label class="form-label small fw-semibold">Full Name</label>
                        <input type="text" id="fullName" name="fullName" class="form-control" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label small fw-semibold">Email Address</label>
                        <input type="email" id="email" name="email" class="form-control" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label small fw-semibold">Password (min 6 characters)</label>
                        <input type="password" id="password" name="password" class="form-control" minlength="6" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label small fw-semibold">Phone Number</label>
                        <input type="text" name="phone" class="form-control" required>
                    </div>
                    <div class="mb-4">
                        <label class="form-label small fw-semibold">Shipping Address</label>
                        <textarea name="address" class="form-control" rows="2" required></textarea>
                    </div>
                    <button type="submit" class="btn btn-charcoal w-100 py-2 mb-3">Register</button>
                </form>

                <p class="small text-muted text-center mb-0">
                    Already registered? <a href="login.jsp" class="text-dark fw-semibold">Sign in</a>
                </p>
            </div>
        </div>
    </div>
</div>

<script>
function validateRegister() {
    const pass = document.getElementById('password').value;
    if (pass.length < 6) {
        alert('Password must be at least 6 characters.');
        return false;
    }
    return true;
}
</script>

<%@ include file="includes/footer.jsp" %>
