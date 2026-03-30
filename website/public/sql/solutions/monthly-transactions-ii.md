# 1205. Monthly Transactions II

## Problem

Write an SQL query to find for each month and country, the number of approved transactions and their total amount, the number of chargebacks and their total amount.

### Schema

**Transactions Table:**
| Column Name | Type    | Description |
|-------------|---------|-------------|
| id          | int     | Primary Key, Transaction ID |
| country     | varchar | Country where transaction occurred |
| state       | varchar | Transaction state: 'approved' or 'declined' |
| amount      | int     | Transaction amount |
| trans_date  | date    | Transaction date |

**Chargebacks Table:**
| Column Name | Type    | Description |
|-------------|---------|-------------|
| trans_id    | int     | Foreign Key to Transactions.id |
| trans_date  | date    | Date of the chargeback |

### Requirements

- Return: month, country, approved_count, approved_amount, chargeback_count, chargeback_amount
- Month format: YYYY-MM
- Only count approved transactions (state = 'approved')
- Chargebacks reference original transactions via trans_id
- Include months and countries that appear in either table
- Sort by month, then country

**Example Logic:**
- A transaction approved in January might be charged back in February
- The approved count goes in January, the chargeback count goes in February
- Use the transaction's country for both approved and chargeback reports

## Approaches

### Approach 1: UNION ALL with Aggregation (Recommended)

Combine approved transactions and chargebacks into a single dataset with unified columns, then aggregate.

#### Algorithm

1. SELECT approved transactions with type='approved', month from trans_date
2. UNION ALL with chargebacks joined to transactions, type='chargeback', month from chargebacks.trans_date
3. GROUP BY month and country
4. Use conditional aggregation (SUM/COUNT with CASE) to separate approved and chargeback metrics

#### Implementation

```sql
SELECT 
    month,
    country,
    SUM(CASE WHEN type = 'approved' THEN 1 ELSE 0 END) AS approved_count,
    SUM(CASE WHEN type = 'approved' THEN amount ELSE 0 END) AS approved_amount,
    SUM(CASE WHEN type = 'chargeback' THEN 1 ELSE 0 END) AS chargeback_count,
    SUM(CASE WHEN type = 'chargeback' THEN amount ELSE 0 END) AS chargeback_amount
FROM (
    -- Approved transactions
    SELECT 
        DATE_FORMAT(trans_date, '%Y-%m') AS month,
        country,
        amount,
        'approved' AS type
    FROM Transactions
    WHERE state = 'approved'
    
    UNION ALL
    
    -- Chargebacks (join to get country and amount)
    SELECT 
        DATE_FORMAT(c.trans_date, '%Y-%m') AS month,
        t.country,
        t.amount,
        'chargeback' AS type
    FROM Chargebacks c
    JOIN Transactions t ON c.trans_id = t.id
) AS combined
GROUP BY month, country
ORDER BY month, country;
```

#### Time & Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n log n) - due to grouping and sorting |
| Space | O(n + m) - where n=transactions, m=chargebacks |

### Approach 2: Separate CTEs with FULL OUTER JOIN Simulation

Create separate aggregations for approved and chargebacks, then join them together.

#### Algorithm

1. CTE for approved aggregation: GROUP BY month, country
2. CTE for chargeback aggregation: GROUP BY month, country
3. Use COALESCE with LEFT JOIN from both sides to simulate FULL OUTER JOIN
4. Combine results with UNION for rows that exist in only one table

#### Implementation

```sql
WITH ApprovedSummary AS (
    SELECT 
        DATE_FORMAT(trans_date, '%Y-%m') AS month,
        country,
        COUNT(*) AS approved_count,
        SUM(amount) AS approved_amount
    FROM Transactions
    WHERE state = 'approved'
    GROUP BY DATE_FORMAT(trans_date, '%Y-%m'), country
),
ChargebackSummary AS (
    SELECT 
        DATE_FORMAT(c.trans_date, '%Y-%m') AS month,
        t.country,
        COUNT(*) AS chargeback_count,
        SUM(t.amount) AS chargeback_amount
    FROM Chargebacks c
    JOIN Transactions t ON c.trans_id = t.id
    GROUP BY DATE_FORMAT(c.trans_date, '%Y-%m'), t.country
),
AllMonths AS (
    SELECT month, country FROM ApprovedSummary
    UNION
    SELECT month, country FROM ChargebackSummary
)
SELECT 
    a.month,
    a.country,
    COALESCE(ap.approved_count, 0) AS approved_count,
    COALESCE(ap.approved_amount, 0) AS approved_amount,
    COALESCE(cb.chargeback_count, 0) AS chargeback_count,
    COALESCE(cb.chargeback_amount, 0) AS chargeback_amount
FROM AllMonths a
LEFT JOIN ApprovedSummary ap 
    ON a.month = ap.month AND a.country = ap.country
LEFT JOIN ChargebackSummary cb 
    ON a.month = cb.month AND a.country = cb.country
ORDER BY a.month, a.country;
```

