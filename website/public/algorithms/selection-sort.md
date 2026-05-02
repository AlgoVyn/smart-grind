# Selection Sort

## Category
Sorting

## Description

Selection Sort is a simple comparison-based sorting algorithm that divides the input array into a sorted and an unsorted region. It repeatedly finds the minimum element from the unsorted region and places it at the end of the sorted region by swapping.

While not efficient for large datasets due to its O(n²) time complexity, Selection Sort has educational value and specific practical advantages: it minimizes the number of swaps (only O(n)), works well with memory-constrained systems, and performs consistently regardless of input order. Its simplicity makes it an excellent introduction to sorting algorithms.

---

## Concepts

Selection Sort relies on fundamental concepts of comparison-based sorting.

### 1. Algorithm Structure

| Phase | Action | Array State |
|-------|--------|-------------|
| **Initialization** | Entire array is unsorted | [unsorted] |
| **Iteration i** | Find min in unsorted[i..n-1] | [sorted | unsorted] |
| **Swap** | Swap min with position i | [sorted+1 | unsorted-1] |
| **Termination** | All elements sorted | [sorted] |

### 2. Swap Analysis

| Algorithm | Worst Case Swaps | Best For |
|-----------|-----------------|----------|
| **Bubble Sort** | O(n²) | When swaps are cheap |
| **Insertion Sort** | O(n²) | Nearly sorted data |
| **Selection Sort** | O(n) | When writes are expensive |

Selection Sort always performs exactly n-1 swaps.

### 3. Stability Considerations

| Variant | Stable | Implementation |
|---------|--------|----------------|
| **Standard** | No | Swaps distant elements |
| **Shift-based** | Yes | Shifts elements to insert minimum |

Standard Selection Sort is not stable because swapping can change the relative order of equal elements.

### 4. Comparison Pattern

```
For array of size n:
  Pass 1: n-1 comparisons, find min of [0..n-1]
  Pass 2: n-2 comparisons, find min of [1..n-1]
  Pass 3: n-3 comparisons, find min of [2..n-1]
  ...
  Pass n-1: 1 comparison

Total comparisons: (n-1) + (n-2) + ... + 1 = n(n-1)/2 = O(n²)
```

---

## Frameworks

Structured approaches for Selection Sort.

### Framework 1: Standard Selection Sort

```
┌─────────────────────────────────────────────────────────────┐
│  STANDARD SELECTION SORT                                     │
├─────────────────────────────────────────────────────────────┤
│  Input: array of n elements                                  │
│  Output: array sorted in ascending order                     │
│                                                              │
│  1. For i from 0 to n-2:                                     │
│     a. min_idx = i                                           │
│     b. For j from i+1 to n-1:                                │
│        - If arr[j] < arr[min_idx]:                          │
│          * min_idx = j                                       │
│     c. If min_idx != i:                                      │
│        - Swap arr[i] and arr[min_idx]                        │
│  2. Return sorted array                                      │
│                                                              │
│  Comparisons: n(n-1)/2                                       │
│  Swaps: n-1                                                  │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Educational purposes, when swaps are expensive.

### Framework 2: Stable Selection Sort

```
┌─────────────────────────────────────────────────────────────┐
│  STABLE SELECTION SORT (SHIFT-BASED)                         │
├─────────────────────────────────────────────────────────────┤
│  1. For i from 0 to n-1:                                     │
│     a. Find minimum in arr[i..n-1]                          │
│     b. Shift elements arr[i..min_idx-1] one position right  │
│     c. Place minimum at position i                          │
│  2. Return sorted array                                      │
│                                                              │
│  More operations but preserves relative order                │
│  Time: O(n²), Space: O(1) but with O(n) shifts             │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: When stability is required.

### Framework 3: Bidirectional Selection Sort (Cocktail Sort Variant)

