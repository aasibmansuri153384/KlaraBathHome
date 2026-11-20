<%@ page import="java.util.*, com.bathhome.model.Product" %>
<%@ include file="../includes/admin-header.jsp" %>

<%
    List<Product> products = (List<Product>) request.getAttribute("products");
    Product editP = (Product) request.getAttribute("editProduct");
%>

<div class="container py-5">
    <h1 class="h3 fw-bold mb-4" style="font-family: Georgia, serif;">Product Management</h1>

    <div class="row g-4">
        <div class="col-lg-4">
            <div class="bg-white border rounded p-4">
                <h5 class="fw-bold mb-3"><%= editP != null ? "Update Product #" + editP.getProductId() : "Add New Product" %></h5>
                <form action="${pageContext.request.contextPath}/admin-products" method="post">
                    <input type="hidden" name="productId" value="<%= editP != null ? editP.getProductId() : "" %>">

                    <div class="mb-3">
                        <label class="form-label small fw-semibold">Product Name</label>
                        <input type="text" name="productName" class="form-control" value="<%= editP != null ? editP.getProductName() : "" %>" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label small fw-semibold">Category</label>
                        <select name="category" class="form-select" required>
                            <%
                                String[] cats = {
                                    "Bathroom Accessories", "Wash Basins", "Faucets", "Showers",
                                    "Kitchen Accessories", "Home Decor", "Storage Products", "Cleaning Products"
                                };
                                for (String c : cats) {
                                    boolean sel = editP != null && c.equals(editP.getCategory());
                            %>
                            <option value="<%= c %>" <%= sel ? "selected" : "" %>><%= c %></option>
                            <% } %>
                        </select>
                    </div>
                    <div class="mb-3">
                        <label class="form-label small fw-semibold">Price (Rs.)</label>
                        <input type="number" step="0.01" name="price" class="form-control" value="<%= editP != null ? editP.getPrice() : "" %>" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label small fw-semibold">Image Path / URL</label>
                        <input type="text" name="imageUrl" class="form-control" value="<%= editP != null ? editP.getImageUrl() : "images/wash-basin.jpg" %>" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label small fw-semibold">Description</label>
                        <textarea name="description" class="form-control" rows="3" required><%= editP != null ? editP.getDescription() : "" %></textarea>
                    </div>
                    <button type="submit" class="btn btn-charcoal w-100">
                        <%= editP != null ? "Update Product" : "Add Product" %>
                    </button>
                    <% if (editP != null) { %>
                        <a href="${pageContext.request.contextPath}/admin-products" class="btn btn-outline-secondary w-100 mt-2">Cancel Edit</a>
                    <% } %>
                </form>
            </div>
        </div>

        <div class="col-lg-8">
            <div class="bg-white border rounded p-4 table-responsive">
                <table class="table align-middle mb-0">
                    <thead>
                        <tr class="small text-uppercase text-muted">
                            <th>ID</th>
                            <th>Product</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th class="text-end">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <% if (products != null) {
                            for (Product p : products) { %>
                        <tr>
                            <td>#<%= p.getProductId() %></td>
                            <td class="fw-semibold"><%= p.getProductName() %></td>
                            <td class="small text-muted"><%= p.getCategory() %></td>
                            <td>Rs. <%= String.format("%.2f", p.getPrice()) %></td>
                            <td class="text-end">
                                <a href="${pageContext.request.contextPath}/admin-products?editId=<%= p.getProductId() %>" class="btn btn-sm btn-outline-dark">Edit</a>
                                <a href="${pageContext.request.contextPath}/admin-products?deleteId=<%= p.getProductId() %>"
                                   onclick="return confirm('Delete this product?');"
                                   class="btn btn-sm btn-outline-danger">Delete</a>
                            </td>
                        </tr>
                        <%  }
                        } %>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
</body>
</html>
