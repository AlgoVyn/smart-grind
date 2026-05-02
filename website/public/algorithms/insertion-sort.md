# Insertion Sort

## Category
Sorting Algorithms

## Description

Insertion Sort is a simple, intuitive comparison-based sorting algorithm that builds the final sorted array one element at a time. It takes each element from the input data and inserts it into its correct position in the already-sorted part of the array. This approach is similar to how one might sort playing cards in their hands.

While its O(n²) worst-case time complexity makes it inefficient for large datasets, Insertion Sort excels for small arrays (typically n < 50) and nearly sorted data where it achieves O(n) performance. Its simplicity, stability, and low overhead make it the algorithm of choice for the base case in hybrid sorting algorithms like Timsort and Introsort.

---

## Concepts

Insertion Sort relies on several fundamental concepts that contribute to its efficiency in specific scenarios.

### 1. Incremental Sorting

Building the sorted array one element at a time:

| Step | Sorted Portion | Unsorted Portion | Action |
|------|----------------|------------------|--------|
| 1 | [5] | [2, 4, 6, 1, 3] | Insert 2 before 5 |
| 2 | [2, 5] | [4, 6, 1, 3] | Insert 4 between 2 and 5 |
| 3 | [2, 4, 5] | [6, 1, 3] | Insert 6 at end |
| 4 | [2, 4, 5, 6] | [1, 3] | Insert 1 at beginning |

### 2. Inversion Counting

An inversion is a pair where a larger element precedes a smaller one:

| Property | Description |
|----------|-------------|
| **Sorted array** | 0 inversions |
| **Reverse sorted** | n(n-1)/2 inversions |
| **Insertion sort operations** | Proportional to number of inversions |
| **Best case** | O(n) when nearly sorted (few inversions) |

### 3. Stable Sorting

Maintaining relative order of equal elements:

```
Original: [3a, 1, 3b, 2]
Sorted:   [1, 2, 3a, 3b]

Note: 3a and 3b maintain original relative order
```

### 4. Adaptive Sorting

Performance adapts to input order:

| Case | Time Complexity | Condition |
|------|-----------------|-----------|
| **Best** | O(n) | Already sorted |
| **Average** | O(n²) | Random order |
| **Worst** | O(n²) | Reverse sorted |

---

## Frameworks

Structured approaches for implementing Insertion Sort.

### Framework 1: Standard Insertion Sort

```
┌─────────────────────────────────────────────────────────────┐
│  STANDARD INSERTION SORT FRAMEWORK                           │
├─────────────────────────────────────────────────────────────┤
│  Input: Array of n elements                                 │
│  Output: Sorted array                                        │
│                                                             │
│  1. For i from 1 to n-1:                                    │
│     a. key = arr[i]  # Element to insert                   │
│     b. j = i - 1      # Last index of sorted portion        │
│                                                             │
│  2. While j >= 0 and arr[j] > key:                          │
│     a. arr[j + 1] = arr[j]  # Shift element right         │
│     b. j = j - 1            # Move left                     │
│                                                             │
│  3. Insert key at correct position:                          │
│     arr[j + 1] = key                                         │
│                                                             │
│  Time: O(n²) worst/average, O(n) best                      │
│  Space: O(1) auxiliary                                       │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Standard implementation, small arrays.

### Framework 2: Binary Insertion Sort

```
┌─────────────────────────────────────────────────────────────┐
│  BINARY INSERTION SORT FRAMEWORK                            │
├─────────────────────────────────────────────────────────────┤
│  Reduces comparisons from O(n) to O(log n) per insertion:   │
│                                                             │
│  1. For i from 1 to n-1:                                    │
│     a. key = arr[i]                                         │
│     b. Use binary search to find insertion point           │
│        in arr[0...i-1]                                     │
│                                                             │
│  2. Shift all elements from insertion point to i-1 right   │
│                                                             │
│  3. Insert key at insertion point                          │
│                                                             │
│  Time: O(n²) total (shifting still O(n)),                  │
│        but only O(n log n) comparisons                     │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: When comparison cost dominates (e.g., complex objects).

### Framework 3: Shell Sort Extension

