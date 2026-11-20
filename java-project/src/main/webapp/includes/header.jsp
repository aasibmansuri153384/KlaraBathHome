<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.bathhome.model.User" %>
<%
    User headerUser = (User) session.getAttribute("loggedUser");
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Klara Bath &amp; Home</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="${pageContext.request.contextPath}/css/style.css" rel="stylesheet">
</head>
<body>
<nav class="navbar navbar-expand-lg bg-white border-bottom sticky-top py-3">
    <div class="container">
        <a class="navbar-brand fs-4" href="${pageContext.request.contextPath}/index.jsp">Klara Bath &amp; Home</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="mainNav">
            <ul class="navbar-nav mx-auto gap-lg-3">
                <li class="nav-item"><a class="nav-link" href="${pageContext.request.contextPath}/index.jsp">Home</a></li>
                <li class="nav-item"><a class="nav-link" href="${pageContext.request.contextPath}/products">All Products</a></li>
                <li class="nav-item"><a class="nav-link" href="${pageContext.request.contextPath}/products?category=Bathroom%20Ware">Bathroom Ware</a></li>
                <li class="nav-item"><a class="nav-link" href="${pageContext.request.contextPath}/products?category=Homeware">Homeware</a></li>
                <li class="nav-item"><a class="nav-link" href="${pageContext.request.contextPath}/admin/login.jsp">Admin</a></li>
            </ul>
            <div class="d-flex align-items-center gap-2">
                <a href="${pageContext.request.contextPath}/cart" class="btn btn-outline-dark btn-sm px-3">Cart</a>
                <% if (headerUser != null) { %>
                    <a href="${pageContext.request.contextPath}/profile" class="btn btn-charcoal btn-sm px-3"><%= headerUser.getFullName() %></a>
                <% } else { %>
                    <a href="${pageContext.request.contextPath}/login.jsp" class="btn btn-charcoal btn-sm px-3">Sign In</a>
                <% } %>
            </div>
        </div>
    </div>
</nav>
