package com.bathhome.servlet;

import com.bathhome.model.Order;
import com.bathhome.model.OrderDetail;
import com.bathhome.model.User;
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

@WebServlet("/profile")
public class ProfileServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        User user = (session != null) ? (User) session.getAttribute("loggedUser") : null;
        if (user == null) {
            response.sendRedirect("login.jsp");
            return;
        }

        List<Order> orders = new ArrayList<>();
        try (Connection conn = DBConnection.getConnection()) {
            PreparedStatement stmt = conn.prepareStatement(
                "SELECT * FROM orders WHERE user_id = ? ORDER BY order_date DESC"
            );
            stmt.setInt(1, user.getUserId());
            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                Order order = new Order();
                order.setOrderId(rs.getInt("order_id"));
                order.setCustomerName(rs.getString("customer_name"));
                order.setTotalAmount(rs.getDouble("total_amount"));
                order.setStatus(rs.getString("status"));
                order.setOrderDate(rs.getTimestamp("order_date"));

                // Fetch line items
                PreparedStatement dStmt = conn.prepareStatement("SELECT * FROM order_details WHERE order_id = ?");
                dStmt.setInt(1, order.getOrderId());
                ResultSet dRs = dStmt.executeQuery();
                List<OrderDetail> details = new ArrayList<>();
                while (dRs.next()) {
                    OrderDetail detail = new OrderDetail();
                    detail.setProductName(dRs.getString("product_name"));
                    detail.setQuantity(dRs.getInt("quantity"));
                    detail.setPrice(dRs.getDouble("price"));
                    details.add(detail);
                }
                order.setDetails(details);
                orders.add(order);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        request.setAttribute("orders", orders);
        request.getRequestDispatcher("profile.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        User user = (session != null) ? (User) session.getAttribute("loggedUser") : null;
        if (user == null) {
            response.sendRedirect("login.jsp");
            return;
        }

        String fullName = request.getParameter("fullName");
        String phone = request.getParameter("phone");
        String address = request.getParameter("address");

        try (Connection conn = DBConnection.getConnection()) {
            PreparedStatement stmt = conn.prepareStatement(
                "UPDATE users SET full_name = ?, phone = ?, address = ? WHERE user_id = ?"
            );
            stmt.setString(1, fullName);
            stmt.setString(2, phone);
            stmt.setString(3, address);
            stmt.setInt(4, user.getUserId());
            stmt.executeUpdate();

            user.setFullName(fullName);
            user.setPhone(phone);
            user.setAddress(address);
            session.setAttribute("loggedUser", user);
            response.sendRedirect("profile?updated=1");
        } catch (Exception e) {
            e.printStackTrace();
            response.sendRedirect("profile?error=1");
        }
    }
}