```
┌─────────────────────────────────────────────────────────────┐
│  SHELL SORT FRAMEWORK (Generalization of Insertion Sort)      │
├─────────────────────────────────────────────────────────────┤
│  Sort elements far apart first, then reduce gap:            │
│                                                             │
│  1. Start with large gap (typically n//2)                   │
│                                                             │
│  2. Perform insertion sort on elements at gap intervals     │
│                                                             │
│  3. Reduce gap and repeat until gap = 1                     │
│                                                             │
│  4. Final insertion sort with gap=1 ensures sorted        │
│                                                             │
│  Time: O(n log n) to O(n^2) depending on gap sequence      │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Medium-sized arrays, simple implementation needed.

---

## Forms

Different manifestations and optimizations of Insertion Sort.

### Form 1: Standard Implementation

Basic insertion sort with linear search.

```python
def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr
```

### Form 2: Binary Search Version

Find insertion point with binary search.

```python
import bisect

def binary_insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        # Find insertion point
        pos = bisect.bisect_left(arr, key, 0, i)
        # Shift and insert
        arr[pos+1:i+1] = arr[pos:i]
        arr[pos] = key
    return arr
```

### Form 3: Linked List Insertion

Optimal for linked lists (O(1) insertion).

```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def insertion_sort_list(head):
    """Sort linked list using insertion sort."""
    dummy = ListNode(float('-inf'))
    current = head
    
    while current:
        # Find insertion point
        prev = dummy
        while prev.next and prev.next.val < current.val:
            prev = prev.next
        
        # Insert
        next_temp = current.next
        current.next = prev.next
        prev.next = current
        current = next_temp
    
    return dummy.next
```

### Form 4: Hybrid Sort Base Case

Used as base case in efficient sorts.

```python
def introsort(arr, max_depth=None):
    """Introspective sort using insertion sort for small arrays."""
    if len(arr) <= 16:  # Threshold
        return insertion_sort(arr)
    # Otherwise use quicksort/heap sort
```

### Form 5: Online Sorting

Sorting as data arrives.

```python
class OnlineSorter:
    """Maintain sorted array as elements arrive."""
    def __init__(self):
        self.sorted_arr = []
    
    def insert(self, x):
        """Insert element maintaining sorted order."""
        bisect.insort(self.sorted_arr, x)
    
    def get_sorted(self):
        return self.sorted_arr
```

---

## Tactics

Specific techniques and optimizations for Insertion Sort.

### Tactic 1: Early Termination Check

Check if already sorted:

```python
def insertion_sort_optimized(arr):
    """Insertion sort with early termination check."""
    n = len(arr)
    
    # Check if already sorted
    already_sorted = True
    for i in range(n - 1):
        if arr[i] > arr[i + 1]:
            already_sorted = False
            break
    
    if already_sorted:
        return arr
    
    # Standard insertion sort
    for i in range(1, n):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    
    return arr
```

### Tactic 2: Sentinel Value

Eliminate bounds checking:

```python
def insertion_sort_sentinel(arr):
    """Use sentinel to eliminate j >= 0 check."""
    # Requires modifying array to add sentinel at beginning
    # Or assuming we can use arr[0] as sentinel
    
    # Find minimum and swap with first element
    min_idx = arr.index(min(arr))
    arr[0], arr[min_idx] = arr[min_idx], arr[0]
    
    # Now arr[0] is minimum, can serve as sentinel
    for i in range(2, len(arr)):
        key = arr[i]
        j = i - 1
        while arr[j] > key:  # No need for j >= 0
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    
    return arr
```

### Tactic 3: Binary Search for Insertion Point

Reduce comparisons:

```python
import bisect

def insertion_sort_binary(arr):
    """Use binary search to find insertion point."""
    for i in range(1, len(arr)):
        key = arr[i]
        # Binary search for insertion point
        left, right = 0, i
        while left < right:
            mid = (left + right) // 2
            if arr[mid] < key:
                left = mid + 1
            else:
                right = mid
        
        # Shift and insert
        for j in range(i, left, -1):
            arr[j] = arr[j - 1]
        arr[left] = key
    
    return arr
