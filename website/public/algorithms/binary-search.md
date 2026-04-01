# Binary Search

## Category
Arrays & Strings

## Description

Binary Search is a divide-and-conquer algorithm that efficiently finds a target value within a sorted array by repeatedly dividing the search interval in half. With O(log n) time complexity, it's the gold standard for searching in sorted data structures.

This algorithm is fundamental to competitive programming and technical interviews. It not only solves basic search problems but also forms the basis for solving optimization problems through "binary search on answer" - finding the minimum or maximum value that satisfies a given condition.

---

## Concepts

The Binary Search technique is built on several fundamental concepts that make it powerful for solving search and optimization problems.

### 1. Search Space Invariants

Binary search maintains invariants about the search space:

| Invariant | Description | Purpose |
|-----------|-------------|---------|
| **Sorted Array** | `arr[i] <= arr[i+1]` for all i | Enables elimination of half the array |
| **Search Range** | `left <= target_index <= right` | Ensures target is within bounds |
| **Monotonic Predicate** | If condition is true at x, it's true for all > x | Enables binary search on answer |

### 2. The Elimination Principle

At each step, binary search eliminates half of the remaining elements:

```
Step 1: n elements
Step 2: n/2 elements
Step 3: n/4 elements
...
Step k: n/(2^k) elements

Stop when n/(2^k) <= 1 → k = log₂(n)
```

### 3. Mid Calculation Variants

Different ways to calculate mid:

| Formula | Use Case | Notes |
|---------|----------|-------|
| `mid = (left + right) // 2` | Simple cases | May overflow in some languages |
| `mid = left + (right - left) // 2` | Safe calculation | Prevents integer overflow |
| `mid = left + (right - left) >> 1` | Bit shift | Faster in some languages |

### 4. Search Variants

Different types of binary search:

| Variant | Return Value | Use Case |
|---------|--------------|----------|
| **Standard** | Index of target if found, else -1 | Basic search |
| **Lower Bound** | First index where `arr[i] >= target` | Insertion point |
| **Upper Bound** | First index where `arr[i] > target` | Range queries |
| **Binary Search on Answer** | Optimal value satisfying condition | Optimization problems |

---

## Frameworks

Structured approaches for solving binary search problems.

### Framework 1: Standard Binary Search

```
┌─────────────────────────────────────────────────────┐
│  STANDARD BINARY SEARCH FRAMEWORK                   │
├─────────────────────────────────────────────────────┤
│  1. Initialize: left = 0, right = len(arr) - 1       │
│  2. While left <= right:                             │
│     a. mid = left + (right - left) // 2             │
│     b. If arr[mid] == target: return mid            │
│     c. If arr[mid] < target: left = mid + 1         │
│     d. Else: right = mid - 1                          │
│  3. Return -1 (target not found)                     │
└─────────────────────────────────────────────────────┘
```

**When to use**: Basic search in sorted array, finding exact match.

### Framework 2: Lower Bound (First Occurrence)

```
┌─────────────────────────────────────────────────────┐
│  LOWER BOUND BINARY SEARCH FRAMEWORK                │
├─────────────────────────────────────────────────────┤
│  1. Initialize: left = 0, right = len(arr) - 1     │
│  2. While left <= right:                             │
│     a. mid = left + (right - left) // 2             │
│     b. If arr[mid] >= target:                       │
│        - right = mid - 1 (search left for earlier) │
│        - record mid as potential answer              │
│     c. Else: left = mid + 1                         │
│  3. Return recorded answer (or -1 if not found)     │
└─────────────────────────────────────────────────────┘
```

**When to use**: Finding first occurrence, insertion point, floor value.

### Framework 3: Upper Bound (Last Occurrence)

```
┌─────────────────────────────────────────────────────┐
│  UPPER BOUND BINARY SEARCH FRAMEWORK                │
├─────────────────────────────────────────────────────┤
│  1. Initialize: left = 0, right = len(arr) - 1     │
│  2. While left <= right:                             │
│     a. mid = left + (right - left) // 2             │
│     b. If arr[mid] <= target:                       │
│        - left = mid + 1 (search right for later)    │
│        - record mid as potential answer              │
│     c. Else: right = mid - 1                         │
│  3. Return recorded answer (or -1 if not found)     │
└─────────────────────────────────────────────────────┘
```

