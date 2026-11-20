<%@ page import="java.util.*, com.bathhome.model.Product" %>
<%
    if (request.getAttribute("products") == null && request.getAttribute("error") == null) {
        response.sendRedirect("products");
        return;
    }
%>
<%@ include file="includes/header.jsp" %>

<%
    List<Product> products = (List<Product>) request.getAttribute("products");
    String selectedCategory = (String) request.getAttribute("selectedCategory");
    String searchQuery = (String) request.getAttribute("searchQuery");
    if (selectedCategory == null) selectedCategory = "All";
    if (searchQuery == null) searchQuery = "";

    String[] allCategories = {
        "Bathroom Accessories", "Wash Basins", "Faucets", "Showers",
        "Kitchen Accessories", "Home Decor", "Storage Products", "Cleaning Products"
    };
%>

<div class="container py-5">
    <div class="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4 pb-3 border-bottom">
        <div>
            <h1 class="h3 fw-bold mb-1" style="font-family: Georgia, serif;">Product Catalog</h1>
            <p class="text-muted small mb-0">Showing: <%= selectedCategory %></p>
        </div>

        <form action="products" method="get" class="d-flex gap-2">
            <input type="text" name="search" value="<%= searchQuery %>" class="form-control form-control-sm" placeholder="Search products..." style="width: 220px;">
            <button type="submit" class="btn btn-sm btn-charcoal">Search</button>
        </form>
    </div>

    <div class="mb-3 d-flex flex-wrap gap-2">
        <a href="products" class="btn btn-sm <%= "All".equals(selectedCategory) ? "btn-charcoal" : "btn-outline-dark" %>">All</a>
        <a href="products?category=Bathroom%20Ware" class="btn btn-sm <%= "Bathroom Ware".equals(selectedCategory) ? "btn-charcoal" : "btn-outline-dark" %>">Bathroom Ware</a>
        <a href="products?category=Homeware" class="btn btn-sm <%= "Homeware".equals(selectedCategory) ? "btn-charcoal" : "btn-outline-dark" %>">Homeware</a>
    </div>

    <div class="mb-4 d-flex flex-wrap gap-2">
        <% for (String cat : allCategories) { %>
            <a href="products?category=<%= java.net.URLEncoder.encode(cat, "UTF-8") %>"
               class="btn btn-sm <%= cat.equals(selectedCategory) ? "btn-dark" : "btn-outline-secondary" %>">
                <%= cat %>
            </a>
        <% } %>
    </div>

    <div class="row g-4">
        <% if (products != null && !products.isEmpty()) {
            for (Product p : products) { %>
        <div class="col-md-4">
            <div class="product-card rounded h-100 d-flex flex-column">
                <div class="product-img-wrap">
                    <img src="<%= p.getImageUrl() %>" alt="<%= p.getProductName() %>">
                </div>
                <div class="p-3 d-flex flex-column flex-grow-1">
                    <span class="small text-muted text-uppercase"><%= p.getCategoryGroup() %> &middot; <%= p.getCategory() %></span>
                    <h5 class="fw-semibold mt-1 mb-2"><%= p.getProductName() %></h5>
                    <p class="small text-muted flex-grow-1"><%= p.getDescription() %></p>
                    <div class="d-flex justify-content-between align-items-center pt-3 border-top">
                        <span class="fw-bold">Rs. <%= String.format("%.2f", p.getPrice()) %></span>
                        <div class="d-flex gap-2">
                            <a href="products?id=<%= p.getProductId() %>" class="btn btn-sm btn-outline-dark">Details</a>
                            <form action="cart" method="post" class="m-0">
                                <input type="hidden" name="action" value="add">
                                <input type="hidden" name="productId" value="<%= p.getProductId() %>">
                                <input type="hidden" name="quantity" value="1">
                                <button type="submit" class="btn btn-sm btn-charcoal">Add to Cart</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <%  }
        } else { %>
            <div class="col-12">
                <div class="p-5 bg-white border rounded text-center text-muted">
                    No products found in this category.
                </div>
            </div>
        <% } %>
    </div>
</div>

<%@ include file="includes/footer.jsp" %>
