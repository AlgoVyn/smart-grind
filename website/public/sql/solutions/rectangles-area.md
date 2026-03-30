# 1459. Rectangles Area

## Problem

Given a table of points in a plane, report all possible rectangles which have a non-zero area, along with their areas. Two points form a diagonal of a rectangle.

### Schema

**Points Table:**
| Column Name  | Type    | Description |
|--------------|---------|-------------|
| Id           | int     | Primary Key |
| XCoordinate  | int     | X coordinate of the point |
| YCoordinate  | int     | Y coordinate of the point |

### Requirements

- Return: `Id1`, `Id2`, `area` where Id1 < Id2 (to avoid duplicates)
- Two points form a rectangle diagonal if they don't share x or y coordinates
- Area = |x2 - x1| × |y2 - y1|
- Rectangle must have non-zero area (diagonal points must differ in both coordinates)

---

## Approaches

### Approach 1: Self JOIN with Diagonal Condition (Recommended)

Self join points where they form valid diagonals (different x AND different y).

#### Algorithm

1. Self JOIN Points table with alias p1 and p2
2. Ensure p1.Id < p2.Id to avoid duplicates
3. Filter: p1.XCoordinate != p2.XCoordinate AND p1.YCoordinate != p2.YCoordinate
4. Calculate area: ABS(p1.X - p2.X) × ABS(p1.Y - p2.Y)

#### Implementation

```sql
SELECT 
    p1.Id AS Id1,
    p2.Id AS Id2,
    ABS(p1.XCoordinate - p2.XCoordinate) * 
    ABS(p1.YCoordinate - p2.YCoordinate) AS area
FROM Points p1
JOIN Points p2 
    ON p1.Id < p2.Id
    AND p1.XCoordinate != p2.XCoordinate
    AND p1.YCoordinate != p2.YCoordinate
ORDER BY area DESC, Id1, Id2;
```

#### Time & Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n²) |
| Space | O(1) |

---

### Approach 2: CROSS JOIN with Filtering

Use CROSS JOIN then filter for valid rectangle diagonals.

#### Algorithm

1. CROSS JOIN all combinations of points
2. Filter: Id1 < Id2 (remove self-pairs and duplicates)
3. Filter: X coordinates differ AND Y coordinates differ
4. Calculate area

#### Implementation

```sql
SELECT 
    p1.Id AS Id1,
    p2.Id AS Id2,
    ABS(p1.XCoordinate - p2.XCoordinate) * 
    ABS(p1.YCoordinate - p2.YCoordinate) AS area
FROM Points p1
CROSS JOIN Points p2
WHERE p1.Id < p2.Id
  AND p1.XCoordinate != p2.XCoordinate
  AND p1.YCoordinate != p2.YCoordinate
ORDER BY area DESC, Id1, Id2;
```

#### Time & Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n²) |
| Space | O(1) |

---

### Approach 3: INNER JOIN with Center and Distance Matching

Find rectangles by matching points that share the same center point and have equal Manhattan distances.

#### Algorithm

1. Calculate center point for each pair: ((x1+x2)/2, (y1+y2)/2)
2. Calculate squared distance from center for validation
3. Group pairs with same center and matching distance
4. This identifies actual rectangles formed by 4 points

#### Implementation

```sql
WITH PointPairs AS (
    SELECT 
        p1.Id AS Id1,
        p2.Id AS Id2,
        p1.XCoordinate AS x1,
        p1.YCoordinate AS y1,
        p2.XCoordinate AS x2,
        p2.YCoordinate AS y2,
        (p1.XCoordinate + p2.XCoordinate) / 2.0 AS center_x,
        (p1.YCoordinate + p2.YCoordinate) / 2.0 AS center_y,
        POWER(p1.XCoordinate - p2.XCoordinate, 2) + 
        POWER(p1.YCoordinate - p2.YCoordinate, 2) AS diag_sq
    FROM Points p1
    JOIN Points p2 ON p1.Id < p2.Id
    WHERE p1.XCoordinate != p2.XCoordinate 
      AND p1.YCoordinate != p2.YCoordinate
)
SELECT 
    pp1.Id1,
    pp1.Id2,
    ABS(pp1.x1 - pp1.x2) * ABS(pp1.y1 - pp1.y2) AS area
FROM PointPairs pp1
JOIN PointPairs pp2 
    ON pp1.center_x = pp2.center_x 
    AND pp1.center_y = pp2.center_y
    AND pp1.diag_sq = pp2.diag_sq
    AND pp1.Id1 != pp2.Id1
    AND pp1.Id1 != pp2.Id2
    AND pp1.Id2 != pp2.Id1
    AND pp1.Id2 != pp2.Id2
ORDER BY area DESC, Id1, Id2;
```

#### Time & Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n⁴) |
| Space | O(n²) |

---

## Solution Analysis

| Approach | Time | Space | Pros | Cons |
|----------|------|-------|------|------|
| Self JOIN with Diagonal | O(n²) | O(1) | Clean, efficient, standard | None major |
| CROSS JOIN with Filter | O(n²) | O(1) | Explicit about all pairs | Less efficient (generates more rows first) |
| Center/Distance Matching | O(n⁴) | O(n²) | Finds actual 4-point rectangles | Very slow, overkill for this problem |

**Recommended:** Approach 1 (Self JOIN with Diagonal Condition) - simplest and most efficient.

---

## Final Solution

```sql
SELECT 
    p1.Id AS Id1,
    p2.Id AS Id2,
    ABS(p1.XCoordinate - p2.XCoordinate) * 
    ABS(p1.YCoordinate - p2.YCoordinate) AS area
FROM Points p1
JOIN Points p2 
    ON p1.Id < p2.Id
    AND p1.XCoordinate != p2.XCoordinate
    AND p1.YCoordinate != p2.YCoordinate
ORDER BY area DESC, Id1, Id2;
```

### Key Concepts

- **Rectangle Diagonal Property**: Two points form a rectangle diagonal if they differ in BOTH x and y coordinates
- **Area Formula**: |x₂ - x₁| × |y₂ - y₁| (product of width and height)
- **Self JOIN with Id constraint**: p1.Id < p2.Id prevents duplicate pairs (p1,p2) and (p2,p1)
- **ABS() function**: Ensures positive area regardless of point ordering

### Example Walkthrough

For points: (0,0), (0,1), (1,0), (1,1), (2,2)

Valid rectangle diagonals:
- (0,0) and (1,1): area = |1-0| × |1-0| = 1
- (0,1) and (1,0): area = |1-0| × |0-1| = 1
- (0,0) and (2,2): area = |2-0| × |2-0| = 4

Invalid pairs (same x or y):
- (0,0) and (0,1): same x = line segment, not diagonal
- (0,0) and (1,0): same y = line segment, not diagonal

---

**Tags:** `#SQL` `#Geometry` `#SelfJOIN` #`MathematicalFunctions` `#LeetCode1459`
