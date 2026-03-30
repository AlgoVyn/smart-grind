## Problem

**Table**: `ActorDirector`
| Column Name   | Type    |
|---------------|---------|
| actor_id      | int     |
| director_id   | int     |
| timestamp     | int     |

timestamp is the primary key column for this table.

Write a SQL query for a report that provides the pairs `(actor_id, director_id)` where the actor has cooperated with the director at least three times.

## Approaches

### Approach 1: GROUP BY Pair with HAVING

Group by the actor-director pair and count occurrences.

```sql
SELECT actor_id, director_id
FROM ActorDirector
GROUP BY actor_id, director_id
HAVING COUNT(*) >= 3;
```

### Approach 2: Self JOIN with Aggregation

Use self join to find pairs with multiple collaborations.

```sql
SELECT DISTINCT a.actor_id, a.director_id
FROM ActorDirector a
JOIN ActorDirector b ON a.actor_id = b.actor_id 
                    AND a.director_id = b.director_id
                    AND a.timestamp < b.timestamp
JOIN ActorDirector c ON a.actor_id = c.actor_id 
                    AND a.director_id = c.director_id
                    AND b.timestamp < c.timestamp;
```

### Approach 3: Window Function Counting

Use window functions to count collaborations per pair.

```sql
WITH Collaborations AS (
    SELECT actor_id, director_id,
           COUNT(*) OVER (PARTITION BY actor_id, director_id) as coop_count
    FROM ActorDirector
)
SELECT DISTINCT actor_id, director_id
FROM Collaborations
WHERE coop_count >= 3;
```

## Solution Analysis

| Approach | Time Complexity | Space Complexity | Pros | Cons |
|----------|----------------|------------------|------|------|
| GROUP BY with HAVING | O(n log n) | O(k) where k = unique pairs | Simple, efficient | None significant |
| Self JOIN | O(n³) worst case | O(n²) | Demonstrates relationships | Very inefficient |
| Window Function | O(n log n) | O(n) | Flexible for additional analytics | Overkill for this problem |

## Final Solution

```sql
SELECT actor_id, director_id
FROM ActorDirector
GROUP BY actor_id, director_id
HAVING COUNT(*) >= 3;
```

**Explanation**:
- Group records by actor_id and director_id pairs
- Count the number of collaborations for each pair
- Use HAVING to filter only pairs with 3 or more collaborations
- This is the most straightforward and efficient approach
