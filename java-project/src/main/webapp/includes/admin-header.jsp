<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%
    String adminName = (String) session.getAttribute("adminUser");
    if (adminName == null) {
        response.sendRedirect(request.getContextPath() + "/admin/login.jsp");
        return;
    }
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Panel — Klara Bath &amp; Home</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="${pageContext.request.contextPath}/css/style.css" rel="stylesheet">
</head>
<body class="bg-stone-grey">
<nav class="navbar navbar-expand-lg bg-white border-bottom py-3">
    <div class="container">
        <a class="navbar-brand fs-5" href="${pageContext.request.contextPath}/admin-dashboard">Klara Admin</a>
        <div class="navbar-nav me-auto ms-4 gap-3">
            <a class="nav-link" href="${pageContext.request.contextPath}/admin-dashboard">Dashboard</a>
            <a class="nav-link" href="${pageContext.request.contextPath}/admin-products">Products</a>
            <a class="nav-link" href="${pageContext.request.contextPath}/admin-orders">Orders</a>
            <a class="nav-link" href="${pageContext.request.contextPath}/index.jsp">View Store</a>
        </div>
        <div class="d-flex align-items-center gap-3">
            <span class="small text-muted"><%= adminName %></span>
            <a href="${pageContext.request.contextPath}/logout" class="btn btn-outline-dark btn-sm">Logout</a>
        </div>
    </div>
</nav>
