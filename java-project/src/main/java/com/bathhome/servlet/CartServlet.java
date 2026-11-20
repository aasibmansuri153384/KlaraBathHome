package com.bathhome.servlet;

import com.bathhome.model.CartItem;
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

@WebServlet("/cart")
public class CartServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        User user = (session != null) ? (User) session.getAttribute("loggedUser") : null;
        if (user == null) {
            response.sendRedirect("login.jsp");
            return;
        }

        List<CartItem> items = new ArrayList<>();
        double total = 0;

        try (Connection conn = DBConnection.getConnection()) {
            String sql = "SELECT c.cart_id, c.quantity, p.product_id, p.product_name, p.category, p.price, p.image_url "
                       + "FROM cart c JOIN products p ON c.product_id = p.product_id WHERE c.user_id = ?";
            PreparedStatement stmt = conn.prepareStatement(sql);
            stmt.setInt(1, user.getUserId());
            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                CartItem item = new CartItem();
                item.setCartId(rs.getInt("cart_id"));
                item.setProductId(rs.getInt("product_id"));
                item.setProductName(rs.getString("product_name"));
                item.setCategory(rs.getString("category"));
                item.setPrice(rs.getDouble("price"));
                item.setImageUrl(rs.getString("image_url"));
                item.setQuantity(rs.getInt("quantity"));
                total += item.getSubtotal();
                items.add(item);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        request.setAttribute("cartItems", items);
        request.setAttribute("cartTotal", total);
        request.getRequestDispatcher("cart.jsp").forward(request, response);
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

        String action = request.getParameter("action");

        try (Connection conn = DBConnection.getConnection()) {
            if ("add".equals(action)) {
                int productId = Integer.parseInt(request.getParameter("productId"));
                int qty = Integer.parseInt(request.getParameter("quantity"));

                PreparedStatement check = conn.prepareStatement(
                    "SELECT cart_id, quantity FROM cart WHERE user_id = ? AND product_id = ?"
                );
                check.setInt(1, user.getUserId());
                check.setInt(2, productId);
                ResultSet rs = check.executeQuery();

                if (rs.next()) {
                    PreparedStatement upd = conn.prepareStatement("UPDATE cart SET quantity = ? WHERE cart_id = ?");
                    upd.setInt(1, rs.getInt("quantity") + qty);
                    upd.setInt(2, rs.getInt("cart_id"));
                    upd.executeUpdate();
                } else {
                    PreparedStatement ins = conn.prepareStatement(
                        "INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)"
                    );
                    ins.setInt(1, user.getUserId());
                    ins.setInt(2, productId);
                    ins.setInt(3, qty);
                    ins.executeUpdate();
                }
            } else if ("update".equals(action)) {
                int cartId = Integer.parseInt(request.getParameter("cartId"));
                int qty = Integer.parseInt(request.getParameter("quantity"));
                if (qty <= 0) {
                    PreparedStatement del = conn.prepareStatement("DELETE FROM cart WHERE cart_id = ? AND user_id = ?");
                    del.setInt(1, cartId);
                    del.setInt(2, user.getUserId());
                    del.executeUpdate();
                } else {
                    PreparedStatement upd = conn.prepareStatement("UPDATE cart SET quantity = ? WHERE cart_id = ? AND user_id = ?");
                    upd.setInt(1, qty);
                    upd.setInt(2, cartId);
                    upd.setInt(3, user.getUserId());
                    upd.executeUpdate();
                }
            } else if ("remove".equals(action)) {
                int cartId = Integer.parseInt(request.getParameter("cartId"));
                PreparedStatement del = conn.prepareStatement("DELETE FROM cart WHERE cart_id = ? AND user_id = ?");
                del.setInt(1, cartId);
                del.setInt(2, user.getUserId());
                del.executeUpdate();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        response.sendRedirect("cart");
    }
}
