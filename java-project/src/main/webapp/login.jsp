<%@ include file="includes/header.jsp" %>

<div class="container py-5">
    <div class="row justify-content-center">
        <div class="col-md-5">
            <div class="bg-white border rounded p-4 p-md-5">
                <h1 class="h3 fw-bold mb-2" style="font-family: Georgia, serif;">Customer Sign In</h1>
                <p class="text-muted small mb-4">Access your cart, saved address, and order history.</p>

                <% if ("1".equals(request.getParameter("registered"))) { %>
                    <div class="alert alert-success small">Account created successfully. Please sign in.</div>
                <% } %>
                <% if (request.getAttribute("error") != null) { %>
                    <div class="alert alert-danger small"><%= request.getAttribute("error") %></div>
                <% } %>

                <form action="login" method="post">
                    <div class="mb-3">
                        <label class="form-label small fw-semibold">Email Address</label>
                        <input type="email" name="email" class="form-control" required>
                    </div>
                    <div class="mb-4">
                        <label class="form-label small fw-semibold">Password</label>
                        <input type="password" name="password" class="form-control" required>
                    </div>
                    <button type="submit" class="btn btn-charcoal w-100 py-2 mb-3">Sign In</button>
                </form>

                <p class="small text-muted text-center mb-0">
                    New customer? <a href="register.jsp" class="text-dark fw-semibold">Create an account</a>
                </p>
            </div>
        </div>
    </div>
</div>

<%@ include file="includes/footer.jsp" %>
