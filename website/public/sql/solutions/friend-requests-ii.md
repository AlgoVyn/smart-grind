# 602. Friend Requests II: Who Has the Most Friends

## Problem

Find the person who has the most friends. A friend request is accepted when (requester_id, accepter_id) appears in the table. Friendship is bidirectional: if A sends to B, both A and B have one more friend.

### Schema

**RequestAccepted Table:**
| Column Name  | Type    | Description |
|--------------|---------|-------------|
| requester_id | int     | Person who sent request |
| accepter_id  | int     | Person who accepted request |

### Requirements

- Count total friends for each person (requests sent + requests received)
- Return the person with the highest friend count
- Return: id, num (number of friends)
- In case of ties, return any one (or all tied persons)

**Example:**
Input:
| requester_id | accepter_id |
|--------------|-------------|
| 1            | 2           |
| 1            | 3           |
| 2            | 3           |
| 3            | 4           |

Friend counts:
- Person 1: sent to 2,3 = 2 friends
- Person 2: sent to 3, received from 1 = 2 friends
- Person 3: sent to 4, received from 1,2 = 3 friends ← most friends
- Person 4: received from 3 = 1 friend

Result: id = 3, num = 3

## Approaches

### Approach 1: UNION ALL with GROUP BY (Recommended)

Combine all requesters and accepters into a single column, then count occurrences per person.

#### Algorithm

1. Use UNION ALL to create a combined list of all person IDs (both requesters and accepters)
2. Each row in the result represents one friendship for that person
3. GROUP BY the person ID and COUNT occurrences
4. ORDER BY count DESC and LIMIT 1 to get the person with most friends

#### Implementation

```sql
SELECT 
    id,
    COUNT(*) AS num
FROM (
    SELECT requester_id AS id FROM RequestAccepted
    UNION ALL
    SELECT accepter_id AS id FROM RequestAccepted
) AS AllFriends
GROUP BY id
ORDER BY num DESC
LIMIT 1;
```

#### Time & Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n log n) - due to grouping and sorting |
| Space | O(n) - storing combined list temporarily |

### Approach 2: CTE with Combined List

Similar to Approach 1 but using explicit CTEs for better readability and structure.

#### Algorithm

1. Create CTE for requesters
2. Create CTE for accepters
3. UNION ALL in a third CTE
4. GROUP BY and count, then get max

#### Implementation

```sql
WITH Requesters AS (
    SELECT requester_id AS id 
    FROM RequestAccepted
),
Accepters AS (
    SELECT accepter_id AS id 
    FROM RequestAccepted
),
AllFriends AS (
    SELECT id FROM Requesters
    UNION ALL
    SELECT id FROM Accepters
),
FriendCounts AS (
    SELECT 
        id,
        COUNT(*) AS num
    FROM AllFriends
    GROUP BY id
)
SELECT id, num
FROM FriendCounts
WHERE num = (SELECT MAX(num) FROM FriendCounts);
```

#### Time & Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n log n) - grouping and finding max |
| Space | O(n) - multiple CTEs store data |

### Approach 3: Self UNION with Subquery

Use a subquery approach that handles ties by returning all persons with maximum friend count.

#### Implementation

```sql
SELECT 
    id,
    num
FROM (
    SELECT 
        id,
        COUNT(*) AS num,
        RANK() OVER (ORDER BY COUNT(*) DESC) AS rnk
    FROM (
        SELECT requester_id AS id FROM RequestAccepted
        UNION ALL
        SELECT accepter_id AS id FROM RequestAccepted
    ) AS AllFriends
    GROUP BY id
) AS RankedFriends
WHERE rnk = 1;
```

**Alternative without window function (for older SQL versions):**

```sql
SELECT 
    id,
    COUNT(*) AS num
FROM (
    SELECT requester_id AS id FROM RequestAccepted
    UNION ALL
    SELECT accepter_id AS id FROM RequestAccepted
) AS AllFriends
GROUP BY id
HAVING COUNT(*) = (
    SELECT MAX(friend_count)
    FROM (
        SELECT COUNT(*) AS friend_count
        FROM (
            SELECT requester_id AS id FROM RequestAccepted
            UNION ALL
            SELECT accepter_id AS id FROM RequestAccepted
        ) AS AllFriends2
        GROUP BY id
    ) AS Counts
);
```

#### Time & Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n log n) - with RANK, O(n²) with subquery approach |
| Space | O(n) - storing intermediate results |

## Solution Analysis

| Approach | Time | Space | Pros | Cons |
|----------|------|-------|------|------|
| UNION ALL + LIMIT | O(n log n) | O(n) | Simple, clean, efficient | Returns only one person on ties |
| CTE with MAX | O(n log n) | O(n) | Readable, handles ties well | More verbose |
| RANK window function | O(n log n) | O(n) | Handles ties elegantly | Requires window function support |

**Recommended:** UNION ALL with GROUP BY (Approach 1) - most straightforward and widely compatible.

## Final Solution

```sql
SELECT 
    id,
    COUNT(*) AS num
FROM (
    SELECT requester_id AS id FROM RequestAccepted
    UNION ALL
    SELECT accepter_id AS id FROM RequestAccepted
) AS AllFriends
GROUP BY id
ORDER BY num DESC
LIMIT 1;
```

### Key Concepts

- **UNION ALL**: Combines rows from multiple queries (keeps duplicates, which is what we want for counting)
- **Bidirectional friendship**: Both requester and accepter gain a friend when request is accepted
- **Self-aggregation**: Treating both columns as the same entity type for counting
- **LIMIT 1**: Returns only the top result; use different approach if ties need to be shown

### Handling Ties

If you need to return ALL persons with the maximum friend count:

```sql
WITH FriendCounts AS (
    SELECT 
        id,
        COUNT(*) AS num
    FROM (
        SELECT requester_id AS id FROM RequestAccepted
        UNION ALL
        SELECT accepter_id AS id FROM RequestAccepted
    ) AS AllFriends
    GROUP BY id
)
SELECT id, num
FROM FriendCounts
WHERE num = (SELECT MAX(num) FROM FriendCounts);
```

### Variation: Count Unique Friends

If you want to count unique friends (in case of duplicate requests between same pair):

```sql
SELECT 
    id,
    COUNT(DISTINCT friend_id) AS num
FROM (
    SELECT requester_id AS id, accepter_id AS friend_id FROM RequestAccepted
    UNION ALL
    SELECT accepter_id AS id, requester_id AS friend_id FROM RequestAccepted
) AS AllFriendships
GROUP BY id
ORDER BY num DESC
LIMIT 1;
```
