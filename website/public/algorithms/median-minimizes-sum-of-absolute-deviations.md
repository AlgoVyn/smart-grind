# Median Minimizes Sum of Absolute Deviations

## Category
Mathematics

## Description

The median is the value that minimizes the sum of absolute deviations. For any set of numbers, the point that minimizes Σ|x_i - c| is the median (any point between the two middle values for even counts). This property makes the median the optimal choice for minimizing L1 distance and finding optimal positioning in one-dimensional problems.

This mathematical property has wide applications in statistics, facility location problems, and optimization. Unlike the mean which minimizes squared error (L2), the median minimizes absolute error (L1) and is more robust to outliers. Understanding this principle is essential for solving warehouse location problems, meeting point optimization, and robust statistical estimation.

---

## Concepts

The median's optimality property is built on fundamental mathematical concepts.

### 1. L1 vs L2 Minimization

Different norms give different optimal points:

| Norm | Formula | Minimizer | Use Case |
|------|---------|-----------|----------|
| **L1 (Manhattan)** | Σ\|x_i - c\| | **Median** | Robust estimation, facility location |
| **L2 (Euclidean)** | Σ(x_i - c)² | **Mean** | Least squares, standard statistics |
| **L∞ (Chebyshev)** | max\|x_i - c\| | Midpoint of range | Minimax problems |

### 2. Why Median Minimizes L1

Mathematical explanation:

| Condition | Optimal Point | Reason |
|-----------|---------------|--------|
| **Odd count** | Middle element | Equal number of points on each side |
| **Even count** | Any point between two middle values | Same total distance from all points |
| **Derivative** | Zero when c = median | Sum of sign(x_i - c) = 0 |

For even count n, any c in [x_{n/2}, x_{n/2+1}] minimizes the sum.

### 3. Weighted Median

Extension to weighted points:

| Concept | Definition |
|---------|------------|
| **Weighted Median** | Point where cumulative weight reaches half total |
| **Property** | Minimizes Σw_i × \|x_i - c\| |
| **Computation** | Sort by value, find where cumulative weight ≥ W/2 |

### 4. Multidimensional Extension

Generalizing to higher dimensions:

| Dimension | Optimal Point | Computation |
|-----------|---------------|-------------|
| **1D** | Median | Sort, pick middle |
| **2D (Manhattan)** | (median_x, median_y) | Independent medians |
| **2D (Euclidean)** | Geometric median | Iterative Weiszfeld's algorithm |

---

## Frameworks

Structured approaches for applying the median minimization property.

### Framework 1: Optimal 1D Position

```
┌─────────────────────────────────────────────────────────────┐
│  OPTIMAL 1D POSITION FRAMEWORK                                  │
├─────────────────────────────────────────────────────────────┤
│  Input: List of points x₁, x₂, ..., xₙ                      │
│  Output: Point c minimizing Σ|x_i - c|                      │
│                                                                │
│  1. Sort the points: x_{(1)} ≤ x_{(2)} ≤ ... ≤ x_{(n)}      │
│                                                                │
│  2. Find median:                                               │
│     If n is odd:                                               │
│       median = x_{(n//2)}  (0-indexed: x_{(n//2)})           │
│     If n is even:                                              │
│       median = any c in [x_{(n//2-1)}, x_{(n//2)}]          │
│       (commonly pick x_{(n//2)})                              │
│                                                                │
│  3. Compute minimum sum:                                       │
│     min_sum = Σ|x_i - median|                                  │
│                                                                │
│  Time: O(n log n) for sort, O(n) for linear selection       │
│  Space: O(1) or O(n)                                          │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Finding optimal position on a line.

### Framework 2: 2D Manhattan Distance

```
┌─────────────────────────────────────────────────────────────┐
│  2D MANHATTAN DISTANCE FRAMEWORK                              │
├─────────────────────────────────────────────────────────────┤
│  Input: List of 2D points (x₁,y₁), (x₂,y₂), ..., (xₙ,yₙ)    │
│  Output: Point minimizing Σ(|x_i - c_x| + |y_i - c_y|)      │
│                                                                │
│  Key Insight: Manhattan distance is separable!               │
│  Σ(|x_i - c_x| + |y_i - c_y|) = Σ|x_i - c_x| + Σ|y_i - c_y| │
│                                                                │
│  1. Extract x-coordinates and y-coordinates separately        │
│     xs = [x₁, x₂, ..., xₙ]                                   │
│     ys = [y₁, y₂, ..., yₙ]                                   │
│                                                                │
│  2. Find medians independently:                              │
│     c_x = median(xs)                                           │
│     c_y = median(ys)                                           │
│                                                                │
│  3. Optimal point = (c_x, c_y)                               │
│     min_sum = Σ|x_i - c_x| + Σ|y_i - c_y|                   │
│                                                                │
│  Time: O(n log n)                                              │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Best meeting point in Manhattan geometry.

