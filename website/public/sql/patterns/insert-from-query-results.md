# Insert from Query Results (INSERT with SELECT)

## Problem Description

The INSERT with SELECT pattern combines data insertion with query capabilities, allowing you to populate tables based on the results of SELECT statements. This pattern is essential for data migration, transformation pipelines, and creating derived datasets from existing tables.

### Key Characteristics

| Characteristic | Description |
|----------------|-------------|
| Time Complexity | O(n + m) - query execution + insertion, where n is source rows, m is target overhead |
| Space Complexity | O(k) - intermediate result set storage |
| Input | Source table/query, target table, optional transformation logic |
| Output | New rows inserted into target table |
| Approach | Query → Transform → Map columns → Insert |

### When to Use

- **Copying data**: Duplicating data from one table to another (e.g., archiving, backup)
- **Transforming data**: Creating a cleaned or aggregated version of existing data
- **Generating data**: Populating a table with computed values or derived metrics
- **Data migration**: Moving data between tables with different schemas
- **Denormalization**: Creating pre-joined views as physical tables for performance
- **Staging data**: Loading intermediate results for complex ETL processes
- **Cross-database operations**: Transferring data between different databases or schemas

## Intuition

The key insight is **query-driven insertion**. Instead of inserting row-by-row with explicit values, you use a SELECT statement as the data source, enabling set-based operations that are both efficient and maintainable.

The "aha!" moments:

1. **Query drives insertion**: The SELECT statement becomes the VALUES clause
2. **Column mapping**: SELECT column order must match INSERT column order (or be explicitly named)
3. **Type compatibility**: Corresponding columns must have compatible data types
4. **Set-based operations**: Process thousands of rows in a single statement vs. row-by-row
5. **Transformation pipeline**: Can combine filtering, joining, and aggregating before insertion

## Solution Approaches

### Approach 1: Basic INSERT SELECT - Copy from Another Table ✅ Recommended

#### Algorithm

1. Identify the source table with the data to copy
2. Identify the target table for insertion
3. Match columns between source and target (order matters)
4. Write INSERT with explicit column list
5. Add SELECT statement retrieving matching columns from source

#### Implementation

**Problem: Duplicate Emails (SQL-196) - Copy to backup table**

```sql
-- Create backup before deleting duplicates
INSERT INTO PersonBackup (id, email)
SELECT id, email
FROM Person
WHERE id IN (
    SELECT MIN(id)
    FROM Person
    GROUP BY email
);
```

**Basic Copy Between Tables:**

```sql
-- Copy all rows from source to target
INSERT INTO TargetTable (col1, col2, col3)
SELECT col_a, col_b, col_c
FROM SourceTable;
```

**Copy with Filtering:**

```sql
-- Copy only active records to archive
INSERT INTO ArchivedUsers (user_id, username, created_date)
SELECT user_id, username, created_date
FROM Users
WHERE status = 'inactive'
  AND last_login < DATE_SUB(CURDATE(), INTERVAL 1 YEAR);
```

**Copy Specific Columns:**

```sql
-- Copy subset of columns
INSERT INTO UserSummary (user_id, full_name)
SELECT user_id, CONCAT(first_name, ' ', last_name)
FROM Users;
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n) - linear scan of source + insertion overhead |
| Space | O(k) - result set buffer, k = matching rows |

### Approach 2: INSERT SELECT with Transformation - Modified Data

Transform data during insertion to create cleaned, computed, or reformatted values in the target table.

#### Algorithm

1. Identify transformation requirements for each column
2. Write expressions in SELECT to transform source data
3. Ensure transformed types match target column types
4. Use functions (CONCAT, CASE, DATE_FORMAT, etc.) for conversions
5. Handle NULL values appropriately

#### Implementation

**Problem: Customers Who Bought All Products (SQL-1045) - Transform for analysis**

```sql
-- Create summary table with transformed metrics
INSERT INTO CustomerMetrics (customer_id, total_orders, avg_order_value, customer_tier)
SELECT 
    customer_id,
    COUNT(*) AS total_orders,
    AVG(order_value) AS avg_order_value,
    CASE 
        WHEN AVG(order_value) > 1000 THEN 'Premium'
        WHEN AVG(order_value) > 500 THEN 'Standard'
        ELSE 'Basic'
    END AS customer_tier
FROM Orders
GROUP BY customer_id;
```

**Data Cleaning Transformation:**

```sql
-- Clean and standardize data during insertion
INSERT INTO CleanedCustomers (customer_id, email, phone, name)
SELECT 
    id,
    LOWER(TRIM(email)),                           -- Normalize email
    REGEXP_REPLACE(phone, '[^0-9]', ''),          -- Strip non-numeric from phone
    CONCAT(UPPER(LEFT(first_name, 1)), SUBSTRING(first_name, 2), ' ',
           UPPER(LEFT(last_name, 1)), SUBSTRING(last_name, 2))  -- Title case name
