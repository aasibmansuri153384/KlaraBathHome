<%@ page import="java.util.*, com.bathhome.model.*" %>
<%
    if (request.getAttribute("orders") == null) {
        response.sendRedirect(request.getContextPath() + "/admin-orders");
        return;
    }
%>
<%@ include file="../includes/admin-header.jsp" %>

<%
    List<Order> orders = (List<Order>) request.getAttribute("orders");
%>

<div class="container py-5">
    <h1 class="h3 fw-bold mb-4" style="font-family: Georgia, serif;">Order Management</h1>

    <div class="bg-white border rounded p-4 table-responsive">
        <table class="table align-middle mb-0">
            <thead>
                <tr class="small text-uppercase text-muted">
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Update Status</th>
                    <th class="text-end">Details</th>
                </tr>
            </thead>
            <tbody>
                <% if (orders != null && !orders.isEmpty()) {
                    for (Order o : orders) { %>
                <tr>
                    <td class="fw-semibold">#<%= o.getOrderId() %></td>
                    <td>
                        <div class="fw-semibold"><%= o.getCustomerName() %></div>
                        <div class="small text-muted"><%= o.getPhone() %></div>
                    </td>
                    <td class="fw-bold">Rs. <%= String.format("%.2f", o.getTotalAmount()) %></td>
                    <td><span class="badge bg-secondary"><%= o.getStatus() %></span></td>
                    <td>
                        <form action="${pageContext.request.contextPath}/admin-orders" method="post" class="d-flex gap-2 m-0">
                            <input type="hidden" name="orderId" value="<%= o.getOrderId() %>">
                            <select name="status" class="form-select form-select-sm" style="width: 140px;">
                                <option <%= "Pending".equals(o.getStatus()) ? "selected" : "" %>>Pending</option>
                                <option <%= "Confirmed".equals(o.getStatus()) ? "selected" : "" %>>Confirmed</option>
                                <option <%= "Shipped".equals(o.getStatus()) ? "selected" : "" %>>Shipped</option>
                                <option <%= "Delivered".equals(o.getStatus()) ? "selected" : "" %>>Delivered</option>
                                <option <%= "Cancelled".equals(o.getStatus()) ? "selected" : "" %>>Cancelled</option>
                            </select>
                            <button type="submit" class="btn btn-sm btn-charcoal">Save</button>
                        </form>
                    </td>
                    <td class="text-end">
                        <button type="button" class="btn btn-sm btn-outline-dark"
                                data-bs-toggle="modal" data-bs-target="#orderModal<%= o.getOrderId() %>">
                            View Details
                        </button>
                    </td>
                </tr>
                <%  }
                } else { %>
                <tr>
                    <td colspan="6" class="text-center text-muted py-4">No orders placed yet.</td>
                </tr>
                <% } %>
            </tbody>
        </table>
    </div>
</div>

<% if (orders != null) {
    for (Order o : orders) { %>
<div class="modal fade" id="orderModal<%= o.getOrderId() %>" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header bg-beige">
                <h5 class="modal-title fw-bold">Order #<%= o.getOrderId() %> Details</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <p class="small mb-1"><strong>Customer:</strong> <%= o.getCustomerName() %></p>
                <p class="small mb-1"><strong>Phone:</strong> <%= o.getPhone() %></p>
                <p class="small mb-3"><strong>Shipping Address:</strong> <%= o.getShippingAddress() %></p>
                <hr>
                <h6 class="fw-semibold small text-uppercase text-muted">Ordered Items</h6>
                <ul class="list-group list-group-flush mb-3">
                    <% if (o.getDetails() != null) {
                        for (OrderDetail d : o.getDetails()) { %>
                        <li class="list-group-item d-flex justify-content-between px-0 small">
                            <span><%= d.getProductName() %> &times; <%= d.getQuantity() %></span>
                            <strong>Rs. <%= String.format("%.2f", d.getPrice() * d.getQuantity()) %></strong>
                        </li>
                    <%  }
                    } %>
                </ul>
                <div class="d-flex justify-content-between fw-bold border-top pt-2">
                    <span>Total Amount</span>
                    <span>Rs. <%= String.format("%.2f", o.getTotalAmount()) %></span>
                </div>
            </div>
        </div>
    </div>
</div>
<%  }
} %>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
