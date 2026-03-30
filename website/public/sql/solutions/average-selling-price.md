# 1251. Average Selling Price

## Problem

Find the average selling price for each product, weighted by the number of units sold. The price of a product changes over time, so we need to match each purchase to the correct price period.

### Schema

**Prices Table:**
| Column Name | Type    |
|-------------|---------|
| product_id  | int     |
| start_date  | date    |
| end_date    | date    |
| price       | int     |

**UnitsSold Table:**
| Column Name  | Type    |
|--------------|---------|
| product_id   | int     |
| purchase_date| date    |
| units        | int     |

### Requirements

- Match each purchase to the price valid on that purchase_date
- Calculate weighted average: SUM(price * units) / SUM(units)
- Return: product_id, average_price (rounded to 2 decimals)
- If a product has no sales, it should still appear with average_price = 0

**Example:**

Prices:
| product_id | start_date | end_date   | price |
|------------|------------|------------|-------|
| 1          | 2019-02-01 | 2019-02-20 | 5     |
| 1          | 2019-02-21 | 2019-03-31 | 20    |
| 2          | 2019-02-01 | 2019-02-20 | 15    |

UnitsSold:
| product_id | purchase_date | units |
|------------|---------------|-------|
| 1          | 2019-02-25    | 100   |
| 1          | 2019-03-01    | 15    |
| 2          | 2019-02-10    | 10    |
| 2          | 2019-03-22    | 5     |

Result:
| product_id | average_price |
|------------|---------------|
| 1          | 19.13         |
| 2          | 15.00         |