```
┌─────────────────────────────────────────────────────────────┐
│  BIDIRECTIONAL SELECTION SORT                                │
├─────────────────────────────────────────────────────────────┤
│  1. left = 0, right = n-1                                    │
│  2. While left < right:                                      │
│     a. Find min in [left..right], swap to left              │
│     b. Find max in [left..right], swap to right             │
│     c. left++, right--                                       │
│  3. Return sorted array                                      │
│                                                              │
│  Fewer passes, but still O(n²) comparisons                  │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Slightly faster in practice, fewer passes.

---

## Forms

Different manifestations of Selection Sort.

### Form 1: Standard Selection Sort

Basic implementation with swaps.

| Aspect | Details |
|--------|---------|
| **Time** | O(n²) all cases |
| **Space** | O(1) auxiliary |
| **Swaps** | O(n) exactly n-1 |
| **Stable** | No |
| **Best for** | Small arrays, expensive writes |

### Form 2: Stable Selection Sort

Maintains relative order of equal elements.

| Aspect | Details |
|--------|---------|
| **Time** | O(n²) |
| **Space** | O(1) but O(n) element shifts |
| **Stable** | Yes |
| **Trade-off** | More operations for stability |

### Form 3: Max-Heap Selection Sort

Using selection principle with heap.

| Aspect | Details |
|--------|---------|
| **Time** | O(n log n) |
| **Space** | O(1) for heap sort |
| **Relation** | Heap Sort is an optimized selection sort |

### Form 4: Tournament Sort

Using tournament tree for selection.

| Aspect | Details |
|--------|---------|
| **Time** | O(n log n) |
| **Space** | O(n) for tournament tree |
| **Idea** | Track comparisons to avoid re-comparing |

---

## Tactics

Specific techniques for Selection Sort.

### Tactic 1: Standard Implementation

Basic selection sort:

```python
def selection_sort(nums):
    """
    Selection sort - find minimum and place in correct position.
    Time: O(n²), Space: O(1)
    """
    n = len(nums)
    
    for i in range(n):
        min_idx = i
        # Find minimum in remaining unsorted array
        for j in range(i + 1, n):
            if nums[j] < nums[min_idx]:
                min_idx = j
        
        # Swap found minimum with first element
        nums[i], nums[min_idx] = nums[min_idx], nums[i]
    
    return nums
```

**Key insight**: Exactly n-1 swaps regardless of input order.

### Tactic 2: Stable Version

Using shifts instead of swaps:

```python
def selection_sort_stable(nums):
    """Stable selection sort using O(n) extra space for shifting."""
    n = len(nums)
    for i in range(n):
        min_idx = i
        for j in range(i + 1, n):
            if nums[j] < nums[min_idx]:
                min_idx = j
        
        # Shift elements and insert minimum
        min_val = nums[min_idx]
        for j in range(min_idx, i, -1):
            nums[j] = nums[j - 1]
        nums[i] = min_val
    
    return nums
```

**Note**: This is stable but uses O(n) shifts per element.

### Tactic 3: Find Both Min and Max

Bidirectional optimization:

```python
def bidirectional_selection_sort(nums):
    """
    Find both min and max in each pass.
    Reduces number of passes by half.
    """
    left, right = 0, len(nums) - 1
    
    while left < right:
        min_idx, max_idx = left, right
        
        # Find min and max in unsorted portion
        for i in range(left, right + 1):
            if nums[i] < nums[min_idx]:
                min_idx = i
            if nums[i] > nums[max_idx]:
                max_idx = i
        
        # Swap min to left
        nums[left], nums[min_idx] = nums[min_idx], nums[left]
        
        # If max was at left, it's now at min_idx
        if max_idx == left:
            max_idx = min_idx
        
        # Swap max to right
        nums[right], nums[max_idx] = nums[max_idx], nums[right]
        
        left += 1
        right -= 1
    
    return nums
```

**Optimization**: Approximately halves the number of passes.

### Tactic 4: Optimize for Nearly Sorted

Early termination check:

```python
def selection_sort_early_exit(nums):
    """
    Selection sort with early termination if already sorted.
    """
    n = len(nums)
    
    for i in range(n):
        min_idx = i
        for j in range(i + 1, n):
            if nums[j] < nums[min_idx]:
                min_idx = j
        
        if min_idx == i:
            # Element already in correct position
            # Could check if remaining is sorted, but still O(n²)
            pass
        
        nums[i], nums[min_idx] = nums[min_idx], nums[i]
    
    return nums
```

**Note**: Selection Sort doesn't adapt well to nearly-sorted input.

### Tactic 5: Recursive Selection Sort

Recursive variant for educational purposes:

```python
def selection_sort_recursive(nums, start=0):
    """
    Recursive selection sort.
    """
    if start >= len(nums) - 1:
        return nums
    
    # Find minimum in remaining array
    min_idx = start
    for i in range(start + 1, len(nums)):
        if nums[i] < nums[min_idx]:
            min_idx = i
    
    # Swap
    nums[start], nums[min_idx] = nums[min_idx], nums[start]
    
    # Recurse on rest
    return selection_sort_recursive(nums, start + 1)
```

---

## Python Templates

### Template 1: Standard Selection Sort

```python
from typing import List


