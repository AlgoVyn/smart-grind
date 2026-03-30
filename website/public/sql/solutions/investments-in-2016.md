## Problem

Find the sum of total investment value in 2016 (TIV_2016) for all policyholders who meet BOTH conditions:
1. Have the same TIV_2015 value as one or more other policyholders
2. Have a unique (LAT, LON) location combination (not shared with any other policyholder)

**Schema:**
```
Insurance(PID, TIV_2015, TIV_2016, LAT, LON)
```

**Requirements:**
- Condition 1: TIV_2015 appears in at least 2 records
- Condition 2: (LAT, LON) pair appears in exactly 1 record
- Return sum of TIV_2016 for qualifying records
- Round to 2 decimal places

---

## Approaches

### Approach 1: Window Function with COUNT DISTINCT (Recommended)

```sql
WITH InsuranceStats AS (
    SELECT 
        PID,
        TIV_2015,
        TIV_2016,
        LAT,
        LON,
        COUNT(*) OVER (PARTITION BY TIV_2015) AS tiv_2015_count,
        COUNT(*) OVER (PARTITION BY LAT, LON) AS location_count
    FROM Insurance
)
SELECT 
    ROUND(SUM(TIV_2016), 2) AS TIV_2016
FROM InsuranceStats
WHERE tiv_2015_count >= 2 AND location_count = 1;
```

**Time Complexity:** O(n log n) due to sorting for window functions
**Space Complexity:** O(n) for the CTE

**Pros:**
- Single table scan with window functions
- Clean and readable
- Efficient for large datasets

**Cons:**
- Requires database support for window functions

---

### Approach 2: GROUP BY with HAVING + Subqueries

```sql
SELECT 
    ROUND(SUM(TIV_2016), 2) AS TIV_2016
FROM Insurance i
WHERE TIV_2015 IN (
    SELECT TIV_2015 
    FROM Insurance 
    GROUP BY TIV_2015 
    HAVING COUNT(*) >= 2
)
AND (LAT, LON) IN (
    SELECT LAT, LON 
    FROM Insurance 
    GROUP BY LAT, LON 
    HAVING COUNT(*) = 1
);
```

**Time Complexity:** O(n) for each subquery + O(n) for main query
**Space Complexity:** O(n) for intermediate results

**Why this approach:**
- Uses standard SQL without window functions
- Subqueries clearly express the two conditions

**Cons:**
- Multiple table scans
- Less efficient than window functions

---

### Approach 3: CTE with Filtering Conditions

```sql
WITH TIV2015Counts AS (
    SELECT TIV_2015
    FROM Insurance
    GROUP BY TIV_2015
    HAVING COUNT(*) >= 2
),
UniqueLocations AS (
    SELECT LAT, LON
    FROM Insurance
    GROUP BY LAT, LON
    HAVING COUNT(*) = 1
)
SELECT 
    ROUND(SUM(i.TIV_2016), 2) AS TIV_2016
FROM Insurance i
JOIN TIV2015Counts t ON i.TIV_2015 = t.TIV_2015
JOIN UniqueLocations u ON i.LAT = u.LAT AND i.LON = u.LON;
```

**Time Complexity:** O(n)
**Space Complexity:** O(k + m) where k = distinct TIV_2015, m = distinct locations

**Pros:**
- CTEs make conditions reusable and testable
- JOIN-based filtering can be efficient
- Very readable with named conditions

**Cons:**
- More verbose
- Requires JOIN operations

---

## Solution Analysis

| Approach | Time | Space | Readability | Portability | Performance |
|----------|------|-------|-------------|-------------|-------------|
| Window Function | O(n log n) | O(n) | High | Medium | Excellent |
| GROUP BY + Subqueries | O(n) | O(n) | Medium | High | Good |
| CTE with JOINs | O(n) | O(k+m) | High | High | Good |

**Key Insights:**
1. **Condition 1 (TIV_2015):** Need COUNT >= 2, meaning the value appears in multiple records
2. **Condition 2 (Location):** Need COUNT = 1, meaning unique coordinate pair
3. **Both Conditions:** Must use AND logic - both must be true simultaneously
4. **Rounding:** Use ROUND(SUM(...), 2) for final output format
5. **Window Functions:** COUNT(*) OVER (PARTITION BY col) is the most elegant solution

---

## Final Solution

```sql
WITH InsuranceStats AS (
    SELECT 
        PID,
        TIV_2015,
        TIV_2016,
        LAT,
        LON,
        COUNT(*) OVER (PARTITION BY TIV_2015) AS tiv_2015_count,
        COUNT(*) OVER (PARTITION BY LAT, LON) AS location_count
    FROM Insurance
)
SELECT 
    ROUND(SUM(TIV_2016), 2) AS TIV_2016
FROM InsuranceStats
WHERE tiv_2015_count >= 2 AND location_count = 1;
```
