package com.bathhome.servlet;

import com.bathhome.model.User;
import com.bathhome.util.DBConnection;
import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

@WebServlet("/place-order")
public class OrderServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        HttpSession session = request.getSession(false);
        User user = (session != null) ? (User) session.getAttribute("loggedUser") : null;
        if (user == null) {
            response.sendRedirect("login.jsp");
            return;
        }

        String phone = request.getParameter("phone");
        String shippingAddress = request.getParameter("shippingAddress");

        try (Connection conn = DBConnection.getConnection()) {
            conn.setAutoCommit(false);

            // 1. Read user's cart
            String cartSql = "SELECT c.product_id, c.quantity, p.product_name, p.price "
                           + "FROM cart c JOIN products p ON c.product_id = p.product_id WHERE c.user_id = ?";
            PreparedStatement cartStmt = conn.prepareStatement(cartSql);
            cartStmt.setInt(1, user.getUserId());
            ResultSet rs = cartStmt.executeQuery();

            double totalAmount = 0;
            boolean hasItems = false;
            while (rs.next()) {
                hasItems = true;
                totalAmount += rs.getDouble("price") * rs.getInt("quantity");
            }

            if (!hasItems) {
                response.sendRedirect("cart");
                return;
            }

            // 2. Insert order row
            String orderSql = "INSERT INTO orders (user_id, customer_name, phone, shipping_address, total_amount, status) "
                            + "VALUES (?, ?, ?, ?, ?, 'Pending')";
            PreparedStatement orderStmt = conn.prepareStatement(orderSql, Statement.RETURN_GENERATED_KEYS);
            orderStmt.setInt(1, user.getUserId());
            orderStmt.setString(2, user.getFullName());
            orderStmt.setString(3, phone);
            orderStmt.setString(4, shippingAddress);
            orderStmt.setDouble(5, totalAmount);
            orderStmt.executeUpdate();

            ResultSet keys = orderStmt.getGeneratedKeys();
            keys.next();
            int orderId = keys.getInt(1);

            // 3. Copy cart items to order_details
            ResultSet rsItems = cartStmt.executeQuery();
            PreparedStatement detailStmt = conn.prepareStatement(
                "INSERT INTO order_details (order_id, product_id, product_name, quantity, price) VALUES (?, ?, ?, ?, ?)"
            );
            while (rsItems.next()) {
                detailStmt.setInt(1, orderId);
                detailStmt.setInt(2, rsItems.getInt("product_id"));
                detailStmt.setString(3, rsItems.getString("product_name"));
                detailStmt.setInt(4, rsItems.getInt("quantity"));
                detailStmt.setDouble(5, rsItems.getDouble("price"));
                detailStmt.addBatch();
            }
            detailStmt.executeBatch();

            // 4. Clear cart
            PreparedStatement clearStmt = conn.prepareStatement("DELETE FROM cart WHERE user_id = ?");
            clearStmt.setInt(1, user.getUserId());
            clearStmt.executeUpdate();

            conn.commit();
            response.sendRedirect("profile?orderSuccess=" + orderId);
        } catch (Exception e) {
            e.printStackTrace();
            response.sendRedirect("cart?error=1");
        }
    }
}