Product 1: (100 * 20 + 15 * 20) / (100 + 15) = 2300 / 115 = 19.13
Product 2: (10 * 15 + 5 * NULL) / 15 = 150 / 15 = 15.00 (price for 2019-03-22 doesn't exist)

## Approaches

### Approach 1: JOIN with Date Range Filter (Recommended)

Join UnitsSold with Prices where purchase_date falls within [start_date, end_date], then calculate weighted average.

#### Algorithm

1. LEFT JOIN UnitsSold with Prices on product_id and date range
2. Group by product_id
3. Calculate weighted average: SUM(price * units) / SUM(units)
4. Handle NULLs for products with no matching prices or no sales

#### Implementation

```sql
SELECT 
    p.product_id,
    IFNULL(
        ROUND(SUM(p.price * u.units) / SUM(u.units), 2),
        0
    ) AS average_price
FROM Prices p
LEFT JOIN UnitsSold u 
    ON p.product_id = u.product_id
    AND u.purchase_date BETWEEN p.start_date AND p.end_date
GROUP BY p.product_id;
```

**Alternative: Products with no sales should appear**

```sql
SELECT 
    p.product_id,
    ROUND(
        COALESCE(SUM(p.price * u.units), 0) / 
        NULLIF(SUM(u.units), 0),
        2
    ) AS average_price
FROM Prices p
LEFT JOIN UnitsSold u 
    ON p.product_id = u.product_id
    AND u.purchase_date BETWEEN p.start_date AND p.end_date
GROUP BY p.product_id

UNION

SELECT 
    product_id,
    0 AS average_price
FROM UnitsSold
WHERE product_id NOT IN (SELECT DISTINCT product_id FROM Prices)
GROUP BY product_id;
```

#### Time & Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n * m) - where n = units, m = price periods per product |
| Space | O(n + m) - intermediate join results |

### Approach 2: Subquery for Price Lookup

Use a correlated subquery or derived table to find the price for each purchase.

#### Algorithm

1. For each UnitsSold record, find the matching price period
2. Calculate weighted sum and total units per product
3. Divide to get average

#### Implementation

```sql
SELECT 
    u.product_id,
    IFNULL(
        ROUND(
            SUM((SELECT p.price 
                 FROM Prices p 
                 WHERE p.product_id = u.product_id 
                   AND u.purchase_date BETWEEN p.start_date AND p.end_date) 
                * u.units
            ) / SUM(u.units),
            2
        ),
        0
    ) AS average_price
FROM UnitsSold u
GROUP BY u.product_id

UNION

SELECT 
    p.product_id,
    0 AS average_price
FROM Prices p
WHERE p.product_id NOT IN (SELECT DISTINCT product_id FROM UnitsSold)
GROUP BY p.product_id;
```

**Cleaner version with explicit price matching:**

```sql
WITH MatchedPrices AS (
    SELECT 
        u.product_id,
        u.units,
        p.price
    FROM UnitsSold u
    LEFT JOIN Prices p 
        ON p.product_id = u.product_id
        AND u.purchase_date BETWEEN p.start_date AND p.end_date
),
Aggregated AS (
    SELECT 
        product_id,
        SUM(price * units) AS total_revenue,
        SUM(units) AS total_units
    FROM MatchedPrices
    GROUP BY product_id
)
SELECT 
    product_id,
    IFNULL(ROUND(total_revenue / total_units, 2), 0) AS average_price
FROM Aggregated

UNION

SELECT 
    product_id,
    0 AS average_price
FROM Prices
WHERE product_id NOT IN (SELECT DISTINCT product_id FROM UnitsSold)
GROUP BY product_id;
```

#### Time & Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n * m) - subquery for each row |
| Space | O(p) - where p = number of unique products |

### Approach 3: Window Functions for Weighted Calculation

Use window functions to calculate the weighted components before aggregation.

#### Algorithm

1. Join tables and calculate price * units per transaction
2. Use window functions to get running totals per product
3. Extract final averages

#### Implementation

```sql
WITH JoinedData AS (
    SELECT 
        p.product_id,
        p.price * u.units AS revenue,
        u.units,
        SUM(p.price * u.units) OVER (PARTITION BY p.product_id) AS total_revenue,
        SUM(u.units) OVER (PARTITION BY p.product_id) AS total_units
    FROM Prices p
    JOIN UnitsSold u 
        ON p.product_id = u.product_id
        AND u.purchase_date BETWEEN p.start_date AND p.end_date
)
SELECT DISTINCT
    product_id,
    ROUND(total_revenue / total_units, 2) AS average_price
FROM JoinedData

UNION

SELECT 
    product_id,
    0 AS average_price
FROM Prices
WHERE product_id NOT IN (
    SELECT DISTINCT p.product_id 
    FROM Prices p
    JOIN UnitsSold u ON p.product_id = u.product_id
)
GROUP BY product_id;
```

#### Time & Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n log n) - due to window function sorting |
| Space | O(n) - window function results |

## Solution Analysis

| Approach | Time | Space | Pros | Cons |
|----------|------|-------|------|------|
| JOIN with Date Filter | O(n*m) | O(n+m) | Clean, straightforward | Can produce large intermediate results |
| Correlated Subquery | O(n²*m) | O(p) | Explicit price lookup | Slow for large datasets |
| Window Functions | O(n log n) | O(n) | Modern SQL style | More complex, overkill for simple aggregation |

**Recommended:** Approach 1 (JOIN with Date Range Filter) - it's the most straightforward and efficient solution.

## Final Solution

```sql
SELECT 
    p.product_id,
    IFNULL(
        ROUND(SUM(p.price * u.units) / SUM(u.units), 2),
        0
    ) AS average_price
FROM Prices p
LEFT JOIN UnitsSold u 
    ON p.product_id = u.product_id
    AND u.purchase_date BETWEEN p.start_date AND p.end_date
GROUP BY p.product_id;
```

**Complete solution handling all edge cases:**

```sql
SELECT 
    p.product_id,
    ROUND(
        COALESCE(SUM(p.price * u.units) / NULLIF(SUM(u.units), 0), 0),
        2
    ) AS average_price
FROM Prices p
LEFT JOIN UnitsSold u 
    ON p.product_id = u.product_id
    AND u.purchase_date BETWEEN p.start_date AND p.end_date
GROUP BY p.product_id;
```

### Key Concepts

- **Weighted Average**: `SUM(price * units) / SUM(units)` not `AVG(price)`
- **Date Range Join**: `BETWEEN start_date AND end_date` matches purchase to correct price period
- **LEFT JOIN**: Ensures all products appear even with no sales
- **IFNULL/COALESCE**: Handle NULL when no matching prices or no units
- **NULLIF**: Prevents division by zero when SUM(units) = 0
