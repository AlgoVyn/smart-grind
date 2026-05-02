# Divide and Conquer

## Category
Algorithmic Paradigms

## Description

Divide and Conquer is a fundamental algorithmic paradigm where a problem is divided into smaller subproblems, each solved recursively, and then combined to form the solution to the original problem. This approach is the foundation of many efficient algorithms and is particularly powerful for problems that exhibit optimal substructure and can be broken down into independent subproblems.

The paradigm consists of three key steps: Divide (break the problem into smaller subproblems), Conquer (solve each subproblem recursively), and Combine (merge the solutions). Classic examples include merge sort, quick sort, binary search, and algorithms for closest pair of points and matrix multiplication. The efficiency of divide and conquer often comes from reducing the problem size geometrically (e.g., by half) at each step, leading to logarithmic depth recursion trees.

---

## Concepts

Divide and Conquer algorithms are built on several fundamental concepts that enable their efficiency and correctness.

### 1. The Divide-Conquer-Combine Pattern

The three-step structure that defines the paradigm:

| Step | Description | Example (Merge Sort) |
|------|-------------|---------------------|
| **Divide** | Split problem into subproblems | Split array into two halves |
| **Conquer** | Solve subproblems recursively | Sort each half recursively |
| **Combine** | Merge subproblem solutions | Merge two sorted halves |

### 2. Recurrence Relations

Complexity analysis using recurrence equations:

| Recurrence | Solution | Example Algorithm |
|------------|----------|-------------------|
| T(n) = 2T(n/2) + O(n) | O(n log n) | Merge Sort |
| T(n) = 2T(n/2) + O(1) | O(n) | Finding maximum subarray (optimal) |
| T(n) = T(n/2) + O(1) | O(log n) | Binary Search |
| T(n) = 2T(n/2) + O(n²) | O(n²) | Naive closest pair |
| T(n) = 2T(n/2) + O(n log n) | O(n log² n) | Enhanced divide and conquer |

### 3. Master Theorem

Quickly solve recurrences of the form T(n) = aT(n/b) + f(n):

```
Case 1: If f(n) = O(n^c) where c < log_b(a), then T(n) = Θ(n^(log_b(a)))
Case 2: If f(n) = Θ(n^(log_b(a))), then T(n) = Θ(n^(log_b(a)) × log n)
Case 3: If f(n) = Ω(n^c) where c > log_b(a), then T(n) = Θ(f(n))
```

### 4. Base Cases

Termination conditions for recursion:

| Problem | Base Case | Action |
|---------|-----------|--------|
| Sorting | n ≤ 1 | Array already sorted |
| Binary Search | low > high | Element not found |
| Matrix Multiply | n = 1 | Return single element |
| Closest Pair | n ≤ 3 | Use brute force |

---

## Frameworks

Structured approaches for implementing divide and conquer solutions.

### Framework 1: Standard D&C Template

```
┌─────────────────────────────────────────────────────────────┐
│  STANDARD DIVIDE AND CONQUER FRAMEWORK                        │
├─────────────────────────────────────────────────────────────┤
│  Input: Problem P of size n                                  │
│  Output: Solution to P                                       │
│                                                             │
│  function solve(P, n):                                      │
│      1. If n is small enough (base case):                  │
│         → Return solve_directly(P)                         │
│                                                             │
│      2. Divide P into k subproblems:                        │
│         → P1, P2, ..., Pk with sizes n1, n2, ..., nk         │
│         → Usually k=2 and n1≈n2≈n/2                         │
│                                                             │
│      3. Conquer (recursively solve):                        │
│         → S1 = solve(P1, n1)                                │
│         → S2 = solve(P2, n2)                                │
│         → ...                                               │
│         → Sk = solve(Pk, nk)                                │
│                                                             │
│      4. Combine solutions:                                  │
│         → S = merge(S1, S2, ..., Sk)                         │
│                                                             │
│      5. Return S                                            │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Most standard D&C problems (sorting, searching, etc.).

### Framework 2: D&C with Global State

```
┌─────────────────────────────────────────────────────────────┐
│  D&C WITH GLOBAL ACCUMULATOR FRAMEWORK                       │
├─────────────────────────────────────────────────────────────┤
│  Used when: Counting inversions, finding global optimum    │
│                                                             │
│  global_result = identity_value                              │
│                                                             │
│  function solve(P, n):                                      │
│      1. Base case handling                                   │
│                                                             │
│      2. Divide and conquer subproblems                       │
│                                                             │
│      3. During combine step, update global:                  │
│         → global_result = update(global_result, local)     │
│                                                             │
│      4. Return solution AND potentially update global        │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Counting inversions, certain geometry problems.

