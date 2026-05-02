# Quick Select

## Category
Sorting & Selection

## Description

Quick Select is an efficient selection algorithm for finding the kth smallest (or largest) element in an unordered list. Related to Quick Sort, it only recurses into one half of the partition, achieving O(n) average time complexity while using O(1) extra space.

The algorithm was developed by Tony Hoare, who also invented Quick Sort. Its elegant design demonstrates the power of divide-and-conquer: by only processing the partition containing our target element, we achieve linear expected time without the O(n log n) cost of full sorting.

---

## Concepts

The Quick Select algorithm relies on several fundamental concepts that ensure both efficiency and correctness.

### 1. Partitioning

The process of rearranging elements around a pivot:

| Partition Scheme | Description | Characteristics |
|-----------------|-------------|-----------------|
| **Lomuto** | Elements < pivot on left, ≥ on right | Simpler, more swaps |
| **Hoare** | Two-pointer approach from both ends | Fewer swaps, faster |
| **3-way** | Separate <, =, > regions | Good for duplicates |

### 2. Randomized Pivot Selection

| Strategy | Worst Case | Average Case | Best For |
|----------|-----------|--------------|----------|
| **First/Last** | O(n²) on sorted input | O(n log n) | Random data |
| **Random** | O(n²) unlikely | O(n) | General use |
| **Median-of-Medians** | O(n) guaranteed | O(n) | Deterministic needs |

### 3. Selection vs Sorting

| Operation | Time | Space | Use When |
|-----------|------|-------|----------|
| **Quick Select** | O(n) avg | O(1) | Single kth element |
| **Quick Sort** | O(n log n) avg | O(log n) | All elements needed |
| **Heap Select** | O(n log k) | O(k) | Streaming data |
| **Median of Medians** | O(n) | O(log n) | Worst-case guarantee |

### 4. Order Statistics

| Problem | k Value | Result |
|---------|---------|--------|
| **Minimum** | 0 | Smallest element |
| **Maximum** | n-1 | Largest element |
| **Median** | n//2 | Middle element |
| **kth smallest** | k-1 | kth order statistic |
| **kth largest** | n-k | (n-k)th smallest |

---

## Frameworks

Structured approaches for solving selection problems.

### Framework 1: Standard Quick Select

```
┌─────────────────────────────────────────────────────────────┐
│  STANDARD QUICK SELECT                                       │
├─────────────────────────────────────────────────────────────┤
│  Input: array nums, target index k (0-indexed)              │
│  Output: kth smallest element                                │
│                                                              │
│  1. If array has 1 element: return it                       │
│  2. Choose random pivot index                               │
│  3. Partition array around pivot                            │
│     - Elements < pivot go to left                           │
│     - Elements ≥ pivot go to right                          │
│  4. Let pivot_position = final position of pivot              │
│  5. If k == pivot_position: return nums[k]                    │
│  6. If k < pivot_position:                                  │
│     - Recurse on left subarray [0..pivot_position-1]       │
│  7. If k > pivot_position:                                  │
│     - Recurse on right subarray [pivot_position+1..n-1]     │
│                                                              │
│  Key: Only recurse on side containing k                     │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Finding single kth element in unsorted array.

### Framework 2: Find Kth Largest

```
┌─────────────────────────────────────────────────────────────┐
│  KTH LARGEST ELEMENT                                         │
├─────────────────────────────────────────────────────────────┤
│  Input: array nums, integer k                               │
│  Output: kth largest element                                 │
│                                                              │
│  1. Target index = len(nums) - k                            │
│  2. Apply Quick Select with target index                    │
│  3. Return result                                            │
│                                                              │
│  Example: nums=[3,2,1,5,6,4], k=2                          │
│  - Want 2nd largest = 5                                     │
│  - Target index = 6 - 2 = 4                                 │
│  - 5 is at index 4 in sorted array [1,2,3,4,5,6]           │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: LeetCode-style "kth largest" problems.

### Framework 3: Median Finding

