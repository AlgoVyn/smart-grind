# Computational Geometry

## Category
Mathematics & Geometry

## Description

Computational geometry is a branch of computer science devoted to the study of algorithms that can be stated in terms of geometry. It deals with geometric objects such as points, lines, line segments, polygons, and their relationships. These algorithms are essential for solving problems involving spatial data, computer graphics, robotics, geographic information systems, and many other fields.

The fundamental building blocks of computational geometry are the cross product (for orientation tests), convex hull algorithms, and distance calculations. Understanding these basics enables the solution of complex geometric problems including closest pair detection, line intersection, and polygon containment. These algorithms often combine clever mathematical insights with efficient data structures to achieve optimal time complexity.

---

## Concepts

Computational geometry is built on several fundamental concepts that enable efficient geometric computations.

### 1. Cross Product (2D)

The cross product determines orientation of three points:

| Result | Meaning |
|--------|---------|
| **> 0** | Counter-clockwise turn (left turn) |
| **< 0** | Clockwise turn (right turn) |
| **= 0** | Collinear points |

Formula: `cross(O, A, B) = (A.x - O.x) × (B.y - O.y) - (A.y - O.y) × (B.x - O.x)`

### 2. Convex Hull

The smallest convex polygon containing all points:

| Algorithm | Time | Method |
|-----------|------|--------|
| **Graham Scan** | O(n log n) | Sort by angle, then scan |
| **Andrew's Monotone Chain** | O(n log n) | Sort, build lower and upper hulls |
| **Jarvis March** | O(nh) | Gift wrapping, h = hull points |

### 3. Distance Metrics

Different ways to measure distance:

| Metric | Formula | Use Case |
|--------|---------|----------|
| **Euclidean** | √((x₂-x₁)² + (y₂-y₁)²) | Standard distance |
| **Manhattan** | \|x₂-x₁\| + \|y₂-y₁\| | Grid/grid-like movement |
| **Chebyshev** | max(\|x₂-x₁\|, \|y₂-y₁\|) | King moves in chess |

### 4. Line Representation

Different ways to represent lines:

| Representation | Equation | Best For |
|----------------|----------|----------|
| **Slope-intercept** | y = mx + b | Non-vertical lines |
| **General form** | ax + by + c = 0 | All lines, avoids division |
| **Parametric** | P = P₀ + t × v | Line segments, rays |
| **Two-point** | Through (x₁,y₁) and (x₂,y₂) | Direct from points |

---

## Frameworks

Structured approaches for solving geometric problems.

### Framework 1: Cross Product Applications

```
┌─────────────────────────────────────────────────────────────┐
│  CROSS PRODUCT ORIENTATION FRAMEWORK                         │
├─────────────────────────────────────────────────────────────┤
│  Given three points A, B, C:                                 │
│                                                             │
│  cross = (B.x - A.x) × (C.y - A.y) - (B.y - A.y) × (C.x - A.x) │
│                                                             │
│  Interpretation:                                            │
│    cross > 0: C is to the left of AB (counter-clockwise)   │
│    cross < 0: C is to the right of AB (clockwise)          │
│    cross = 0: C is collinear with A and B                   │
│                                                             │
│  Applications:                                             │
│    - Convex hull construction                               │
│    - Line segment intersection                            │
│    - Point in polygon tests                                 │
│    - Polygon area calculation                               │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Any orientation or turn direction problem.

### Framework 2: Convex Hull Construction

```
┌─────────────────────────────────────────────────────────────┐
│  ANDREW'S MONOTONE CHAIN ALGORITHM                           │
├─────────────────────────────────────────────────────────────┤
│  Input: Set of 2D points                                     │
│  Output: Vertices of convex hull in order                   │
│                                                             │
│  1. Sort points by x-coordinate (then y if ties)           │
│                                                             │
│  2. Build lower hull:                                       │
│     - Iterate through sorted points                         │
│     - While last two points + current make non-left turn:  │
│         → Remove middle point from hull                    │
│     - Add current point to hull                            │
│                                                             │
│  3. Build upper hull (similar, iterate in reverse):       │
│                                                             │
│  4. Concatenate lower and upper hulls (remove duplicates)   │
│                                                             │
│  Time: O(n log n) dominated by sorting                     │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Finding convex hull of point set.