### Framework 3: D&C Decision Framework

```
┌─────────────────────────────────────────────────────────────┐
│  CHOOSING DIVIDE AND CONQUER                                 │
├─────────────────────────────────────────────────────────────┤
│  Use D&C when:                                               │
│    ✓ Problem can be divided into independent subproblems     │
│    ✓ Subproblems are smaller instances of same problem      │
│    ✓ Solutions can be efficiently combined                  │
│    ✓ Recurrence gives better complexity than naive          │
│                                                             │
│  Don't use D&C when:                                         │
│    ✗ Subproblems overlap heavily (use DP instead)           │
│    ✗ Combining is as expensive as solving directly         │
│    ✗ Better iterative/greedy solution exists                 │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Deciding whether to apply D&C approach.

---

## Forms

Different manifestations of the divide and conquer pattern.

### Form 1: Binary Division (n → n/2 + n/2)

Most common form - divide into two equal halves.

| Algorithm | Divide | Combine | Complexity |
|-----------|--------|---------|------------|
| **Merge Sort** | Split array | Merge sorted halves | O(n log n) |
| **Quick Sort** | Partition | No combine needed | O(n log n) avg |
| **Binary Search** | Midpoint | Return found index | O(log n) |
| **Closest Pair** | Split by x | Check strip | O(n log n) |

### Form 2: Multiple Division (n → n/k + n/k + ...)

Divide into k > 2 subproblems.

| Algorithm | k | Complexity |
|-----------|---|------------|
| **Strassen's Matrix** | 7 multiplications of n/2 | O(n^2.81) |
| **Karatsuba Multiply** | 3 multiplications | O(n^1.585) |

### Form 3: Uneven Division

Divide into problems of different sizes.

| Algorithm | Division | Complexity |
|-----------|----------|------------|
| **Quickselect** | partition around pivot | O(n) average |

### Form 4: Virtual Division

No actual splitting, just conceptual ranges.

```python
def range_query(arr, query_range):
    """Segment tree-style query without physical split."""
    # Query different ranges of the same array
    mid = len(arr) // 2
    left_result = query(arr[:mid], left_range)
    right_result = query(arr[mid:], right_range)
    return combine(left_result, right_result)
```

### Form 5: Parallel D&C

Subproblems can be solved concurrently:

```
Divide: Split into independent subproblems
Conquer: Solve subproblems in parallel (threads/processes)
Combine: Merge results when all complete
```

---

## Tactics

Specific techniques and optimizations for divide and conquer.

### Tactic 1: Merge Sort with Counting

Count inversions during merge step:

```python
def merge_sort_count(arr):
    """Sort array and count inversions."""
    if len(arr) <= 1:
        return arr, 0
    
    mid = len(arr) // 2
    left, left_inv = merge_sort_count(arr[:mid])
    right, right_inv = merge_sort_count(arr[mid:])
    merged, split_inv = merge_and_count(left, right)
    
    return merged, left_inv + right_inv + split_inv

def merge_and_count(left, right):
    """Merge and count split inversions."""
    result = []
    count = 0
    i = j = 0
    
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
            count += len(left) - i  # All remaining in left form inversions
    
    result.extend(left[i:])
    result.extend(right[j:])
    return result, count
```

### Tactic 2: Closest Pair Optimization

Efficiently check only nearby points in the strip:

```python
def closest_pair(points):
    """Find closest pair in O(n log n)."""
    px = sorted(points, key=lambda p: p[0])
    py = sorted(points, key=lambda p: p[1])
    return closest_recursive(px, py)