def selection_sort(nums: List[int]) -> List[int]:
    """
    Selection Sort - In-place sorting algorithm.
    
    Divides array into sorted and unsorted regions,
    repeatedly finds minimum from unsorted and places at end of sorted.
    
    Time: O(n²) for all cases (best, average, worst)
    Space: O(1) auxiliary
    Swaps: O(n) - exactly n-1 swaps
    Stable: No
    
    Args:
        nums: List of comparable elements
    
    Returns:
        Sorted list (in-place modification)
    """
    n = len(nums)
    
    for i in range(n):
        # Find minimum element in unsorted portion
        min_idx = i
        for j in range(i + 1, n):
            if nums[j] < nums[min_idx]:
                min_idx = j
        
        # Swap minimum with first element of unsorted portion
        nums[i], nums[min_idx] = nums[min_idx], nums[i]
    
    return nums
```

### Template 2: Selection Sort with Swap Count

```python
def selection_sort_with_stats(nums: List[int]) -> tuple:
    """
    Selection sort with comparison and swap statistics.
    
    Returns:
        (sorted_array, comparisons, swaps)
    """
    n = len(nums)
    comparisons = 0
    swaps = 0
    
    for i in range(n):
        min_idx = i
        for j in range(i + 1, n):
            comparisons += 1
            if nums[j] < nums[min_idx]:
                min_idx = j
        
        if min_idx != i:
            nums[i], nums[min_idx] = nums[min_idx], nums[i]
            swaps += 1
    
    return nums, comparisons, swaps

# Expected: comparisons = n(n-1)/2, swaps <= n-1
```

### Template 3: Bidirectional Selection Sort

```python
def bidirectional_selection_sort(nums: List[int]) -> List[int]:
    """
    Selection sort that finds both min and max each pass.
    Approximately halves the number of passes.
    
    Time: O(n²) but fewer passes
    Space: O(1)
    """
    left, right = 0, len(nums) - 1
    
    while left < right:
        min_idx, max_idx = left, right
        
        # Find min and max
        for i in range(left, right + 1):
            if nums[i] < nums[min_idx]:
                min_idx = i
            if nums[i] > nums[max_idx]:
                max_idx = i
        
        # Place min at left
        nums[left], nums[min_idx] = nums[min_idx], nums[left]
        
        # If max was at left, it's now at min_idx
        if max_idx == left:
            max_idx = min_idx
        
        # Place max at right
        nums[right], nums[max_idx] = nums[max_idx], nums[right]
        
        left += 1
        right -= 1
    
    return nums
```

### Template 4: Stable Selection Sort

```python
def stable_selection_sort(nums: List[int]) -> List[int]:
    """
    Stable variant of selection sort using shifts.
    
    Preserves relative order of equal elements.
    
    Time: O(n²)
    Space: O(1) but O(n) shifts per element
    """
    n = len(nums)
    
    for i in range(n):
        # Find minimum
        min_idx = i
        for j in range(i + 1, n):
            if nums[j] < nums[min_idx]:
                min_idx = j
        
        # Shift elements and insert minimum at position i
        min_val = nums[min_idx]
        for j in range(min_idx, i, -1):
            nums[j] = nums[j - 1]
        nums[i] = min_val
    
    return nums
```

---

## When to Use

Use Selection Sort when you need to solve problems involving:

- **Minimal swaps**: When write operations are expensive (e.g., flash memory)
- **Small datasets**: Educational purposes, n < 50
- **Consistent performance**: O(n²) regardless of input order
- **Memory constraints**: In-place sorting with O(1) space
- **Simple implementation**: When code simplicity matters

### Comparison with Other O(n²) Sorts

| Algorithm | Comparisons | Swaps | Stable | Adaptive | Best For |
|-----------|-------------|-------|--------|----------|----------|
| **Bubble** | O(n²) | O(n²) | Yes | Yes | Educational |
| **Insertion** | O(n²) | O(n²) | Yes | Yes | Nearly sorted |
| **Selection** | O(n²) | O(n) | No | No | Expensive writes |

### When to Choose Selection Sort

- **Choose Selection Sort** when:
  - Swaps are significantly more expensive than comparisons
  - Guaranteed O(n²) is acceptable
  - Simple, small-scale sorting needed
  - Stability not required

- **Avoid Selection Sort** when:
  - Large datasets (use O(n log n) algorithms)
  - Data is nearly sorted (Insertion Sort is better)
  - Stability is required
  - Cache efficiency matters

---

## Algorithm Explanation

### Core Concept

Selection Sort works by repeatedly finding the minimum element from the unsorted portion and placing it at the end of the sorted portion. This creates a growing sorted region at the beginning and a shrinking unsorted region at the end.

### How It Works

#### Step 1: Find Minimum
```
Scan array from position i to n-1
Track index of smallest element
```

#### Step 2: Swap to Position
```
Swap element at i with minimum element
Now position i is in final sorted position
```

#### Step 3: Repeat
```
Increment i and repeat until i = n-1
```

### Visual Walkthrough

**Example**: Sort [64, 25, 12, 22, 11]

```
Initial: [64, 25, 12, 22, 11]
          ↑
         i=0, min=11 at index 4