**When to use**: Finding last occurrence, ceiling value.

### Framework 4: Binary Search on Answer

```
┌─────────────────────────────────────────────────────┐
│  BINARY SEARCH ON ANSWER FRAMEWORK                  │
├─────────────────────────────────────────────────────┤
│  1. Define search space: low, high                   │
│  2. Define is_valid(x) function                      │
│  3. While low <= high:                               │
│     a. mid = low + (high - low) // 2                 │
│     b. If is_valid(mid):                             │
│        - This value works, try to optimize           │
│        - For min: high = mid - 1                     │
│        - For max: low = mid + 1                      │
│     c. Else:                                         │
│        - This value doesn't work                     │
│        - For min: low = mid + 1                      │
│        - For max: high = mid - 1                     │
│  4. Return best valid value found                    │
└─────────────────────────────────────────────────────┘
```

**When to use**: Optimization problems, finding threshold values.

---

## Forms

Different manifestations of binary search.

### Form 1: Iterative Binary Search

Standard loop-based implementation.

| Aspect | Details |
|--------|---------|
| Time | O(log n) |
| Space | O(1) |
| Best for | Most cases, production code |

### Form 2: Recursive Binary Search

Function calls itself on subarrays.

| Aspect | Details |
|--------|---------|
| Time | O(log n) |
| Space | O(log n) for recursion stack |
| Best for | Educational purposes, clean code |

### Form 3: Binary Search on Rotated Array

Array was sorted then rotated at some pivot.

```
[4, 5, 6, 7, 0, 1, 2] - rotated at index 3

Key insight: One half is always sorted!
Determine which half is sorted, then decide where target could be.
```

### Form 4: Binary Search on 2D Matrix

Matrix where rows are sorted and first element of each row > last element of previous row.

```
Treat as 1D array: index = row * num_cols + col
Or use two binary searches: first for row, then for column
```

### Form 5: Binary Search with Predicate Function

Used for optimization problems where we binary search on the answer.

```
Problem: Find minimum k such that condition(k) is true
Approach: Binary search on k, check condition at each step
```

---

## Tactics

Specific techniques and optimizations.

### Tactic 1: Avoiding Integer Overflow

Always use safe mid calculation:

```python
def binary_search_safe(arr, target):
    """Binary search with overflow-safe mid calculation."""
    left, right = 0, len(arr) - 1
    
    while left <= right:
        # Safe calculation
        mid = left + (right - left) // 2
        
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1
```

### Tactic 2: Finding First and Last Position

Find range of target in sorted array with duplicates:

```python
def search_range(arr, target):
    """Find first and last position of target."""
    def find_first():
        left, right = 0, len(arr) - 1
        first = -1
        while left <= right:
            mid = left + (right - left) // 2
            if arr[mid] >= target:
                first = mid
                right = mid - 1
            else:
                left = mid + 1
        return first if first != -1 and arr[first] == target else -1
    
    def find_last():
        left, right = 0, len(arr) - 1
        last = -1
        while left <= right:
            mid = left + (right - left) // 2
            if arr[mid] <= target:
                last = mid
                left = mid + 1
            else:
                right = mid - 1
        return last if last != -1 and arr[last] == target else -1
    
    return [find_first(), find_last()]
```

### Tactic 3: Search in Rotated Sorted Array

Handle rotation by checking which half is sorted:

```python
def search_rotated(arr, target):
    """Search in rotated sorted array."""
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = left + (right - left) // 2
        
        if arr[mid] == target:
            return mid
        
        # Left half is sorted
        if arr[left] <= arr[mid]:
            if arr[left] <= target < arr[mid]:
                right = mid - 1
            else:
                left = mid + 1
        # Right half is sorted
        else:
            if arr[mid] < target <= arr[right]:
                left = mid + 1
            else:
                right = mid - 1
    
    return -1
```

### Tactic 4: Finding Square Root

Binary search on answer example:

```python
def my_sqrt(x):
    """Find integer square root using binary search."""
    if x < 2:
        return x
    
    left, right = 1, x // 2
    
    while left <= right:
        mid = left + (right - left) // 2
        square = mid * mid
        
        if square == x:
            return mid
        elif square < x:
            left = mid + 1
        else:
            right = mid - 1
    
    # right is the largest value where right^2 <= x
    return right
```

