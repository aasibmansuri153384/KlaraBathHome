<%@ page import="java.util.*, com.bathhome.model.*" %>
<%
    User u = (User) session.getAttribute("loggedUser");
    if (u == null) {
        response.sendRedirect("login.jsp");
        return;
    }
    if (request.getAttribute("orders") == null) {
        response.sendRedirect("profile");
        return;
    }
    List<Order> orders = (List<Order>) request.getAttribute("orders");
%>
<%@ include file="includes/header.jsp" %>

<div class="container py-5">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="h3 fw-bold mb-0" style="font-family: Georgia, serif;">My Profile &amp; Orders</h1>
        <a href="logout" class="btn btn-outline-dark btn-sm">Logout</a>
    </div>

    <% if (request.getParameter("orderSuccess") != null) { %>
        <div class="alert alert-success">Order #<%= request.getParameter("orderSuccess") %> placed successfully!</div>
    <% } %>
    <% if ("1".equals(request.getParameter("updated"))) { %>
        <div class="alert alert-success">Profile updated successfully.</div>
    <% } %>

    <div class="row g-4">
        <div class="col-lg-5">
            <div class="bg-white border rounded p-4">
                <h5 class="fw-bold mb-3">Account Details</h5>
                <form action="profile" method="post">
                    <div class="mb-3">
                        <label class="form-label small fw-semibold">Full Name</label>
                        <input type="text" name="fullName" class="form-control" value="<%= u.getFullName() %>" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label small fw-semibold">Email (Read Only)</label>
                        <input type="email" class="form-control bg-light" value="<%= u.getEmail() %>" readonly>
                    </div>
                    <div class="mb-3">
                        <label class="form-label small fw-semibold">Phone</label>
                        <input type="text" name="phone" class="form-control" value="<%= u.getPhone() != null ? u.getPhone() : "" %>">
                    </div>
                    <div class="mb-3">
                        <label class="form-label small fw-semibold">Shipping Address</label>
                        <textarea name="address" class="form-control" rows="3"><%= u.getAddress() != null ? u.getAddress() : "" %></textarea>
                    </div>
                    <button type="submit" class="btn btn-charcoal w-100">Save Profile</button>
                </form>
            </div>
        </div>

        <div class="col-lg-7">
            <div class="bg-white border rounded p-4">
                <h5 class="fw-bold mb-3">Previous Orders</h5>
                <% if (orders == null || orders.isEmpty()) { %>
                    <p class="text-muted small mb-0">You have not placed any orders yet.</p>
                <% } else {
                    for (Order o : orders) { %>
                    <div class="border rounded p-3 mb-3 bg-beige">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <span class="fw-bold">Order #<%= o.getOrderId() %></span>
                            <span class="badge bg-dark"><%= o.getStatus() %></span>
                        </div>
                        <p class="small text-muted mb-2">Date: <%= o.getOrderDate() %> &middot; Total: <strong>Rs. <%= String.format("%.2f", o.getTotalAmount()) %></strong></p>
                        <ul class="small mb-0 ps-3">
                            <% if (o.getDetails() != null) {
                                for (OrderDetail d : o.getDetails()) { %>
                                <li><%= d.getProductName() %> x <%= d.getQuantity() %> (Rs. <%= String.format("%.2f", d.getPrice()) %>)</li>
                            <%  }
                            } %>
                        </ul>
                    </div>
                <%  }
                } %>
            </div>
        </div>
    </div>
</div>

<%@ include file="includes/footer.jsp" %>
