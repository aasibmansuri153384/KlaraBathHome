package com.bathhome.servlet;

import com.bathhome.model.Product;
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

@WebServlet("/admin-products")
public class AdminProductServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("adminUser") == null) {
            response.sendRedirect("admin/login.jsp");
            return;
        }

        String deleteId = request.getParameter("deleteId");
        String editId = request.getParameter("editId");

        try (Connection conn = DBConnection.getConnection()) {
            if (deleteId != null) {
                PreparedStatement del = conn.prepareStatement("DELETE FROM products WHERE product_id = ?");
                del.setInt(1, Integer.parseInt(deleteId));
                del.executeUpdate();
                response.sendRedirect("admin-products");
                return;
            }

            if (editId != null) {
                PreparedStatement ed = conn.prepareStatement("SELECT * FROM products WHERE product_id = ?");
                ed.setInt(1, Integer.parseInt(editId));
                ResultSet ers = ed.executeQuery();
                if (ers.next()) {
                    Product ep = new Product();
                    ep.setProductId(ers.getInt("product_id"));
                    ep.setProductName(ers.getString("product_name"));
                    ep.setCategoryGroup(ers.getString("category_group"));
                    ep.setCategory(ers.getString("category"));
                    ep.setPrice(ers.getDouble("price"));
                    ep.setDescription(ers.getString("description"));
                    ep.setImageUrl(ers.getString("image_url"));
                    request.setAttribute("editProduct", ep);
                }
            }

            List<Product> products = new ArrayList<>();
            ResultSet rs = conn.createStatement().executeQuery("SELECT * FROM products ORDER BY product_id DESC");
            while (rs.next()) {
                Product p = new Product();
                p.setProductId(rs.getInt("product_id"));
                p.setProductName(rs.getString("product_name"));
                p.setCategoryGroup(rs.getString("category_group"));
                p.setCategory(rs.getString("category"));
                p.setPrice(rs.getDouble("price"));
                p.setDescription(rs.getString("description"));
                p.setImageUrl(rs.getString("image_url"));
                products.add(p);
            }
            request.setAttribute("products", products);
            request.getRequestDispatcher("admin/products.jsp").forward(request, response);
        } catch (Exception e) {
            e.printStackTrace();
            response.sendRedirect("admin-dashboard");
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("adminUser") == null) {
            response.sendRedirect("admin/login.jsp");
            return;
        }

        String productId = request.getParameter("productId");
        String productName = request.getParameter("productName");
        String category = request.getParameter("category");
        String categoryGroup = (category.equals("Bathroom Accessories") || category.equals("Wash Basins")
                || category.equals("Faucets") || category.equals("Showers"))
                ? "Bathroom Ware" : "Homeware";
        double price = Double.parseDouble(request.getParameter("price"));
        String description = request.getParameter("description");
        String imageUrl = request.getParameter("imageUrl");

        try (Connection conn = DBConnection.getConnection()) {
            if (productId == null || productId.isEmpty()) {
                String sql = "INSERT INTO products (product_name, category_group, category, price, description, image_url) "
                           + "VALUES (?, ?, ?, ?, ?, ?)";
                PreparedStatement stmt = conn.prepareStatement(sql);
                stmt.setString(1, productName);
                stmt.setString(2, categoryGroup);
                stmt.setString(3, category);
                stmt.setDouble(4, price);
                stmt.setString(5, description);
                stmt.setString(6, imageUrl);
                stmt.executeUpdate();
            } else {
                String sql = "UPDATE products SET product_name=?, category_group=?, category=?, price=?, description=?, image_url=? "
                           + "WHERE product_id=?";
                PreparedStatement stmt = conn.prepareStatement(sql);
                stmt.setString(1, productName);
                stmt.setString(2, categoryGroup);
                stmt.setString(3, category);
                stmt.setDouble(4, price);
                stmt.setString(5, description);
                stmt.setString(6, imageUrl);
                stmt.setInt(7, Integer.parseInt(productId));
                stmt.executeUpdate();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        response.sendRedirect("admin-products");
    }
}