### Framework 3: Weighted Median

```
┌─────────────────────────────────────────────────────────────┐
│  WEIGHTED MEDIAN FRAMEWORK                                    │
├─────────────────────────────────────────────────────────────┤
│  Input: Points x_i with weights w_i                          │
│  Output: c minimizing Σw_i × |x_i - c|                       │
│                                                                │
│  1. Create pairs (x_i, w_i)                                  │
│                                                                │
│  2. Sort pairs by x_i                                        │
│                                                                │
│  3. Find weighted median:                                     │
│     total_weight = Σw_i                                        │
│     cumulative = 0                                             │
│     For each pair in sorted order:                           │
│       cumulative += w_i                                        │
│       If cumulative >= total_weight / 2:                     │
│         Return x_i                                             │
│                                                                │
│  Note: Weighted median minimizes weighted sum of distances     │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Points have different importance/weights.

---

## Forms

Different manifestations of median minimization.

### Form 1: Standard Median

Basic median for unweighted points.

| Aspect | Details |
|--------|---------|
| **Odd n** | Middle element |
| **Even n** | Any point between two middle values |
| **Time** | O(n log n) sort, or O(n) quickselect |
| **Use** | General minimization |

### Form 2: Weighted Median

For points with different weights.

| Aspect | Details |
|--------|---------|
| **Definition** | Point where cumulative weight ≥ total/2 |
| **Use** | Importance-weighted optimization |
| **Example** | Population-weighted facility location |

### Form 3: Geometric Median

For Euclidean distance in 2D+.

| Aspect | Details |
|--------|---------|
| **Property** | Minimizes Σ Euclidean distance |
| **Algorithm** | Weiszfeld's iterative algorithm |
| **Note** | Not the same as coordinate-wise median |

### Form 4: K-Medians

Generalization to k clusters.

| Aspect | Details |
|--------|---------|
| **Problem** | Partition into k groups, find k medians |
| **Algorithm** | Similar to k-means but with L1 norm |
| **Complexity** | NP-hard in general, DP for 1D |

---

## Tactics

Specific techniques and optimizations.

### Tactic 1: Standard Median Minimization

Find point minimizing sum of absolute deviations:

```python
def min_sum_absolute_diff(nums):
    """
    Find minimum sum of absolute differences.
    Time: O(n log n), Space: O(1)
    """
    nums_sorted = sorted(nums)
    n = len(nums)
    
    # Median minimizes sum of absolute deviations
    median = nums_sorted[n // 2]
    
    min_sum = sum(abs(x - median) for x in nums)
    return median, min_sum
```

### Tactic 2: Linear Time with Quickselect

O(n) average case:

```python
def quick_select(nums, k):
    """Find kth smallest element (0-indexed)."""
    if not nums:
        return None
    
    pivot = nums[len(nums) // 2]
    left = [x for x in nums if x < pivot]
    mid = [x for x in nums if x == pivot]
    right = [x for x in nums if x > pivot]
    
    if k < len(left):
        return quick_select(left, k)
    elif k < len(left) + len(mid):
        return pivot
    else:
        return quick_select(right, k - len(left) - len(mid))

def median_linear(nums):
    """O(n) average case median finding."""
    n = len(nums)
    return quick_select(nums[:], n // 2)
```

### Tactic 3: 2D Manhattan Distance

Optimal meeting point:

```python
def min_manhattan_distance_2d(points):
    """
    Find point minimizing sum of Manhattan distances.
    Median of x and y coordinates separately.
    """
    if not points:
        return None, 0
    
    xs = [p[0] for p in points]
    ys = [p[1] for p in points]
    
    xs.sort()
    ys.sort()
    
    n = len(points)
    median_x = xs[n // 2]
    median_y = ys[n // 2]
    
    min_sum = sum(abs(p[0] - median_x) + abs(p[1] - median_y) for p in points)
    return (median_x, median_y), min_sum
```

### Tactic 4: Weighted Median

For importance-weighted points:

```python
def weighted_median(points, weights):
    """
    Find weighted median minimizing sum of weighted distances.
    """
    sorted_pairs = sorted(zip(points, weights))
    total_weight = sum(weights)
    
    cumulative = 0
    for point, weight in sorted_pairs:
        cumulative += weight
        if cumulative >= total_weight / 2:
            return point
    
    return sorted_pairs[-1][0]
```

### Tactic 5: K-Medians 1D (Dynamic Programming)

Optimal k-clustering:

```python
def k_medians_1d(points, k):
    """
    Cluster points into k groups minimizing sum of L1 distances.
    Uses dynamic programming.
    Time: O(n^2 * k)
    """
    n = len(points)
    points.sort()
    
    # Precompute cost[i][j] = cost of one cluster from i to j
    cost = [[0] * n for _ in range(n)]
    for i in range(n):
        for j in range(i, n):
            mid = (i + j) // 2
            median = points[mid]
            cost[i][j] = sum(abs(points[t] - median) for t in range(i, j + 1))
    
    # DP: dp[i][c] = min cost to partition first i points into c clusters
    INF = float('inf')
    dp = [[INF] * (k + 1) for _ in range(n + 1)]
    dp[0][0] = 0
    
    for i in range(1, n + 1):
        for c in range(1, k + 1):
            for j in range(c - 1, i):
                dp[i][c] = min(dp[i][c], dp[j][c - 1] + cost[j][i - 1])
    
    return dp[n][k]
```

---

## Python Templates

### Template 1: Median Minimization

```python
def min_absolute_difference_sum(nums: list[int]) -> tuple[int, int]:
    """
    Find median and minimum sum of absolute differences.
    
    Args:
        nums: List of integers
    
    Returns:
        Tuple of (median, minimum_sum)
        
    Time: O(n log n)
    Space: O(1)
    """
    n = len(nums)
    nums_sorted = sorted(nums)
    
    # Median minimizes sum of absolute deviations
    median = nums_sorted[n // 2]
    
    min_sum = sum(abs(x - median) for x in nums)
    return median, min_sum
```

### Template 2: Quickselect Median (Linear Time)

```python
def quickselect(nums: list[int], k: int) -> int:
    """
    Find kth smallest element (0-indexed).
    Average O(n) time.
    """
    if not nums:
        raise ValueError("Empty list")
    
    pivot = nums[len(nums) // 2]
    left = [x for x in nums if x < pivot]
    mid = [x for x in nums if x == pivot]
    right = [x for x in nums if x > pivot]
    
    if k < len(left):
        return quickselect(left, k)
    elif k < len(left) + len(mid):
        return pivot
    else:
        return quickselect(right, k - len(left) - len(mid))

def median_linear(nums: list[int]) -> int:
    """Find median in O(n) average time."""
    return quickselect(nums[:], len(nums) // 2)
```

### Template 3: 2D Manhattan Meeting Point

```python
def best_meeting_point(points: list[tuple[int, int]]) -> tuple[tuple[int, int], int]:
    """
    Find optimal meeting point minimizing Manhattan distances.
    
    Args:
        points: List of (x, y) coordinates
    
    Returns:
        Tuple of ((optimal_x, optimal_y), total_distance)
        
    Time: O(n log n)
    Space: O(n)
    """
    if not points:
        return (0, 0), 0
    
    xs = [p[0] for p in points]
    ys = [p[1] for p in points]
    
    xs.sort()
    ys.sort()
    
    n = len(points)
    median_x = xs[n // 2]
    median_y = ys[n // 2]
    
    total_distance = sum(abs(p[0] - median_x) + abs(p[1] - median_y) for p in points)
    
    return (median_x, median_y), total_distance
```

### Template 4: Weighted Median

```python
def weighted_median(points: list[int], weights: list[int]) -> int:
    """
    Find weighted median minimizing sum of weighted distances.
    
    Args:
        points: List of point values
        weights: Corresponding weights
    
    Returns:
        Weighted median value
        
    Time: O(n log n)
    Space: O(n)
    """
    pairs = sorted(zip(points, weights))
    total_weight = sum(weights)
    
    cumulative = 0
    for point, weight in pairs:
        cumulative += weight
        if cumulative >= total_weight / 2:
            return point
    
    return pairs[-1][0]
```

### Template 5: Minimum Moves to Equal Array Elements II

```python
def min_moves_to_equal_array(nums: list[int]) -> int:
    """
    LeetCode 462: Minimum Moves to Equal Array Elements II.
    Each move: increment or decrement an element by 1.
    
    Args:
        nums: List of integers
    
    Returns:
        Minimum number of moves
        
    Time: O(n log n)
    Space: O(1)
    """
    nums.sort()
    n = len(nums)
    median = nums[n // 2]
    
    return sum(abs(num - median) for num in nums)
```

### Template 6: Best Meeting Point (Grid)

```python
def best_meeting_point_grid(grid: list[list[int]]) -> int:
    """
    LeetCode 296: Best Meeting Point.
    Given binary grid (1 = person, 0 = empty), find meeting point
    minimizing total Manhattan distance.
    
    Args:
        grid: Binary matrix
    
    Returns:
        Minimum total distance
        
    Time: O(mn)
    Space: O(m+n)
    """
    rows, cols = [], []
    
    # Collect coordinates
    for i in range(len(grid)):
        for j in range(len(grid[0])):
            if grid[i][j] == 1:
                rows.append(i)
                cols.append(j)
    
    # Sort and find medians
    rows.sort()
    cols.sort()
    
    median_row = rows[len(rows) // 2]
    median_col = cols[len(cols) // 2]
    
    # Calculate total distance
    total = sum(abs(r - median_row) for r in rows)
    total += sum(abs(c - median_col) for c in cols)
    
    return total
```

---

## When to Use

Use the Median Minimization property when you need to solve problems involving:

- **Optimal Positioning**: Finding best location on a line (warehouse, meeting point)
- **L1 Minimization**: Minimizing sum of absolute errors
- **Robust Statistics**: Less sensitive to outliers than mean
- **Facility Location**: 1D placement problems
- **Manhattan Distance**: 2D grid problems with L1 metric

### Comparison: Mean vs Median

| Property | Mean | Median |
|----------|------|--------|
| **Minimizes** | Σ(x_i - c)² | Σ\|x_i - c\| |
| **Sensitivity** | Sensitive to outliers | Robust to outliers |
| **Computation** | O(n) | O(n log n) or O(n) |
| **Use Case** | Average, balance point | Robust center, L1 optimal |

### When to Choose Each Measure

- **Choose Median** when:
  - Minimizing absolute differences is the goal
  - Outliers may be present
  - Robust estimation is needed
  - L1 norm is natural for the problem

- **Choose Mean** when:
  - Minimizing squared error is the goal
  - No significant outliers
  - Least squares is appropriate
  - L2 norm is natural

---

## Algorithm Explanation

### Core Concept

The median minimizes the sum of absolute deviations because it balances the number of points on either side. For any point left of the median, moving right reduces distance to more points than it increases.

### Why It Works

**Mathematical Proof Sketch:**

The function f(c) = Σ|x_i - c| is minimized when its derivative is zero:
```
df/dc = Σ sign(x_i - c) = 0

This happens when:
  count(x_i < c) = count(x_i > c)

Which is exactly the definition of the median!
```

**For even n:**
Any point between the two middle values has equal points on each side, so the derivative is zero throughout that interval.

### Visual Walkthrough

**Example:** Points [1, 2, 9, 10]

```
Position: 1   2   3   4   5   6   7   8   9   10
          *   *               |           *   *
                              
Sum of distances if c=2:
  |1-2| + |2-2| + |9-2| + |10-2| = 1 + 0 + 7 + 8 = 16

Sum if c=5 (between 2 and 9):
  |1-5| + |2-5| + |9-5| + |10-5| = 4 + 3 + 4 + 5 = 16

Sum if c=9:
  |1-9| + |2-9| + |9-9| + |10-9| = 8 + 7 + 0 + 1 = 16

All give same minimum! Any point in [2, 9] works.
```

### Limitations

- **1D Only**: Property holds for L1 in 1D; higher dimensions need coordinate-wise median for separable problems
- **Unweighted**: For weighted points, use weighted median
- **Non-Convex**: Multiple optimal points possible for even n

---

## Practice Problems

### Problem 1: Minimum Moves to Equal Array Elements II

**Problem:** [LeetCode 462 - Minimum Moves to Equal Array Elements II](https://leetcode.com/problems/minimum-moves-to-equal-array-elements-ii/)

**Description:** Minimize moves (±1) to make all elements equal.

**How to Apply:**
- Target should be the median
- Sum of distances to median

---

### Problem 2: Best Meeting Point

**Problem:** [LeetCode 296 - Best Meeting Point](https://leetcode.com/problems/best-meeting-point/)

**Description:** Find grid point minimizing Manhattan distance to all people.

**How to Apply:**
- Median of all x-coordinates
- Median of all y-coordinates
- Sum distances separately

---

### Problem 3: Minimum Cost to Make Array Equal

**Problem:** [LeetCode 2448 - Minimum Cost to Make Array Equal](https://leetcode.com/problems/minimum-cost-to-make-array-equal/)

**Description:** Weighted version: each element has cost per move.

**How to Apply:**
- Use weighted median concept
- Cumulative weight ≥ total/2

---

### Problem 4: Minimum Total Distance Traveled

**Problem:** [LeetCode 2463 - Minimum Total Distance Traveled](https://leetcode.com/problems/minimum-total-distance-traveled/)

**Description:** Facility location with moving robots.

**How to Apply:**
- Median-based assignment
- Related to optimal transport

---

## Video Tutorial Links

### Fundamentals

- [Median Minimizes Absolute Deviation - Statistics](https://www.youtube.com/watch?v=8sGFjrU1p4g) - Mathematical proof
- [L1 vs L2 Minimization - Optimization](https://www.youtube.com/watch?v=JqQj2T3h9bQ) - Norm comparison
- [Facility Location - MIT OCW](https://www.youtube.com/watch?v=3d6lD7q6Xy8) - Applications

### Problem Solving

- [Best Meeting Point - NeetCode](https://www.youtube.com/watch?v=3tSEiPqLwcA) - LeetCode solution
- [Geometric Median - Algorithms](https://www.youtube.com/watch?v=4vVJbL8e3sQ) - Advanced

---

## Follow-up Questions

### Q1: Why does the median minimize L1 but not L2?

**Answer:** The L1 norm uses absolute value whose derivative is the sign function. The sum of signs equals zero when equal numbers of points are on each side—the definition of median. L2 uses squared distance with derivative proportional to distance, leading to the mean as the balance point.

---

### Q2: What if there are multiple medians (even number of points)?

**Answer:** For even n, any point between the two middle values minimizes the sum. This creates a "flat" region in the optimization landscape. Any point in [x_{n/2}, x_{n/2+1}] is optimal.

---

### Q3: Does this work in 2D with Euclidean distance?

**Answer:** No. For Euclidean distance in 2D, the optimal point is the geometric median (Fermat-Weber point), which typically requires iterative computation. However, for Manhattan (L1) distance in 2D, the coordinate-wise medians are optimal because L1 is separable.

---

### Q4: How do I compute the median in linear time?

**Answer:** Use the quickselect algorithm, a variant of quicksort that only recurses into the partition containing the desired element. Average case is O(n), worst case O(n²) but rare with good pivot selection. Median-of-medians algorithm gives guaranteed O(n).

---

### Q5: Can this be extended to weighted points?

**Answer:** Yes. The weighted median is the point where cumulative weight reaches half the total weight. It minimizes Σw_i × |x_i - c|. Computation is similar: sort by value and find where cumulative weight ≥ total/2.

---

## Summary

The Median Minimizes Sum of Absolute Deviations is a fundamental property with wide applications in optimization and statistics. The key takeaways are:

1. **L1 Minimization**: Median minimizes Σ|x_i - c|
2. **Robustness**: Less sensitive to outliers than mean
3. **2D Manhattan**: Coordinate-wise medians are optimal
4. **Weighted Version**: Weighted median for importance-weighted points
5. **Efficiency**: O(n log n) by sort, or O(n) with quickselect

**When to Use:**
- Optimal 1D positioning problems
- Robust statistical estimation
- Manhattan distance minimization
- Facility location on grids

**Key Insight:**
```
Optimal point = median
Minimum sum = Σ|x_i - median|
```

This property is essential for competitive programming and optimization, providing elegant O(n log n) solutions to seemingly complex positioning problems.
