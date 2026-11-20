<%@ page import="com.bathhome.model.Product" %>
<%@ include file="includes/header.jsp" %>

<%
    Product p = (Product) request.getAttribute("product");
%>

<div class="container py-5">
    <% if (p != null) { %>
    <a href="products" class="text-decoration-none text-muted small d-inline-block mb-4">&larr; Back to Catalog</a>
    <div class="row g-5 align-items-start">
        <div class="col-md-6">
            <div class="bg-beige rounded border overflow-hidden">
                <img src="<%= p.getImageUrl() %>" alt="<%= p.getProductName() %>" class="img-fluid w-100">
            </div>
        </div>
        <div class="col-md-6">
            <p class="small text-muted text-uppercase mb-1"><%= p.getCategoryGroup() %> &middot; <%= p.getCategory() %></p>
            <h1 class="h2 fw-bold mb-3" style="font-family: Georgia, serif;"><%= p.getProductName() %></h1>
            <p class="h4 fw-bold mb-4">Rs. <%= String.format("%.2f", p.getPrice()) %></p>
            <p class="text-muted mb-4"><%= p.getDescription() %></p>

            <form action="cart" method="post" class="d-flex align-items-center gap-3">
                <input type="hidden" name="action" value="add">
                <input type="hidden" name="productId" value="<%= p.getProductId() %>">
                <input type="number" name="quantity" value="1" min="1" max="10" class="form-control" style="width: 90px;">
                <button type="submit" class="btn btn-charcoal px-4 py-2">Add to Shopping Cart</button>
            </form>
        </div>
    </div>
    <% } else { %>
    <div class="alert alert-light border">Product not found.</div>
    <% } %>
</div>

<%@ include file="includes/footer.jsp" %>