FROM RawCustomerData;
```

**Date and Format Conversion:**

```sql
-- Transform date formats and compute derived columns
INSERT INTO OrderAnalytics (order_id, order_date, order_month, days_since_order)
SELECT 
    order_id,
    order_date,
    DATE_FORMAT(order_date, '%Y-%m'),              -- Extract month
    DATEDIFF(CURDATE(), order_date)                -- Calculate age
FROM Orders;
```

**Computed Values:**

```sql
-- Insert with calculated fields
INSERT INTO ProductPricing (product_id, base_price, tax_amount, total_price)
SELECT 
    product_id,
    base_price,
    base_price * 0.08,                             -- Compute tax
    base_price * 1.08                              -- Compute total
FROM Products;
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n × f) - includes function evaluation overhead per row |
| Space | O(k) - buffer for transformed results |

### Approach 3: INSERT SELECT with Joins - Combined Sources

Combine data from multiple tables using JOINs before inserting into a target table, creating denormalized or pre-joined datasets.

#### Algorithm

1. Identify all source tables needed for the join
2. Determine join conditions between tables
3. Select columns from multiple tables in SELECT clause
4. Ensure target table columns match the joined result structure
5. Consider using LEFT JOIN to preserve all records

#### Implementation

**Problem: Product Sales Analysis (SQL-1070) - Combined insertion**

```sql
-- Create denormalized sales report table
INSERT INTO SalesReport (product_name, category, total_sales, total_quantity)
SELECT 
    p.product_name,
    c.category_name,
    SUM(s.amount) AS total_sales,
    SUM(s.quantity) AS total_quantity
FROM Sales s
INNER JOIN Products p ON s.product_id = p.product_id
INNER JOIN Categories c ON p.category_id = c.category_id
GROUP BY p.product_id, c.category_id;
```

**Pre-Joined Data Table:**

```sql
-- Create enriched order details table
INSERT INTO OrderDetailsEnriched (order_id, customer_name, product_name, quantity, unit_price, total)
SELECT 
    o.order_id,
    CONCAT(c.first_name, ' ', c.last_name) AS customer_name,
    p.product_name,
    oi.quantity,
    oi.unit_price,
    oi.quantity * oi.unit_price AS total
FROM Orders o
INNER JOIN Customers c ON o.customer_id = c.customer_id
INNER JOIN OrderItems oi ON o.order_id = oi.order_id
INNER JOIN Products p ON oi.product_id = p.product_id;
```

**Left Join to Preserve All Records:**

```sql
-- Insert all employees with optional department info
INSERT INTO EmployeeDirectory (employee_id, name, department, manager)
SELECT 
    e.employee_id,
    e.name,
    COALESCE(d.department_name, 'Unassigned'),
    COALESCE(m.name, 'No Manager')
FROM Employees e
LEFT JOIN Departments d ON e.department_id = d.department_id
LEFT JOIN Employees m ON e.manager_id = m.employee_id;
```

**Multi-Table Data Integration:**

```sql
-- Integrate data from multiple sources into unified table
INSERT INTO UnifiedInventory (item_id, warehouse_location, stock_level, last_movement)
SELECT 
    w.item_id,
    w.location,
    w.quantity_on_hand,
    COALESCE(r.received_date, s.shipped_date, w.last_updated)
FROM WarehouseStock w
LEFT JOIN ReceivingLog r ON w.item_id = r.item_id
LEFT JOIN ShippingLog s ON w.item_id = s.item_id;
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n × m) - join complexity depends on table sizes and indexes |
| Space | O(k) - buffer for joined results |

### Approach 4: INSERT SELECT with Aggregation - Summarized Data

Insert aggregated summaries into a target table, useful for creating pre-computed analytics tables or data warehouse fact tables.

#### Algorithm

1. Define grouping criteria for aggregation (GROUP BY columns)
2. Choose appropriate aggregate functions (SUM, COUNT, AVG, etc.)
3. Map aggregated results to target table columns
4. Consider using HAVING to filter aggregated groups
5. Handle large datasets with batch processing if needed

#### Implementation

**Problem: Department Top Three Salaries (SQL-185) - Aggregation for ranking**

```sql
-- Create salary summary by department
INSERT INTO DepartmentSalarySummary (department_id, dept_name, emp_count, total_salary, avg_salary, max_salary)
SELECT 
    d.department_id,
    d.department_name,
    COUNT(*) AS emp_count,
    SUM(e.salary) AS total_salary,
    AVG(e.salary) AS avg_salary,
    MAX(e.salary) AS max_salary
FROM Employees e
INNER JOIN Departments d ON e.department_id = d.department_id
GROUP BY d.department_id, d.department_name;
```

**Daily Aggregations:**

```sql
-- Create daily metrics table from transaction data
INSERT INTO DailyMetrics (metric_date, total_transactions, total_revenue, unique_customers)
SELECT 
    DATE(transaction_date) AS metric_date,
    COUNT(*) AS total_transactions,
    SUM(amount) AS total_revenue,
    COUNT(DISTINCT customer_id) AS unique_customers
