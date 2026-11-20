package com.bathhome.util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

/**
 * Simple JDBC utility class for connecting to MySQL.
 * Update DB_USER and DB_PASS to match your local MySQL installation.
 */
public class DBConnection {

    private static final String DB_URL = "jdbc:mysql://localhost:3306/bathware_homeware_db?useSSL=false&serverTimezone=UTC";
    private static final String DB_USER = "root";
    private static final String DB_PASS = "root"; // Change to your MySQL root password

    public static Connection getConnection() throws SQLException {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            throw new SQLException("MySQL JDBC Driver not found. Add mysql-connector-j.jar to WEB-INF/lib.", e);
        }
        return DriverManager.getConnection(DB_URL, DB_USER, DB_PASS);
    }
}