```
┌─────────────────────────────────────────────────────────────┐
│  FIND MEDIAN                                                 │
├─────────────────────────────────────────────────────────────┤
│  Input: array nums                                          │
│  Output: median value                                        │
│                                                              │
│  If n is odd:                                               │
│   1. Return QuickSelect(nums, n // 2)                        │
│                                                              │
│  If n is even:                                              │
│   1. left = QuickSelect(nums, n//2 - 1)                    │
│   2. right = QuickSelect(nums, n//2)                       │
│   3. Return (left + right) / 2                              │
│                                                              │
│  Note: Modifies input array in-place                        │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Finding median in O(n) time.

### Framework 4: Iterative Quick Select

```
┌─────────────────────────────────────────────────────────────┐
│  ITERATIVE QUICK SELECT                                      │
├─────────────────────────────────────────────────────────────┤
│  1. Set left = 0, right = len(nums) - 1                     │
│  2. While left < right:                                     │
│     a. Choose random pivot in [left, right]                │
│     b. Partition and get pivot_position                     │
│     c. If pivot_position == k: return nums[k]               │
│     d. If pivot_position < k: left = pivot_position + 1    │
│     e. If pivot_position > k: right = pivot_position - 1     │
│  3. Return nums[left]                                         │
│                                                              │
│  Benefit: O(1) space (no recursion stack)                   │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Memory-constrained environments.

---

## Forms

Different manifestations and variations of Quick Select.

### Form 1: Basic Quick Select

Standard recursive implementation.

| Aspect | Details |
|--------|---------|
| **Time** | O(n) average, O(n²) worst |
| **Space** | O(log n) recursion stack |
| **Pivot** | Random selection |
| **Best for** | General purpose selection |

### Form 2: Iterative Quick Select

Eliminates recursion overhead.

| Aspect | Details |
|--------|---------|
| **Time** | O(n) average |
| **Space** | O(1) auxiliary |
| **Approach** | While loop with pointer manipulation |
| **Best for** | Memory-constrained scenarios |

### Form 3: 3-Way Partition Quick Select

Handles arrays with many duplicates efficiently.

| Aspect | Details |
|--------|---------|
| **Time** | O(n) even with many duplicates |
| **Space** | O(log n) recursion |
| **Partitions** | < pivot, = pivot, > pivot |
| **Best for** | Arrays with frequent duplicates |

### Form 4: Deterministic Quick Select

Uses median-of-medians for O(n) worst case.

| Aspect | Details |
|--------|---------|
| **Time** | O(n) guaranteed |
| **Space** | O(log n) or O(n) depending on implementation |
| **Pivot** | Median-of-medians |
| **Best for** | When worst-case guarantee needed |

### Form 5: Quick Select with Duplicates Handling

Special handling for finding kth unique element.

| Aspect | Details |
|--------|---------|
| **Preprocessing** | May need frequency counting |
| **Time** | O(n) average |
| **Best for** | Problems with duplicate handling requirements |

---

## Tactics

Specific techniques and optimizations.

### Tactic 1: Lomuto Partition

Standard partition with rightmost pivot:

```python
import random

def lomuto_partition(nums, left, right, pivot_idx):
    """
    Lomuto partition scheme.
    Returns final position of pivot.
    """
    pivot = nums[pivot_idx]
    # Move pivot to end
    nums[pivot_idx], nums[right] = nums[right], nums[pivot_idx]
    
    store_idx = left
    for i in range(left, right):
        if nums[i] < pivot:
            nums[store_idx], nums[i] = nums[i], nums[store_idx]
            store_idx += 1
    
    # Move pivot to final position
    nums[right], nums[store_idx] = nums[store_idx], nums[right]
    return store_idx
```

**Characteristics**: Simpler to implement, but more swaps than Hoare.

### Tactic 2: Hoare Partition

More efficient two-pointer scheme:

```python
def hoare_partition(nums, left, right):
    """
    Hoare partition scheme.
    Returns split position (not necessarily pivot final position).
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

**Advantage**: Fewer swaps, typically faster in practice.

### Tactic 3: Quick Select with Random Pivot

Essential for avoiding worst case:

```python
def quick_select(nums, k):
    """
    Find kth smallest element (0-indexed).
    Time: O(n) average, O(n²) worst
    """
    def select(left, right, k):
        if left == right:
            return nums[left]
        
        # Random pivot to avoid worst case
        pivot_idx = random.randint(left, right)
        pivot_idx = lomuto_partition(nums, left, right, pivot_idx)
        
        if k == pivot_idx:
            return nums[k]
        elif k < pivot_idx:
            return select(left, pivot_idx - 1, k)
        else:
            return select(pivot_idx + 1, right, k)
    
    return select(0, len(nums) - 1, k)
