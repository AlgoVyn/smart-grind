# 1484. Group Sold Products By The Date

## Problem

**LeetCode 1484 - Easy**

Write a solution to find, for each date, the products sold in alphabetical order separated by comma.

**Schema:**
- `Activities(SellDate, Product)`
  - Primary key: `(SellDate, Product)`
  - `SellDate`: Date when the product was sold
  - `Product`: Name of the product sold on that date

**Example Input:**
```
+------------+------------+
| SellDate   | Product    |
+------------+------------+
| 2020-05-01 | Apple      |
| 2020-05-01 | Banana     |
| 2020-05-02 | Orange     |
| 2020-05-02 | Apple      |
| 2020-05-03 | Apple      |
| 2020-05-03 | Banana     |
| 2020-05-03 | Orange     |
+------------+------------+
```

**Example Output:**
```
+------------+----------+-----------------------------+
| SellDate   | NumSold  | Products                    |
+------------+----------+-----------------------------+
| 2020-05-01 | 2        | Apple,Banana                |
| 2020-05-02 | 2        | Apple,Orange                |
| 2020-05-03 | 3        | Apple,Banana,Orange         |
+------------+----------+-----------------------------+
```

---

## Approaches

### Approach 1: GROUP_CONCAT with GROUP BY (MySQL - Recommended)

Use `GROUP_CONCAT` function to aggregate products into a comma-separated string, ordered alphabetically.

```sql
SELECT 
    SellDate,
    COUNT(DISTINCT Product) AS NumSold,
    GROUP_CONCAT(DISTINCT Product ORDER BY Product ASC SEPARATOR ',') AS Products
FROM Activities
GROUP BY SellDate
ORDER BY SellDate;
```

**How it works:**
- `GROUP BY SellDate` groups all records by date
- `COUNT(DISTINCT Product)` counts unique products sold per date
- `GROUP_CONCAT(DISTINCT Product ORDER BY Product ASC SEPARATOR ',')` concatenates distinct products in alphabetical order with comma separator
- `ORDER BY SellDate` ensures results are sorted chronologically

**Time Complexity:** O(n log n) due to sorting by SellDate and ordering products  
**Space Complexity:** O(n) for the aggregated result

---

### Approach 2: STRING_AGG (PostgreSQL/SQL Server 2017+)

Modern SQL databases provide `STRING_AGG` for string aggregation.

```sql
SELECT 
    SellDate,
    COUNT(DISTINCT Product) AS NumSold,
    STRING_AGG(DISTINCT Product, ',' ORDER BY Product ASC) AS Products
FROM Activities
GROUP BY SellDate
ORDER BY SellDate;
```

**How it works:**
- `STRING_AGG(expression, separator ORDER BY ...)` aggregates strings with built-in ordering
- `DISTINCT` ensures no duplicate products appear
- The ordering is done within the aggregation function itself

**Time Complexity:** O(n log n)  
**Space Complexity:** O(n)

---

### Approach 3: FOR XML PATH (SQL Server pre-2017)

For older SQL Server versions, use XML path technique for string aggregation.

```sql
SELECT 
    SellDate,
    NumSold,
    STUFF((SELECT ',' + Product 
           FROM (SELECT DISTINCT Product FROM Activities a2 WHERE a2.SellDate = a1.SellDate) sub
           ORDER BY Product
           FOR XML PATH('')), 1, 1, '') AS Products
FROM (
    SELECT SellDate, COUNT(DISTINCT Product) AS NumSold
    FROM Activities
    GROUP BY SellDate
) a1
ORDER BY SellDate;
```

**How it works:**
- `FOR XML PATH('')` concatenates rows into a single XML string
- `STUFF(..., 1, 1, '')` removes the leading comma
- Correlated subquery groups products by each date
- `DISTINCT` inside the subquery prevents duplicates

**Time Complexity:** O(n²) in worst case due to correlated subquery  
**Space Complexity:** O(n)

---

## Solution Analysis

| Approach | Database | Time Complexity | Space Complexity | Pros | Cons |
|----------|----------|-----------------|------------------|------|------|
| GROUP_CONCAT | MySQL | O(n log n) | O(n) | Built-in ordering, clean syntax | MySQL-specific |
| STRING_AGG | PostgreSQL, SQL Server 2017+ | O(n log n) | O(n) | Standard SQL, efficient | Not available in older versions |
| FOR XML PATH | SQL Server (all) | O(n²) | O(n) | Works in all SQL Server versions | Complex syntax, slower |

**Key Observations:**
- String aggregation functions vary significantly across database systems
- Always use `DISTINCT` to avoid duplicate products in the output
- Ordering within the aggregation ensures alphabetical product listing as required
- `COUNT(DISTINCT Product)` gives the accurate count of unique products

---

## Final Solution

### Recommended: GROUP_CONCAT Approach (MySQL)

```sql
SELECT 
    SellDate,
    COUNT(DISTINCT Product) AS NumSold,
    GROUP_CONCAT(DISTINCT Product ORDER BY Product ASC SEPARATOR ',') AS Products
FROM Activities
GROUP BY SellDate
ORDER BY SellDate;
```

### Alternative: STRING_AGG (PostgreSQL/SQL Server 2017+)

```sql
SELECT 
    SellDate,
    COUNT(DISTINCT Product) AS NumSold,
    STRING_AGG(DISTINCT Product, ',' ORDER BY Product ASC) AS Products
FROM Activities
GROUP BY SellDate
ORDER BY SellDate;
```

**Explanation:**
1. `GROUP BY SellDate` groups all sales by date
2. `COUNT(DISTINCT Product)` calculates the number of unique products sold per date
3. String aggregation function (`GROUP_CONCAT` or `STRING_AGG`) combines product names:
   - `DISTINCT` ensures each product appears only once per date
   - `ORDER BY Product ASC` sorts products alphabetically
   - Comma separator creates the required output format
4. Final `ORDER BY SellDate` presents results chronologically

**Example Walkthrough:**
- 2020-05-01: Products = [Apple, Banana] → COUNT=2, GROUP_CONCAT="Apple,Banana"
- 2020-05-02: Products = [Orange, Apple] → COUNT=2, GROUP_CONCAT="Apple,Orange" (sorted)
- 2020-05-03: Products = [Apple, Banana, Orange] → COUNT=3, GROUP_CONCAT="Apple,Banana,Orange"

**Result:**
```
+------------+----------+-----------------------------+
| SellDate   | NumSold  | Products                    |
+------------+----------+-----------------------------+
| 2020-05-01 | 2        | Apple,Banana                |
| 2020-05-02 | 2        | Apple,Orange                |
| 2020-05-03 | 3        | Apple,Banana,Orange         |
+------------+----------+-----------------------------+
```