def closest_recursive(px, py):
    n = len(px)
    if n <= 3:
        return brute_force(px)
    
    mid = n // 2
    mid_point = px[mid]
    
    # Divide
    left_px = px[:mid]
    right_px = px[mid:]
    left_py = [p for p in py if p[0] <= mid_point[0]]
    right_py = [p for p in py if p[0] > mid_point[0]]
    
    # Conquer
    dl = closest_recursive(left_px, left_py)
    dr = closest_recursive(right_px, right_py)
    d = min(dl, dr)
    
    # Combine - check strip
    strip = [p for p in py if abs(p[0] - mid_point[0]) < d]
    
    # Optimization: Only check next 7 points
    for i in range(len(strip)):
        for j in range(i + 1, min(i + 8, len(strip))):
            if strip[j][1] - strip[i][1] >= d:
                break
            d = min(d, dist(strip[i], strip[j]))
    
    return d
```

### Tactic 3: Karatsuba Multiplication

Fast multiplication using 3 multiplications instead of 4:

```python
def karatsuba(x, y):
    """Multiply using divide and conquer. O(n^1.585)"""
    if x < 10 or y < 10:
        return x * y
    
    n = max(len(str(x)), len(str(y)))
    m = n // 2
    
    # Split
    a = x // (10 ** m)
    b = x % (10 ** m)
    c = y // (10 ** m)
    d = y % (10 ** m)
    
    # 3 multiplications instead of 4
    z0 = karatsuba(b, d)           # bd
    z1 = karatsuba(a + b, c + d)   # (a+b)(c+d)
    z2 = karatsuba(a, c)           # ac
    
    # Combine: ac*10^(2m) + ((a+b)(c+d) - ac - bd)*10^m + bd
    return (z2 * (10 ** (2 * m))) + ((z1 - z2 - z0) * (10 ** m)) + z0
```

### Tactic 4: Maximum Subarray (Divide and Conquer)

Find max subarray crossing the midpoint:

```python
def max_subarray_dc(arr):
    """Maximum subarray using divide and conquer."""
    def max_crossing_sum(arr, left, mid, right):
        # Max sum from mid to left
        sm = 0
        left_sum = float('-inf')
        for i in range(mid, left - 1, -1):
            sm += arr[i]
            left_sum = max(left_sum, sm)
        
        # Max sum from mid+1 to right
        sm = 0
        right_sum = float('-inf')
        for i in range(mid + 1, right + 1):
            sm += arr[i]
            right_sum = max(right_sum, sm)
        
        return left_sum + right_sum
    
    def max_subarray_recursive(arr, left, right):
        if left == right:
            return arr[left]
        
        mid = (left + right) // 2
        
        left_max = max_subarray_recursive(arr, left, mid)
        right_max = max_subarray_recursive(arr, mid + 1, right)
        cross_max = max_crossing_sum(arr, left, mid, right)
        
        return max(left_max, right_max, cross_max)
    
    return max_subarray_recursive(arr, 0, len(arr) - 1)
```

### Tactic 5: Binary Search Variations

Different binary search patterns:

```python
def binary_search_leftmost(arr, target):
    """Find leftmost occurrence of target."""
    left, right = 0, len(arr)
    while left < right:
        mid = (left + right) // 2
        if arr[mid] < target:
            left = mid + 1
        else:
            right = mid
    return left

def binary_search_rightmost(arr, target):
    """Find rightmost occurrence of target."""
    left, right = 0, len(arr)
    while left < right:
        mid = (left + right) // 2
        if arr[mid] <= target:
            left = mid + 1
        else:
            right = mid
    return left - 1
```

---

## Python Templates

### Template 1: Generic Merge Sort

```python
def merge_sort(arr):
    """
    Sort array using divide and conquer.
    Time: O(n log n), Space: O(n)
    """
    if len(arr) <= 1:
        return arr
    
    # Divide
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    
    # Conquer (merge)
    return merge(left, right)

