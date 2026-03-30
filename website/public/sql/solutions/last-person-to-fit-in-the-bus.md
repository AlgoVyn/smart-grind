# 1204. Last Person to Fit in the Bus

## Problem

Write a solution to find the person_name of the last person that can fit on a bus without exceeding the weight limit of 1000 kg. The person with the smallest turn value boards first.

### Schema

**Queue Table:**
| Column Name | Type    | Description |
|-------------|---------|-------------|
| person_id   | int     | Primary Key, ID of person in queue |
| person_name | varchar | Name of the person |
| weight      | int     | Weight of the person in kg |
| turn        | int     | Order of boarding (smaller = boards first) |

### Requirements

- Return: person_name of the last person who fits
- Bus weight limit: 1000 kg
- People board in order of turn (ascending)
- Running sum of weights must not exceed 1000 kg
- Find the last person before the cumulative sum would exceed 1000 kg

**Example:**
- Turn 1: 100 kg (cumulative: 100) - fits
- Turn 2: 200 kg (cumulative: 300) - fits
- Turn 3: 300 kg (cumulative: 600) - fits
- Turn 4: 400 kg (cumulative: 1000) - fits (exactly at limit)
- Turn 5: 100 kg (cumulative: 1100) - exceeds, does not board
- Result: person_name from Turn 4

## Approaches

### Approach 1: Self JOIN with Running Sum (Recommended)

Use self JOIN to calculate cumulative sum by joining each row with all previous rows based on turn order.

#### Algorithm

1. Self JOIN queue with itself where q2.turn <= q1.turn (all people before or at current turn)
2. Group by q1.person_id, calculate SUM(q2.weight) as cumulative weight
3. Filter to only include people where cumulative weight <= 1000
4. Select the person with maximum turn value among those who fit

#### Implementation

```sql
SELECT 
    q1.person_name
FROM Queue q1
JOIN Queue q2 ON q2.turn <= q1.turn
GROUP BY q1.person_id, q1.person_name, q1.turn
HAVING SUM(q2.weight) <= 1000
ORDER BY q1.turn DESC
LIMIT 1;
```

#### Time & Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n²) - self join creates n×n combinations |
| Space | O(n) - grouping reduces to n results |

### Approach 2: Window Function with SUM() OVER

Use SUM() OVER with ROWS clause for efficient cumulative sum calculation.

#### Algorithm

1. Use window function SUM(weight) OVER (ORDER BY turn) to calculate running total
2. Filter to rows where running sum <= 1000
3. Return the last person (highest turn) among qualifying rows

#### Implementation

```sql
WITH CumulativeWeights AS (
    SELECT 
        person_name,
        turn,
        SUM(weight) OVER (ORDER BY turn) AS cumulative_weight
    FROM Queue
)
SELECT person_name
FROM CumulativeWeights
WHERE cumulative_weight <= 1000
ORDER BY turn DESC
LIMIT 1;
```

#### Time & Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n log n) - window function with ordering |
| Space | O(n) - CTE stores intermediate results |

### Approach 3: Correlated Subquery with Cumulative Sum

Use a correlated subquery to calculate cumulative weight for each row individually.

#### Algorithm

1. For each person, calculate cumulative weight using a correlated subquery
2. Subquery sums weights of all people with turn <= current turn
3. Filter to people where cumulative sum <= 1000
4. Return the person with maximum turn value

#### Implementation

```sql
SELECT 
    q1.person_name
FROM Queue q1
WHERE (
    SELECT SUM(q2.weight) 
    FROM Queue q2 
    WHERE q2.turn <= q1.turn
) <= 1000
ORDER BY q1.turn DESC
LIMIT 1;
```

**Alternative: Using CROSS APPLY / LATERAL JOIN syntax**

```sql
WITH CumulativeSum AS (
    SELECT 
        q1.person_name,
        q1.turn,
        (SELECT SUM(q2.weight) 
         FROM Queue q2 
         WHERE q2.turn <= q1.turn) AS total_weight
    FROM Queue q1
)
SELECT person_name
FROM CumulativeSum
WHERE total_weight <= 1000
ORDER BY turn DESC
LIMIT 1;
```

#### Time & Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n²) - subquery executes for each row |
| Space | O(n) - result set size |

## Solution Analysis

| Approach | Time | Space | Pros | Cons |
|----------|------|-------|------|------|
| Self JOIN | O(n²) | O(n) | Works in all SQL versions | Quadratic time complexity |
| Window Function | O(n log n) | O(n) | Fast, clean, most efficient | Requires window function support |
| Correlated Subquery | O(n²) | O(n) | Easy to understand conceptually | Slow, multiple table scans |

**Recommended:** Approach 2 (Window Function with SUM() OVER) - most efficient and readable, especially for larger datasets.

## Final Solution

```sql
WITH CumulativeWeights AS (
    SELECT 
        person_name,
        turn,
        SUM(weight) OVER (ORDER BY turn) AS cumulative_weight
    FROM Queue
)
SELECT person_name
FROM CumulativeWeights
WHERE cumulative_weight <= 1000
ORDER BY turn DESC
LIMIT 1;
```

### Key Concepts

- **SUM() OVER (ORDER BY)**: Window function that calculates running total
  - SUM(weight) OVER (ORDER BY turn) gives cumulative sum at each row
  - Frame defaults to ROWS UNBOUNDED PRECEDING (all rows from start to current)
- **Running Sum Constraint**: cumulative_weight <= 1000 ensures we don't exceed bus limit
- **ORDER BY turn DESC with LIMIT 1**: Gets the last person who successfully boarded
- **CTE**: Makes the query readable by separating cumulative calculation from final filtering

### Notes

- Window functions are more efficient than self-joins for running calculations
- The problem assumes no single person exceeds 1000 kg alone
- LIMIT 1 handles ties (if two people have same max turn, returns one arbitrarily)
- For handling exact ties at the boundary, the query naturally includes those who fit exactly at 1000 kg