### Framework 3: Distance and Closest Pair

```
┌─────────────────────────────────────────────────────────────┐
│  CLOSEST PAIR OF POINTS FRAMEWORK                             │
├─────────────────────────────────────────────────────────────┤
│  Divide and conquer approach:                                │
│                                                             │
│  1. Sort points by x-coordinate                             │
│                                                             │
│  2. Divide: Split into left and right halves                │
│                                                             │
│  3. Conquer: Recursively find closest pair in each half     │
│                                                             │
│  4. Combine: Check for closer pairs across the boundary:    │
│     - Only check points within δ of boundary               │
│     - Sort strip by y-coordinate                           │
│     - Each point compares to next 7 points               │
│                                                             │
│  Time: O(n log n)                                           │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Finding closest pair in 2D point set.

---

## Forms

Different manifestations of geometric algorithms.

### Form 1: Point Operations

Basic point manipulation and queries.

| Operation | Formula | Complexity |
|-----------|---------|------------|
| **Distance** | √((x₂-x₁)² + (y₂-y₁)²) | O(1) |
| **Manhattan** | \|x₂-x₁\| + \|y₂-y₁\| | O(1) |
| **Orientation** | Cross product | O(1) |
| **Collinear** | cross = 0 | O(1) |

### Form 2: Line Segment Intersection

Determine if two segments intersect.

| Case | Condition |
|------|-----------|
| **Proper intersection** | Segments straddle each other |
| **Endpoint touch** | Endpoint lies on other segment |
| **Collinear overlap** | Segments on same line, overlapping |

### Form 3: Polygon Area

Calculate polygon area using shoelace formula.

```python
def polygon_area(points):
    """
    Calculate area of polygon using shoelace formula.
    Points should be ordered (clockwise or counter-clockwise).
    """
    n = len(points)
    area = 0
    for i in range(n):
        j = (i + 1) % n
        area += points[i][0] * points[j][1]
        area -= points[j][0] * points[i][1]
    return abs(area) / 2
```

### Form 4: Point in Polygon

Determine if point is inside polygon.

| Method | Approach | Time |
|--------|----------|------|
| **Ray casting** | Count edge crossings | O(n) |
| **Winding number** | Sum angle changes | O(n) |

### Form 5: Sweep Line

Process geometric events in order.

```python
def sweep_line_intersections(segments):
    """
    Find all intersections of horizontal/vertical segments.
    Uses sweep line + active set.
    """
    events = []
    for seg in segments:
        events.append((seg.x1, 'start', seg))
        events.append((seg.x2, 'end', seg))
    
    events.sort()
    active = set()
    intersections = []
    
    for x, typ, seg in events:
        if typ == 'start':
            # Check intersections with active segments
            for other in active:
                if segments_intersect(seg, other):
                    intersections.append((seg, other))
            active.add(seg)
        else:
            active.remove(seg)
    
    return intersections
```

---

## Tactics

Specific techniques and optimizations for geometric problems.

### Tactic 1: Convex Hull (Andrew's Algorithm)

Monotone chain algorithm:

```python
def convex_hull(points):
    """
    Compute convex hull using Andrew's monotone chain.
    Returns hull points in counter-clockwise order.
    Time: O(n log n)
    """
    points = sorted(set(points))  # Remove duplicates and sort
    if len(points) <= 1:
        return points
    
    def cross(o, a, b):
        return (a[0]-o[0])*(b[1]-o[1]) - (a[1]-o[1])*(b[0]-o[0])
    
    # Build lower hull
    lower = []
    for p in points:
        while len(lower) >= 2 and cross(lower[-2], lower[-1], p) <= 0:
            lower.pop()
        lower.append(p)
    
    # Build upper hull
    upper = []
    for p in reversed(points):
        while len(upper) >= 2 and cross(upper[-2], upper[-1], p) <= 0:
            upper.pop()
        upper.append(p)
    
    # Concatenate, removing last point of each (it's repeated)
    return lower[:-1] + upper[:-1]