def merge(left, right):
    """Merge two sorted arrays."""
    result = []
    i = j = 0
    
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    
    result.extend(left[i:])
    result.extend(right[j:])
    return result
```

### Template 2: Inversion Counting

```python
def count_inversions(arr):
    """
    Count pairs where i < j but arr[i] > arr[j].
    Time: O(n log n), Space: O(n)
    """
    def sort_and_count(arr):
        if len(arr) <= 1:
            return arr, 0
        
        mid = len(arr) // 2
        left, left_count = sort_and_count(arr[:mid])
        right, right_count = sort_and_count(arr[mid:])
        merged, split_count = merge_and_count(left, right)
        
        return merged, left_count + right_count + split_count
    
    def merge_and_count(left, right):
        result = []
        count = 0
        i = j = 0
        
        while i < len(left) and j < len(right):
            if left[i] <= right[j]:
                result.append(left[i])
                i += 1
            else:
                result.append(right[j])
                j += 1
                count += len(left) - i
        
        result.extend(left[i:])
        result.extend(right[j:])
        return result, count
    
    _, count = sort_and_count(arr)
    return count
```

### Template 3: Binary Search Template

```python
def binary_search(arr, target):
    """
    Find target in sorted array.
    Returns index if found, -1 otherwise.
    Time: O(log n), Space: O(1)
    """
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1

def lower_bound(arr, target):
    """First index where arr[i] >= target."""
    left, right = 0, len(arr)
    while left < right:
        mid = (left + right) // 2
        if arr[mid] < target:
            left = mid + 1
        else:
            right = mid
    return left

def upper_bound(arr, target):
    """First index where arr[i] > target."""
    left, right = 0, len(arr)
    while left < right:
        mid = (left + right) // 2
        if arr[mid] <= target:
            left = mid + 1
        else:
            right = mid
    return left
```

### Template 4: Quick Sort

```python
import random

def quick_sort(arr):
    """
    In-place quick sort with random pivot.
    Time: O(n log n) average, O(n²) worst
    Space: O(log n) for recursion
    """
    def partition(low, high):
        # Random pivot selection
        pivot_idx = random.randint(low, high)
        arr[pivot_idx], arr[high] = arr[high], arr[pivot_idx]
        
        pivot = arr[high]
        i = low - 1
        
        for j in range(low, high):
            if arr[j] <= pivot:
                i += 1
                arr[i], arr[j] = arr[j], arr[i]
        
        arr[i + 1], arr[high] = arr[high], arr[i + 1]
        return i + 1
    
    def sort(low, high):
        if low < high:
            pi = partition(low, high)
            sort(low, pi - 1)
            sort(pi + 1, high)
    
    sort(0, len(arr) - 1)
    return arr
```

### Template 5: Closest Pair of Points

```python
import math

def closest_pair(points):
    """
    Find closest pair of points in 2D.
    Time: O(n log n), Space: O(n)
    """
    def dist(p1, p2):
        return math.sqrt((p1[0] - p2[0])**2 + (p1[1] - p2[1])**2)
    
    def brute_force(pts):
        min_dist = float('inf')
        for i in range(len(pts)):
            for j in range(i + 1, len(pts)):
                min_dist = min(min_dist, dist(pts[i], pts[j]))
        return min_dist
    
    def closest_recursive(px, py):
        n = len(px)
        if n <= 3:
            return brute_force(px)
        
        mid = n // 2
        mid_point = px[mid]
        
        left_px = px[:mid]
        right_px = px[mid:]
        left_py = [p for p in py if p[0] <= mid_point[0]]
        right_py = [p for p in py if p[0] > mid_point[0]]
        
        dl = closest_recursive(left_px, left_py)
        dr = closest_recursive(right_px, right_py)
        d = min(dl, dr)
        
        strip = [p for p in py if abs(p[0] - mid_point[0]) < d]
        for i in range(len(strip)):
            for j in range(i + 1, min(i + 7, len(strip))):
                d = min(d, dist(strip[i], strip[j]))
        
        return d
    
    px = sorted(points, key=lambda p: p[0])
    py = sorted(points, key=lambda p: p[1])
    return closest_recursive(px, py)
