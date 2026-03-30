## Problem

Find similar friend pairs. Two friends are considered similar if they meet at least one of the following conditions:
1. Listened to the same song on the same day
2. Listened to songs from the same genre

Return all similar friend pairs. Order the result by `user1_id`, then by `user2_id`. If a friendship exists in both directions (A,B) and (B,A), only include the one with the smaller ID first.

### Schema

```sql
Listens(
    UserId INT,
    SongId INT,
    DayId INT
)

Friendship(
    User1Id INT,
    User2Id INT
)

Genre(
    SongId INT,
    Genre VARCHAR
)
```

### Output

| Column  | Type |
|---------|------|
| user1_id| int  |
| user2_id| int  |

---

## Approaches

### Approach 1: CTE for Song Matches + UNION with Genre Matches

Use Common Table Expressions (CTEs) to separately identify similar friends based on listening patterns and genre preferences, then combine results.

```sql
WITH SongMatches AS (
    -- Friends who listened to same song on same day
    SELECT DISTINCT l1.UserId AS user1_id, l2.UserId AS user2_id
    FROM Listens l1
    JOIN Listens l2 
        ON l1.SongId = l2.SongId 
        AND l1.DayId = l2.DayId
        AND l1.UserId < l2.UserId
),
GenreMatches AS (
    -- Friends who listened to songs from same genre
    SELECT DISTINCT l1.UserId AS user1_id, l2.UserId AS user2_id
    FROM Listens l1
    JOIN Listens l2 ON l1.UserId < l2.UserId
    JOIN Genre g1 ON l1.SongId = g1.SongId
    JOIN Genre g2 ON l2.SongId = g2.SongId
    WHERE g1.Genre = g2.Genre
)
SELECT DISTINCT user1_id, user2_id
FROM (
    SELECT * FROM SongMatches
    UNION
    SELECT * FROM GenreMatches
) combined
WHERE EXISTS (
    SELECT 1 FROM Friendship f
    WHERE (f.User1Id = combined.user1_id AND f.User2Id = combined.user2_id)
       OR (f.User1Id = combined.user2_id AND f.User2Id = combined.user1_id)
)
ORDER BY user1_id, user2_id;
```

### Approach 2: JOIN-Based with Genre Comparison

Use self-joins on Listens table with explicit genre matching for a more direct approach.

```sql
WITH SimilarPairs AS (
    -- Same song, same day
    SELECT DISTINCT l1.UserId AS user1_id, l2.UserId AS user2_id
    FROM Listens l1
    JOIN Listens l2 
        ON l1.SongId = l2.SongId 
        AND l1.DayId = l2.DayId
        AND l1.UserId < l2.UserId
    
    UNION
    
    -- Same genre (different songs potentially)
    SELECT DISTINCT l1.UserId AS user1_id, l2.UserId AS user2_id
    FROM Listens l1
    JOIN Genre g1 ON l1.SongId = g1.SongId
    JOIN Genre g2 ON g1.Genre = g2.Genre AND g1.SongId != g2.SongId
    JOIN Listens l2 ON g2.SongId = l2.SongId
    WHERE l1.UserId < l2.UserId
)
SELECT DISTINCT s.user1_id, s.user2_id
FROM SimilarPairs s
JOIN Friendship f 
    ON (f.User1Id = s.user1_id AND f.User2Id = s.user2_id)
    OR (f.User1Id = s.user2_id AND f.User2Id = s.user1_id)
ORDER BY s.user1_id, s.user2_id;
```

### Approach 3: Cross-Join with Filtering (MySQL/PostgreSQL)

Use CROSS JOIN or EXISTS to find user pairs with similar interests, then filter by friendship.

```sql
WITH AllSimilar AS (
    SELECT DISTINCT 
        LEAST(l1.UserId, l2.UserId) AS user1_id,
        GREATEST(l1.UserId, l2.UserId) AS user2_id
    FROM Listens l1
    CROSS JOIN Listens l2
    WHERE l1.UserId != l2.UserId
      AND (
          -- Same song, same day
          (l1.SongId = l2.SongId AND l1.DayId = l2.DayId)
          OR
          -- Same genre
          EXISTS (
              SELECT 1 FROM Genre g1
              JOIN Genre g2 ON g1.Genre = g2.Genre
              WHERE g1.SongId = l1.SongId AND g2.SongId = l2.SongId
          )
      )
)
SELECT DISTINCT user1_id, user2_id
FROM AllSimilar
WHERE EXISTS (
    SELECT 1 FROM Friendship f
    WHERE (f.User1Id = AllSimilar.user1_id AND f.User2Id = AllSimilar.user2_id)
       OR (f.User1Id = AllSimilar.user2_id AND f.User2Id = AllSimilar.user1_id)
)
ORDER BY user1_id, user2_id;
```

