## Problem

Find the most experienced employees in each project. Return the project_id and employee_id of the employee(s) with the maximum experience_years for each project.

### Schema

**Project** table:
| Column Name | Type    |
|-------------|---------|
| project_id  | int     |
| employee_id | int     |

**Employee** table:
| Column Name     | Type    |
|-----------------|---------|
| employee_id     | int     |
| name            | varchar |
| experience_years| int     |

- `(project_id, employee_id)` is the primary key of Project table.
- `employee_id` is the primary key of Employee table.

---

## Approaches

### Approach 1: RANK Window Function

```sql
SELECT project_id, employee_id
FROM (
    SELECT 
        p.project_id,
        p.employee_id,
        RANK() OVER (PARTITION BY p.project_id ORDER BY e.experience_years DESC) as rnk
    FROM Project p
    JOIN Employee e ON p.employee_id = e.employee_id
) ranked
WHERE rnk = 1;
```

**Explanation:** Uses `RANK()` to assign ranks within each project partition ordered by experience_years descending, then filters for rank 1.

### Approach 2: Correlated Subquery with MAX

```sql
SELECT p.project_id, p.employee_id
FROM Project p
JOIN Employee e ON p.employee_id = e.employee_id
WHERE e.experience_years = (
    SELECT MAX(e2.experience_years)
    FROM Project p2
    JOIN Employee e2 ON p2.employee_id = e2.employee_id
    WHERE p2.project_id = p.project_id
);
```

**Explanation:** For each row, checks if the employee's experience equals the maximum experience in their project using a correlated subquery.

### Approach 3: JOIN with Grouped Subquery

```sql
SELECT p.project_id, p.employee_id
FROM Project p
JOIN Employee e ON p.employee_id = e.employee_id
JOIN (
    SELECT p2.project_id, MAX(e2.experience_years) as max_exp
    FROM Project p2
    JOIN Employee e2 ON p2.employee_id = e2.employee_id
    GROUP BY p2.project_id
) max_exp_table ON p.project_id = max_exp_table.project_id 
    AND e.experience_years = max_exp_table.max_exp;
```

**Explanation:** Pre-computes the maximum experience per project in a subquery, then joins back to filter employees matching that max.

---

## Solution Analysis

| Approach | Time Complexity | Space Complexity | Pros | Cons |
|----------|----------------|------------------|------|------|
| RANK Window Function | O(n log n) | O(n) | Clean, handles ties, single pass | May be slower on very large datasets |
| Correlated Subquery | O(n²) | O(1) | Simple to understand | Poor performance with large data |
| JOIN with Subquery | O(n log n) | O(p) where p = num projects | Efficient, handles ties | Requires two passes over data |

---

## Final Solution

```sql
SELECT project_id, employee_id
FROM (
    SELECT 
        p.project_id,
        p.employee_id,
        RANK() OVER (PARTITION BY p.project_id ORDER BY e.experience_years DESC) as rnk
    FROM Project p
    JOIN Employee e ON p.employee_id = e.employee_id
) ranked
WHERE rnk = 1;
```
