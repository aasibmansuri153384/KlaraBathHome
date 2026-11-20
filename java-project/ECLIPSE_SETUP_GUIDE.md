# How to Configure & Run in Eclipse IDE with Apache Tomcat

## Prerequisites
1. **Java Development Kit (JDK 11 or JDK 17)**
2. **Eclipse IDE for Enterprise Java and Web Developers**
3. **Apache Tomcat 9.0** (uses `javax.servlet.*`)
   *(Note: If you use Tomcat 10+, change `javax.servlet.*` imports to `jakarta.servlet.*`.)*
4. **MySQL Server 8.0** + **MySQL Workbench**
5. **MySQL Connector/J** (`mysql-connector-j-8.x.x.jar`)

---

## Step 1: Set Up the MySQL Database
1. Open **MySQL Workbench** or the MySQL CLI.
2. Open `sql/bathware_homeware.sql` and execute the entire script.
3. Verify that `bathware_homeware_db` has 6 tables (`users`, `admin`, `products`, `cart`, `orders`, `order_details`) and sample data.
4. Open `src/main/java/com/bathhome/util/DBConnection.java` and update `DB_USER` and `DB_PASS` to match your MySQL credentials.

## Step 2: Create the Dynamic Web Project in Eclipse
1. Open Eclipse -> **File -> New -> Dynamic Web Project**.
2. Name the project `KlaraBathHome`.
3. Under **Target Runtime**, click **New Runtime...** -> select **Apache Tomcat v9.0** -> browse to your Tomcat folder -> **Finish**.
4. Check **"Generate web.xml deployment descriptor"** -> **Finish**.

## Step 3: Add Source Files & MySQL Driver
1. Copy the `com.bathhome.*` packages into `src/main/java`.
2. Copy all `.jsp`, `css/`, and `WEB-INF/web.xml` files into `src/main/webapp`.
3. Copy `mysql-connector-j-8.x.x.jar` into `src/main/webapp/WEB-INF/lib/`.
   *(Also right-click the project -> **Build Path -> Configure Build Path -> Libraries -> Add JARs** to confirm the JAR is on the classpath.)*

## Step 4: Run on Apache Tomcat
1. Right-click the project -> **Run As -> Run on Server**.
2. Select **Tomcat v9.0 Server at localhost** -> **Finish**.
3. Open your browser at `http://localhost:8080/KlaraBathHome/`.
4. **Demo Customer Login:** `aarav@example.com` / `123456`
5. **Admin Login:** `http://localhost:8080/KlaraBathHome/admin/login.jsp` (`admin` / `admin123`)