```

### Tactic 4: Two-Way Insertion

Reduce shifts by inserting from both ends:

```python
def two_way_insertion_sort(arr):
    """Insert elements from both ends of sorted portion."""
    if len(arr) <= 1:
        return arr
    
    # Use output array
    n = len(arr)
    result = [0] * n
    left, right = n // 2, n // 2
    result[left] = arr[0]
    
    for i in range(1, n):
        if arr[i] < result[left]:
            left -= 1
            result[left] = arr[i]
        else:
            right += 1
            # Find position in right portion
            j = right - 1
            while j > left and result[j - 1] > arr[i]:
                result[j] = result[j - 1]
                j -= 1
            result[j] = arr[i]
    
    # Reconstruct array
    return result[left:right+1]
```

### Tactic 5: Counting Inversions

Use modified insertion sort:

```python
def count_inversions_insertion(arr):
    """Count inversions using insertion sort concept."""
    # Similar to insertion sort but counts shifts
    inversions = 0
    sorted_list = []
    
    for x in arr:
        # Find position using bisect
        pos = bisect.bisect_left(sorted_list, x)
        inversions += len(sorted_list) - pos
        sorted_list.insert(pos, x)
    
    return inversions
```

---

## Python Templates

### Template 1: Standard Insertion Sort

```python
def insertion_sort(arr):
    """
    Standard insertion sort.
    
    Time: O(n^2) worst/average, O(n) best
    Space: O(1) auxiliary
    Stable: Yes
    
    In-place sorting with minimal overhead.
    """
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        
        # Move elements greater than key one position ahead
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        
        arr[j + 1] = key
    
    return arr
```

### Template 2: Binary Insertion Sort

```python
import bisect

def binary_insertion_sort(arr):
    """
    Insertion sort with binary search for insertion point.
    
    Reduces comparisons from O(n) to O(log n) per element,
    but still O(n^2) total due to shifting.
    
    Best when comparison is expensive (e.g., strings, objects).
    """
    for i in range(1, len(arr)):
        key = arr[i]
        # Binary search for position in sorted portion
        pos = bisect.bisect_left(arr, key, 0, i)
        
        # Shift elements and insert
        arr[pos+1:i+1] = arr[pos:i]
        arr[pos] = key
    
    return arr
```

### Template 3: Insertion Sort for Linked List

```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def insertion_sort_list(head):
    """
    Insertion sort for linked list.
    
    Time: O(n^2)
    Space: O(1)
    
    Efficient for linked lists due to O(1) insertion.
    """
    if not head or not head.next:
        return head
    
    dummy = ListNode(float('-inf'))
    current = head
    
    while current:
        # Find insertion point
        prev = dummy
        while prev.next and prev.next.val < current.val:
            prev = prev.next
        
        # Insert
        next_temp = current.next
        current.next = prev.next
        prev.next = current
        current = next_temp
    
    return dummy.next
```

### Template 4: Shell Sort (Generalization)

```python
def shell_sort(arr):
    """
    Shell sort - generalization of insertion sort.
    
    Time: O(n log n) to O(n^2) depending on gap sequence
    Space: O(1)
    
    More efficient than insertion sort for larger arrays.
    """
    n = len(arr)
    gap = n // 2
    
    while gap > 0:
        # Do gapped insertion sort
        for i in range(gap, n):
            temp = arr[i]
            j = i
            while j >= gap and arr[j - gap] > temp:
                arr[j] = arr[j - gap]
                j -= gap
            arr[j] = temp
        
        gap //= 2
    
    return arr
```

### Template 5: Hybrid Sort Base Case

```python
def insertion_sort_threshold(arr, left, right):
    """
    Insertion sort for subarray [left, right].
    Used as base case in quicksort/mergesort.
    """
    for i in range(left + 1, right + 1):
        key = arr[i]
        j = i - 1
        while j >= left and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    
    return arr

QUICKSORT_THRESHOLD = 16

def quicksort_hybrid(arr, left=0, right=None):
    """Quicksort with insertion sort for small subarrays."""
    if right is None:
        right = len(arr) - 1
    
    if right - left + 1 <= QUICKSORT_THRESHOLD:
        return insertion_sort_threshold(arr, left, right)
    
    # Standard quicksort partition and recursion
    # ...