#### Time & Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n log n) - multiple aggregations and joins |
| Space | O(k) - where k is number of unique month/country combinations |

### Approach 3: Window Functions with COALESCE

Use window functions to handle missing data and simplify the aggregation.

#### Algorithm

1. Create base table of all month/country combinations from both sources
2. Use window functions or subqueries to calculate counts
3. COALESCE to handle NULL values where one type doesn't exist

#### Implementation

```sql
WITH AllData AS (
    -- All approved transactions
    SELECT 
        DATE_FORMAT(trans_date, '%Y-%m') AS month,
        country,
        amount,
        1 AS is_approved,
        0 AS is_chargeback
    FROM Transactions
    WHERE state = 'approved'
    
    UNION ALL
    
    -- All chargebacks
    SELECT 
        DATE_FORMAT(c.trans_date, '%Y-%m') AS month,
        t.country,
        t.amount,
        0 AS is_approved,
        1 AS is_chargeback
    FROM Chargebacks c
    JOIN Transactions t ON c.trans_id = t.id
)
SELECT 
    month,
    country,
    SUM(is_approved) AS approved_count,
    SUM(CASE WHEN is_approved = 1 THEN amount ELSE 0 END) AS approved_amount,
    SUM(is_chargeback) AS chargeback_count,
    SUM(CASE WHEN is_chargeback = 1 THEN amount ELSE 0 END) AS chargeback_amount
FROM AllData
GROUP BY month, country
ORDER BY month, country;
```

#### Time & Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n log n) - union all and grouping |
| Space | O(n + m) - combined dataset |

## Solution Analysis

| Approach | Time | Space | Pros | Cons |
|----------|------|-------|------|------|
| UNION ALL with Aggregation | O(n log n) | O(n + m) | Clean, single scan per table | Requires handling union order |
| CTEs with JOIN | O(n log n) | O(k) | Modular, easy to debug | More verbose, three CTEs |
| Window Functions | O(n log n) | O(n + m) | Simple conditional sum | Slightly less intuitive flags |

**Recommended:** Approach 1 (UNION ALL with Aggregation) - most straightforward and maintainable.

## Final Solution

```sql
SELECT 
    month,
    country,
    SUM(CASE WHEN type = 'approved' THEN 1 ELSE 0 END) AS approved_count,
    SUM(CASE WHEN type = 'approved' THEN amount ELSE 0 END) AS approved_amount,
    SUM(CASE WHEN type = 'chargeback' THEN 1 ELSE 0 END) AS chargeback_count,
    SUM(CASE WHEN type = 'chargeback' THEN amount ELSE 0 END) AS chargeback_amount
FROM (
    -- Approved transactions
    SELECT 
        DATE_FORMAT(trans_date, '%Y-%m') AS month,
        country,
        amount,
        'approved' AS type
    FROM Transactions
    WHERE state = 'approved'
    
    UNION ALL
    
    -- Chargebacks
    SELECT 
        DATE_FORMAT(c.trans_date, '%Y-%m') AS month,
        t.country,
        t.amount,
        'chargeback' AS type
    FROM Chargebacks c
    JOIN Transactions t ON c.trans_id = t.id
) AS combined
GROUP BY month, country
ORDER BY month, country;
```

### Key Concepts

- **UNION ALL**: Combines rows from both sources without deduplication (preserves all records)
- **Conditional Aggregation**: `SUM(CASE WHEN type = 'x' THEN 1 ELSE 0 END)` counts only rows matching condition
- **DATE_FORMAT**: Formats date as 'YYYY-MM' for monthly grouping
- **JOIN for Chargebacks**: Must join Chargebacks to Transactions to get country and amount
- **COALESCE**: Handles cases where a month/country has only approved or only chargeback transactions

### Notes

- Different date sources: approved uses Transactions.trans_date, chargebacks uses Chargebacks.trans_date
- Country comes from Transactions table for both types
- UNION ALL is used instead of UNION to preserve all rows (no deduplication needed)
- Some months may have 0 approved or 0 chargeback - COALESCE handles this in alternative approaches
- For databases without DATE_FORMAT, use equivalent: `TO_CHAR(trans_date, 'YYYY-MM')` (PostgreSQL/Oracle) or `FORMAT(trans_date, 'yyyy-MM')` (SQL Server)