FROM Transactions
GROUP BY DATE(transaction_date);
```

**Rolling Window Aggregation:**

```sql
-- Insert 7-day rolling averages into analytics table
INSERT INTO RollingMetrics (metric_date, avg_sales, total_orders)
SELECT 
    DATE(order_date) AS metric_date,
    AVG(daily_sales) OVER (
        ORDER BY DATE(order_date)
        ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
    ) AS avg_sales,
    SUM(daily_orders) OVER (
        ORDER BY DATE(order_date)
        ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
    ) AS total_orders
FROM (
    SELECT 
        order_date,
        SUM(order_total) AS daily_sales,
        COUNT(*) AS daily_orders
    FROM Orders
    GROUP BY DATE(order_date)
) daily_summary;
```

**Top N Per Group:**

```sql
-- Insert top 3 products by sales per category
INSERT INTO TopProductsByCategory (category_id, product_id, product_name, sales_rank, total_sales)
SELECT 
    category_id,
    product_id,
    product_name,
    sales_rank,
    total_sales
FROM (
    SELECT 
        p.category_id,
        p.product_id,
        p.product_name,
        SUM(s.amount) AS total_sales,
        RANK() OVER (
            PARTITION BY p.category_id 
            ORDER BY SUM(s.amount) DESC
        ) AS sales_rank
    FROM Products p
    INNER JOIN Sales s ON p.product_id = s.product_id
    GROUP BY p.category_id, p.product_id, p.product_name
) ranked
WHERE sales_rank <= 3;
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n log n) - aggregation requires sorting/grouping |
| Space | O(g) - where g is number of groups |

## Complexity Analysis

| Approach | Time | Space | Best For |
|----------|------|-------|----------|
| Basic INSERT SELECT | O(n) | O(k) | **Recommended** - simple data copying |
| With Transformation | O(n × f) | O(k) | Data cleaning and format conversion |
| With Joins | O(n × m) | O(k) | Creating denormalized tables |
| With Aggregation | O(n log n) | O(g) | Analytics and summary tables |

## Related Problems

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| Product Sales Analysis I | 1068 | Easy | Basic JOIN with aggregation |
| Product Sales Analysis II | 1069 | Easy | Simple aggregation and INSERT pattern |
| Customers Who Bought All Products | 1045 | Medium | Complex aggregation with grouping |
| Department Top Three Salaries | 185 | Hard | Ranking with aggregation |
| Game Play Analysis IV | 534 | Medium | Running totals with conditional logic |
| Rising Temperature | 197 | Easy | Self-join with date comparison |
| Duplicate Emails | 196 | Easy | Subquery-based filtering |
| Second Highest Salary | 176 | Medium | Aggregation with subqueries |

## Key Takeaways

- **Column order matters**: SELECT columns must align with INSERT column order (or use explicit column lists)
- **Type compatibility**: Ensure source and target columns have compatible data types
- **Set-based efficiency**: INSERT SELECT is dramatically faster than row-by-row inserts
- **Transformation power**: Can filter, join, aggregate, and compute in a single statement
- **Transaction safety**: INSERT SELECT is atomic - all rows succeed or fail together
- **Constraints apply**: Target table constraints (UNIQUE, NOT NULL, FK) are enforced during insert
- **SELECT can be complex**: Subqueries, CTEs, window functions, and any valid SELECT works

## Common Pitfalls

1. **Column count mismatch**: SELECT returns 5 columns but INSERT expects 4
2. **Column order mismatch**: Values go into wrong columns due to misaligned ordering
3. **Type incompatibility**: Trying to insert text into numeric columns or dates into strings
4. **Constraint violations**: Duplicate keys for UNIQUE/PRIMARY KEY, violating NOT NULL constraints
5. **Foreign key failures**: Referenced values don't exist in parent tables
6. **Large transaction issues**: Inserting millions of rows may exceed memory or lock timeouts
7. **Missing WHERE clause**: Accidentally copying entire source table instead of filtered subset
8. **Not handling NULLs**: NULL source values may violate target NOT NULL constraints

## INSERT SELECT Variations

| Variation | Syntax | Use Case |
|-----------|--------|----------|
| Basic | `INSERT INTO t (cols) SELECT cols FROM source` | Simple copy |
| With WHERE | `INSERT ... SELECT ... WHERE condition` | Filtered copy |
| With JOIN | `INSERT ... SELECT ... FROM a JOIN b` | Multi-table source |
| With GROUP BY | `INSERT ... SELECT ... GROUP BY cols` | Aggregated insert |
| With CTE | `WITH cte AS (...) INSERT ... SELECT FROM cte` | Complex preprocessing |
| INSERT IGNORE | `INSERT IGNORE INTO ... SELECT` | Skip constraint violations |
| REPLACE | `REPLACE INTO ... SELECT` | Update existing, insert new |

## Pattern Source

[Insert from Query Results](sql/insert-from-query-results.md)
