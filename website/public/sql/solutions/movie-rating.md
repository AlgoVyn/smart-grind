# 1341. Movie Rating

## Problem

Write a solution to find:
1. The user who has rated the greatest number of movies (in case of tie, use lexicographically smaller name)
2. The movie with the highest average rating in February 2020 (in case of tie, use lexicographically smaller title)

Return the result as two rows with different format per LeetCode requirements.

### Schema

**Movies Table:**
| Column Name | Type    | Description |
|-------------|---------|-------------|
| movie_id    | int     | Primary Key |
| title       | varchar | Movie title |

**Users Table:**
| Column Name | Type    | Description |
|-------------|---------|-------------|
| user_id     | int     | Primary Key |
| name        | varchar | User name |

**MovieRating Table:**
| Column Name | Type    | Description |
|-------------|---------|-------------|
| movie_id    | int     | Foreign Key to Movies |
| user_id     | int     | Foreign Key to Users |
| rating      | int     | Rating (1-5) |
| created_at  | date    | Date of rating |

### Requirements

- Find user with most ratings (all time) - return as `name`
- Find movie with highest avg rating in February 2020 - return as `title`
- Tie-breaking: use lexicographically smaller name/title
- Return two rows with results (format depends on platform)
- February 2020: created_at between '2020-02-01' and '2020-02-29'

## Approaches

### Approach 1: CTEs with Separate Aggregations (Recommended)

Use two separate CTEs to find the top user and top movie, then combine results.

#### Algorithm

1. CTE for user ratings: count ratings per user, rank by count (desc) and name (asc)
2. CTE for movie ratings: avg rating per movie in Feb 2020, rank by avg (desc) and title (asc)
3. Select top 1 from each CTE
4. UNION the results together

#### Implementation

```sql
WITH UserRatingCounts AS (
    SELECT 
        u.name,
        COUNT(*) AS rating_count
    FROM MovieRating mr
    JOIN Users u ON mr.user_id = u.user_id
    GROUP BY u.user_id, u.name
),
TopUser AS (
    SELECT name
    FROM UserRatingCounts
    ORDER BY rating_count DESC, name ASC
    LIMIT 1
),
MovieAvgRatings AS (
    SELECT 
        m.title,
        AVG(mr.rating) AS avg_rating
    FROM MovieRating mr
    JOIN Movies m ON mr.movie_id = m.movie_id
    WHERE mr.created_at BETWEEN '2020-02-01' AND '2020-02-29'
    GROUP BY m.movie_id, m.title
),
TopMovie AS (
    SELECT title
    FROM MovieAvgRatings
    ORDER BY avg_rating DESC, title ASC
    LIMIT 1
)
SELECT name AS results FROM TopUser
UNION ALL
SELECT title AS results FROM TopMovie;
```

#### Time & Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n log n) - due to sorting for ranking |
| Space | O(n) - CTEs store aggregated results |

### Approach 2: Window Functions for Ranking

Use RANK() or ROW_NUMBER() window functions to rank users and movies, then filter for rank 1.

#### Algorithm

1. Create CTE with user rating counts and rank
2. Create CTE with movie avg ratings (Feb 2020) and rank
3. Filter both CTEs for rank = 1
4. UNION the top results

#### Implementation

```sql
WITH UserRanks AS (
    SELECT 
        u.name,
        RANK() OVER (ORDER BY COUNT(*) DESC, u.name ASC) AS user_rank
    FROM MovieRating mr
    JOIN Users u ON mr.user_id = u.user_id
    GROUP BY u.user_id, u.name
),
MovieRanks AS (
    SELECT 
        m.title,
        RANK() OVER (ORDER BY AVG(mr.rating) DESC, m.title ASC) AS movie_rank
    FROM MovieRating mr
    JOIN Movies m ON mr.movie_id = m.movie_id
    WHERE mr.created_at BETWEEN '2020-02-01' AND '2020-02-29'
    GROUP BY m.movie_id, m.title
)
SELECT name AS results FROM UserRanks WHERE user_rank = 1
UNION ALL
SELECT title AS results FROM MovieRanks WHERE movie_rank = 1;
```

**Alternative with ROW_NUMBER for strict single result:**

