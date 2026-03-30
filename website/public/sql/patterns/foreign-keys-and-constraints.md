# Foreign Keys and Constraints

## Problem Description

The Foreign Keys and Constraints pattern ensures data integrity by establishing and enforcing relationships between tables. Foreign keys prevent orphaned records by requiring that referenced values exist in the parent table, while additional constraints (CHECK, UNIQUE, NOT NULL) enforce business rules at the database level.

### Key Characteristics

| Characteristic | Description |
|----------------|-------------|
| Time Complexity | O(1) - O(log n) for FK validation with index |
| Space Complexity | O(1) - minimal overhead per constraint |
| Input | Parent and child tables, relationship definitions |
| Output | Validated data or constraint violation error |
| Approach | Define → Validate → Enforce → Cascade |

### When to Use

- **Relationship validation**: Ensuring every child record has a valid parent (e.g., orders must have valid customers)
- **Existence checks**: Preventing references to non-existent records before inserts/updates
- **Constraint enforcement**: Enforcing business rules (CHECK constraints for valid ranges)
- **Cascading operations**: Automatically updating or deleting related records
- **Data consistency**: Maintaining referential integrity across related tables

## Intuition

The key insight is **declarative integrity enforcement**. Instead of writing application code to check if a referenced record exists, the database enforces this automatically through constraints.

The "aha!" moments:

1. **Constraints define relationships**: FKs are not just columns—they are enforced connections between tables
2. **NULL FK is allowed**: A nullable foreign key column allows "no relationship" state
3. **Cascading effects**: ON DELETE CASCADE removes children when parent is deleted; ON UPDATE CASCADE propagates key changes
4. **Deferrable constraints**: Some databases allow deferring FK checks until transaction commit
5. **Composite FKs**: Foreign keys can span multiple columns for complex relationships

## Solution Approaches

### Approach 1: Foreign Key Validation - Check Referenced Exists ✅ Recommended

Use foreign keys to ensure that references to parent tables always point to existing records.

#### Algorithm

1. Identify the parent table (referenced) and child table (referencing)
2. Ensure the parent has a primary key or unique constraint
3. Add foreign key column(s) to the child table
4. Create FOREIGN KEY constraint referencing parent's key
5. Choose appropriate ON DELETE/UPDATE actions

#### Implementation

**Basic Foreign Key Definition:**

```sql
-- Parent table
CREATE TABLE Departments (
    dept_id INT PRIMARY KEY,
    dept_name VARCHAR(50) NOT NULL
);

-- Child table with foreign key
CREATE TABLE Employees (
    emp_id INT PRIMARY KEY,
    emp_name VARCHAR(50) NOT NULL,
    dept_id INT,
    FOREIGN KEY (dept_id) REFERENCES Departments(dept_id)
);
```

**Problem: Product Sales Analysis (SQL-1280)**

```sql
-- Ensure sales reference valid products
CREATE TABLE Sales (
    sale_id INT PRIMARY KEY,
    product_id INT NOT NULL,
    quantity INT CHECK (quantity > 0),
    sale_date DATE,
    FOREIGN KEY (product_id) REFERENCES Products(product_id)
);

-- Query to find orphaned records (should return none with proper FK)
SELECT s.*
FROM Sales s
LEFT JOIN Products p ON s.product_id = p.product_id
WHERE p.product_id IS NULL;
```

**Multiple Foreign Keys - Junction Tables:**

```sql
-- Many-to-many relationship with dual FKs
CREATE TABLE StudentCourses (
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    enrollment_date DATE DEFAULT CURRENT_DATE,
    PRIMARY KEY (student_id, course_id),
    FOREIGN KEY (student_id) REFERENCES Students(student_id),
    FOREIGN KEY (course_id) REFERENCES Courses(course_id)
);
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(log n) with index on FK column |
| Space | O(1) per constraint |

### Approach 2: Self-Referencing FKs - Hierarchical Data

Create foreign keys within the same table to model parent-child hierarchies like organizational charts.

#### Algorithm

1. Add a nullable column for parent reference in the same table
2. Create self-referencing foreign key constraint
3. Ensure root nodes have NULL parent_id
4. Prevent circular references with application logic or triggers

#### Implementation

**Problem: Manager-Employee Hierarchy (SQL-1341)**

```sql
-- Self-referencing foreign key for org chart
CREATE TABLE Employees (
    emp_id INT PRIMARY KEY,
    emp_name VARCHAR(50) NOT NULL,
    manager_id INT,
    department VARCHAR(50),
    salary DECIMAL(10,2),
    FOREIGN KEY (manager_id) REFERENCES Employees(emp_id)
);

