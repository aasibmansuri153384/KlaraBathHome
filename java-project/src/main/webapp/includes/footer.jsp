<footer class="bg-stone-grey border-top mt-5 py-5">
    <div class="container">
        <div class="row g-4">
            <div class="col-md-5">
                <h5 class="fw-bold mb-2" style="font-family: Georgia, serif;">Klara Bath &amp; Home</h5>
                <p class="text-muted small mb-0">
                    Thoughtfully designed bathroom ware and everyday homeware crafted in ceramic, travertine, and brushed metal.
                </p>
            </div>
            <div class="col-md-3">
                <h6 class="fw-semibold small text-uppercase text-muted mb-2">Shop</h6>
                <ul class="list-unstyled small mb-0">
                    <li><a href="${pageContext.request.contextPath}/products?category=Bathroom%20Ware" class="text-decoration-none text-dark">Bathroom Ware</a></li>
                    <li><a href="${pageContext.request.contextPath}/products?category=Homeware" class="text-decoration-none text-dark">Homeware</a></li>
                    <li><a href="${pageContext.request.contextPath}/cart" class="text-decoration-none text-dark">Shopping Cart</a></li>
                </ul>
            </div>
            <div class="col-md-4">
                <h6 class="fw-semibold small text-uppercase text-muted mb-2">Account &amp; Admin</h6>
                <ul class="list-unstyled small mb-0">
                    <li><a href="${pageContext.request.contextPath}/login.jsp" class="text-decoration-none text-dark">Customer Login</a></li>
                    <li><a href="${pageContext.request.contextPath}/register.jsp" class="text-decoration-none text-dark">Register Account</a></li>
                    <li><a href="${pageContext.request.contextPath}/admin/login.jsp" class="text-decoration-none text-dark">Admin Portal</a></li>
                </ul>
            </div>
        </div>
        <hr class="my-4">
        <p class="text-muted small mb-0">&copy; 2026 Klara Bath &amp; Home. Built with Java Servlets, JSP, JDBC &amp; MySQL.</p>
    </div>
</footer>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
<script src="${pageContext.request.contextPath}/js/validation.js"></script>
</body>
</html>