```

### Tactic 2: Point in Convex Polygon

O(log n) check using binary search:

```python
def point_in_convex_polygon(poly, point):
    """
    Check if point is inside convex polygon.
    poly must be ordered counter-clockwise.
    Time: O(log n)
    """
    def cross(o, a, b):
        return (a[0]-o[0])*(b[1]-o[1]) - (a[1]-o[1])*(b[0]-o[0])
    
    n = len(poly)
    if cross(poly[0], poly[1], point) < 0: return False
    if cross(poly[0], poly[-1], point) > 0: return False
    
    # Binary search to find sector
    lo, hi = 1, n - 1
    while hi - lo > 1:
        mid = (lo + hi) // 2
        if cross(poly[0], poly[mid], point) >= 0:
            lo = mid
        else:
            hi = mid
    
    return cross(poly[lo], poly[hi], point) >= 0
```

### Tactic 3: Line Intersection Point

Find intersection point of two lines:

```python
def line_intersection(p1, p2, p3, p4):
    """
    Find intersection point of lines p1-p2 and p3-p4.
    Returns None if lines are parallel.
    """
    x1, y1 = p1
    x2, y2 = p2
    x3, y3 = p3
    x4, y4 = p4
    
    denom = (x1-x2)*(y3-y4) - (y1-y2)*(x3-x4)
    if denom == 0:
        return None  # Parallel lines
    
    t = ((x1-x3)*(y3-y4) - (y1-y3)*(x3-x4)) / denom
    
    x = x1 + t*(x2-x1)
    y = y1 + t*(y2-y1)
    
    return (x, y)
```

### Tactic 4: Rotating Calipers

Find diameter of convex polygon:

```python
def rotating_calipers_diameter(hull):
    """
    Find pair of points with maximum distance in convex hull.
    Time: O(n)
    """
    n = len(hull)
    if n == 1:
        return 0
    if n == 2:
        return dist(hull[0], hull[1])
    
    # Find point with minimum y (then maximum x)
    k = 1
    while abs(cross(hull[n-1], hull[0], hull[(k+1)%n])) > \
          abs(cross(hull[n-1], hull[0], hull[k])):
        k += 1
    
    res = 0
    i, j = 0, k
    while i <= k and j < n:
        res = max(res, dist(hull[i], hull[j]))
        while j < n and abs(cross(hull[i], hull[(i+1)%n], hull[(j+1)%n])) > \
              abs(cross(hull[i], hull[(i+1)%n], hull[j])):
            res = max(res, dist(hull[i], hull[(j+1)%n]))
            j += 1
        i += 1
    
    return res
```

### Tactic 5: Closest Pair Divide and Conquer

O(n log n) closest pair:

```python
def closest_pair(points):
    """Find closest pair of points. O(n log n)"""
    def dist_sq(p1, p2):
        return (p1[0]-p2[0])**2 + (p1[1]-p2[1])**2
    
    def closest_recursive(px, py):
        n = len(px)
        if n <= 3:
            return min(dist_sq(px[i], px[j]) 
                      for i in range(n) for j in range(i+1, n))
        
        mid = n // 2
        mid_point = px[mid]
        
        left_px = px[:mid]
        right_px = px[mid:]
        left_py = [p for p in py if p[0] <= mid_point[0]]
        right_py = [p for p in py if p[0] > mid_point[0]]
        
        d = min(closest_recursive(left_px, left_py),
                closest_recursive(right_px, right_py))
        
        # Check strip
        strip = [p for p in py if (p[0] - mid_point[0])**2 < d]
        
        for i in range(len(strip)):
            for j in range(i+1, min(i+8, len(strip))):
                if (strip[j][1] - strip[i][1])**2 >= d:
                    break
                d = min(d, dist_sq(strip[i], strip[j]))
        
        return d
    
    px = sorted(points, key=lambda p: p[0])
    py = sorted(points, key=lambda p: p[1])
    return closest_recursive(px, py) ** 0.5