```

### Template 6: Online Insertion

```python
import bisect

class SortedArray:
    """Maintain sorted array with online insertion."""
    
    def __init__(self):
        self.arr = []
    
    def insert(self, x):
        """Insert element maintaining sorted order."""
        bisect.insort(self.arr, x)
    
    def get(self):
        """Get sorted array."""
        return self.arr
    
    def find(self, x):
        """Find position of x."""
        return bisect.bisect_left(self.arr, x)
```

---

## When to Use

Use Insertion Sort when:

- **Small arrays**: n < 50 typically
- **Nearly sorted data**: O(n) performance
- **Online sorting**: Data arrives incrementally
- **Stability required**: Maintains relative order
- **Memory constrained**: Only O(1) extra space
- **As base case**: In hybrid sorting algorithms

### Comparison with Alternatives

| Algorithm | Time (Best/Avg/Worst) | Space | Stable | Adaptive |
|-----------|----------------------|-------|--------|----------|
| **Insertion** | O(n) / O(n²) / O(n²) | O(1) | Yes | Yes |
| **Selection** | O(n²) / O(n²) / O(n²) | O(1) | No | No |
| **Bubble** | O(n) / O(n²) / O(n²) | O(1) | Yes | Yes |
| **Quick** | O(n log n) / O(n log n) / O(n²) | O(log n) | No | No |
| **Merge** | O(n log n) / O(n log n) / O(n log n) | O(n) | Yes | No |

### When to Choose Insertion Sort vs Other Algorithms

- **Choose Insertion Sort** when:
  - Array is small (n < 50)
  - Data is nearly sorted
  - Stability is required
  - Memory is extremely limited
  - Implementing base case for hybrid sort

- **Choose Quick/Merge Sort** when:
  - Array is large
  - Worst-case guarantee needed (use Merge)
  - Average performance is priority (use Quick)

- **Choose Heap Sort** when:
  - O(n log n) worst-case required
  - O(1) space required

---

## Algorithm Explanation

### Core Concept

Insertion Sort builds a sorted array by repeatedly taking the next element and inserting it into the correct position in the already-sorted portion. This mimics how people naturally sort items like playing cards.

**Key Terminology**:
- **Sorted portion**: Left part of array that is already sorted
- **Key**: Current element being inserted
- **Shift**: Moving elements right to make room for key
- **Adaptive**: Performance depends on input order

### How It Works

#### Step 1: Iterate Through Array

```python
for i in range(1, len(arr)):
    key = arr[i]  # Element to position
```

#### Step 2: Find Insertion Point

```python
j = i - 1
while j >= 0 and arr[j] > key:
    arr[j + 1] = arr[j]  # Shift right
    j -= 1
```

#### Step 3: Insert Element

```python
arr[j + 1] = key
```

### Visual Walkthrough

**Sorting [5, 2, 4, 6, 1, 3]**:
```
Initial: [5, 2, 4, 6, 1, 3]
         ↑
        i=1, key=2

Step 1: Compare 5 > 2, shift 5 right
        [5, 5, 4, 6, 1, 3]
        ↑
        j=0, insert 2
        [2, 5, 4, 6, 1, 3]

Step 2: i=2, key=4
        Compare 5 > 4, shift
        [2, 5, 5, 6, 1, 3]
        Insert 4
        [2, 4, 5, 6, 1, 3]

Step 3: i=3, key=6
        5 < 6, no shift needed
        [2, 4, 5, 6, 1, 3]

Step 4: i=4, key=1
        Shift 6, 5, 4, 2 all right
        [2, 2, 4, 5, 6, 3]
        [1, 2, 4, 5, 6, 3]

Step 5: i=5, key=3
        Shift 6, 5, 4
        [1, 2, 4, 4, 5, 6]
        Insert 3
        [1, 2, 3, 4, 5, 6]

