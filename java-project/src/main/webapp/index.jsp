<%@ page import="java.sql.*, java.util.*, com.bathhome.util.DBConnection, com.bathhome.model.Product" %>
<%@ include file="includes/header.jsp" %>

<section class="bg-beige py-5 border-bottom">
    <div class="container py-4">
        <div class="row align-items-center g-4">
            <div class="col-lg-6">
                <p class="text-uppercase small text-muted mb-2">Architectural Living</p>
                <h1 class="display-5 fw-bold mb-3" style="font-family: Georgia, serif;">
                    Calm Fixtures &amp; Warm Everyday Homeware
                </h1>
                <p class="text-muted mb-4">
                    Explore ceramic wash basins, brushed brass and nickel faucets, rainfall showers, and stoneware essentials for kitchen and living spaces.
                </p>
                <a href="products" class="btn btn-charcoal px-4 py-2 me-2">Browse Catalog</a>
                <a href="products?category=Bathroom%20Ware" class="btn btn-outline-dark px-4 py-2">Bathroom Ware</a>
            </div>
            <div class="col-lg-6">
                <img src="images/hero-bath.jpg" alt="Minimalist Ceramic Wash Basin" class="img-fluid rounded border">
            </div>
        </div>
    </div>
</section>

<section class="container py-5">
    <h2 class="h4 fw-bold mb-4" style="font-family: Georgia, serif;">Shop by Category</h2>
    <div class="row g-3">
        <%
            String[] categories = {
                "Bathroom Accessories", "Wash Basins", "Faucets", "Showers",
                "Kitchen Accessories", "Home Decor", "Storage Products", "Cleaning Products"
            };
            for (String cat : categories) {
        %>
        <div class="col-6 col-md-3">
            <a href="products?category=<%= java.net.URLEncoder.encode(cat, "UTF-8") %>"
               class="d-block p-3 bg-white border rounded text-decoration-none text-dark h-100">
                <span class="small text-muted d-block mb-1">Category</span>
                <span class="fw-semibold"><%= cat %></span>
            </a>
        </div>
        <% } %>
    </div>
</section>

<section class="container pb-5">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="h4 fw-bold mb-0" style="font-family: Georgia, serif;">Featured Products</h2>
        <a href="products" class="text-dark small fw-semibold">View All &rarr;</a>
    </div>
    <div class="row g-4">
        <%
            try (Connection conn = DBConnection.getConnection();
                 PreparedStatement stmt = conn.prepareStatement("SELECT * FROM products WHERE is_featured = TRUE LIMIT 6");
                 ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
        %>
        <div class="col-md-4">
            <div class="product-card rounded h-100 d-flex flex-column">
                <div class="product-img-wrap">
                    <img src="<%= rs.getString("image_url") %>" alt="<%= rs.getString("product_name") %>">
                </div>
                <div class="p-3 d-flex flex-column flex-grow-1">
                    <span class="small text-muted text-uppercase"><%= rs.getString("category") %></span>
                    <h5 class="fw-semibold mt-1 mb-2"><%= rs.getString("product_name") %></h5>
                    <p class="small text-muted flex-grow-1"><%= rs.getString("description") %></p>
                    <div class="d-flex justify-content-between align-items-center pt-2 border-top">
                        <span class="fw-bold">Rs. <%= String.format("%.2f", rs.getDouble("price")) %></span>
                        <a href="products?id=<%= rs.getInt("product_id") %>" class="btn btn-sm btn-charcoal">View Details</a>
                    </div>
                </div>
            </div>
        </div>
        <%
                }
            } catch (Exception e) {
                out.println("<div class='alert alert-warning'>Connect MySQL to view products: " + e.getMessage() + "</div>");
            }
        %>
    </div>
</section>

<%@ include file="includes/footer.jsp" %>
