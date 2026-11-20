<%@ page import="java.util.*, com.bathhome.model.*" %>
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
                    <th>Items</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Update</th>
                </tr>
            </thead>
            <tbody>
                <% if (orders != null && !orders.isEmpty()) {
                    for (Order o : orders) { %>
                <tr>
                    <td class="fw-semibold">#<%= o.getOrderId() %></td>
                    <td>
                        <div class="fw-semibold"><%= o.getCustomerName() %></div>
                        <div class="small text-muted"><%= o.getPhone() %> &middot; <%= o.getShippingAddress() %></div>
                    </td>
                    <td class="small">
                        <% if (o.getDetails() != null) {
                            for (OrderDetail d : o.getDetails()) { %>
                            <div><%= d.getProductName() %> &times; <%= d.getQuantity() %></div>
                        <%  }
                        } %>
                    </td>
                    <td class="fw-bold">Rs. <%= String.format("%.2f", o.getTotalAmount()) %></td>
                    <td><%= o.getStatus() %></td>
                    <td>
                        <form action="${pageContext.request.contextPath}/admin-orders" method="post" class="d-flex gap-2 m-0">
                            <input type="hidden" name="orderId" value="<%= o.getOrderId() %>">
                            <select name="status" class="form-select form-select-sm">
                                <option <%= "Pending".equals(o.getStatus()) ? "selected" : "" %>>Pending</option>
                                <option <%= "Confirmed".equals(o.getStatus()) ? "selected" : "" %>>Confirmed</option>
                                <option <%= "Shipped".equals(o.getStatus()) ? "selected" : "" %>>Shipped</option>
                                <option <%= "Delivered".equals(o.getStatus()) ? "selected" : "" %>>Delivered</option>
                                <option <%= "Cancelled".equals(o.getStatus()) ? "selected" : "" %>>Cancelled</option>
                            </select>
                            <button type="submit" class="btn btn-sm btn-charcoal">Save</button>
                        </form>
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
</body>
</html>
