## Problem

Find customers who were **NOT** referred by customer id 2.

**Schema:**
```
Customer(Id, Name, RefereeId)
```

**Note:** Need to handle `NULL` RefereeId (customers not referred by anyone). A `NULL` RefereeId means the customer was not referred by any customer.

---

## Approaches

### Approach 1: IS NULL OR != 2 (Recommended)

```sql
SELECT name
FROM Customer
WHERE referee_id IS NULL OR referee_id != 2;
```

**Time Complexity:** O(n)
**Space Complexity:** O(1)

**Pros:**
- Explicitly handles NULL values
- Standard SQL, works across all databases
- Clear and readable

**Cons:**
- Slightly more verbose

---

### Approach 2: NOT IN with NULL handling

```sql
SELECT name
FROM Customer
WHERE COALESCE(referee_id, 0) NOT IN (2);
-- OR
SELECT name
FROM Customer
WHERE referee_id NOT IN (2) OR referee_id IS NULL;
```

**Time Complexity:** O(n)
**Space Complexity:** O(1)

**Why this approach:**
- `NOT IN (2)` alone would exclude NULLs (since `NULL NOT IN (2)` returns UNKNOWN)
- `COALESCE` replaces NULL with a non-matching value (like 0)

**Cons:**
- `NOT IN` with NULLs can be tricky (UNKNOWN results evaluate to false)
- Requires explicit NULL handling

---

### Approach 3: COALESCE in WHERE clause

```sql
SELECT name
FROM Customer
WHERE COALESCE(referee_id, -1) != 2;
```

**Time Complexity:** O(n)
**Space Complexity:** O(1)

**Pros:**
- Concise single condition
- Handles NULL in one expression

**Cons:**
- Less explicit about NULL handling intent
- Assumes -1 is not a valid customer ID

---

## Solution Analysis

| Approach | Time | Space | Readability | NULL Safety |
|----------|------|-------|-------------|-------------|
| IS NULL OR != 2 | O(n) | O(1) | High | Yes |
| NOT IN + NULL | O(n) | O(1) | Medium | Manual |
| COALESCE | O(n) | O(1) | Medium | Yes |

**Key Insight:** The main challenge is that SQL's three-valued logic treats `NULL != 2` as UNKNOWN (not TRUE), so NULL rows are excluded. You must explicitly handle NULLs with `IS NULL` or `COALESCE`.

---

## Final Solution

```sql
SELECT name
FROM Customer
WHERE referee_id IS NULL OR referee_id != 2;
```
