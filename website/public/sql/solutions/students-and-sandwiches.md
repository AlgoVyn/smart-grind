# 1280. Students and Sandwiches

## Problem

Write a solution to count the number of students who are unable to eat. Students form a circle and take sandwiches from the top of a stack if their preference matches. Students who cannot get their preferred sandwich leave the circle.

### Schema

**Students Table:**
| Column Name       | Type    | Description |
|-------------------|---------|-------------|
| StudentId         | int     | Primary Key |
| PreferredSandwich | varchar | Student's preferred sandwich type |

**Sandwiches Table:**
| Column Name  | Type    | Description |
|--------------|---------|-------------|
| SandwichId   | int     | Primary Key (stack order, lower = on top) |
| SandwichType | varchar | Type of sandwich |

### Requirements

- Students are arranged in a circle (queue) in order of StudentId
- Sandwiches are stacked with SandwichId 1 on top
- Process:
  1. Student at front checks if top sandwich matches their preference
  2. If match: student takes sandwich and leaves the circle
  3. If no match: student goes to back of circle
  4. If no student can take the top sandwich, stop
- Return: count of students unable to eat

**Example Process:**
```
Students: [1:cheese, 2:ham, 3:cheese]  (Student 1 at front)
Sandwiches: [1:ham, 2:cheese, 3:ham]   (Sandwich 1 on top)

Round 1: Student 1 wants cheese, top is ham → no match → to back
Round 2: Student 2 wants ham, top is ham → match! → sandwich taken
Round 3: Student 3 wants cheese, top is cheese → match! → sandwich taken
Round 4: Student 1 wants cheese, top is ham → no match → to back
Round 5: No cheese sandwich left, Student 1 cannot eat

Result: 1 student unable to eat
```

## Approaches

### Approach 1: Queue Simulation with COUNT (Recommended)

Simulate the process by counting preferences and determining when no matches remain.

#### Algorithm

1. Count how many students want each sandwich type
2. Iterate through sandwiches from top to bottom
3. For each sandwich, check if any student wants it
4. If yes: decrement count for that type (student eats)
5. If no: all remaining students cannot eat (count them)
6. If all sandwiches are taken, return 0

#### Implementation

```sql
WITH StudentCounts AS (
    -- Count students by preferred sandwich type
    SELECT 
        PreferredSandwich AS sandwich_type,
        COUNT(*) AS student_count
    FROM Students
    GROUP BY PreferredSandwich
),
SandwichList AS (
    -- Get sandwiches in stack order (lowest ID = top)
    SELECT 
        SandwichType,
        ROW_NUMBER() OVER (ORDER BY SandwichId) AS stack_order
    FROM Sandwiches
),
Simulation AS (
    SELECT 
        sl.SandwichType,
        sl.stack_order,
        COALESCE(sc.student_count, 0) AS available_students
    FROM SandwichList sl
    LEFT JOIN StudentCounts sc ON sl.SandwichType = sc.sandwich_type
)
-- Students who cannot eat = total students - students who ate
SELECT 
    (SELECT COUNT(*) FROM Students) - 
    (
        -- Count how many sandwiches were successfully taken
        SELECT COUNT(*) 
        FROM (
            SELECT 
                SandwichType,
                stack_order,
                available_students - (
                    SELECT COUNT(*) 
                    FROM Simulation s2 
                    WHERE s2.SandwichType = s1.SandwichType 
                    AND s2.stack_order < s1.stack_order
                ) AS remaining_students
            FROM Simulation s1
        ) t
        WHERE remaining_students > 0
    ) AS unable_to_eat;
```

**Simpler Alternative using preference counting:**
```sql
-- Count students per preference and simulate consumption
WITH PreferenceCounts AS (
    SELECT PreferredSandwich, COUNT(*) AS cnt
    FROM Students
    GROUP BY PreferredSandwich
),
StackSimulation AS (
    SELECT 
        s.SandwichType,
        s.SandwichId,
        COALESCE(p.cnt, 0) - (
            SELECT COUNT(*) 
            FROM Sandwiches s2 
            WHERE s2.SandwichType = s.SandwichType 
            AND s2.SandwichId < s.SandwichId
        ) AS students_who_want_this_remaining
    FROM Sandwiches s
    LEFT JOIN PreferenceCounts p ON s.SandwichType = p.PreferredSandwich
    ORDER BY s.SandwichId
)
SELECT 
    (SELECT COUNT(*) FROM Students) -
    (SELECT COUNT(*) FROM StackSimulation WHERE students_who_want_this_remaining > 0)
    AS unable_to_eat_count;
```

#### Time & Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n × m) - nested queries for counting |
| Space | O(k) - where k = unique sandwich types |

### Approach 2: LEFT JOIN with Aggregation

Use joins to match students with sandwiches and identify unmatched students.

#### Algorithm

1. Match students to sandwiches based on preferences
2. Use window functions to simulate the stack order consumption
3. Identify students who never get a matching sandwich

#### Implementation