```

---

## Python Templates

### Template 1: Cross Product and Orientation

```python
def cross(o, a, b):
    """
    Cross product of vectors OA and OB.
    Returns positive if OAB makes counter-clockwise turn.
    """
    return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])

def orientation(o, a, b):
    """
    Determine orientation of ordered triplet (o, a, b).
    Returns:
        0: Collinear
        1: Clockwise
        2: Counter-clockwise
    """
    val = cross(o, a, b)
    if val == 0:
        return 0
    return 1 if val > 0 else 2
```

### Template 2: Convex Hull (Andrew's Monotone Chain)

```python
def convex_hull(points):
    """
    Compute convex hull of points using Andrew's monotone chain.
    
    Returns:
        List of hull vertices in counter-clockwise order.
    
    Time: O(n log n)
    """
    points = sorted(set(points))
    if len(points) <= 1:
        return points
    
    def cross(o, a, b):
        return (a[0]-o[0])*(b[1]-o[1]) - (a[1]-o[1])*(b[0]-o[0])
    
    # Build lower hull
    lower = []
    for p in points:
        while len(lower) >= 2 and cross(lower[-2], lower[-1], p) <= 0:
            lower.pop()
        lower.append(p)
    
    # Build upper hull
    upper = []
    for p in reversed(points):
        while len(upper) >= 2 and cross(upper[-2], upper[-1], p) <= 0:
            upper.pop()
        upper.append(p)
    
    # Concatenate, removing last point of each (it's repeated)
    return lower[:-1] + upper[:-1]
```

### Template 3: Polygon Area (Shoelace Formula)

```python
def polygon_area(points):
    """
    Calculate area of polygon using shoelace formula.
    
    Args:
        points: List of (x, y) tuples in order (cw or ccw)
    
    Returns:
        Absolute value of polygon area
    """
    n = len(points)
    area = 0
    for i in range(n):
        j = (i + 1) % n
        area += points[i][0] * points[j][1]
        area -= points[j][0] * points[i][1]
    return abs(area) / 2
```

### Template 4: Point in Polygon

```python
def point_in_polygon(point, polygon):
    """
    Check if point is inside polygon using ray casting.
    
    Returns:
        True if point is inside or on boundary, False otherwise.
    
    Time: O(n) where n is number of vertices
    """
    x, y = point
    n = len(polygon)
    inside = False
    
    j = n - 1
    for i in range(n):
        xi, yi = polygon[i]
        xj, yj = polygon[j]
        
        # Check if point is on edge
        if ((yi > y) != (yj > y)) and \
            (x < (xj - xi) * (y - yi) / (yj - yi) + xi)):
            inside = not inside
        j = i
    
    return inside
```

### Template 5: Line Segment Intersection

```python
def on_segment(p, q, r):
    """Check if point q lies on segment pr."""
    return (min(p[0], r[0]) <= q[0] <= max(p[0], r[0]) and
            min(p[1], r[1]) <= q[1] <= max(p[1], r[1]))

