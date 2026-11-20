package com.bathhome.servlet;

import com.bathhome.util.DBConnection;
import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/register")
public class RegisterServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String fullName = request.getParameter("fullName");
        String email = request.getParameter("email");
        String password = request.getParameter("password");
        String phone = request.getParameter("phone");
        String address = request.getParameter("address");

        if (fullName == null || fullName.trim().isEmpty()
                || email == null || email.trim().isEmpty()
                || password == null || password.length() < 6) {
            request.setAttribute("error", "Please enter a valid name, email, and password (min 6 chars).");
            request.getRequestDispatcher("register.jsp").forward(request, response);
            return;
        }

        try (Connection conn = DBConnection.getConnection()) {
            // Check duplicate email
            PreparedStatement checkStmt = conn.prepareStatement("SELECT user_id FROM users WHERE email = ?");
            checkStmt.setString(1, email.trim());
            ResultSet rs = checkStmt.executeQuery();
            if (rs.next()) {
                request.setAttribute("error", "An account with this email already exists.");
                request.getRequestDispatcher("register.jsp").forward(request, response);
                return;
            }

            String sql = "INSERT INTO users (full_name, email, password, phone, address) VALUES (?, ?, ?, ?, ?)";
            PreparedStatement stmt = conn.prepareStatement(sql);
            stmt.setString(1, fullName.trim());
            stmt.setString(2, email.trim());
            stmt.setString(3, password);
            stmt.setString(4, phone != null ? phone.trim() : "");
            stmt.setString(5, address != null ? address.trim() : "");
            stmt.executeUpdate();

            response.sendRedirect("login.jsp?registered=1");
        } catch (Exception e) {
            e.printStackTrace();
            request.setAttribute("error", "Database error: " + e.getMessage());
            request.getRequestDispatcher("register.jsp").forward(request, response);
        }
    }
}
