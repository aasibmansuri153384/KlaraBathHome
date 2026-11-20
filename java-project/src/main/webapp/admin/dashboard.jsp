<%
    if (request.getAttribute("totalProducts") == null) {
        response.sendRedirect(request.getContextPath() + "/admin-dashboard");
        return;
    }
%>
<%@ include file="../includes/admin-header.jsp" %>

<div class="container py-5">
    <h1 class="h3 fw-bold mb-4" style="font-family: Georgia, serif;">Admin Dashboard</h1>

    <div class="row g-4 mb-5">
        <div class="col-md-4">
            <div class="bg-white border rounded p-4">
                <span class="small text-uppercase text-muted">Total Products</span>
                <div class="display-6 fw-bold mt-2"><%= request.getAttribute("totalProducts") %></div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="bg-white border rounded p-4">
                <span class="small text-uppercase text-muted">Total Orders</span>
                <div class="display-6 fw-bold mt-2"><%= request.getAttribute("totalOrders") %></div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="bg-white border rounded p-4">
                <span class="small text-uppercase text-muted">Total Customers</span>
                <div class="display-6 fw-bold mt-2"><%= request.getAttribute("totalCustomers") %></div>
            </div>
        </div>
    </div>

    <div class="row g-4">
        <div class="col-md-6">
            <div class="bg-beige border rounded p-4">
                <h5 class="fw-bold mb-2">Product Management</h5>
                <p class="small text-muted mb-3">Add new bathroom ware or homeware items, update prices, or remove products.</p>
                <a href="${pageContext.request.contextPath}/admin-products" class="btn btn-charcoal btn-sm">Manage Products</a>
            </div>
        </div>
        <div class="col-md-6">
            <div class="bg-beige border rounded p-4">
                <h5 class="fw-bold mb-2">Order Management</h5>
                <p class="small text-muted mb-3">Inspect customer orders, review line items, and update fulfillment status.</p>
                <a href="${pageContext.request.contextPath}/admin-orders" class="btn btn-charcoal btn-sm">Manage Orders</a>
            </div>
        </div>
    </div>
</div>
</body>
</html>