### Tactic 5: Capacity Problems (Ship Packages)

Binary search on answer for capacity optimization:

```python
def ship_within_days(weights, days):
    """Find minimum capacity to ship all packages within days."""
    
    def can_ship(capacity):
        """Check if all packages can be shipped with given capacity."""
        current_load = 0
        required_days = 1
        
        for weight in weights:
            if current_load + weight <= capacity:
                current_load += weight
            else:
                required_days += 1
                current_load = weight
                if required_days > days:
                    return False
        return True
    
    # Binary search on capacity
    left, right = max(weights), sum(weights)
    
    while left < right:
        mid = left + (right - left) // 2
        if can_ship(mid):
            right = mid
        else:
            left = mid + 1
    
    return left
```

### Tactic 6: Finding Peak Element

Binary search for local maximum:

```python
def find_peak_element(arr):
    """Find peak element (greater than neighbors)."""
    left, right = 0, len(arr) - 1
    
    while left < right:
        mid = left + (right - left) // 2
        
        if arr[mid] < arr[mid + 1]:
            # Peak is on right side
            left = mid + 1
        else:
            # Peak is on left side (could be mid itself)
            right = mid
    
    return left
```

---

## Python Templates

### Template 1: Standard Binary Search

```python
def binary_search(arr: list[int], target: int) -> int:
    """
    Standard binary search - returns index if found, -1 otherwise.
    Time: O(log n), Space: O(1)
    """
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = left + (right - left) // 2  # Prevent overflow
        
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1
```

### Template 2: Lower Bound (First Occurrence)

```python
def lower_bound(arr: list[int], target: int) -> int:
    """
    Find first index where arr[i] >= target.
    Returns len(arr) if all elements are smaller.
    Time: O(log n), Space: O(1)
    """
    left, right = 0, len(arr) - 1
    result = len(arr)  # Default: not found, insert at end
    
    while left <= right:
        mid = left + (right - left) // 2
        
        if arr[mid] >= target:
            result = mid
            right = mid - 1
        else:
            left = mid + 1
    
    return result
```

### Template 3: Upper Bound (Last Occurrence)

```python
def upper_bound(arr: list[int], target: int) -> int:
    """
    Find first index where arr[i] > target.
    Returns -1 if all elements are smaller or equal.
    Time: O(log n), Space: O(1)
    """
    left, right = 0, len(arr) - 1
    result = -1
    
    while left <= right:
        mid = left + (right - left) // 2
        
        if arr[mid] <= target:
            result = mid
            left = mid + 1
        else:
            right = mid - 1
    
    return result
```

### Template 4: Search in Rotated Sorted Array

```python
def search_rotated(arr: list[int], target: int) -> int:
    """
    Search in rotated sorted array (no duplicates).
    Time: O(log n), Space: O(1)
    """
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = left + (right - left) // 2
        
        if arr[mid] == target:
            return mid
        
        # Left half is sorted
        if arr[left] <= arr[mid]:
            if arr[left] <= target < arr[mid]:
                right = mid - 1
            else:
                left = mid + 1
        # Right half is sorted
        else:
            if arr[mid] < target <= arr[right]:
                left = mid + 1
            else:
                right = mid - 1
    
    return -1
```

### Template 5: Binary Search on Answer (Minimum)

```python
def binary_search_min(left: int, right: int, is_valid) -> int:
    """
    Find minimum value in [left, right] that satisfies is_valid.
    Time: O(log(right - left)) * cost_of_is_valid
    """
    result = -1
    
    while left <= right:
        mid = left + (right - left) // 2
        
        if is_valid(mid):
            result = mid
            right = mid - 1  # Try to find smaller valid value
        else:
            left = mid + 1   # Need larger value
    
    return result
```

### Template 6: Binary Search on Answer (Maximum)

```python
def binary_search_max(left: int, right: int, is_valid) -> int:
    """
    Find maximum value in [left, right] that satisfies is_valid.
    Time: O(log(right - left)) * cost_of_is_valid
    """
    result = -1
    
    while left <= right:
        mid = left + (right - left) // 2
        
        if is_valid(mid):
            result = mid
            left = mid + 1   # Try to find larger valid value
        else:
            right = mid - 1  # Need smaller value
    
    return result
```