```

### Template 6: Maximum Subarray (Kadane's vs D&C)

```python
def max_subarray_kadane(arr):
    """
    Maximum subarray sum using Kadane's algorithm.
    Time: O(n), Space: O(1)
    """
    max_so_far = max_ending_here = arr[0]
    
    for x in arr[1:]:
        max_ending_here = max(x, max_ending_here + x)
        max_so_far = max(max_so_far, max_ending_here)
    
    return max_so_far

def max_subarray_divide_conquer(arr):
    """
    Maximum subarray using divide and conquer.
    Time: O(n log n), Space: O(log n)
    """
    def max_crossing_sum(arr, left, mid, right):
        sm = 0
        left_sum = float('-inf')
        for i in range(mid, left - 1, -1):
            sm += arr[i]
            left_sum = max(left_sum, sm)
        
        sm = 0
        right_sum = float('-inf')
        for i in range(mid + 1, right + 1):
            sm += arr[i]
            right_sum = max(right_sum, sm)
        
        return left_sum + right_sum
    
    def max_subarray_recursive(arr, left, right):
        if left == right:
            return arr[left]
        
        mid = (left + right) // 2
        left_max = max_subarray_recursive(arr, left, mid)
        right_max = max_subarray_recursive(arr, mid + 1, right)
        cross_max = max_crossing_sum(arr, left, mid, right)
        
        return max(left_max, right_max, cross_max)
    
    return max_subarray_recursive(arr, 0, len(arr) - 1)
```

---

## When to Use

Use Divide and Conquer when you need to solve problems involving:

- **Sorting**: Merge sort, quick sort, external sorting
- **Searching**: Binary search on sorted data, finding medians
- **Geometry**: Closest pair of points, convex hull
- **Counting**: Inversion count, significant pairs
- **Matrix Operations**: Strassen's multiplication, matrix exponentiation
- **Large Data**: Problems that can be processed in chunks

### Comparison with Alternatives

| Approach | Time Complexity | Best For | Limitations |
|----------|-----------------|----------|-------------|
| **Divide & Conquer** | O(n log n) avg | Independent subproblems | Recursion overhead |
| **Dynamic Programming** | O(n) to O(n²) | Overlapping subproblems | Higher space usage |
| **Greedy** | O(n log n) | Optimal substructure | Limited applicability |
| **Brute Force** | O(n²) or worse | Small inputs | Not scalable |

### When to Choose D&C vs Other Paradigms

- **Choose D&C** when:
  - Problem naturally divides into independent subproblems
  - Recurrence gives better complexity (e.g., O(n log n) vs O(n²))
  - Subproblems don't overlap significantly
  - Parallel processing possible

- **Choose DP** when:
  - Subproblems overlap heavily
  - Need to avoid recomputation
  - Can store solutions to subproblems

- **Choose Greedy** when:
  - Local optimal choice leads to global optimum
  - Problem has matroid structure

---

## Algorithm Explanation

### Core Concept

Divide and Conquer solves problems by breaking them into smaller, more manageable subproblems. The key insight is that solving two half-sized problems is often easier than solving one full-sized problem, especially when combining the solutions is efficient.

**Key Terminology**:
- **Subproblem**: A smaller instance of the original problem
- **Base Case**: Small enough problem to solve directly
- **Combine Step**: Merge solutions of subproblems
- **Recursion Depth**: Levels of problem division

### How It Works

#### Step 1: Divide

```python
def divide(problem):
    """Split problem into subproblems."""
    mid = len(problem) // 2
    left = problem[:mid]
    right = problem[mid:]
    return left, right
```

#### Step 2: Conquer

```python
def conquer(left, right):
    """Recursively solve subproblems."""
    if is_small_enough(left):
        left_solution = solve_directly(left)
    else:
        left_solution = solve(left)
    
    if is_small_enough(right):
        right_solution = solve_directly(right)
    else:
        right_solution = solve(right)
    
    return left_solution, right_solution
