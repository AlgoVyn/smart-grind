# Quick Sort

## Category
Sorting

## Description

Quick Sort is a highly efficient divide-and-conquer sorting algorithm that works by selecting a 'pivot' element and partitioning the array around it. Elements smaller than the pivot are moved to the left, while larger elements go to the right. This process is repeated recursively on the subarrays.

Developed by Tony Hoare in 1959, Quick Sort has become one of the most widely used sorting algorithms due to its excellent average-case performance and cache-friendly memory access patterns. While its worst-case time complexity is O(n²), randomized pivot selection makes this case extremely unlikely in practice, and the algorithm consistently outperforms other O(n log n) sorts for most real-world data.

---

## Concepts

The Quick Sort algorithm relies on several fundamental concepts that ensure both efficiency and correctness.

### 1. Partitioning

The core operation that rearranges elements around a pivot:

| Partition Scheme | Strategy | Comparisons | Swaps |
|-----------------|----------|-------------|-------|
| **Lomuto** | Single pointer from left | O(n) | Up to n |
| **Hoare** | Two pointers from both ends | O(n) | Up to n/2 |
| **3-way (Dutch National Flag)** | Three regions | O(n) | Varies |

**Lomuto**: Simpler but less efficient, swaps into store position
**Hoare**: More efficient, fewer swaps, works from both ends
**3-way**: Handles duplicates efficiently, creates <, =, > regions

### 2. Pivot Selection Strategies

| Strategy | Description | Best For | Risk |
|----------|-------------|----------|------|
| **First/Last** | Choose first or last element | Simple implementation | O(n²) on sorted data |
| **Random** | Random array element | General purpose | Unlikely worst case |
| **Median-of-three** | Median of first, middle, last | Nearly sorted data | Slightly better balance |
| **Median-of-medians** | Guaranteed good pivot | Worst-case guarantee | Complex, high overhead |

### 3. Recursion and Divide-and-Conquer

```
Divide:   Partition array into two subarrays
Conquer:  Recursively sort subarrays
Combine:  Nothing needed (in-place sorting)
```

### 4. Stability and Properties

| Property | Quick Sort | Notes |
|----------|-----------|-------|
| **Stable** | No | Equal elements may change order |
| **In-place** | Yes | O(log n) stack space |
| **Adaptive** | Partially | Random pivot helps with patterns |
| **Cache efficiency** | High | Sequential memory access |

---

## Frameworks

Structured approaches for implementing Quick Sort.

### Framework 1: Standard Quick Sort (Lomuto)

