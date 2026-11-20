package com.bathhome.servlet;

import com.bathhome.util.DBConnection;
import java.io.IOException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

@WebServlet("/admin-dashboard")
public class AdminDashboardServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("adminUser") == null) {
            response.sendRedirect("admin/login.jsp");
            return;
        }

        int totalProducts = 0;
        int totalOrders = 0;
        int totalCustomers = 0;

        try (Connection conn = DBConnection.getConnection();
             Statement stmt = conn.createStatement()) {

            ResultSet rs1 = stmt.executeQuery("SELECT COUNT(*) FROM products");
            if (rs1.next()) totalProducts = rs1.getInt(1);

            ResultSet rs2 = stmt.executeQuery("SELECT COUNT(*) FROM orders");
            if (rs2.next()) totalOrders = rs2.getInt(1);

            ResultSet rs3 = stmt.executeQuery("SELECT COUNT(*) FROM users");
            if (rs3.next()) totalCustomers = rs3.getInt(1);
        } catch (Exception e) {
            e.printStackTrace();
        }

        request.setAttribute("totalProducts", totalProducts);
        request.setAttribute("totalOrders", totalOrders);
        request.setAttribute("totalCustomers", totalCustomers);
        request.getRequestDispatcher("admin/dashboard.jsp").forward(request, response);
    }
}