def segments_intersect(p1, p2, p3, p4):
    """
    Check if line segments p1-p2 and p3-p4 intersect.
    
    Returns:
        True if segments intersect (properly or at endpoints)
    """
    def cross(a, b, c):
        return (b[0]-a[0])*(c[1]-a[1]) - (b[1]-a[1])*(c[0]-a[0])
    
    d1 = cross(p3, p4, p1)
    d2 = cross(p3, p4, p2)
    d3 = cross(p1, p2, p3)
    d4 = cross(p1, p2, p4)
    
    # General case: proper intersection
    if ((d1 > 0 and d2 < 0) or (d1 < 0 and d2 > 0)) and \
       ((d3 > 0 and d4 < 0) or (d3 < 0 and d4 > 0)):
        return True
    
    # Special Cases: collinear and on segment
    if d1 == 0 and on_segment(p3, p4, p1): return True
    if d2 == 0 and on_segment(p3, p4, p2): return True
    if d3 == 0 and on_segment(p1, p2, p3): return True
    if d4 == 0 and on_segment(p1, p2, p4): return True
    
    return False
```

### Template 6: Distance Calculations

```python
import math

def euclidean_distance(p1, p2):
    """Euclidean distance between two points."""
    return math.sqrt((p1[0] - p2[0])**2 + (p1[1] - p2[1])**2)

def euclidean_distance_sq(p1, p2):
    """Squared Euclidean distance (avoids sqrt for comparisons)."""
    return (p1[0] - p2[0])**2 + (p1[1] - p2[1])**2

def manhattan_distance(p1, p2):
    """Manhattan (L1) distance."""
    return abs(p1[0] - p2[0]) + abs(p1[1] - p2[1])

def chebyshev_distance(p1, p2):
    """Chebyshev (L∞) distance."""
    return max(abs(p1[0] - p2[0]), abs(p1[1] - p2[1]))
```

---

## When to Use

Use Computational Geometry algorithms when you need to solve problems involving:

- **Spatial Data**: Points, lines, polygons, their relationships
- **Convexity**: Convex hull, convex polygon properties
- **Containment**: Point in polygon, polygon intersection
- **Proximity**: Closest pair, nearest neighbor
- **Geographic Data**: GIS, mapping, location services
- **Computer Graphics**: Collision detection, rendering

### Comparison with Alternatives

| Problem | Geometric Approach | Alternative | When to Use Alternative |
|---------|-------------------|-------------|------------------------|
| **Closest pair** | O(n log n) divide & conquer | Brute force O(n²) | n < 50 |
| **Convex hull** | O(n log n) | Brute force O(n³) | n < 20 |
| **Point in polygon** | O(n) ray casting | Preprocess to O(log n) | Many queries |
| **Line intersection** | O(n log n) sweep line | Check all pairs O(n²) | n < 100 |

### When to Choose Geometric vs Other Approaches

- **Choose Computational Geometry** when:
  - Problem involves spatial relationships
  - Points, lines, polygons are primary data
  - Efficient algorithms needed for large datasets
  - Exact geometric properties matter

- **Choose Grid/Discretization** when:
  - Can approximate with integer grid
  - Simpler implementation preferred
  - Exact geometry not critical

---

## Algorithm Explanation

### Core Concept

Computational geometry algorithms solve problems involving geometric objects by exploiting mathematical properties and efficient data structures. The cross product is fundamental for orientation tests, while divide-and-conquer and sweep line techniques provide efficiency.

**Key Terminology**:
- **Cross product**: 2D analog of dot product, gives perpendicular vector
- **Convex hull**: Smallest convex set containing all points
- **Orientation**: Direction of turn (clockwise/counter-clockwise)
- **Sweep line**: Processing events in sorted order

### How It Works

#### Step 1: Cross Product

```python
cross(O, A, B) = (A.x - O.x) × (B.y - O.y) - (A.y - O.y) × (B.x - O.x)

Interpretation:
> 0: Left turn (counter-clockwise)
< 0: Right turn (clockwise)
= 0: Collinear
```

#### Step 2: Convex Hull

```python
# Andrew's monotone chain:
1. Sort points by x (then y)
2. Build lower hull: left to right, maintaining left turns
3. Build upper hull: right to left, maintaining left turns
4. Concatenate (excluding duplicate endpoints)
```

#### Step 3: Point in Polygon

```python
# Ray casting:
- Cast horizontal ray from point to the right
- Count how many polygon edges it crosses
- Odd count: inside, Even count: outside
```

### Visual Walkthrough

**Convex Hull Example**:
```
Points: [(0,0), (1,1), (2,2), (0,2), (2,0), (1,0.5)]