```sql
WITH StudentPrefs AS (
    SELECT 
        StudentId,
        PreferredSandwich,
        ROW_NUMBER() OVER (PARTITION BY PreferredSandwich ORDER BY StudentId) AS pref_rank
    FROM Students
),
SandwichStack AS (
    SELECT 
        SandwichId,
        SandwichType,
        ROW_NUMBER() OVER (PARTITION BY SandwichType ORDER BY SandwichId) AS stack_rank
    FROM Sandwiches
),
Matches AS (
    SELECT 
        sp.StudentId,
        sp.PreferredSandwich,
        ss.SandwichId,
        ss.SandwichType
    FROM StudentPrefs sp
    LEFT JOIN SandwichStack ss 
        ON sp.PreferredSandwich = ss.SandwichType 
        AND sp.pref_rank = ss.stack_rank
)
SELECT COUNT(*) AS unable_to_eat
FROM Students
WHERE StudentId NOT IN (
    SELECT StudentId FROM Matches WHERE SandwichId IS NOT NULL
);
```

#### Time & Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n log n + m log m) - due to sorting for row numbers |
| Space | O(n + m) - intermediate CTEs |

### Approach 3: Simulation with Iterative Logic (MySQL Variable Approach)

Use session variables to simulate the queue/stack process iteratively.

#### Algorithm

1. Create ordered lists for students (queue) and sandwiches (stack)
2. Use variables to track current positions
3. Simulate rounds until no match found or all eaten
4. Count remaining students

#### Implementation

```sql
-- Create numbered student queue and sandwich stack
WITH RECURSIVE 
StudentQueue AS (
    SELECT 
        StudentId,
        PreferredSandwich,
        ROW_NUMBER() OVER (ORDER BY StudentId) AS queue_pos,
        1 AS attempts
    FROM Students
),
SandwichStack AS (
    SELECT 
        SandwichId,
        SandwichType,
        ROW_NUMBER() OVER (ORDER BY SandwichId) AS stack_pos
    FROM Sandwiches
),
-- Count preferences to determine when we run out of matches
PreferenceSummary AS (
    SELECT 
        PreferredSandwich,
        COUNT(*) AS pref_count
    FROM Students
    GROUP BY PreferredSandwich
),
-- For each sandwich, check if there are enough students who want it
SandwichFeasibility AS (
    SELECT 
        ss.SandwichType,
        ss.stack_pos,
        COALESCE(ps.pref_count, 0) AS total_want,
        (
            SELECT COUNT(*) 
            FROM SandwichStack ss2 
            WHERE ss2.SandwichType = ss.SandwichType 
            AND ss2.stack_pos < ss.stack_pos
        ) AS prior_same_type
    FROM SandwichStack ss
    LEFT JOIN PreferenceSummary ps ON ss.SandwichType = ps.PreferredSandwich
)
-- Calculate remaining sandwiches that can't be matched
SELECT 
    (SELECT COUNT(*) FROM Students) - 
    (
        SELECT COUNT(*) 
        FROM SandwichFeasibility 
        WHERE total_want > prior_same_type
    ) AS unable_to_eat;
```

#### Time & Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n²) - correlated subqueries for counting |
| Space | O(n + m) - CTEs store all data |

## Solution Analysis

| Approach | Time | Space | Pros | Cons |
|----------|------|-------|------|------|
| Queue Simulation | O(n × m) | O(k) | Intuitive, uses counting logic | Nested queries can be slow |
| LEFT JOIN with Row Numbers | O(n log n) | O(n+m) | Clean set-based approach | Requires proper ranking logic |
| Iterative Variable | O(n²) | O(n+m) | Close to actual simulation | Complex, database-specific |

**Recommended:** Approach 1 (Queue Simulation with COUNT) - most intuitive and uses the key insight that we only need to count preferences and simulate consumption, not track individual students.

## Final Solution

```sql
-- Count students who are unable to eat
WITH PreferenceCounts AS (
    -- Count how many students prefer each sandwich type
    SELECT 
        PreferredSandwich AS sandwich_type, 
        COUNT(*) AS student_count
    FROM Students
    GROUP BY PreferredSandwich
),
SandwichStack AS (
    -- Get sandwiches in stack order with running count per type
    SELECT 
        SandwichType,
        SandwichId,
        ROW_NUMBER() OVER (PARTITION BY SandwichType ORDER BY SandwichId) AS type_sequence
    FROM Sandwiches
)
SELECT 
    (SELECT COUNT(*) FROM Students) - 
    -- Count successfully matched sandwiches
    (
        SELECT COUNT(*) 
        FROM SandwichStack ss
        JOIN PreferenceCounts pc ON ss.SandwichType = pc.sandwich_type
        WHERE ss.type_sequence <= pc.student_count
    ) AS unable_to_eat_count;
```

### Key Concepts

- **Queue Simulation**: Students form a FIFO queue, processed in order
- **Stack Consumption**: Sandwiches are LIFO - only the top is accessible
- **Preference Counting**: The key insight is counting preferences rather than tracking individual students
- **Match Condition**: A sandwich is taken if there are more students wanting it than same-type sandwiches above it
- **Termination**: Process stops when top sandwich has no matching student preference