Sorted!
```

### Why Insertion Sort Works

1. **Invariant**: After i iterations, first i+1 elements are sorted
2. **Correct insertion**: Key is placed in correct relative position
3. **Stability**: Equal elements never swap relative order
4. **Adaptivity**: Fewer operations when nearly sorted

### Limitations

- **Quadratic Time**: O(n²) makes it slow for large n
- **Many Shifts**: Can be expensive for large elements
- **Not Cache Efficient**: Linear access pattern
- **Comparison-based**: O(n log n) is lower bound

---

## Practice Problems

### Problem 1: Sort List

**Problem:** [LeetCode 148 - Sort List](https://leetcode.com/problems/sort-list/)

**Description:** Sort linked list in O(n log n) time.

**How to Apply Insertion Sort:**
- Can use insertion sort for small subproblems
- Or use merge sort with insertion sort base case

---

### Problem 2: Insertion Sort List

**Problem:** [LeetCode 147 - Insertion Sort List](https://leetcode.com/problems/insertion-sort-list/)

**Description:** Sort linked list using insertion sort.

**How to Apply:**
- Standard linked list insertion sort
- O(1) insertion makes it efficient for lists

---

### Problem 3: K Closest Points to Origin

**Problem:** [LeetCode 973 - K Closest Points to Origin](https://leetcode.com/problems/k-closest-points-to-origin/)

**Description:** Find k closest points to (0,0).

**How to Apply:**
- Can use insertion sort for small k
- Or use as part of introselect algorithm

---

## Video Tutorial Links

### Fundamentals

- [Insertion Sort - Abdul Bari](https://www.youtube.com/watch?v=JU767SDMDVAm) - Visual explanation
- [Sorting Algorithms Comparison](https://www.youtube.com/watch?v=JU767SDMDVAm) - When to use each
- [Insertion Sort Analysis](https://www.youtube.com/watch?v=JU767SDMDVAm) - Time complexity

### Advanced

- [Shell Sort](https://www.youtube.com/watch?v=JU767SDMDVAm) - Generalization
- [Hybrid Sorting](https://www.youtube.com/watch?v=JU767SDMDVAm) - Timsort, Introsort

---

## Follow-up Questions

### Q1: Why is insertion sort used as base case in quicksort?

**Answer:**
- **Overhead**: Quicksort has recursion overhead
- **Cache**: Insertion sort has better cache behavior for small n
- **Crossover**: Typically around n = 10-50
- **Empirical**: Faster in practice despite same asymptotic complexity

---

### Q2: How does binary insertion sort compare to standard?

**Answer:**
- **Comparisons**: O(n log n) vs O(n²)
- **Shifts**: Still O(n²) total
- **When better**: When comparison is expensive (strings, custom objects)
- **Trade-off**: More complex code for modest gain

---

### Q3: Is insertion sort stable?

**Answer:**
- **Yes**: Maintains relative order of equal elements
- **Why**: Only shifts elements strictly greater than key
- **Equal elements**: Never cross each other
- **Useful**: When secondary sort key matters

---

### Q4: What's the best case for insertion sort?

**Answer:**
- **Already sorted**: O(n) time
- **Why**: Only n-1 comparisons, no shifts
- **Nearly sorted**: Still O(n) for small number of inversions
- **Adaptive**: Performance improves with sortedness

---

### Q5: When should you NOT use insertion sort?

**Answer:**
- **Large arrays**: O(n²) too slow for n > 1000
- **Random data**: No benefit from adaptivity
- **Parallel sorting**: Hard to parallelize
- **External sorting**: Not designed for disk-based sorting

---

## Summary

Insertion Sort is a simple, stable, adaptive sorting algorithm. Key takeaways:

1. **O(n²) worst/average**: Too slow for large arrays
2. **O(n) best case**: Excellent for nearly sorted data
3. **O(1) space**: Minimal memory requirements
4. **Stable**: Preserves relative order of equal elements
5. **Adaptive**: Performance depends on input order

**When to Use**:
- Small arrays (n < 50)
- Nearly sorted data
- Online sorting
- Base case in hybrid algorithms
- When stability is required

**Implementation Tips**:
- Use binary search for expensive comparisons
- Consider Shell sort generalization for larger arrays
- Use sentinel to eliminate bounds checking
- Leverage adaptivity by checking if already sorted

This fundamental algorithm is essential for understanding sorting and serves as the basis for more advanced techniques.