-- Query to validate hierarchy (find employees with invalid managers)
SELECT e.emp_id, e.emp_name, e.manager_id
FROM Employees e
LEFT JOIN Employees m ON e.manager_id = m.emp_id
WHERE e.manager_id IS NOT NULL
  AND m.emp_id IS NULL;

-- Find all subordinates recursively (MySQL 8.0+, PostgreSQL)
WITH RECURSIVE Subordinates AS (
    SELECT emp_id, emp_name, manager_id, 0 AS level
    FROM Employees
    WHERE manager_id = 1  -- Starting manager
    
    UNION ALL
    
    SELECT e.emp_id, e.emp_name, e.manager_id, s.level + 1
    FROM Employees e
    INNER JOIN Subordinates s ON e.manager_id = s.emp_id
)
SELECT * FROM Subordinates;
```

**Hierarchical Data with Level Validation:**

```sql
-- Prevent too deep nesting with CHECK constraint
CREATE TABLE Categories (
    category_id INT PRIMARY KEY,
    category_name VARCHAR(50) NOT NULL,
    parent_category_id INT,
    hierarchy_level INT DEFAULT 0 CHECK (hierarchy_level BETWEEN 0 AND 5),
    FOREIGN KEY (parent_category_id) REFERENCES Categories(category_id)
);
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(log n) per lookup, O(n) for hierarchy traversal |
| Space | O(n) for recursive queries |

### Approach 3: Composite Key Relationships - Multi-Column FKs

Use foreign keys that reference composite primary keys for complex relationship models.

#### Algorithm

1. Identify composite key in parent table (multiple columns forming PK)
2. Create matching column set in child table
3. Define composite foreign key referencing all PK columns
4. Maintain column order consistency between tables

#### Implementation

**Problem: Sales Analysis (SQL-1378)**

```sql
-- Parent table with composite primary key
CREATE TABLE Inventory (
    warehouse_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity_available INT DEFAULT 0,
    unit_cost DECIMAL(10,2),
    PRIMARY KEY (warehouse_id, product_id)
);

-- Child table with composite foreign key
CREATE TABLE Shipments (
    shipment_id INT PRIMARY KEY,
    warehouse_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity_shipped INT CHECK (quantity_shipped > 0),
    ship_date DATE,
    FOREIGN KEY (warehouse_id, product_id) 
        REFERENCES Inventory(warehouse_id, product_id)
);

-- Query to find shipments referencing invalid inventory
SELECT s.*
FROM Shipments s
LEFT JOIN Inventory i 
    ON s.warehouse_id = i.warehouse_id 
    AND s.product_id = i.product_id
WHERE i.warehouse_id IS NULL;

-- Check if shipment quantity exceeds available inventory
SELECT 
    s.shipment_id,
    s.quantity_shipped,
    i.quantity_available,
    CASE 
        WHEN s.quantity_shipped > i.quantity_available THEN 'Insufficient'
        ELSE 'OK'
    END AS stock_status
FROM Shipments s
INNER JOIN Inventory i 
    ON s.warehouse_id = i.warehouse_id 
    AND s.product_id = i.product_id;
```

**Multi-Table Composite Relationships:**

```sql
-- Enrollment with composite FK to section
CREATE TABLE CourseSections (
    course_id INT NOT NULL,
    semester VARCHAR(10) NOT NULL,
    section_num INT NOT NULL,
    instructor_id INT,
    PRIMARY KEY (course_id, semester, section_num)
);

CREATE TABLE Enrollments (
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    semester VARCHAR(10) NOT NULL,
    section_num INT NOT NULL,
    enrollment_date DATE,
    PRIMARY KEY (student_id, course_id, semester, section_num),
    FOREIGN KEY (course_id, semester, section_num) 
        REFERENCES CourseSections(course_id, semester, section_num)
);
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(log n) per composite key lookup |
| Space | O(k) - k columns in composite key |

### Approach 4: Existence Verification - Before Operations

Explicitly check for referenced record existence before performing inserts or updates when FKs aren't available.

#### Algorithm

1. Query parent table to verify referenced key exists
2. Perform insert/update only if verification passes
3. Use transactions to ensure atomicity
4. Handle violations gracefully

#### Implementation

**Explicit Existence Check:**

```sql
-- Check if customer exists before creating order
SELECT CASE 
    WHEN EXISTS (
        SELECT 1 FROM Customers 
        WHERE customer_id = @new_customer_id
    ) THEN 'Valid'
    ELSE 'Invalid - Customer does not exist'
END AS validation_result;