```
┌─────────────────────────────────────────────────────────────┐
│  STANDARD QUICK SORT WITH LOMUTO PARTITION                   │
├─────────────────────────────────────────────────────────────┤
│  Input: array nums, indices left and right                   │
│  Output: nums sorted in-place                                │
│                                                              │
│  1. If left >= right: return                                 │
│  2. Choose pivot (e.g., random in [left, right])           │
│  3. Move pivot to nums[right]                                 │
│  4. Initialize store_idx = left                              │
│  5. For i from left to right-1:                              │
│     a. If nums[i] < pivot:                                   │
│        - Swap nums[store_idx] and nums[i]                    │
│        - store_idx++                                         │
│  6. Swap nums[store_idx] and nums[right] (place pivot)     │
│  7. pivot_pos = store_idx                                    │
│  8. Recurse on [left, pivot_pos-1]                          │
│  9. Recurse on [pivot_pos+1, right]                         │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Simple implementation, general purpose sorting.

### Framework 2: Hoare Partition Quick Sort

```
┌─────────────────────────────────────────────────────────────┐
│  QUICK SORT WITH HOARE PARTITION                             │
├─────────────────────────────────────────────────────────────┤
│  1. If left >= right: return                                   │
│  2. Choose pivot (e.g., nums[(left+right)//2])              │
│  3. Initialize i = left - 1, j = right + 1                   │
│  4. While True:                                              │
│     a. Repeat: i++ until nums[i] >= pivot                    │
│     b. Repeat: j-- until nums[j] <= pivot                    │
│     c. If i >= j: break and return j                         │
│     d. Swap nums[i] and nums[j]                              │
│  5. Recurse on [left, j]                                      │
│  6. Recurse on [j+1, right]                                   │
│                                                              │
│  Note: Hoare returns split position, not pivot position    │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Better performance, fewer swaps.

### Framework 3: 3-Way Quick Sort (Dutch National Flag)

```
┌─────────────────────────────────────────────────────────────┐
│  3-WAY QUICK SORT FOR ARRAYS WITH DUPLICATES                │
├─────────────────────────────────────────────────────────────┤
│  1. If left >= right: return                                   │
│  2. Choose pivot and move to nums[left]                      │
│  3. Initialize: lt = left, gt = right, i = left + 1        │
│  4. While i <= gt:                                           │
│     a. If nums[i] < pivot:                                   │
│        - Swap nums[lt] and nums[i]                           │
│        - lt++, i++                                           │
│     b. If nums[i] > pivot:                                   │
│        - Swap nums[i] and nums[gt]                           │
│        - gt-- (don't increment i)                          │
│     c. Else (nums[i] == pivot):                              │
│        - i++                                                 │
│  5. Result: [left..lt-1] < pivot = [lt..gt] < [gt+1..right]│
│  6. Recurse on [left, lt-1]                                 │
│  7. Recurse on [gt+1, right]                                │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Many duplicate elements.

### Framework 4: Hybrid Quick Sort

```
┌─────────────────────────────────────────────────────────────┐
│  HYBRID QUICK SORT (INTROSORT PATTERN)                       │
├─────────────────────────────────────────────────────────────┤
│  1. Set recursion depth limit (e.g., 2 * log2(n))           │
│  2. While True:                                              │
│     a. If right - left < threshold (e.g., 16):            │
│        - Use insertion sort on small subarray               │
│        - Break                                               │
│     b. If depth limit reached:                               │
│        - Use heap sort on remaining subarray                │
│        - Break                                               │
│     c. Partition and recurse on smaller half first          │
│     d. Set right = larger_half_start (tail recursion opt) │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Production code, guaranteed O(n log n) worst case.

---

## Forms

Different manifestations and variations of Quick Sort.

### Form 1: Basic Quick Sort

Standard implementation with Lomuto partition.

| Aspect | Details |
|--------|---------|
| **Time** | O(n log n) avg, O(n²) worst |
| **Space** | O(log n) recursion stack |
| **Stable** | No |
| **Best for** | General purpose, unsorted data |

### Form 2: Randomized Quick Sort

Uses random pivot selection to avoid worst case.

| Aspect | Details |
|--------|---------|
| **Time** | O(n log n) expected |
| **Space** | O(log n) |
| **Advantage** | Worst case extremely unlikely |
| **Best for** | Unknown/adversarial input |

### Form 3: 3-Way Quick Sort

Handles duplicates efficiently.

| Aspect | Details |
|--------|---------|
| **Time** | O(n log n) avg, O(n) with many duplicates |
| **Space** | O(log n) |
| **Best for** | Arrays with many duplicate keys |

### Form 4: Dual-Pivot Quick Sort

Uses two pivots for three partitions.

| Aspect | Details |
|--------|---------|
| **Time** | O(n log n) avg, better constants |
| **Space** | O(log n) |
| **Best for** | Used in Java's Arrays.sort() |

### Form 5: Iterative Quick Sort

Eliminates recursion using explicit stack.

| Aspect | Details |
|--------|---------|
| **Time** | O(n log n) avg |
| **Space** | O(log n) explicit stack |
| **Best for** | Avoiding recursion limits |

---

## Tactics

Specific techniques and optimizations.

### Tactic 1: Randomized Partition

Essential for avoiding worst-case performance:

```python
import random

def randomized_partition(nums, left, right):
    """
    Partition with random pivot selection.
    """
    # Random pivot avoids worst case on sorted input
    pivot_idx = random.randint(left, right)
    nums[pivot_idx], nums[right] = nums[right], nums[pivot_idx]
    
    pivot = nums[right]
    store_idx = left
    
    for i in range(left, right):
        if nums[i] < pivot:
            nums[store_idx], nums[i] = nums[i], nums[store_idx]
            store_idx += 1
    
    nums[right], nums[store_idx] = nums[store_idx], nums[right]
    return store_idx
```

**Why it matters**: Prevents O(n²) on already sorted or reverse-sorted input.

### Tactic 2: Hoare Partition

More efficient two-pointer approach:

```python
def hoare_partition(nums, left, right):
    """
    Hoare partition scheme - fewer swaps than Lomuto.
    """
    pivot = nums[(left + right) // 2]
    i, j = left - 1, right + 1
    
    while True:
        i += 1
        while nums[i] < pivot:
            i += 1
        
        j -= 1
        while nums[j] > pivot:
            j -= 1
        
        if i >= j:
            return j
        
        nums[i], nums[j] = nums[j], nums[i]
```

**Advantage**: Typically 3x fewer swaps than Lomuto.

### Tactic 3: 3-Way Partition for Duplicates

Efficient handling of duplicate keys:

```python
def quick_sort_3way(nums, left, right):
    """
    3-way quick sort for arrays with many duplicates.
    """
    if left >= right:
        return
    
    # Random pivot
    pivot_idx = random.randint(left, right)
    nums[pivot_idx], nums[left] = nums[left], nums[pivot_idx]
    pivot = nums[left]
    
    # Three pointers
    lt = left  # nums[left..lt-1] < pivot
    gt = right  # nums[gt+1..right] > pivot
    i = left + 1  # nums[lt..i-1] == pivot
    
    while i <= gt:
        if nums[i] < pivot:
            nums[lt], nums[i] = nums[i], nums[lt]
            lt += 1
            i += 1
        elif nums[i] > pivot:
            nums[i], nums[gt] = nums[gt], nums[i]
            gt -= 1
        else:
            i += 1
    
    quick_sort_3way(nums, left, lt - 1)
    quick_sort_3way(nums, gt + 1, right)
```

**When to use**: Array has many duplicate elements (e.g., [1, 1, 1, 2, 2, 3, 3]).

### Tactic 4: Tail Recursion Optimization

Optimize stack usage by recursing on smaller partition first:

```python
def quick_sort_optimized(nums, left, right):
    """
    Quick sort with tail recursion optimization.
    """
    while left < right:
        pivot_idx = partition(nums, left, right)
        
        # Recurse on smaller partition
        if pivot_idx - left < right - pivot_idx:
            quick_sort_optimized(nums, left, pivot_idx - 1)
            left = pivot_idx + 1  # Iterate on larger half
        else:
            quick_sort_optimized(nums, pivot_idx + 1, right)
            right = pivot_idx - 1
```

**Benefit**: Guarantees O(log n) stack depth even in worst case.

### Tactic 5: Hybrid with Insertion Sort

Use insertion sort for small subarrays:

```python
def insertion_sort_range(nums, left, right):
    """Insertion sort for small subarrays."""
    for i in range(left + 1, right + 1):
        key = nums[i]
        j = i - 1
        while j >= left and nums[j] > key:
            nums[j + 1] = nums[j]
            j -= 1
        nums[j + 1] = key

def quick_sort_hybrid(nums, left, right):
    """Quick sort that switches to insertion sort for small arrays."""
    if right - left < 16:  # Threshold
        insertion_sort_range(nums, left, right)
        return
    
    pivot_idx = partition(nums, left, right)
    quick_sort_hybrid(nums, left, pivot_idx - 1)
    quick_sort_hybrid(nums, pivot_idx + 1, right)
```

**Optimization**: Insertion sort has better constants for small n (< 16-32).

---

## Python Templates

### Template 1: Standard Quick Sort (Lomuto)

```python
import random
from typing import List


def quick_sort(nums: List[int]) -> List[int]:
    """
    Quick sort with random pivot (Lomuto partition).
    
    Sorts the array in-place and returns it.
    
    Time: O(n log n) average, O(n²) worst case
    Space: O(log n) recursion stack
    """
    def partition(left: int, right: int, pivot_idx: int) -> int:
        pivot = nums[pivot_idx]
        # Move pivot to end
        nums[pivot_idx], nums[right] = nums[right], nums[pivot_idx]
        
        store_idx = left
        for i in range(left, right):
            if nums[i] < pivot:
                nums[store_idx], nums[i] = nums[i], nums[store_idx]
                store_idx += 1
        
        # Place pivot in final position
        nums[right], nums[store_idx] = nums[store_idx], nums[right]
        return store_idx
    
    def sort(left: int, right: int):
        if left >= right:
            return
        
        # Random pivot to avoid worst case
        pivot_idx = random.randint(left, right)
        pivot_idx = partition(left, right, pivot_idx)
        
        sort(left, pivot_idx - 1)
        sort(pivot_idx + 1, right)
    
    sort(0, len(nums) - 1)
    return nums
```

### Template 2: Quick Sort with Hoare Partition

```python
def quick_sort_hoare(nums: List[int]) -> List[int]:
    """
    Quick sort with Hoare partition scheme.
    
    More efficient with fewer swaps than Lomuto.
    
    Time: O(n log n) average
    Space: O(log n)
    """
    def partition(left: int, right: int) -> int:
        # Choose middle element as pivot
        pivot = nums[(left + right) // 2]
        i, j = left - 1, right + 1
        
        while True:
            i += 1
            while nums[i] < pivot:
                i += 1
            
            j -= 1
            while nums[j] > pivot:
                j -= 1
            
            if i >= j:
                return j
            
            nums[i], nums[j] = nums[j], nums[i]
    
    def sort(left: int, right: int):
        if left < right:
            pivot_idx = partition(left, right)
            sort(left, pivot_idx)
            sort(pivot_idx + 1, right)
    
    sort(0, len(nums) - 1)
    return nums
```

### Template 3: 3-Way Quick Sort

```python
def quick_sort_3way(nums: List[int]) -> List[int]:
    """
    3-way quick sort for arrays with duplicates.
    
    Creates three partitions: < pivot, = pivot, > pivot
    
    Time: O(n log n) average, O(n) with many duplicates
    Space: O(log n)
    """
    def sort(left: int, right: int):
        if left >= right:
            return
        
        # Random pivot
        pivot_idx = random.randint(left, right)
        nums[pivot_idx], nums[left] = nums[left], nums[pivot_idx]
        pivot = nums[left]
        
        # Three-way partition
        lt = left  # nums[left..lt-1] < pivot
        gt = right  # nums[gt+1..right] > pivot
        i = left + 1  # nums[lt..i-1] == pivot
        
        while i <= gt:
            if nums[i] < pivot:
                nums[lt], nums[i] = nums[i], nums[lt]
                lt += 1
                i += 1
            elif nums[i] > pivot:
                nums[i], nums[gt] = nums[gt], nums[i]
                gt -= 1
            else:
                i += 1
        
        sort(left, lt - 1)
        sort(gt + 1, right)
    
    sort(0, len(nums) - 1)
    return nums
```

### Template 4: Hybrid Quick Sort with Insertion Sort

```python
def quick_sort_hybrid(nums: List[int], threshold: int = 16) -> List[int]:
    """
    Quick sort that switches to insertion sort for small subarrays.
    
    Optimal threshold is typically 16-32.
    
    Time: O(n log n) average
    Space: O(log n)
    """
    def insertion_sort(left: int, right: int):
        for i in range(left + 1, right + 1):
            key = nums[i]
            j = i - 1
            while j >= left and nums[j] > key:
                nums[j + 1] = nums[j]
                j -= 1
            nums[j + 1] = key
    
    def partition(left: int, right: int) -> int:
        pivot = nums[random.randint(left, right)]
        i, j = left - 1, right + 1
        
        while True:
            i += 1
            while nums[i] < pivot:
                i += 1
            j -= 1
            while nums[j] > pivot:
                j -= 1
            if i >= j:
                return j
            nums[i], nums[j] = nums[j], nums[i]
    
    def sort(left: int, right: int):
        if right - left < threshold:
            insertion_sort(left, right)
            return
        
        pivot_idx = partition(left, right)
        sort(left, pivot_idx)
        sort(pivot_idx + 1, right)
    
    sort(0, len(nums) - 1)
    return nums
```

### Template 5: Iterative Quick Sort

```python
def quick_sort_iterative(nums: List[int]) -> List[int]:
    """
    Iterative Quick Sort using explicit stack.
    
    Avoids recursion depth limits.
    
    Time: O(n log n) average
    Space: O(log n) explicit stack
    """
    def partition(left: int, right: int) -> int:
        pivot = nums[random.randint(left, right)]
        i, j = left - 1, right + 1
        
        while True:
            i += 1
            while nums[i] < pivot:
                i += 1
            j -= 1
            while nums[j] > pivot:
                j -= 1
            if i >= j:
                return j
            nums[i], nums[j] = nums[j], nums[i]
    
    # Explicit stack for subarray boundaries
    stack = [(0, len(nums) - 1)]
    
    while stack:
        left, right = stack.pop()
        
        if left < right:
            pivot_idx = partition(left, right)
            
            # Push larger partition first (tail recursion optimization)
            if pivot_idx - left > right - pivot_idx:
                stack.append((left, pivot_idx))
                stack.append((pivot_idx + 1, right))
            else:
                stack.append((pivot_idx + 1, right))
                stack.append((left, pivot_idx))
    
    return nums
```

---

## When to Use

Use Quick Sort when you need to solve problems involving:

- **General sorting**: Most efficient for random data
- **In-place sorting**: Limited memory available
- **Cache performance**: Sequential memory access matters
- **Custom comparisons**: Flexible comparison functions
- **Partial sorting**: Can be modified for selection (Quick Select)

### Comparison with Other Sorts

| Algorithm | Time | Space | Stable | Cache | Best For |
|-----------|------|-------|--------|-------|----------|
| **Quick Sort** | O(n log n) avg | O(log n) | No | Excellent | General purpose |
| **Merge Sort** | O(n log n) | O(n) | Yes | Good | Linked lists, stability needed |
| **Heap Sort** | O(n log n) | O(1) | No | Poor | Guaranteed O(n log n) |
| **Tim Sort** | O(n log n) | O(n) | Yes | Good | Real-world data (Python, Java) |
| **Counting Sort** | O(n + k) | O(k) | Yes | N/A | Small integer range |

### When to Choose Quick Sort

- **Choose Quick Sort** when:
  - Average-case performance is most important
  - Memory is constrained (in-place sorting)
  - Cache performance matters
  - Stability is not required
  - Data is randomly distributed

- **Avoid Quick Sort** when:
  - Worst-case O(n²) is unacceptable (use Heap Sort)
  - Stability is required (use Merge Sort)
  - Data is nearly sorted (use Tim Sort or Insertion Sort)
  - Data is a linked list (use Merge Sort)

---

## Algorithm Explanation

### Core Concept

Quick Sort works on the principle of divide-and-conquer through partitioning:
1. **Divide**: Select a pivot and partition array into two subarrays
2. **Conquer**: Recursively sort the subarrays
3. **Combine**: Nothing needed (sorted in-place)

The key insight is that after partitioning, the pivot is in its final sorted position, and we only need to sort the elements on either side.

### How Partitioning Works

#### Lomuto Partition:
```
Initial: [3, 6, 2, 8, 1, 4], pivot = 4

Step through array:
  i=0, nums[0]=3 < 4: swap with store_idx=0, store_idx=1
  i=1, nums[1]=6 > 4: skip
  i=2, nums[2]=2 < 4: swap with store_idx=1, store_idx=2
  i=3, nums[3]=8 > 4: skip
  i=4, nums[4]=1 < 4: swap with store_idx=2, store_idx=3

Result: [3, 2, 1] [4] [6, 8]
              ↑
           pivot at position 3
```

### Visual Walkthrough

**Example**: Sort [3, 6, 2, 8, 1, 4]

```
Level 1: [3, 6, 2, 8, 1, 4], pivot=4
         Partition → [3, 2, 1] [4] [6, 8]
                      ↓         ↓     ↓
                   recurse   done  recurse

Level 2: [3, 2, 1], pivot=2    [6, 8], pivot=8
         → [1] [2] [3]         → [6] [8]

Result: [1, 2, 3, 4, 6, 8] ✓
```

### Why O(n log n) Average

Each level of recursion processes all n elements (total work per level = O(n)).
With balanced partitions, we have log n levels.
Total: O(n log n)

### Worst Case O(n²)

Occurs when pivot is always smallest or largest element:
- Sorted input with naive pivot selection
- Results in completely unbalanced partitions
- Each level processes n, n-1, n-2, ... elements
- Total: n + (n-1) + (n-2) + ... = O(n²)

**Mitigation**: Randomized pivot selection makes worst case probability negligible.

---

## Practice Problems

### Problem 1: Sort an Array

**Problem:** [LeetCode 912 - Sort an Array](https://leetcode.com/problems/sort-an-array/)

**Description:** Given an array of integers `nums`, sort the array in ascending order.

**How to Apply Quick Sort:**
- Implement standard Quick Sort with random pivot
- Handle edge cases (empty array, single element)
- Return sorted array

---

### Problem 2: Kth Largest Element

**Problem:** [LeetCode 215 - Kth Largest Element in an Array](https://leetcode.com/problems/kth-largest-element-in-an-array/)

**Description:** Find the kth largest element in an unsorted array.

**How to Apply:**
- Use Quick Select (single-partition variant of Quick Sort)
- Only recurse on partition containing target
- O(n) average time instead of O(n log n)

---

### Problem 3: Wiggle Sort II

**Problem:** [LeetCode 324 - Wiggle Sort II](https://leetcode.com/problems/wiggle-sort-ii/)

**Description:** Given an unsorted array `nums`, reorder it such that `nums[0] < nums[1] > nums[2] < nums[3]...`

**How to Apply Quick Sort:**
- Find median using Quick Select
- Use 3-way partition around median
- Virtual indexing for wiggle arrangement

---

## Video Tutorial Links

### Fundamentals

- [Quick Sort Algorithm](https://www.youtube.com/watch?v=Hoixgm4-P4M) - Comprehensive explanation
- [Hoare vs Lomuto Partition](https://www.youtube.com/watch?v=MZaf_9IZCrc) - Partition comparison
- [3-Way Quick Sort](https://www.youtube.com/watch?v=Qb74DAW2BrI) - Handling duplicates

### Implementation

- [Quick Sort in Python](https://www.youtube.com/watch?v=9KBwdDEwal8) - Code walkthrough
- [Quick Sort vs Merge Sort](https://www.youtube.com/watch?v=es2T6KY45cA) - Algorithm comparison
- [Introsort and Hybrid Sorts](https://www.youtube.com/watch?v=1Vl2mTIM9o4) - Advanced techniques

---

## Follow-up Questions

### Q1: Why is Quick Sort faster than Merge Sort in practice despite both being O(n log n)?

**Answer:** Quick Sort has better cache locality (sequential access patterns) and lower constant factors. It also sorts in-place requiring only O(log n) stack space versus O(n) auxiliary space for Merge Sort.

### Q2: Can Quick Sort be made stable?

**Answer:** Standard Quick Sort is not stable due to the swapping mechanism. To make it stable would require O(n) extra space and modifications that eliminate most of its advantages. Use Merge Sort if stability is required.

### Q3: What is the probability of O(n²) with random pivot?

**Answer:** The probability is extremely low - about 1/n! for consistently bad choices. In practice, randomized Quick Sort essentially never hits worst case, making it preferred for most applications.

### Q4: When should I use 3-way Quick Sort over standard Quick Sort?

**Answer:** Use 3-way Quick Sort when the array contains many duplicate elements. Standard Quick Sort degrades to O(n²) with all equal elements, while 3-way handles this in O(n).

### Q5: Why do programming languages use different default sorts?

**Answer:**
- **Python**: Timsort (hybrid merge + insertion) - excellent for real-world data patterns
- **Java**: Dual-pivot Quick Sort for primitives, Timsort for objects
- **C++**: Introsort (Quick Sort + Heap Sort + Insertion Sort) - guaranteed O(n log n) worst case

---

## Summary

Quick Sort is one of the most important sorting algorithms, offering excellent average-case performance and cache efficiency. Understanding its partitioning schemes, pivot selection strategies, and optimizations is essential for effective algorithmic problem solving.

**Key Takeaways:**

1. **Partition is Key**: The efficiency of Quick Sort depends on balanced partitions
2. **Random Pivot**: Essential for avoiding worst-case O(n²) behavior
3. **Not Stable**: Equal elements may change relative order
4. **Cache Friendly**: Sequential memory access patterns
5. **Versatile**: Forms basis for Quick Select and other algorithms

**When to Use:**
- General purpose sorting of random data
- Memory-constrained environments
- When cache performance matters
- As basis for selection algorithms (Quick Select)

Quick Sort remains a cornerstone algorithm in computer science education and practical software engineering, frequently appearing in technical interviews and competitive programming contests.
