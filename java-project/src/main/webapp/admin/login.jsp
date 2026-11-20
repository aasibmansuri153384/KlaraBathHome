<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Login — Klara Bath &amp; Home</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="${pageContext.request.contextPath}/css/style.css" rel="stylesheet">
</head>
<body class="bg-stone-grey d-flex align-items-center min-vh-100">
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-4">
            <div class="bg-white border rounded p-4 p-md-5">
                <p class="small text-uppercase text-muted mb-1">Administration</p>
                <h1 class="h4 fw-bold mb-4" style="font-family: Georgia, serif;">Klara Admin Sign In</h1>

                <% if (request.getAttribute("error") != null) { %>
                    <div class="alert alert-danger small"><%= request.getAttribute("error") %></div>
                <% } %>

                <form action="${pageContext.request.contextPath}/admin-login" method="post">
                    <div class="mb-3">
                        <label class="form-label small fw-semibold">Username</label>
                        <input type="text" name="username" class="form-control" required>
                    </div>
                    <div class="mb-4">
                        <label class="form-label small fw-semibold">Password</label>
                        <input type="password" name="password" class="form-control" required>
                    </div>
                    <button type="submit" class="btn btn-charcoal w-100 py-2 mb-3">Sign In to Admin</button>
                </form>

                <div class="text-center">
                    <a href="${pageContext.request.contextPath}/index.jsp" class="small text-muted text-decoration-none">&larr; Return to Storefront</a>
                </div>
            </div>
        </div>
    </div>
</div>
</body>
</html>