```

**Critical**: Random pivot prevents O(n²) on sorted input.

### Tactic 4: Find Median

Special case for median finding:

```python
def find_median(nums):
    """
    Find median using Quick Select.
    """
    n = len(nums)
    if n % 2 == 1:
        return quick_select(nums, n // 2)
    else:
        # Note: This calls quick_select twice
        # For efficiency, use modified version that finds both
        left = quick_select(nums.copy(), n // 2 - 1)
        right = quick_select(nums, n // 2)
        return (left + right) / 2
```

**Optimization**: Modified Quick Select can find both elements in one pass.

### Tactic 5: Kth Largest (LeetCode Style)

Common interview problem format:

```python
def find_kth_largest(nums, k):
    """
    Find kth largest element.
    k=1 means largest, k=2 means second largest, etc.
    """
    # kth largest = (n-k)th smallest
    return quick_select(nums, len(nums) - k)
```

**Mapping**: kth largest at index n-k in 0-indexed sorted array.

---

## Python Templates

### Template 1: Basic Quick Select

```python
import random
from typing import List


def quick_select(nums: List[int], k: int) -> int:
    """
    Find kth smallest element (0-indexed) using Quick Select.
    
    Args:
        nums: Input array (will be modified)
        k: Target index (0-indexed)
    
    Returns:
        The kth smallest element
    
    Time: O(n) average, O(n²) worst case
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
        
        # Move pivot to final position
        nums[right], nums[store_idx] = nums[store_idx], nums[right]
        return store_idx
    
    def select(left: int, right: int, k: int) -> int:
        if left == right:
            return nums[left]
        
        # Random pivot to avoid worst case
        pivot_idx = random.randint(left, right)
        pivot_idx = partition(left, right, pivot_idx)
        
        if k == pivot_idx:
            return nums[k]
        elif k < pivot_idx:
            return select(left, pivot_idx - 1, k)
        else:
            return select(pivot_idx + 1, right, k)
    
    return select(0, len(nums) - 1, k)
```

### Template 2: Iterative Quick Select

```python
def quick_select_iterative(nums: List[int], k: int) -> int:
    """
    Iterative version of Quick Select.
    
    Time: O(n) average
    Space: O(1) auxiliary
    """
    def partition(left: int, right: int, pivot_idx: int) -> int:
        pivot = nums[pivot_idx]
        nums[pivot_idx], nums[right] = nums[right], nums[pivot_idx]
        
        store_idx = left
        for i in range(left, right):
            if nums[i] < pivot:
                nums[store_idx], nums[i] = nums[i], nums[store_idx]
                store_idx += 1
        
        nums[right], nums[store_idx] = nums[store_idx], nums[right]
        return store_idx
    
    left, right = 0, len(nums) - 1
    
    while left < right:
        pivot_idx = random.randint(left, right)
        pivot_idx = partition(left, right, pivot_idx)
        
        if pivot_idx == k:
            return nums[k]
        elif pivot_idx < k:
            left = pivot_idx + 1
        else:
            right = pivot_idx - 1
    
    return nums[left]
```

### Template 3: Kth Largest Element

```python
def find_kth_largest(nums: List[int], k: int) -> int:
    """
    Find kth largest element in array.
    
    Args:
        nums: Input array
        k: kth largest (1-indexed, k=1 means largest)
    
    Time: O(n) average
    """
    # kth largest = (n-k)th smallest
    return quick_select(nums, len(nums) - k)
```

### Template 4: Find Median

```python
def find_median(nums: List[int]) -> float:
    """
    Find median using Quick Select.
    
    Time: O(n) average
    """
    n = len(nums)
    
    if n % 2 == 1:
        # Odd length: return middle element
        return float(quick_select(nums, n // 2))
    else:
        # Even length: average of two middle elements
        # Note: Need to copy for second select since array is modified
        left = quick_select(nums.copy(), n // 2 - 1)
        right = quick_select(nums, n // 2)
        return (left + right) / 2.0
```

### Template 5: Quick Select with 3-Way Partition

```python
def quick_select_3way(nums: List[int], k: int) -> int:
    """
    Quick Select with 3-way partitioning for arrays with duplicates.
    
    More efficient when there are many duplicate elements.
    """
    def partition_3way(left: int, right: int, pivot_idx: int) -> tuple:
        pivot = nums[pivot_idx]
        nums[pivot_idx], nums[left] = nums[left], nums[pivot_idx]
        
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
        
        return lt, gt  # Range of elements equal to pivot
    
    def select(left: int, right: int, k: int) -> int:
        if left > right:
            return nums[k]
        
        pivot_idx = random.randint(left, right)
        lt, gt = partition_3way(left, right, pivot_idx)
        
        if k < lt:
            return select(left, lt - 1, k)
        elif k > gt:
            return select(gt + 1, right, k)
        else:
            return nums[k]
    
    return select(0, len(nums) - 1, k)
```

---

## When to Use

Use Quick Select when you need to solve problems involving:

- **Finding kth smallest/largest**: Order statistics problems
- **Median finding**: Middle element in O(n) time
- **Top K elements**: When combined with heap for streaming
- **Partial sorting**: When full sort is unnecessary
- **Selection with constraints**: Problems requiring specific rank elements

### Comparison with Alternatives

| Algorithm | Time | Space | Best For | Drawbacks |
|-----------|------|-------|----------|-----------|
| **Quick Select** | O(n) avg | O(1) | Single element | O(n²) worst case |
| **Sorting** | O(n log n) | O(1) or O(n) | Multiple queries | Wasteful for single element |
| **Min-Heap** | O(n log k) | O(k) | K smallest, streaming | Slower for single kth |
| **Max-Heap** | O(n log k) | O(k) | K largest, streaming | Slower for single kth |
| **Median of Medians** | O(n) | O(log n) | Deterministic O(n) | Higher constant factor |

### When to Choose Quick Select vs Alternatives

- **Choose Quick Select** when:
  - You only need one or few order statistics
  - Average-case O(n) is acceptable
  - In-place selection is preferred
  - Input is randomly distributed

- **Choose Sorting** when:
  - You need multiple order statistics
  - Input is nearly sorted (TimSort optimization)
  - Stability is required

- **Choose Median of Medians** when:
  - Worst-case O(n) is required
  - Input may be adversarial
  - Deterministic behavior is critical

---

## Algorithm Explanation

### Core Concept

Quick Select exploits the partition step of Quick Sort. After partitioning around a pivot, we know:
- All elements to the left are smaller
- All elements to the right are larger
- The pivot is in its final sorted position

If the pivot position equals our target index k, we're done. Otherwise, we only need to recurse into the half containing index k.

### How It Works

#### Step 1: Partition
```
Choose pivot and rearrange array:
[elements < pivot] [pivot] [elements ≥ pivot]
         ↑        ↑              ↑
       left   pivot_pos      right
```

#### Step 2: Compare Position
```
If pivot_pos == k: return nums[k]
If pivot_pos > k: search left half
If pivot_pos < k: search right half
```

#### Step 3: Recurse
Only process the partition containing k, discarding the other half.

### Visual Walkthrough

**Example**: Find 3rd smallest (k=2) in [3, 2, 1, 5, 6, 4]

```
Initial: [3, 2, 1, 5, 6, 4], k=2

Step 1: Choose pivot 4 (random), partition
[3, 2, 1] [4] [5, 6]
pivot_pos = 3

Since k=2 < pivot_pos=3, recurse on left:
[3, 2, 1], k=2

Step 2: Choose pivot 2, partition
[1] [2] [3]
pivot_pos = 1

Since k=2 > pivot_pos=1, recurse on right:
[3], target becomes k - pivot_pos - 1 = 0

Step 3: Single element, return 3

Result: 3 is the 3rd smallest ✓
```

### Expected Linear Time Proof

The average case is O(n) because:
- Each partition takes O(m) for subarray of size m
- Expected partition splits roughly in half
- Total work: n + n/2 + n/4 + ... ≈ 2n = O(n)

### Worst Case Scenario

Worst case O(n²) occurs when:
- Pivot is always the minimum or maximum
- This happens with sorted input and naive pivot selection
- Mitigated by random pivot selection

---

## Practice Problems

### Problem 1: Kth Largest Element in an Array

**Problem:** [LeetCode 215 - Kth Largest Element in an Array](https://leetcode.com/problems/kth-largest-element-in-an-array/)

**Description:** Given an integer array `nums` and an integer `k`, return the kth largest element in the array.

**How to Apply Quick Select:**
- Use kth largest = (n-k)th smallest mapping
- Apply Quick Select with target index n-k
- Return result

---

### Problem 2: Median of Two Sorted Arrays

**Problem:** [LeetCode 4 - Median of Two Sorted Arrays](https://leetcode.com/problems/median-of-two-sorted-arrays/)

**Description:** Given two sorted arrays `nums1` and `nums2` of size m and n, return the median of the two sorted arrays.

**How to Apply:**
- Can use modified Quick Select on merged virtual array
- Binary search approach is more common
- Consider partition-based approach

---

### Problem 3: Wiggle Sort II

**Problem:** [LeetCode 324 - Wiggle Sort II](https://leetcode.com/problems/wiggle-sort-ii/)

**Description:** Given an integer array `nums`, reorder it such that `nums[0] < nums[1] > nums[2] < nums[3]...`.

**How to Apply Quick Select:**
- Find median using Quick Select
- Use virtual indexing to rearrange
- Partition around median

---

### Problem 4: Top K Frequent Elements

**Problem:** [LeetCode 347 - Top K Frequent Elements](https://leetcode.com/problems/top-k-frequent-elements/)

**Description:** Given an integer array `nums` and an integer `k`, return the k most frequent elements.

**How to Apply Quick Select:**
- Count frequencies with hash map
- Apply Quick Select on frequency array
- Return top k elements

---

## Video Tutorial Links

### Fundamentals

- [Quick Select Algorithm](https://www.youtube.com/watch?v=BP7TqB1PlU0) - Complete explanation
- [Hoare vs Lomuto Partition](https://www.youtube.com/watch?v=LY9yTjMucww) - Partition schemes
- [Median of Medians](https://www.youtube.com/watch?v=79qQ5hoRJoU) - Worst-case linear selection

### Problem Solutions

- [LeetCode 215 Solution](https://www.youtube.com/watch?v=XEmy13g1Qxc) - Kth Largest Element
- [LeetCode 4 Solution](https://www.youtube.com/watch?v=LPFhl65R7ww) - Median of Two Sorted Arrays
- [Selection Algorithms](https://www.youtube.com/watch?v=hGK_5n81dj8) - Comprehensive overview

---

## Follow-up Questions

### Q1: Why is Quick Select O(n) average but Quick Sort is O(n log n)?

**Answer:** Quick Select only recurses on one partition (the one containing k), while Quick Sort recurses on both. The expected work is n + n/2 + n/4 + ... = 2n for Quick Select vs n log n for Quick Sort.

### Q2: Can Quick Select handle duplicate elements?

**Answer:** Yes, but standard Lomuto partition may place duplicates on either side. 3-way partitioning (Dutch National Flag) handles duplicates more efficiently by grouping equal elements together.

### Q3: When should I use Median of Medians instead of Quick Select?

**Answer:** Use Median of Medians when you need a guaranteed O(n) worst-case time complexity, such as in real-time systems or when handling potentially adversarial input. The trade-off is higher constant factors and more complex code.

### Q4: How do I find both kth smallest and kth largest efficiently?

**Answer:** Use the relationship: kth largest = (n-k)th smallest. If you need both simultaneously, you can run Quick Select twice, or use a modified version that tracks both during partitioning.

### Q5: Can Quick Select be used on streaming data?

**Answer:** No, Quick Select requires random access to all elements. For streaming data where elements arrive one by one, use a heap-based approach (min-heap for k largest, max-heap for k smallest).

---

## Summary

Quick Select is a fundamental algorithm for selection problems, offering O(n) average time complexity with minimal space overhead. Its elegant design demonstrates the power of divide-and-conquer by eliminating unnecessary work when only a single order statistic is needed.

**Key Takeaways:**

1. **O(n) Average Time**: Much faster than sorting for single selection
2. **Random Pivot**: Essential to avoid worst-case O(n²)
3. **Single Recursion**: Only processes partition containing target
4. **In-Place**: O(1) auxiliary space with iterative version
5. **Versatile**: Finds minimum, maximum, median, or any kth element

**When to Use:**
- Finding kth smallest/largest element
- Median finding in O(n) time
- When full sort is unnecessary
- Large datasets where sorting would be wasteful

Quick Select is an essential algorithm for technical interviews and competitive programming, often providing the most efficient solution to order statistic problems.
