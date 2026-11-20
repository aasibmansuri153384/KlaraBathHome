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

@WebServlet("/products")
public class ProductServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String idParam = request.getParameter("id");
        String category = request.getParameter("category");

        try (Connection conn = DBConnection.getConnection()) {
            if (idParam != null && !idParam.isEmpty()) {
                PreparedStatement stmt = conn.prepareStatement("SELECT * FROM products WHERE product_id = ?");
                stmt.setInt(1, Integer.parseInt(idParam));
                ResultSet rs = stmt.executeQuery();
                if (rs.next()) {
                    Product p = mapProduct(rs);
                    request.setAttribute("product", p);
                    request.getRequestDispatcher("product-details.jsp").forward(request, response);
                    return;
                }
            }

            List<Product> products = new ArrayList<>();
            PreparedStatement stmt;
            if (category != null && !category.isEmpty() && !category.equals("All")) {
                stmt = conn.prepareStatement("SELECT * FROM products WHERE category = ? OR category_group = ? ORDER BY product_id DESC");
                stmt.setString(1, category);
                stmt.setString(2, category);
            } else {
                stmt = conn.prepareStatement("SELECT * FROM products ORDER BY product_id DESC");
            }

            ResultSet rs = stmt.executeQuery();
            while (rs.next()) {
                products.add(mapProduct(rs));
            }
            request.setAttribute("products", products);
            request.setAttribute("selectedCategory", category != null ? category : "All");
            request.getRequestDispatcher("products.jsp").forward(request, response);
        } catch (Exception e) {
            e.printStackTrace();
            request.setAttribute("error", "Could not load products.");
            request.getRequestDispatcher("products.jsp").forward(request, response);
        }
    }

    private Product mapProduct(ResultSet rs) throws Exception {
        Product p = new Product();
        p.setProductId(rs.getInt("product_id"));
        p.setProductName(rs.getString("product_name"));
        p.setCategoryGroup(rs.getString("category_group"));
        p.setCategory(rs.getString("category"));
        p.setPrice(rs.getDouble("price"));
        p.setDescription(rs.getString("description"));
        p.setImageUrl(rs.getString("image_url"));
        p.setFeatured(rs.getBoolean("is_featured"));
        return p;
    }
}