### Template 7: Find Peak Element

```python
def find_peak_element(arr: list[int]) -> int:
    """
    Find any peak element (greater than neighbors).
    Time: O(log n), Space: O(1)
    """
    left, right = 0, len(arr) - 1
    
    while left < right:
        mid = left + (right - left) // 2
        
        if arr[mid] < arr[mid + 1]:
            left = mid + 1  # Peak is on right
        else:
            right = mid   # Peak is on left (or mid)
    
    return left
```

### Template 8: Search in 2D Matrix

```python
def search_matrix(matrix: list[list[int]], target: int) -> bool:
    """
    Search in matrix where rows and columns are sorted.
    Time: O(log(m*n)), Space: O(1)
    """
    if not matrix or not matrix[0]:
        return False
    
    rows, cols = len(matrix), len(matrix[0])
    left, right = 0, rows * cols - 1
    
    while left <= right:
        mid = left + (right - left) // 2
        row, col = mid // cols, mid % cols
        
        if matrix[row][col] == target:
            return True
        elif matrix[row][col] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return False
```

### Template 9: Find First and Last Position

```python
def search_range(arr: list[int], target: int) -> list[int]:
    """
    Find first and last position of target in sorted array.
    Time: O(log n), Space: O(1)
    """
    def find_first():
        left, right = 0, len(arr) - 1
        result = -1
        while left <= right:
            mid = left + (right - left) // 2
            if arr[mid] >= target:
                if arr[mid] == target:
                    result = mid
                right = mid - 1
            else:
                left = mid + 1
        return result
    
    def find_last():
        left, right = 0, len(arr) - 1
        result = -1
        while left <= right:
            mid = left + (right - left) // 2
            if arr[mid] <= target:
                if arr[mid] == target:
                    result = mid
                left = mid + 1
            else:
                right = mid - 1
        return result
    
    return [find_first(), find_last()]
```

### Template 10: Recursive Binary Search

```python
def binary_search_recursive(arr: list[int], target: int, left: int = 0, right: int = None) -> int:
    """
    Recursive binary search.
    Time: O(log n), Space: O(log n) for recursion stack
    """
    if right is None:
        right = len(arr) - 1
    
    if left > right:
        return -1
    
    mid = left + (right - left) // 2
    
    if arr[mid] == target:
        return mid
    elif arr[mid] < target:
        return binary_search_recursive(arr, target, mid + 1, right)
    else:
        return binary_search_recursive(arr, target, left, mid - 1)
```

---

## When to Use

Use the Binary Search algorithm when you need to solve problems involving:

- **Searching in sorted arrays**: Finding an element efficiently
- **Finding boundaries**: Lower bound, upper bound, insertion points
- **Optimization problems**: Finding minimum/maximum satisfying a condition
- **Monotonic predicates**: Problems where if x works, all values > x also work (or vice versa)

### Comparison with Alternatives

| Algorithm | Time Complexity | Space | Requirements |
|-----------|----------------|-------|--------------|
| **Binary Search** | O(log n) | O(1) | Sorted array |
| Linear Search | O(n) | O(1) | None |
| Hash Table Lookup | O(1) avg | O(n) | Hash function |
| Interpolation Search | O(log log n) avg | O(1) | Uniformly distributed |

### When to Choose Binary Search vs Other Approaches

- **Choose Binary Search** when:
  - The array is sorted (or can be sorted in O(n log n) then search many times)
  - You need O(log n) search time
  - You're solving an optimization problem with monotonic predicate
  - You need to find exact match or closest element

- **Choose Linear Search** when:
  - Array is unsorted and cannot be sorted
  - Array is very small (n < 50)
  - You only need to search once

- **Choose Hash Table** when:
  - You need O(1) average lookup time
  - You have many searches on the same data
  - Space is not a concern

---

## Algorithm Explanation

### Core Concept

Binary Search works on the principle of **elimination**. At each step, we compare the middle element of the current search range with the target value:

- If they're **equal**, we've found the target
- If the target is **smaller**, the target must be in the left half
- If the target is **larger**, the target must be in the right half

By eliminating half of the remaining elements with each comparison, we achieve O(log n) time complexity.

### How It Works