```sql
WITH UserRanks AS (
    SELECT 
        u.name,
        ROW_NUMBER() OVER (ORDER BY COUNT(*) DESC, u.name ASC) AS rn
    FROM MovieRating mr
    JOIN Users u ON mr.user_id = u.user_id
    GROUP BY u.user_id, u.name
),
MovieRanks AS (
    SELECT 
        m.title,
        ROW_NUMBER() OVER (ORDER BY AVG(mr.rating) DESC, m.title ASC) AS rn
    FROM MovieRating mr
    JOIN Movies m ON mr.movie_id = m.movie_id
    WHERE mr.created_at BETWEEN '2020-02-01' AND '2020-02-29'
    GROUP BY m.movie_id, m.title
)
SELECT name AS results FROM UserRanks WHERE rn = 1
UNION ALL
SELECT title AS results FROM MovieRanks WHERE rn = 1;
```

#### Time & Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n log n) - window functions require sorting |
| Space | O(n) - intermediate results with rankings |

### Approach 3: Single Query with Subqueries

Use subqueries in SELECT clause to find top user and movie without CTEs.

#### Algorithm

1. Create a derived table with just two rows (placeholders)
2. Use correlated subqueries or scalar subqueries to fetch results
3. Return one result per row

#### Implementation

```sql
SELECT 
    (SELECT u.name
     FROM MovieRating mr
     JOIN Users u ON mr.user_id = u.user_id
     GROUP BY u.user_id, u.name
     ORDER BY COUNT(*) DESC, u.name ASC
     LIMIT 1) AS results
UNION ALL
SELECT 
    (SELECT m.title
     FROM MovieRating mr
     JOIN Movies m ON mr.movie_id = m.movie_id
     WHERE mr.created_at BETWEEN '2020-02-01' AND '2020-02-29'
     GROUP BY m.movie_id, m.title
     ORDER BY AVG(mr.rating) DESC, m.title ASC
     LIMIT 1) AS results;
```

**Alternative with VALUES clause:**

```sql
SELECT results FROM (
    SELECT 1 AS sort_order,
           (SELECT u.name
            FROM MovieRating mr
            JOIN Users u ON mr.user_id = u.user_id
            GROUP BY u.user_id, u.name
            ORDER BY COUNT(*) DESC, u.name ASC
            LIMIT 1) AS results
    UNION ALL
    SELECT 2 AS sort_order,
           (SELECT m.title
            FROM MovieRating mr
            JOIN Movies m ON mr.movie_id = m.movie_id
            WHERE mr.created_at BETWEEN '2020-02-01' AND '2020-02-29'
            GROUP BY m.movie_id, m.title
            ORDER BY AVG(mr.rating) DESC, m.title ASC
            LIMIT 1) AS results
) t
ORDER BY sort_order;
```

#### Time & Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n log n) - two separate aggregation queries |
| Space | O(n) - subquery results |

## Solution Analysis

| Approach | Time | Space | Pros | Cons |
|----------|------|-------|------|------|
| CTEs with Aggregations | O(n log n) | O(n) | Clean, readable, easy to debug | Requires CTE support |
| Window Functions | O(n log n) | O(n) | Explicit ranking logic | Slightly more verbose |
| Scalar Subqueries | O(n log n) | O(n) | Compact, no CTEs needed | Harder to read, less maintainable |

**Recommended:** CTEs with Separate Aggregations (Approach 1) - clearest separation of concerns, most maintainable, and works across all major SQL databases.

## Final Solution

```sql
WITH UserRatingCounts AS (
    SELECT 
        u.name,
        COUNT(*) AS rating_count
    FROM MovieRating mr
    JOIN Users u ON mr.user_id = u.user_id
    GROUP BY u.user_id, u.name
),
TopUser AS (
    SELECT name
    FROM UserRatingCounts
    ORDER BY rating_count DESC, name ASC
    LIMIT 1
),
MovieAvgRatings AS (
    SELECT 
        m.title,
        AVG(mr.rating) AS avg_rating
    FROM MovieRating mr
    JOIN Movies m ON mr.movie_id = m.movie_id
    WHERE mr.created_at BETWEEN '2020-02-01' AND '2020-02-29'
    GROUP BY m.movie_id, m.title
),
TopMovie AS (
    SELECT title
    FROM MovieAvgRatings
    ORDER BY avg_rating DESC, title ASC
    LIMIT 1
)
SELECT name AS results FROM TopUser
UNION ALL
SELECT title AS results FROM TopMovie;
```

### Key Concepts

- **Multiple aggregations**: Two separate problems solved in one query
- **Tie-breaking**: Secondary sort by name/title ensures deterministic results
- **Date filtering**: `BETWEEN '2020-02-01' AND '2020-02-29'` for February 2020
- **UNION ALL**: Combines two different result types (user name + movie title)
- **ORDER BY ... LIMIT 1**: Efficient way to get top result with tie-breaking
- **Lexicographic ordering**: String comparison for breaking ties alphabetically
