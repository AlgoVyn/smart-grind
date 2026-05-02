# Convex Hull (Graham Scan / Monotone Chain)

## Category
Computational Geometry

## Description

The Convex Hull of a set of points is the smallest convex polygon containing all points. Used in computational geometry for collision detection, shape analysis, and geographic systems.

---

## Concepts

### 1. Monotone Chain Algorithm (Andrew's)

- Sort points by x-coordinate
- Build lower hull left to right
- Build upper hull right to left
- Use cross product for orientation

### 2. Cross Product

```python
cross(o, a, b) = (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x)

> 0: counter-clockwise turn
< 0: clockwise turn
= 0: collinear
```

### 3. Time Complexity

| Step | Complexity |
|------|------------|
| Sort | O(n log n) |
| Build hulls | O(n) |
| Total | O(n log n) |

---

## Frameworks

### Framework 1: Monotone Chain

```
┌─────────────────────────────────────────────────────────────┐
│  CONVEX HULL - MONOTONE CHAIN                                │
├─────────────────────────────────────────────────────────────┤
│  1. Sort points by (x, y)                                    │
│                                                              │
│  2. Build lower hull:                                        │
│     For each point p in sorted order:                        │
│       While len(lower) >= 2 and cross(lower[-2], lower[-1], p) <= 0:
│         lower.pop()                                          │
│       lower.append(p)                                          │
│                                                              │
│  3. Build upper hull:                                        │
│     For each point p in reversed(sorted):                    │
│       While len(upper) >= 2 and cross(upper[-2], upper[-1], p) <= 0:
│         upper.pop()                                          │
│       upper.append(p)                                          │
│                                                              │
│  4. Return lower[:-1] + upper[:-1]                            │
└─────────────────────────────────────────────────────────────┘
```

---

## Forms

### Form 1: Convex Hull (Vertices Only)

Return only the vertices of the hull.

| Aspect | Details |
|--------|---------|
| **Output** | List of hull points |
| **Time** | O(n log n) |
| **Cross** | <= 0 removes collinear |

### Form 2: With Collinear Points

Include points on hull edges.

| Aspect | Details |
|--------|---------|
| **Cross** | < 0 keeps collinear |
| **Use** | Fence problems |

---

## Tactics

### Tactic 1: Convex Hull

```python
def convex_hull(points):
    if len(points) <= 1:
        return points
    
    points = sorted(points)
    
    def cross(o, a, b):
        return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
    
    lower = []
    for p in points:
        while len(lower) >= 2 and cross(lower[-2], lower[-1], p) <= 0:
            lower.pop()
        lower.append(p)
    
    upper = []
    for p in reversed(points):
        while len(upper) >= 2 and cross(upper[-2], upper[-1], p) <= 0:
            upper.pop()
        upper.append(p)
    
    return lower[:-1] + upper[:-1]
```

---

## Python Templates

### Template 1: Convex Hull

```python
def convex_hull(points):
    """
    Convex hull using monotone chain algorithm.
    
    Time: O(n log n)
    Space: O(n)
    """
    if len(points) <= 1:
        return points
    
    points = sorted(points)
    
    def cross(o, a, b):
        return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
    
    lower = []
    for p in points:
        while len(lower) >= 2 and cross(lower[-2], lower[-1], p) <= 0:
            lower.pop()
        lower.append(p)
    
    upper = []
    for p in reversed(points):
        while len(upper) >= 2 and cross(upper[-2], upper[-1], p) <= 0:
            upper.pop()
        upper.append(p)
    
    return lower[:-1] + upper[:-1]
```

---

## Practice Problems

### Problem 1: Erect the Fence
**Problem:** [LeetCode 587](https://leetcode.com/problems/erect-the-fence/)

### Problem 2: Largest Triangle Area
**Problem:** [LeetCode 812](https://leetcode.com/problems/largest-triangle-area/)

---

## Summary

Convex Hull:
- Monotone chain: O(n log n)
- Sort by x, then build lower and upper hulls
- Cross product determines turn direction
- Applications in geometry and graphics