#### Iterative Approach:
1. Initialize pointers: `left = 0` and `right = len(arr) - 1`
2. Enter loop: While `left <= right`:
   - Calculate `mid = left + (right - left) // 2` (prevents overflow)
   - If `arr[mid] == target`, return `mid` (found!)
   - If `arr[mid] < target`, set `left = mid + 1` (search right half)
   - If `arr[mid] > target`, set `right = mid - 1` (search left half)
3. Exit loop: Return -1 if target not found

#### Recursive Approach:
1. Base case: If `left > right`, return -1 (not found)
2. Calculate mid: `mid = left + (right - left) // 2`
3. Compare and recurse:
   - If `arr[mid] == target`, return `mid`
   - If `arr[mid] < target`, recurse on `[mid + 1, right]`
   - If `arr[mid] > target`, recurse on `[left, mid - 1]`

### Visual Representation

For array `[1, 3, 5, 7, 9, 11, 13, 15]` searching for target `7`:

```
Step 1: [1, 3, 5, 7, 9, 11, 13, 15]
          L       M               R
          mid = 3, arr[3] = 7 == target ✓

Search space reduced from 8 to 1 element in just 1 step!
```

For target `6` (not present):
```
Step 1: [1, 3, 5, 7, 9, 11, 13, 15]
          L       M               R
          arr[3] = 7 > 6, search left

Step 2: [1, 3, 5]
          L   M   R
          arr[1] = 3 < 6, search right

Step 3: [5]
          L=R=M
          arr[2] = 5 < 6, left becomes 3

Step 4: left > right, return -1
```

### Why It Works

