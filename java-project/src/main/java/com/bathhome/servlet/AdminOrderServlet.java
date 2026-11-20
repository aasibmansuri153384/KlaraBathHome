package com.bathhome.servlet;

import com.bathhome.model.Order;
import com.bathhome.model.OrderDetail;
import com.bathhome.util.DBConnection;
import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

@WebServlet("/admin-orders")
public class AdminOrderServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("adminUser") == null) {
            response.sendRedirect("admin/login.jsp");
            return;
        }

        List<Order> orders = new ArrayList<>();
        try (Connection conn = DBConnection.getConnection()) {
            ResultSet rs = conn.createStatement().executeQuery("SELECT * FROM orders ORDER BY order_date DESC");
            while (rs.next()) {
                Order order = new Order();
                order.setOrderId(rs.getInt("order_id"));
                order.setCustomerName(rs.getString("customer_name"));
                order.setPhone(rs.getString("phone"));
                order.setShippingAddress(rs.getString("shipping_address"));
                order.setTotalAmount(rs.getDouble("total_amount"));
                order.setStatus(rs.getString("status"));
                order.setOrderDate(rs.getTimestamp("order_date"));

                PreparedStatement dStmt = conn.prepareStatement("SELECT * FROM order_details WHERE order_id = ?");
                dStmt.setInt(1, order.getOrderId());
                ResultSet dRs = dStmt.executeQuery();
                List<OrderDetail> details = new ArrayList<>();
                while (dRs.next()) {
                    OrderDetail d = new OrderDetail();
                    d.setProductName(dRs.getString("product_name"));
                    d.setQuantity(dRs.getInt("quantity"));
                    d.setPrice(dRs.getDouble("price"));
                    details.add(d);
                }
                order.setDetails(details);
                orders.add(order);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        request.setAttribute("orders", orders);
        request.getRequestDispatcher("admin/orders.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("adminUser") == null) {
            response.sendRedirect("admin/login.jsp");
            return;
        }

        int orderId = Integer.parseInt(request.getParameter("orderId"));
        String status = request.getParameter("status");

        try (Connection conn = DBConnection.getConnection()) {
            PreparedStatement stmt = conn.prepareStatement("UPDATE orders SET status = ? WHERE order_id = ?");
            stmt.setString(1, status);
            stmt.setInt(2, orderId);
            stmt.executeUpdate();
        } catch (Exception e) {
            e.printStackTrace();
        }

        response.sendRedirect("admin-orders");
    }
}