Pass 1: Swap index 0 and 4
Result: [11, 25, 12, 22, 64]
          ✓  [unsorted...]

Pass 2: Find min in [25, 12, 22, 64]
        min=12 at index 2
Result: [11, 12, 25, 22, 64]
              ✓  [unsorted..]

Pass 3: Find min in [25, 22, 64]
        min=22 at index 3
Result: [11, 12, 22, 25, 64]
                  ✓  [unsorted]

Pass 4: Find min in [25, 64]
        min=25 at index 3
Result: [11, 12, 22, 25, 64]
                      ✓  ✓

Sorted: [11, 12, 22, 25, 64] ✓
```

### Why O(n²) Comparisons Always

Selection Sort always scans the entire unsorted portion to find the minimum:
- Pass 1: n-1 comparisons
- Pass 2: n-2 comparisons
- ...
- Pass n-1: 1 comparison

Total: (n-1) + (n-2) + ... + 1 = n(n-1)/2 = O(n²)

This is true regardless of input order - no early termination possible.

---

## Practice Problems

### Problem 1: Sort an Array

**Problem:** [LeetCode 912 - Sort an Array](https://leetcode.com/problems/sort-an-array/)

**Description:** Given an array of integers `nums`, sort the array in ascending order.

**How to Apply:**
- Implement any sorting algorithm
- Selection Sort works but is not optimal
- Good for practicing the algorithm

---

### Problem 2: Relative Sort Array

**Problem:** [LeetCode 1122 - Relative Sort Array](https://leetcode.com/problems/relative-sort-array/)

**Description:** Sort one array based on the relative order of elements in a second array.

**How to Apply:**
- Custom comparison based on reference array
- Selection Sort with custom comparator

---

## Video Tutorial Links

### Fundamentals

- [Selection Sort Algorithm](https://www.youtube.com/watch?v=g-PGLbMth_g) - Visualization
- [Sorting Algorithms Comparison](https://www.youtube.com/watch?v=ZZuD6iUe3Pc) - All O(n²) sorts
- [Why Selection Sort is Not Stable](https://www.youtube.com/watch?v=cd9P5BosPm4) - Stability explanation

### Implementations

- [Selection Sort in Python](https://www.youtube.com/watch?v=5KjZ2-h1cjk) - Code walkthrough
- [Sorting Algorithm Analysis](https://www.youtube.com/watch?v=l7-f9gW8QpI) - Time complexity

---

## Follow-up Questions

### Q1: Why is Selection Sort not stable?

**Answer**: When we find the minimum element and swap it to the front, we might change the relative order of equal elements that are far apart. For example, [5a, 3, 5b] becomes [3, 5b, 5a] after one pass, changing the order of the two 5s.

### Q2: Can Selection Sort be made stable?

**Answer**: Yes, by using shifts instead of swaps. Instead of swapping the minimum with position i, we shift all elements between i and min_idx one position right, then place the minimum at i. This is O(n) shifts instead of O(1) swaps.

### Q3: Why use Selection Sort over other O(n²) algorithms?

**Answer**: Selection Sort's key advantage is minimal swaps (O(n)). When writing to memory is expensive (e.g., flash memory, EEPROM), Selection Sort outperforms Bubble and Insertion sorts despite all being O(n²) in comparisons.

### Q4: Does Selection Sort adapt to nearly sorted input?

**Answer**: No. Selection Sort always performs n(n-1)/2 comparisons regardless of input order. It cannot detect that an array is already sorted. Insertion Sort is preferred for nearly sorted data.

### Q5: When would I use Selection Sort in practice?

**Answer**: Rarely for performance, but useful for:
- Educational purposes (simple to understand)
- When write operations are very expensive
- When memory is extremely constrained
- As part of hybrid algorithms (though Insertion Sort is preferred)

---

## Summary

Selection Sort is a simple comparison-based sorting algorithm with educational value and specific niche applications. While not suitable for large datasets, its minimal swap count makes it theoretically interesting.

**Key Takeaways:**

1. **O(n²) Always**: Same time for all input orders
2. **O(n) Swaps**: Exactly n-1 swaps
3. **Not Stable**: Swaps can change relative order
4. **In-Place**: O(1) auxiliary space
5. **Simple**: Easy to understand and implement

**When to Use:**
- Educational contexts
- When writes are very expensive
- Small datasets where simplicity matters
- Never for performance-critical large-scale sorting

Selection Sort serves as a foundation for understanding more complex sorting algorithms and demonstrates key concepts like in-place sorting and comparison-based algorithms.