Because the array is sorted, we can definitively determine which half contains (or doesn't contain) our target:
- All elements to the left of a value are ≤ that value
- All elements to the right of a value are ≥ that value

This guarantee allows us to eliminate entire halves without missing potential matches.

### Limitations

- **Requires sorted data**: Either the array must be sorted, or we must sort it first
- **Random access required**: Cannot work efficiently on linked lists (O(n) to find middle)
- **No dynamic updates**: Adding/removing elements requires re-sorting or different data structures

---

## Practice Problems

### Problem 1: Binary Search

**Problem:** [LeetCode 704 - Binary Search](https://leetcode.com/problems/binary-search/)

**Description:** Given an array of integers `nums` which is sorted in ascending order, and an integer `target`, write a function to search `target` in `nums`. If `target` exists, then return its index. Otherwise, return `-1`.

**How to Apply Binary Search:**
- Apply the standard iterative binary search algorithm
- Use overflow-safe mid calculation: `left + (right - left) // 2`
- Time complexity is O(log n) as required

---

### Problem 2: Search Insert Position

**Problem:** [LeetCode 35 - Search Insert Position](https://leetcode.com/problems/search-insert-position/)

**Description:** Given a sorted array and a target value, return the index if found. If not, return the index where it would be inserted to maintain sorted order.

**How to Apply Binary Search:**
- Use lower bound variation
- When target not found, `left` pointer indicates insertion point
- Return `left` at the end regardless of whether target was found

---

### Problem 3: Search in Rotated Sorted Array

**Problem:** [LeetCode 33 - Search in Rotated Sorted Array](https://leetcode.com/problems/search-in-rotated-sorted-array/)

**Description:** There is an integer array `nums` sorted in ascending order (with distinct values). Prior to being passed to your function, `nums` is possibly rotated at an unknown pivot index. Given the rotated array and an integer target, return the index of target if it is in nums, or -1 if it is not in nums.

**How to Apply Binary Search:**
- Determine which half is sorted at each step
- Check if target falls within the sorted half's range
- Search the appropriate half based on target's possible location

---

### Problem 4: Find First and Last Position of Element

**Problem:** [LeetCode 34 - Find First and Last Position of Element in Sorted Array](https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/)

**Description:** Given an array of integers `nums` sorted in non-decreasing order, find the starting and ending position of a given `target` value. If target is not found, return `[-1, -1]`.

**How to Apply Binary Search:**
- Use separate binary searches for first and last positions
- For first: move right pointer when `arr[mid] >= target`
- For last: move left pointer when `arr[mid] <= target`

---

### Problem 5: Search a 2D Matrix

**Problem:** [LeetCode 74 - Search a 2D Matrix](https://leetcode.com/problems/search-a-2d-matrix/)

**Description:** You are given an m x n integer matrix with two properties: (1) Each row is sorted in non-decreasing order, (2) The first integer of each row is greater than the last integer of the previous row. Given an integer target, return `true` if target is in the matrix.

**How to Apply Binary Search:**
- Treat 2D matrix as 1D sorted array using index mapping
- Map index to (row, col): `row = index // cols`, `col = index % cols`
- Apply standard binary search with virtual indexing

---

## Video Tutorial Links

### Fundamentals

- [Binary Search Explained (Take U Forward)](https://www.youtube.com/watch?v=Mo5R9qQ-GQc) - Comprehensive introduction
- [Binary Search Implementation (NeetCode)](https://www.youtube.com/watch?v=FXW2mjQaOys) - Practical implementation guide
- [Binary Search Mastery (WilliamFiset)](https://www.youtube.com/watch?v=5B697naOjAo) - Detailed visualizations

### Advanced Topics

- [Search in Rotated Array](https://www.youtube.com/watch?v=6bPZS8T8zTY) - Handling rotated arrays
- [Binary Search on Answer](https://www.youtube.com/watch?v=zD2P2m9M7kE) - Optimization problems
- [Lower Bound & Upper Bound](https://www.youtube.com/watch?v=OEu2MXZE5T4) - Variations for finding boundaries

---

## Follow-up Questions

### Q1: Why use `left + (right - left) // 2` instead of `(left + right) // 2`?

**Answer:** The latter can cause integer overflow in languages with fixed-size integers (like C++ and Java). When `left` and `right` are large (close to `Integer.MAX_VALUE`), their sum can exceed the maximum value. The subtraction first ensures we never exceed the range. In Python this isn't an issue due to arbitrary precision integers, but it's good practice for cross-language compatibility.

### Q2: When should you use binary search over linear search?

**Answer:**
- **Use Binary Search** when:
  - Array is sorted
  - You have multiple searches on the same array
  - n is large (log n is significantly better than n)
  - You're solving an optimization problem with monotonic predicate

- **Use Linear Search** when:
  - Array is unsorted
  - Array is very small (n < 50)
  - You only need to search once (sorting would take O(n log n))

### Q3: Can binary search work on linked lists?

**Answer:** Not efficiently. Binary search requires O(1) random access to find the middle element, but linked lists have O(n) access time. To find the middle, you'd need to traverse half the list each time, making the total time O(n log n) instead of O(log n). For linked lists, prefer linear search or convert to array first.

### Q4: What is "binary search on answer" and when is it used?

**Answer:** Binary search on answer is a technique for optimization problems where:
- We need to find the minimum/maximum value that satisfies a condition
- The condition is monotonic: if x satisfies the condition, then all values greater than x also satisfy it (or vice versa)

Examples: finding minimum capacity to ship packages, minimum eating speed, minimum threshold for a property. We binary search on the possible answer values instead of array indices.

### Q5: How do you handle duplicates in binary search?

**Answer:**
- **Find first occurrence**: Use lower bound variation (move right when `arr[mid] >= target`)
- **Find last occurrence**: Use upper bound variation (move left when `arr[mid] <= target`)
- **Find any occurrence**: Standard binary search (any match is fine)
- **Count occurrences**: Find first and last, then `last - first + 1`

---

## Summary

Binary Search is one of the most fundamental and powerful algorithms in computer science. Key takeaways:

- **O(log n) time complexity**: Dramatically faster than linear search for large datasets
- **Requires sorted data**: Either sorted array or sortable collection
- **Simple implementation**: Core algorithm is just a few lines
- **Many variations**: Lower bound, upper bound, rotated array, binary search on answer
- **Essential for interviews**: Frequently asked in technical interviews

When to use:
- ✅ Searching in sorted arrays
- ✅ Finding insertion points
- ✅ Optimization problems (binary search on answer)
- ✅ Finding boundaries (first/last occurrence)
- ❌ Unsorted arrays (sort first or use different algorithm)
- ❌ Single search on unsortable data (use linear search)

Mastering binary search and its variations is essential for competitive programming and technical interviews. The pattern of "divide and conquer" applies to many other algorithms and problem-solving techniques.
