## Problem

**Rising Temperature**

Table: `Weather`

```
+---------------+---------+
| Column Name   | Type    |
+---------------+---------+
| id            | int     |
| recordDate    | date    |
| temperature   | int     |
+---------------+---------+
```

- `id` is the column with unique values for this table.
- There are no duplicate rows with the same `recordDate`.
- This table contains information about the temperature on a certain day.

Write a solution to find all dates' `id` with higher temperatures compared to its previous dates (yesterday).

**Example:**

Input:
```
+----+------------+-------------+
| id | recordDate | temperature |
+----+------------+-------------+
| 1  | 2015-01-01 | 10          |
| 2  | 2015-01-02 | 25          |
| 3  | 2015-01-03 | 20          |
| 4  | 2015-01-04 | 30          |
+----+------------+-------------+
```

Output:
```
+----+
| id |
+----+
| 2  |
| 4  |
+----+
```

**Explanation:**
- In 2015-01-02, the temperature was higher than the previous day (10 -> 25).
- In 2015-01-04, the temperature was higher than the previous day (20 -> 30).

---

## Approaches

### Approach 1: Self JOIN with DATEDIFF

```sql
SELECT w1.id
FROM Weather w1
JOIN Weather w2 
  ON DATEDIFF(w1.recordDate, w2.recordDate) = 1
WHERE w1.temperature > w2.temperature;
```

**Explanation:**
- Self join the table to compare each date with all other dates
- `DATEDIFF(w1.recordDate, w2.recordDate) = 1` finds pairs where w1 is exactly 1 day after w2
- Filter where w1's temperature is higher than w2's
- Works in MySQL; for PostgreSQL use `w1.recordDate = w2.recordDate + INTERVAL '1 day'`

---

### Approach 2: LAG Window Function

```sql
WITH TempWithPrev AS (
    SELECT id,
           recordDate,
           temperature,
           LAG(temperature) OVER (ORDER BY recordDate) as prev_temp,
           LAG(recordDate) OVER (ORDER BY recordDate) as prev_date
    FROM Weather
)
SELECT id
FROM TempWithPrev
WHERE temperature > prev_temp
  AND DATEDIFF(recordDate, prev_date) = 1;
```

**Explanation:**
- Use `LAG()` window function to get previous day's temperature and date
- Compare current temperature with previous temperature
- Verify the date difference is exactly 1 day (handles gaps in data)
- Most efficient and readable approach

---

### Approach 3: Correlated Subquery

```sql
SELECT w1.id
FROM Weather w1
WHERE w1.temperature > (
    SELECT w2.temperature
    FROM Weather w2
    WHERE w2.recordDate = DATE_SUB(w1.recordDate, INTERVAL 1 DAY)
)
AND EXISTS (
    SELECT 1
    FROM Weather w2
    WHERE w2.recordDate = DATE_SUB(w1.recordDate, INTERVAL 1 DAY)
);
```

**Explanation:**
- For each row, find the temperature from exactly 1 day before using a subquery
- `DATE_SUB` (MySQL) or `recordDate - INTERVAL '1 day'` (PostgreSQL) calculates yesterday
- The `EXISTS` clause ensures we only return rows where a previous day actually exists

---

## Solution Analysis

| Approach | Time Complexity | Space Complexity | Notes |
|----------|----------------|------------------|-------|
| Self JOIN | O(n²) | O(1) | Simple but inefficient for large datasets |
| LAG Window | O(n log n) | O(n) | Most efficient, single table scan with sorting |
| Correlated Subquery | O(n²) | O(1) | Readable but may execute subquery for each row |

- **Self JOIN** works everywhere but can be slow with many rows (n² comparisons)
- **LAG Window** is the most efficient - single pass with window function
- **Correlated Subquery** is intuitive but may have performance issues without proper indexing

---

## Final Solution

```sql
-- MySQL / PostgreSQL with window functions (Recommended)
WITH TempWithPrev AS (
    SELECT id,
           recordDate,
           temperature,
           LAG(temperature) OVER (ORDER BY recordDate) as prev_temp,
           LAG(recordDate) OVER (ORDER BY recordDate) as prev_date
    FROM Weather
)
SELECT id
FROM TempWithPrev
WHERE temperature > prev_temp
  AND recordDate = DATE_ADD(prev_date, INTERVAL 1 DAY);
```

```sql
-- MySQL (without CTE - simpler version)
SELECT w1.id
FROM Weather w1
JOIN Weather w2 
  ON DATEDIFF(w1.recordDate, w2.recordDate) = 1
WHERE w1.temperature > w2.temperature;
```

```sql
-- PostgreSQL syntax
SELECT w1.id
FROM Weather w1
JOIN Weather w2 
  ON w1.recordDate = w2.recordDate + INTERVAL '1 day'
WHERE w1.temperature > w2.temperature;
```
