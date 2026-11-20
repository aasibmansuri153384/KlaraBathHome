<%@ page import="java.util.*, com.bathhome.model.CartItem, com.bathhome.model.User" %>
<%@ include file="includes/header.jsp" %>

<%
    List<CartItem> items = (List<CartItem>) request.getAttribute("cartItems");
    Double total = (Double) request.getAttribute("cartTotal");
    if (total == null) total = 0.0;
    User currentUser = (User) session.getAttribute("loggedUser");
%>

<div class="container py-5">
    <h1 class="h3 fw-bold mb-4" style="font-family: Georgia, serif;">Shopping Cart</h1>

    <% if (items == null || items.isEmpty()) { %>
        <div class="p-5 bg-white border rounded text-center">
            <p class="text-muted mb-3">Your shopping cart is currently empty.</p>
            <a href="products" class="btn btn-charcoal">Explore Products</a>
        </div>
    <% } else { %>
        <div class="row g-4">
            <div class="col-lg-8">
                <div class="bg-white border rounded">
                    <% for (CartItem item : items) { %>
                    <div class="p-3 border-bottom d-flex justify-content-between align-items-center gap-3 flex-wrap">
                        <div>
                            <span class="small text-muted d-block"><%= item.getCategory() %></span>
                            <h6 class="fw-semibold mb-1"><%= item.getProductName() %></h6>
                            <span class="small text-muted">Rs. <%= String.format("%.2f", item.getPrice()) %> each</span>
                        </div>
                        <div class="d-flex align-items-center gap-2">
                            <form action="cart" method="post" class="d-flex align-items-center gap-1 m-0">
                                <input type="hidden" name="action" value="update">
                                <input type="hidden" name="cartId" value="<%= item.getCartId() %>">
                                <button type="submit" name="quantity" value="<%= item.getQuantity() - 1 %>" class="btn btn-sm btn-outline-secondary">-</button>
                                <span class="px-2 fw-semibold"><%= item.getQuantity() %></span>
                                <button type="submit" name="quantity" value="<%= item.getQuantity() + 1 %>" class="btn btn-sm btn-outline-secondary">+</button>
                            </form>
                            <span class="fw-bold ms-3">Rs. <%= String.format("%.2f", item.getSubtotal()) %></span>
                            <form action="cart" method="post" class="m-0 ms-2">
                                <input type="hidden" name="action" value="remove">
                                <input type="hidden" name="cartId" value="<%= item.getCartId() %>">
                                <button type="submit" class="btn btn-sm btn-outline-danger">Remove</button>
                            </form>
                        </div>
                    </div>
                    <% } %>
                </div>
            </div>

            <div class="col-lg-4">
                <div class="bg-beige border rounded p-4">
                    <h5 class="fw-bold mb-3">Order Summary</h5>
                    <div class="d-flex justify-content-between mb-3">
                        <span>Total Amount</span>
                        <span class="fw-bold fs-5">Rs. <%= String.format("%.2f", total) %></span>
                    </div>
                    <form action="place-order" method="post">
                        <div class="mb-3">
                            <label class="form-label small fw-semibold">Phone Number</label>
                            <input type="text" name="phone" class="form-control" value="<%= currentUser != null && currentUser.getPhone() != null ? currentUser.getPhone() : "" %>" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label small fw-semibold">Delivery Address</label>
                            <textarea name="shippingAddress" class="form-control" rows="3" required><%= currentUser != null && currentUser.getAddress() != null ? currentUser.getAddress() : "" %></textarea>
                        </div>
                        <button type="submit" class="btn btn-charcoal w-100 py-2">Place Order (Cash on Delivery)</button>
                    </form>
                </div>
            </div>
        </div>
    <% } %>
</div>

<%@ include file="includes/footer.jsp" %>
