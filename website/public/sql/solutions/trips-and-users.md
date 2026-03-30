## Problem

Find the cancellation rate of requests with unbanned users (both client and driver must not be banned) each day between "2013-10-01" and "2013-10-03".

**Schema:**
```
Trips(Id, Client_Id, Driver_Id, City_Id, Status, Request_at)
Users(Users_Id, Banned, Role)
```

**Requirements:**
- Cancellation rate = (canceled trips / total trips) rounded to 2 decimal places
- Exclude trips where either client or driver is banned
- Only consider trips between '2013-10-01' and '2013-10-03'
- Status = 'cancelled_by_driver' or 'cancelled_by_client' counts as cancelled
- Return result ordered by Day

**Note:** Users table contains both clients and drivers (identified by Role column).

---

## Approaches

### Approach 1: JOIN with Filter + CASE Aggregation (Recommended)

```sql
SELECT 
    t.request_at AS Day,
    ROUND(
        SUM(CASE WHEN t.status LIKE 'cancelled%' THEN 1 ELSE 0 END) * 1.0 / COUNT(*), 
        2
    ) AS 'Cancellation Rate'
FROM Trips t
JOIN Users u1 ON t.client_id = u1.users_id AND u1.banned = 'No'
JOIN Users u2 ON t.driver_id = u2.users_id AND u2.banned = 'No'
WHERE t.request_at BETWEEN '2013-10-01' AND '2013-10-03'
GROUP BY t.request_at
ORDER BY t.request_at;
```

**Time Complexity:** O(t × u) where t = trips, u = users
**Space Complexity:** O(d) where d = distinct days

**Pros:**
- Clean and readable with explicit filtering
- Uses JOIN for efficient filtering of banned users
- CASE statement clearly identifies cancelled trips

**Cons:**
- Requires two JOINs to Users table

---

### Approach 2: CTE with Filtering + Ratio Calculation

```sql
WITH ValidTrips AS (
    SELECT t.*
    FROM Trips t
    JOIN Users u1 ON t.client_id = u1.users_id AND u1.banned = 'No' AND u1.role = 'client'
    JOIN Users u2 ON t.driver_id = u2.users_id AND u2.banned = 'No' AND u2.role = 'driver'
    WHERE t.request_at BETWEEN '2013-10-01' AND '2013-10-03'
),
DailyStats AS (
    SELECT 
        request_at,
        COUNT(*) AS total,
        SUM(CASE WHEN status LIKE 'cancelled%' THEN 1 ELSE 0 END) AS cancelled
    FROM ValidTrips
    GROUP BY request_at
)
SELECT 
    request_at AS Day,
    ROUND(cancelled * 1.0 / total, 2) AS 'Cancellation Rate'
FROM DailyStats
ORDER BY request_at;
```

**Time Complexity:** O(t × u)
**Space Complexity:** O(t + d)

**Pros:**
- Modular structure with clear separation of concerns
- CTEs make the query easier to debug and maintain
- Role filtering adds extra safety

**Cons:**
- More verbose than single-query approach

---

### Approach 3: Subquery with Conditional Count

```sql
SELECT 
    request_at AS Day,
    ROUND(
        (SUM(CASE WHEN status LIKE 'cancelled%' THEN 1 ELSE 0 END) * 1.0) / COUNT(*),
        2
    ) AS 'Cancellation Rate'
FROM Trips
WHERE request_at BETWEEN '2013-10-01' AND '2013-10-03'
  AND client_id IN (SELECT users_id FROM Users WHERE banned = 'No')
  AND driver_id IN (SELECT users_id FROM Users WHERE banned = 'No')
GROUP BY request_at
ORDER BY request_at;
```

**Time Complexity:** O(t × u)
**Space Complexity:** O(d)

**Why this approach:**
- Uses subqueries for filtering instead of JOINs
- May be more intuitive for simple filtering logic

**Cons:**
- Subqueries may be less efficient than JOINs on some databases
- Harder to optimize for large datasets

---

## Solution Analysis

| Approach | Time | Space | Readability | Performance | Flexibility |
|----------|------|-------|-------------|-------------|-------------|
| JOIN + CASE | O(t×u) | O(d) | High | Good | Medium |
| CTE | O(t×u) | O(t+d) | High | Good | High |
| Subquery | O(t×u) | O(d) | Medium | Moderate | Low |

**Key Insights:**
1. **Banned User Filtering:** Must check both client AND driver - using JOINs or IN subqueries
2. **Cancellation Detection:** Status starting with 'cancelled' catches both driver and client cancellations
3. **Rate Calculation:** Multiply by 1.0 to force floating-point division, then ROUND to 2 decimals
4. **Date Range:** BETWEEN is inclusive, capturing '2013-10-01' through '2013-10-03'

---

## Final Solution

```sql
SELECT 
    t.request_at AS Day,
    ROUND(
        SUM(CASE WHEN t.status LIKE 'cancelled%' THEN 1 ELSE 0 END) * 1.0 / COUNT(*), 
        2
    ) AS 'Cancellation Rate'
FROM Trips t
JOIN Users u1 ON t.client_id = u1.users_id AND u1.banned = 'No'
JOIN Users u2 ON t.driver_id = u2.users_id AND u2.banned = 'No'
WHERE t.request_at BETWEEN '2013-10-01' AND '2013-10-03'
GROUP BY t.request_at
ORDER BY t.request_at;
```