---

## Solution Analysis

| Approach      | Time Complexity | Space Complexity | Pros                                    | Cons                              |
|---------------|-----------------|------------------|-----------------------------------------|-----------------------------------|
| CTE + UNION   | O(n²)           | O(n²)            | Clean separation of concerns            | Multiple table scans              |
| JOIN-Based    | O(n²)           | O(n²)            | Direct genre matching                   | Complex join conditions           |
| Cross-Join    | O(n²)           | O(n²)            | Flexible EXISTS subquery for genre      | May generate large intermediate sets |

**Key Points:**
- Always use `UserId1 < UserId2` pattern to avoid duplicate pairs
- UNION automatically deduplicates; UNION ALL would keep duplicates
- The Friendship table check ensures only actual friends are returned
- Genre matching requires joining through the Genre table bridge

---

## Final Solution

```sql
-- Recommended: CTE approach with UNION
WITH SongSimilarity AS (
    -- Same song, same day
    SELECT DISTINCT 
        l1.UserId AS user1_id, 
        l2.UserId AS user2_id
    FROM Listens l1
    INNER JOIN Listens l2 
        ON l1.SongId = l2.SongId 
        AND l1.DayId = l2.DayId
        AND l1.UserId < l2.UserId
),
GenreSimilarity AS (
    -- Same genre
    SELECT DISTINCT 
        l1.UserId AS user1_id, 
        l2.UserId AS user2_id
    FROM Listens l1
    INNER JOIN Genre g1 ON l1.SongId = g1.SongId
    INNER JOIN Genre g2 ON g1.Genre = g2.Genre
    INNER JOIN Listens l2 ON g2.SongId = l2.SongId
    WHERE l1.UserId < l2.UserId
)
SELECT DISTINCT 
    LEAST(f.User1Id, f.User2Id) AS user1_id,
    GREATEST(f.User1Id, f.User2Id) AS user2_id
FROM Friendship f
WHERE EXISTS (
    SELECT 1 FROM SongSimilarity s
    WHERE (s.user1_id = f.User1Id AND s.user2_id = f.User2Id)
       OR (s.user1_id = f.User2Id AND s.user2_id = f.User1Id)
)
OR EXISTS (
    SELECT 1 FROM GenreSimilarity g
    WHERE (g.user1_id = f.User1Id AND g.user2_id = f.User2Id)
       OR (g.user1_id = f.User2Id AND g.user2_id = f.User1Id)
)
ORDER BY user1_id, user2_id;
```

```sql
-- Alternative: Simpler UNION approach
SELECT DISTINCT user1_id, user2_id
FROM (
    -- Same song same day
    SELECT 
        LEAST(l1.UserId, l2.UserId) AS user1_id,
        GREATEST(l1.UserId, l2.UserId) AS user2_id
    FROM Listens l1
    JOIN Listens l2 ON l1.SongId = l2.SongId AND l1.DayId = l2.DayId
    WHERE l1.UserId != l2.UserId
    
    UNION
    
    -- Same genre
    SELECT 
        LEAST(l1.UserId, l2.UserId) AS user1_id,
        GREATEST(l1.UserId, l2.UserId) AS user2_id
    FROM Listens l1
    JOIN Genre g1 ON l1.SongId = g1.SongId
    JOIN Genre g2 ON g1.Genre = g2.Genre
    JOIN Listens l2 ON g2.SongId = l2.SongId
    WHERE l1.UserId != l2.UserId
) AS similar
WHERE EXISTS (
    SELECT 1 FROM Friendship f
    WHERE (f.User1Id = similar.user1_id AND f.User2Id = similar.user2_id)
       OR (f.User1Id = similar.user2_id AND f.User2Id = similar.user1_id)
)
ORDER BY user1_id, user2_id;
```