-- Safe insert with existence verification
INSERT INTO Orders (order_id, customer_id, order_date)
SELECT @new_order_id, @customer_id, CURRENT_DATE
WHERE EXISTS (
    SELECT 1 FROM Customers WHERE customer_id = @customer_id
);
```

**Problem: Product Sales Analysis (SQL-1280) - Validation Query**

```sql
-- Verify all sales have valid products before analysis
WITH ValidSales AS (
    SELECT s.*
    FROM Sales s
    WHERE EXISTS (
        SELECT 1 FROM Products p 
        WHERE p.product_id = s.product_id
    )
)
SELECT 
    product_id,
    SUM(quantity) AS total_sold,
    SUM(quantity * unit_price) AS total_revenue
FROM ValidSales
GROUP BY product_id;

-- Identify invalid foreign key references
SELECT 
    s.product_id,
    COUNT(*) AS invalid_sales_count
FROM Sales s
WHERE NOT EXISTS (
    SELECT 1 FROM Products p 
    WHERE p.product_id = s.product_id
)
GROUP BY s.product_id;
```

**Batch Validation with Temporary Tables:**

```sql
-- Stage data before insertion with validation
CREATE TEMPORARY TABLE StagingOrders AS
SELECT * FROM ImportOrders;

-- Identify invalid references
SELECT DISTINCT customer_id
FROM StagingOrders s
WHERE NOT EXISTS (
    SELECT 1 FROM Customers c 
    WHERE c.customer_id = s.customer_id
);

-- Insert only valid records
INSERT INTO Orders (order_id, customer_id, order_date)
SELECT order_id, customer_id, order_date
FROM StagingOrders s
WHERE EXISTS (
    SELECT 1 FROM Customers c 
    WHERE c.customer_id = s.customer_id
);
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n × log m) - n child records, m parent records |
| Space | O(n) for staging/temporary storage |

## Complexity Analysis

| Approach | Time | Space | Best For |
|----------|------|-------|----------|
| Foreign Key Validation | O(log n) | O(1) | **Recommended** - automatic integrity enforcement |
| Self-Referencing FKs | O(log n) | O(n) | Hierarchical data, org charts |
| Composite Key Relationships | O(log n) | O(k) | Multi-part keys, complex relationships |
| Existence Verification | O(n × log m) | O(n) | Legacy systems without FK constraints |

## Related Problems

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| Product Sales Analysis I | 1280 | Easy | Join with product validation |
| Movie Rating Analysis | 1341 | Medium | User-movie rating relationships |
| Sales Analysis I | 1378 | Medium | Multi-table integrity |
| Customers Who Never Order | 183 | Easy | Existence verification pattern |
| Delete Duplicate Emails | 196 | Easy | Self-reference constraint |
| Rising Temperature | 197 | Easy | Time-series constraint check |
| Second Highest Salary | 176 | Medium | Constraint-based filtering |

## Key Takeaways

- **Declarative enforcement**: FKs enforce integrity at the database level, not application level
- **Index requirement**: FK columns should be indexed for performance
- **NULL handling**: Nullable FK columns allow optional relationships
- **Cascade options**: ON DELETE CASCADE, SET NULL, RESTRICT control behavior on parent deletion
- **Transaction safety**: FK violations fail the entire transaction, ensuring atomicity
- **Composite support**: FKs can span multiple columns matching composite PKs
- **Self-reference**: Tables can reference themselves for hierarchical data

## Common Pitfalls

1. **Missing indexes on FK columns**: Severe performance impact on large tables
2. **Orphaned records without FKs**: Data integrity issues when constraints aren't enforced
3. **Circular dependencies**: Self-referencing FKs can create circular references in hierarchies
4. **Cascading deletes**: ON DELETE CASCADE can unintentionally remove large amounts of data
5. **Data type mismatch**: FK and referenced PK must have identical data types
6. **Order of operations**: Cannot insert child before parent exists
7. **Nullable FK confusion**: NULL means "no relationship," not "invalid relationship"
8. **Deferred constraints**: Not all databases support deferring FK checks within transactions

## Constraint Action Comparison

| ON DELETE | Behavior | Use Case |
|-----------|----------|----------|
| CASCADE | Delete child rows | When children shouldn't exist without parent |
| SET NULL | Set FK to NULL | When child can exist without parent reference |
| RESTRICT | Prevent parent deletion | When parent deletion should be blocked with children |
| NO ACTION | Same as RESTRICT | Default behavior, explicit prevention |

## Pattern Source

[Foreign Keys and Constraints](sql/foreign-keys-and-constraints.md)