```

#### Step 3: Combine

```python
def combine(left_sol, right_sol):
    """Merge subproblem solutions."""
    return merge(left_sol, right_sol)
```

### Visual Walkthrough

**Merge Sort Example on [38, 27, 43, 3, 9, 82, 10]**:
```
Divide:
[38, 27, 43, 3, 9, 82, 10]
→ [38, 27, 43] and [3, 9, 82, 10]
→ [38] [27, 43] and [3, 9] [82, 10]
→ [38] [27] [43] and [3] [9] [82] [10]

Conquer (sort small arrays):
→ [38] [27] [43] are already "sorted" (single elements)

Combine:
→ [27, 38] ← merge([27], [38])
→ [27, 38, 43] ← merge([27, 38], [43])
→ [3, 9] ← merge([3], [9])
→ [10, 82] ← merge([82], [10])
→ [3, 9, 10, 82] ← merge([3, 9], [10, 82])
→ [3, 9, 10, 27, 38, 43, 82] ← final merge
```

### Why Divide and Conquer Works

1. **Problem Size Reduction**: Each recursion halves the problem size
2. **Independent Subproblems**: Can be solved separately
3. **Efficient Combining**: Often linear time O(n)
4. **Recursion Tree Depth**: Logarithmic in problem size

Total complexity often follows: T(n) = 2T(n/2) + O(n) = O(n log n)

### Limitations

- **Recursion Overhead**: Function call overhead and stack usage
- **Not In-Place**: Many D&C algorithms need extra space
- **Subproblem Overlap**: If subproblems share work, DP may be better
- **Base Case Choice**: Poor base case can hurt performance

---

## Practice Problems

### Problem 1: Sort List

**Problem:** [LeetCode 148 - Sort List](https://leetcode.com/problems/sort-list/)

**Description:** Given the head of a linked list, return the list after sorting it in O(n log n) time.

**How to Apply D&C:**
- Use merge sort (natural fit for linked lists)
- Find middle using slow/fast pointers
- Recursively sort halves and merge

---

### Problem 2: Count of Smaller Numbers After Self

**Problem:** [LeetCode 315 - Count of Smaller Numbers After Self](https://leetcode.com/problems/count-of-smaller-numbers-after-self/)

**Description:** For each element, count how many smaller elements are to its right.

**How to Apply D&C:**
- Modified merge sort counting inversions
- During merge, count elements from right half placed before left half elements

---

### Problem 3: Reverse Pairs

**Problem:** [LeetCode 493 - Reverse Pairs](https://leetcode.com/problems/reverse-pairs/)

**Description:** Count pairs (i, j) where i < j and nums[i] > 2 * nums[j].

**How to Apply D&C:**
- Similar to inversion count but with modified comparison
- During merge step, count valid pairs across halves

---

### Problem 4: The Skyline Problem

**Problem:** [LeetCode 218 - The Skyline Problem](https://leetcode.com/problems/the-skyline-problem/)

**Description:** Given buildings with [left, right, height], output the skyline.

**How to Apply D&C:**
- Divide set of buildings into two halves
- Recursively compute skylines
- Merge two skylines by tracking current heights

---

### Problem 5: Construct Quad Tree

**Problem:** [LeetCode 427 - Construct Quad Tree](https://leetcode.com/problems/construct-quad-tree/)

**Description:** Construct a quad tree from a binary matrix.

**How to Apply D&C:**
- Divide matrix into four quadrants
- Recursively build quad tree for each quadrant
- Combine if all quadrants are uniform

---

### Problem 6: Different Ways to Add Parentheses

**Problem:** [LeetCode 241 - Different Ways to Add Parentheses](https://leetcode.com/problems/different-ways-to-add-parentheses/)

**Description:** Given expression with numbers and operators, compute all possible results from different parenthesizations.

**How to Apply D&C:**
- For each operator, divide expression into left and right
- Recursively compute all results for each part
- Combine using the operator

---

## Video Tutorial Links

### Fundamentals

- [Divide and Conquer - Abdul Bari](https://www.youtube.com/watch?v=2Rr2tW12K5k) - Comprehensive explanation
- [Merge Sort D&C - MyCodeSchool](https://www.youtube.com/watch?v=TzeBrNJCN) - Visual animation
- [Binary Search Introduction - CS50](https://www.youtube.com/watch?v=YzBq2K9p6c) - Harvard CS50

### Advanced Topics

- [Closest Pair of Points - MIT OCW](https://www.youtube.com/watch?v=0VjT7rLep8) - Geometry D&C
- [Karatsuba Multiplication - William Fiset](https://www.youtube.com/watch?v=JCb1q6) - Fast multiplication
- [Strassen's Matrix Multiplication](https://www.youtube.com/watch?v=0oMh_4i0) - Advanced matrix D&C

### Problem Solving

- [Inversion Count - Tushar Roy](https://www.youtube.com/watch?v=k9RQAlm3j4) - Counting inversions
- [Skyline Problem - NeetCode](https://www.youtube.com/watch?v=POQe5KJsd7M) - Famous D&C problem
- [D&C Interview Problems](https://www.youtube.com/watch?v=2Rr2tW12K5k) - Competitive programming

---

## Follow-up Questions

### Q1: How does divide and conquer differ from dynamic programming?

**Answer:**
- **D&C**: Subproblems are independent, solved recursively without storing results
- **DP**: Subproblems overlap, solutions stored to avoid recomputation
- **Choice**: Use D&C when subproblems don't share work, DP when they do
- **Example**: Merge sort uses D&C (independent halves), Fibonacci uses DP (overlapping subproblems)

---

### Q2: When is divide and conquer not the best approach?

**Answer:**
- **Small inputs**: Overhead not worth it for n < 50
- **Overlapping subproblems**: DP is more efficient
- **Greedy works**: When local optimum is global (e.g., activity selection)
- **High combining cost**: If combine step is O(n²), overall may be worse
- **Space constraints**: Recursion stack may cause issues

---

### Q3: Can all recursive algorithms be considered divide and conquer?

**Answer:**
- **No**: D&C requires dividing into smaller instances of the same problem
- **Pure recursion**: May just reduce by 1 (e.g., factorial), not divide
- **D&C characteristic**: Problem size reduces geometrically (by factor, not constant)
- **Examples**: Tree traversal is recursive but not D&C (no combine step)

---

### Q4: How do you analyze the time complexity of D&C algorithms?

**Answer:**
- **Recurrence relation**: Write T(n) in terms of T(n/b)
- **Master theorem**: Apply to T(n) = aT(n/b) + f(n)
- **Recursion tree**: Sum work at each level
- **Substitution method**: Guess and verify by induction
- **Key factors**: Number of subproblems (a), division factor (b), combine cost (f(n))

---

### Q5: What's the difference between merge sort and quick sort in terms of D&C?

**Answer:**
- **Merge Sort**: Easy divide (split in half), expensive combine (merge)
- **Quick Sort**: Expensive divide (partition), no combine (already in place)
- **Stability**: Merge sort is stable, quick sort is not (without extra work)
- **Space**: Merge sort needs O(n) extra space, quick sort needs O(log n) stack
- **Worst case**: Merge sort is O(n log n) guaranteed, quick sort is O(n²) worst

---

## Summary

Divide and Conquer is a fundamental algorithmic paradigm that solves problems by breaking them into smaller subproblems. Key takeaways:

1. **Three Steps**: Divide → Conquer → Combine
2. **Complexity**: Often achieves O(n log n) for O(n²) naive problems
3. **Recurrence**: Use Master Theorem to analyze: T(n) = aT(n/b) + f(n)
4. **Base Case**: Critical for termination and performance
5. **Applications**: Sorting, searching, geometry, matrix operations

**When to Use D&C**:
- Problem divides into independent subproblems
- Recurrence gives better than naive complexity
- Efficient combining possible
- Natural recursive structure exists

**Common Patterns**:
- Binary division (merge sort, binary search)
- Multiple division (Strassen's, Karatsuba)
- Virtual division (segment tree queries)

This paradigm is essential for every programmer's toolkit and forms the foundation of many efficient algorithms.