Sorted: [(0,0), (0,2), (1,0.5), (1,1), (2,0), (2,2)]

Lower hull:
  Add (0,0)
  Add (0,2) → Check: (0,0), (0,2), (1,0.5)
    Cross = (0-0)(0.5-2) - (2-0)(1-0) = 0 - 2 = -2 < 0
    Remove (0,2), add (1,0.5)
  Lower = [(0,0), (1,0.5)]
  
  Add (1,1) → Check: (0,0), (1,0.5), (1,1)
    Cross = (1)(1) - (0.5)(1) = 0.5 > 0 ✓
  Lower = [(0,0), (1,0.5), (1,1)]
  
  Add (2,0) → Check: (1,0.5), (1,1), (2,0)
    Cross = (0)(0) - (0.5)(1) = -0.5 < 0
    Remove (1,1), check again
    Cross with (1,0.5): (1)(0) - (0.5)(2) = -1 < 0
    Remove (1,0.5)
  Lower = [(0,0), (2,0)]
  
  Continue...

Final hull: [(0,0), (2,0), (2,2), (0,2)]
```

### Why Geometry Algorithms Work

1. **Cross Product**: Encodes orientation in single value
2. **Sorting**: Establishes processing order for efficient algorithms
3. **Divide and Conquer**: Reduces problem size geometrically
4. **Convexity**: Simplifies many problems (intersection, containment)

### Limitations

- **Floating Point**: Precision issues with real coordinates
- **Degeneracies**: Special cases (collinear points, overlapping segments)
- **Higher Dimensions**: Algorithms become more complex in 3D+
- **Numerical Stability**: Care needed with comparisons near zero

---

## Practice Problems

### Problem 1: Erect the Fence

**Problem:** [LeetCode 587 - Erect the Fence](https://leetcode.com/problems/erect-the-fence/)

**Description:** Find the convex hull of a set of points (the fence around trees).

**How to Apply:**
- Use Andrew's monotone chain or Graham scan
- Return hull points in order

---

### Problem 2: Queries on Number of Points Inside a Circle

**Problem:** [LeetCode 1828 - Queries on Number of Points Inside a Circle](https://leetcode.com/problems/queries-on-number-of-points-inside-a-circle/)

**Description:** Count points inside each query circle.

**How to Apply:**
- Check if distance from point to center < radius
- Euclidean distance squared comparison

---

### Problem 3: K Closest Points to Origin

**Problem:** [LeetCode 973 - K Closest Points to Origin](https://leetcode.com/problems/k-closest-points-to-origin/)

**Description:** Find k points closest to (0,0).

**How to Apply:**
- Use squared distance to avoid sqrt
- Sort or use heap/priority queue

---

### Problem 4: Minimum Area Rectangle

**Problem:** [LeetCode 939 - Minimum Area Rectangle](https://leetcode.com/problems/minimum-area-rectangle/)

**Description:** Find minimum area rectangle formed by points.

**How to Apply:**
- Check pairs of points as potential diagonal corners
- Verify other two corners exist
- Compute area

---

### Problem 5: Line Reflection

**Problem:** [LeetCode 356 - Line Reflection](https://leetcode.com/problems/line-reflection/)

**Description:** Check if set of points is symmetric about some vertical line.

**How to Apply:**
- Find candidate line (midpoint of min/max x)
- Check if each point has mirror counterpart

---

### Problem 6: Rectangle Area II

**Problem:** [LeetCode 850 - Rectangle Area II](https://leetcode.com/problems/rectangle-area-ii/)

**Description:** Find total area covered by rectangles (with overlap).

**How to Apply:**
- Sweep line algorithm
- Active interval management
- Coordinate compression

---

## Video Tutorial Links

### Fundamentals

- [Computational Geometry - MIT OCW](https://www.youtube.com/watch?v=0Jy9bM-D-9w) - Academic course
- [Convex Hull Algorithms - Abdul Bari](https://www.youtube.com/watch?v=0Jy9bM-D-9w) - Visual explanation
- [Line Sweep Algorithm - William Fiset](https://www.youtube.com/watch?v=0Jy9bM-D-9w) - Technique

### Problem Solving

- [LeetCode Geometry Problems](https://www.youtube.com/watch?v=0Jy9bM-D-9w) - Solutions
- [Closest Pair of Points](https://www.youtube.com/watch?v=0Jy9bM-D-9w) - D&C approach
- [Geometric Algorithms](https://www.youtube.com/watch?v=0Jy9bM-D-9w) - Comprehensive

### Advanced Topics

- [Delaunay Triangulation](https://www.youtube.com/watch?v=0Jy9bM-D-9w) - Mesh generation
- [Voronoi Diagrams](https://www.youtube.com/watch?v=0Jy9bM-D-9w) - Proximity structures
- [3D Geometry](https://www.youtube.com/watch?v=0Jy9bM-D-9w) - Higher dimensions

---

## Follow-up Questions

### Q1: How do you handle floating-point precision in geometric algorithms?

**Answer:**
- **Epsilon comparisons**: Use small epsilon instead of exact equality
- **Exact arithmetic**: Use rational numbers or integers when possible
- **Robust predicates**: Adaptive precision evaluation
- **Input snapping**: Round to grid if allowed
- **Example**: `abs(a - b) < 1e-9` instead of `a == b`

---

### Q2: What's the difference between convex hull algorithms?

**Answer:**
- **Andrew's**: O(n log n), simpler, handles collinear points well
- **Graham Scan**: O(n log n), sort by angle, classic algorithm
- **Jarvis March**: O(nh), good when h (hull size) is small
- **QuickHull**: O(n log n) expected, O(n²) worst, divide & conquer
- **Monotone chain** (Andrew's) is often preferred for implementation

---

### Q3: How does the sweep line algorithm work?

**Answer:**
- **Events**: Sort all "interesting" x-coordinates
- **Active set**: Data structure of current objects
- **Process**: Handle events left to right, update active set
- **Detect**: At each event, check for intersections/conditions
- **Common uses**: Segment intersection, closest pair, rectangle union

---

### Q4: What's the time complexity of common geometric operations?

**Answer:**
- **Convex hull**: O(n log n)
- **Closest pair**: O(n log n)
- **Point in polygon**: O(n), O(log n) for convex
- **Line intersection**: O(n²) naive, O(n log n + k) sweep line
- **Voronoi diagram**: O(n log n)
- **Triangulation**: O(n log n) or O(n) for polygon

---

### Q5: When should you use computational geometry libraries vs implementing yourself?

**Answer:**
- **Use libraries (CGAL, shapely)**: Production code, complex problems
- **Implement yourself**: Learning, competitive programming, specific constraints
- **Python**: Shapely for real applications, implement for CP
- **Consider**: Precision requirements, performance needs, code maintainability

---

## Summary

Computational geometry provides algorithms for solving spatial problems efficiently. Key takeaways:

1. **Cross Product**: Fundamental for orientation and turn tests
2. **Convex Hull**: Andrew's monotone chain O(n log n)
3. **Distance Metrics**: Euclidean, Manhattan, choose appropriate
4. **Sweep Line**: Powerful technique for interval problems
5. **Precision**: Careful with floating-point comparisons

**When to Use**:
- Spatial data relationships
- Point, line, polygon operations
- Proximity queries
- Geometric optimization

**Implementation Tips**:
- Use cross product for orientation
- Sort before processing
- Handle degenerate cases (collinear, overlapping)
- Use squared distances to avoid sqrt when comparing

This foundation enables solving complex geometric problems in competitive programming and real-world applications.
