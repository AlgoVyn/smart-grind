# Dutch National Flag

## Category
Arrays & Strings

## Description

The **Dutch National Flag** algorithm (also known as **3-way partition**) is a classic sorting algorithm proposed by Edsger Dijkstra. It efficiently sorts an array containing only **three distinct values** (like 0, 1, 2 or red, white, blue) in a **single pass** with **O(n)** time complexity and **O(1)** space complexity.

This algorithm is most famously used to solve the "Sort Colors" problem (LeetCode 75), but its underlying principle of three-way partitioning is applicable to many other scenarios including quicksort optimization, element categorization, and in-place partitioning problems.

The key insight is using **three pointers** to partition the array into four distinct sections during a single traversal, ensuring each element is processed at most once.

---

## Concepts

The Dutch National Flag algorithm is built on several fundamental concepts that make it powerful for three-way partitioning.

### 1. Three-Pointer Strategy

The algorithm uses three pointers to create four distinct partitions:

| Pointer | Purpose | Region |
|---------|---------|--------|
| **`low`** | Boundary for 0s | `[0, low-1]` contains all 0s |
| **`mid`** | Current element being processed | `[low, mid-1]` contains all 1s |
| **`high`** | Boundary for 2s | `[high+1, n-1]` contains all 2s |

### 2. Four-Way Partition

During execution, the array is conceptually divided into:

```
[0, low-1] | [low, mid-1] | [mid, high] | [high+1, n-1]
    0s      |      1s      |  unknown    |      2s
  (done)    |    (done)    | (processing)|    (done)
```

### 3. Single-Pass Processing

Each element is processed exactly once:

```
while mid <= high:
    if nums[mid] == 0: swap to left section, advance both
    elif nums[mid] == 1: already in middle, just advance
    else: swap to right section, shrink right bound
```

### 4. Invariant Maintenance

The algorithm maintains these invariants throughout:

- All elements before `low` are 0
- All elements from `low` to `mid-1` are 1
- All elements after `high` are 2
- Elements from `mid` to `high` are unprocessed

---

## Frameworks

Structured approaches for solving Dutch National Flag problems.

### Framework 1: Classic 3-Way Partition

```
┌─────────────────────────────────────────────────────┐
│  DUTCH NATIONAL FLAG FRAMEWORK                      │
├─────────────────────────────────────────────────────┤
│  1. Initialize pointers:                             │
│     - low = 0 (boundary for 0s)                     │
│     - mid = 0 (current processing pointer)          │
│     - high = n - 1 (boundary for 2s)              │
│  2. While mid <= high:                               │
│     - If nums[mid] == 0:                            │
│         swap(nums[low], nums[mid])                  │
│         low++, mid++                                │
│     - If nums[mid] == 1:                            │
│         mid++                                       │
│     - If nums[mid] == 2:                            │
│         swap(nums[mid], nums[high])                 │
│         high-- (don't increment mid!)               │
│  3. Array is now sorted with 0s, 1s, 2s             │
└─────────────────────────────────────────────────────┘
```

**When to use**: Sorting arrays with exactly three distinct values (0, 1, 2).

### Framework 2: Generic K-Way Partition

```
┌─────────────────────────────────────────────────────┐
│  K-WAY PARTITION FRAMEWORK                          │
├─────────────────────────────────────────────────────┤
│  1. For k distinct values, use multiple pointers   │
│  2. Alternative: Count and rewrite approach         │
│     a. Count occurrences of each value             │
│     b. Rewrite array in sorted order               │
│  3. For k > 3, counting sort is often preferred    │
└─────────────────────────────────────────────────────┘
```

**When to use**: Generalizing to more than three values.

### Framework 3: Quicksort 3-Way Partition

```
┌─────────────────────────────────────────────────────┐
│  QUICKSORT 3-WAY PARTITION FRAMEWORK               │
├─────────────────────────────────────────────────────┤
│  1. Select pivot element                            │
│  2. Partition array into three sections:           │
│     - Elements less than pivot                     │
│     - Elements equal to pivot                      │
│     - Elements greater than pivot                  │
│  3. Recursively sort less-than and greater-than    │
│  4. Skip equal section (already sorted)            │
└─────────────────────────────────────────────────────┘
```

**When to use**: Optimizing quicksort for arrays with many duplicates.

---

## Forms

Different manifestations of the Dutch National Flag pattern.

### Form 1: Sort Colors (0, 1, 2)

The classic problem - sorting red, white, and blue colors represented as 0, 1, 2.

```python
# Standard implementation for 0, 1, 2
def sort_colors(nums):
    low = mid = 0
    high = len(nums) - 1
    
    while mid <= high:
        if nums[mid] == 0:
            nums[low], nums[mid] = nums[mid], nums[low]
            low += 1
            mid += 1
        elif nums[mid] == 1:
            mid += 1
        else:  # nums[mid] == 2
            nums[mid], nums[high] = nums[high], nums[mid]
            high -= 1
```

### Form 2: Partition by Pivot

General three-way partition around any pivot value.

| Section | Condition |
|---------|-----------|
| Left | `element < pivot` |
| Middle | `element == pivot` |
| Right | `element > pivot` |

### Form 3: Two-Way Partition (Binary)

Simplified version for two categories only.

```python
def partition_binary(nums, condition):
    """Partition array based on binary condition."""
    left = 0
    for right in range(len(nums)):
        if condition(nums[right]):
            nums[left], nums[right] = nums[right], nums[left]
            left += 1
    return nums
```

### Form 4: Move Zeroes (Special Case)

Move all zeros to end while maintaining relative order of non-zero elements.

```python
def move_zeroes(nums):
    """Special case: move all 0s to end."""
    left = 0
    for right in range(len(nums)):
        if nums[right] != 0:
            nums[left], nums[right] = nums[right], nums[left]
            left += 1
```

### Form 5: Sort by Parity

Separate even and odd numbers.

```python
def sort_by_parity(nums):
    """Separate even and odd numbers."""
    left = 0
    for right in range(len(nums)):
        if nums[right] % 2 == 0:  # Even
            nums[left], nums[right] = nums[right], nums[left]
            left += 1
```

---

## Tactics

Specific techniques and optimizations.

### Tactic 1: Why Not to Increment mid After Swapping with high

Critical pitfall explained:

```python
if nums[mid] == 2:
    nums[mid], nums[high] = nums[high], nums[mid]
    high -= 1
    # Don't increment mid!
    # The element swapped from high hasn't been processed yet
    # It could be 0, 1, or 2 - we need to check it
```

### Tactic 2: Counting Sort Alternative

For some cases, counting sort is simpler:

```python
def sort_colors_counting(nums):
    """Alternative using counting sort."""
    count = [0, 0, 0]
    for num in nums:
        count[num] += 1
    
    idx = 0
    for val in range(3):
        for _ in range(count[val]):
            nums[idx] = val
            idx += 1
```

**Trade-off**: Two passes vs one pass, O(k) extra space vs O(1).

### Tactic 3: Handling Unknown Values

When values are not exactly 0, 1, 2:

```python
def three_way_partition(nums, pivot1, pivot2):
    """
    Partition into three categories:
    - < pivot1
    - >= pivot1 and <= pivot2
    - > pivot2
    """
    low = mid = 0
    high = len(nums) - 1
    
    while mid <= high:
        if nums[mid] < pivot1:
            nums[low], nums[mid] = nums[mid], nums[low]
            low += 1
            mid += 1
        elif pivot1 <= nums[mid] <= pivot2:
            mid += 1
        else:  # nums[mid] > pivot2
            nums[mid], nums[high] = nums[high], nums[mid]
            high -= 1
```

### Tactic 4: In-Place vs. Return New Array

```python
# In-place (modifies original)
def sort_colors_inplace(nums):
    # ... modifies nums directly
    return None  # or return nums for chaining

# Non-destructive (returns new array)
def sort_colors_copy(nums):
    result = nums.copy()
    # ... sort result
    return result
```

### Tactic 5: One-Pass vs. Two-Pass Decision Tree

```
Decision: Which approach to use?
┌─────────────────────────────────────────┐
│ Need O(1) space?                       │
│ ├── Yes: Use Dutch National Flag       │
│ └── No: Consider counting sort           │
│                                         │
│ Need stability (preserve order)?       │
│ ├── Yes: Use counting sort               │
│ └── No: Dutch National Flag is fine     │
│                                         │
│ Exactly 3 distinct values?             │
│ ├── Yes: Dutch National Flag optimal     │
│ └── No: Counting sort more flexible      │
└─────────────────────────────────────────┘
```

### Tactic 6: Quickselect Integration

Use for finding kth element with duplicates:

```python
def three_way_partition_for_quickselect(nums, left, right, pivot_idx):
    """Partition for quickselect with duplicate handling."""
    pivot = nums[pivot_idx]
    
    # Move pivot to end
    nums[pivot_idx], nums[right] = nums[right], nums[pivot_idx]
    
    # Three-way partition
    store_idx = left
    mid_start = left
    
    for i in range(left, right):
        if nums[i] < pivot:
            nums[store_idx], nums[i] = nums[i], nums[store_idx]
            # Also swap if we had equal elements before
            if mid_start > store_idx:
                nums[mid_start], nums[i] = nums[i], nums[mid_start]
            store_idx += 1
            mid_start += 1
        elif nums[i] == pivot:
            nums[mid_start], nums[i] = nums[i], nums[mid_start]
            mid_start += 1
    
    # Move pivot to final place
    nums[mid_start], nums[right] = nums[right], nums[mid_start]
    
    return (store_idx, mid_start)  # Return range of equal elements
```

---

## Python Templates

### Template 1: Classic Dutch National Flag (0, 1, 2)

```python
def sort_colors(nums: list[int]) -> None:
    """
    Dutch National Flag - 3-way partition algorithm.
    
    Sorts an array containing only 0s, 1s, and 2s in-place in a single pass.
    
    Time Complexity: O(n)
    Space Complexity: O(1)
    
    Args:
        nums: List containing only 0, 1, and 2 (modified in-place)
    
    Returns:
        None (modifies nums in place)
    
    Example:
        >>> nums = [2, 0, 2, 1, 1, 0]
        >>> sort_colors(nums)
        >>> print(nums)
        [0, 0, 1, 1, 2, 2]
    """
    if not nums or len(nums) <= 1:
        return
    
    low = 0      # All elements before low are 0s
    mid = 0      # Current element being processed
    high = len(nums) - 1  # All elements after high are 2s
    
    # Process until mid crosses high
    while mid <= high:
        if nums[mid] == 0:
            # Move 0 to the left section
            nums[low], nums[mid] = nums[mid], nums[low]
            low += 1
            mid += 1
        elif nums[mid] == 1:
            # 1 is already in correct partition, move forward
            mid += 1
        else:  # nums[mid] == 2
            # Move 2 to the right section
            # Don't increment mid - need to process swapped element
            nums[mid], nums[high] = nums[high], nums[mid]
            high -= 1
```

### Template 2: Generic 3-Way Partition

```python
def three_way_partition(nums: list[int], pivot: int) -> tuple[int, int]:
    """
    Partition array around pivot into three sections:
    - Elements less than pivot
    - Elements equal to pivot
    - Elements greater than pivot
    
    Returns (start_of_equal, end_of_equal) indices.
    
    Used in 3-way quicksort (Dutch National Flag variant)
    """
    low = 0
    mid = 0
    high = len(nums) - 1
    
    while mid <= high:
        if nums[mid] < pivot:
            nums[low], nums[mid] = nums[mid], nums[low]
            low += 1
            mid += 1
        elif nums[mid] == pivot:
            mid += 1
        else:  # nums[mid] > pivot
            nums[mid], nums[high] = nums[high], nums[mid]
            high -= 1
    
    return (low, mid)  # Range of equal elements
```

### Template 3: Move Zeroes to End

```python
def move_zeroes(nums: list[int]) -> None:
    """
    Move all 0's to the end while maintaining relative order of non-zero elements.
    
    This is essentially a 2-way partition (Dutch National Flag with 2 values).
    
    Time: O(n), Space: O(1)
    """
    left = 0  # Position to place next non-zero element
    
    for right in range(len(nums)):
        if nums[right] != 0:
            # Swap non-zero element to the front section
            nums[left], nums[right] = nums[right], nums[left]
            left += 1
    
    # All elements from 'left' to end are already 0 or will be 0
```

### Template 4: Sort by Parity

```python
def sort_array_by_parity(nums: list[int]) -> list[int]:
    """
    Sort array so that all even integers come before all odd integers.
    
    Two-way partition based on parity.
    Time: O(n), Space: O(1)
    """
    left = 0  # Position for next even number
    
    for right in range(len(nums)):
        if nums[right] % 2 == 0:  # Even number
            nums[left], nums[right] = nums[right], nums[left]
            left += 1
    
    return nums
```

### Template 5: Sort Colors Alternative (Counting)

```python
def sort_colors_counting(nums: list[int]) -> None:
    """
    Alternative implementation using counting sort.
    
    Two-pass algorithm with O(k) extra space.
    Better when stability is required or for k > 3 distinct values.
    
    Time: O(n), Space: O(k) where k = number of distinct values
    """
    if not nums:
        return
    
    # Count occurrences of each value
    # Assuming values are 0, 1, 2
    count = [0, 0, 0]
    for num in nums:
        count[num] += 1
    
    # Rewrite array in sorted order
    idx = 0
    for val in range(3):
        for _ in range(count[val]):
            nums[idx] = val
            idx += 1
```

### Template 6: Wiggle Sort II

```python
def wiggle_sort(nums: list[int]) -> None:
    """
    Reorder array such that nums[0] < nums[1] > nums[2] < nums[3]...
    
    Uses three-way partition concept for median-based sorting.
    Time: O(n), Space: O(n)
    """
    # Find median using quickselect
    # Then three-way partition around median
    # Finally interleave smaller and larger halves
    
    n = len(nums)
    sorted_nums = sorted(nums)
    
    # Interleave: smaller half (reversed) + larger half (reversed)
    mid = (n + 1) // 2
    j, k = mid - 1, n - 1
    
    result = []
    for i in range(n):
        if i % 2 == 0:
            result.append(sorted_nums[j])
            j -= 1
        else:
            result.append(sorted_nums[k])
            k -= 1
    
    nums[:] = result
```

---

## When to Use

Use the Dutch National Flag algorithm when you need to solve problems involving:

- **Three-way partitioning**: Sorting arrays with exactly three distinct values
- **Element categorization**: Grouping elements into three categories in one pass
- **In-place sorting**: When O(1) extra space is required
- **Single-pass solutions**: When you need to process elements only once
- **Pivot-based partitioning**: Similar to quicksort's partition step

### Comparison with Alternatives

| Algorithm | Time Complexity | Space Complexity | Passes Required | Best For |
|-----------|----------------|------------------|------------------|----------|
| **Dutch National Flag** | O(n) | O(1) | 1 | 3 distinct values |
| **Counting Sort** | O(n + k) | O(k) | 2 | Limited range of values |
| **Quicksort (3-way)** | O(n log n) | O(1) | Multiple | Multiple duplicate values |
| **Built-in Sort** | O(n log n) | O(n) | Multiple | General sorting |
| **Two-pass Counting** | O(n) | O(1) | 2 | Known value ranges |

### When to Choose Dutch National Flag vs Others

- **Choose Dutch National Flag** when:
  - Array contains exactly 3 distinct values (or can be mapped to 3)
  - Need in-place O(1) space solution
  - Single-pass solution is preferred
  - Values can be compared (0, 1, 2 or similar)

- **Choose Counting Sort** when:
  - Value range is small and known
  - Space is not a concern
  - Need stable sorting

- **Choose Quicksort 3-way** when:
  - Array has many duplicate values
  - Need general-purpose sorting
  - Average-case performance matters

---

## Algorithm Explanation

### Core Concept

The key insight behind the Dutch National Flag algorithm is using **three pointers** to partition the array into four distinct sections during a single traversal. This approach ensures each element is processed at most once, achieving O(n) time complexity.

### How It Works

#### Three Pointers Strategy:

- **`low`**: Boundary for elements equal to 0 (all elements before `low` are 0s)
- **`mid`**: Current element being processed (all elements from `low` to `mid-1` are 1s)
- **`high`**: Boundary for elements equal to 2 (all elements after `high` are 2s)

#### Four Partitions:

1. **[0, low - 1]**: All zeros (processed)
2. **[low, mid - 1]**: All ones (processed)
3. **[mid, high]**: Unprocessed elements (unknown)
4. **[high + 1, n - 1]**: All twos (processed)

#### Algorithm Logic:

```
while mid <= high:
    if nums[mid] == 0:
        swap(nums[low], nums[mid])
        low++, mid++
    elif nums[mid] == 1:
        mid++
    else:  # nums[mid] == 2
        swap(nums[mid], nums[high])
        high--
```

#### Why It Works:

- **Each element is processed at most once**: The `mid` pointer only moves forward
- **Elements equal to mid are skipped**: They're already in the correct partition (ones)
- **Elements less than mid go left**: When we see a 0, it goes to the left section
- **Elements greater than mid go right**: When we see a 2, it goes to the right section
- **No element is missed**: The `high` pointer ensures all 2s are placed at the end

### Visual Representation

For array `[2, 0, 2, 1, 1, 0]`:

```
Initial: [2, 0, 2, 1, 1, 0]
          low=0, mid=0, high=5

Step 1: mid=0, nums[mid]=2 → swap with high
        [0, 0, 2, 1, 1, 2]
          low=0, mid=0, high=4

Step 2: mid=0, nums[mid]=0 → swap with low
        [0, 0, 2, 1, 1, 2]
          low=1, mid=1, high=4

Step 3: mid=1, nums[mid]=0 → swap with low
        [0, 0, 2, 1, 1, 2]
          low=2, mid=2, high=4

Step 4: mid=2, nums[mid]=2 → swap with high
        [0, 0, 1, 1, 2, 2]
          low=2, mid=2, high=3

Step 5: mid=2, nums[mid]=1 → mid++
        [0, 0, 1, 1, 2, 2]
          low=2, mid=3, high=3

Step 6: mid=3, nums[mid]=1 → mid++
        [0, 0, 1, 1, 2, 2]
          low=2, mid=4, high=3

mid > high → Done!

Final: [0, 0, 1, 1, 2, 2]
```

### Why O(n) Time

- **Best Case**: O(n) - Even when array is already sorted, we still traverse once
- **Average Case**: O(n) - Same as best case, linear time
- **Worst Case**: O(n) - Even reverse sorted takes single pass
- **Why not O(n²)**: Each element is swapped at most once, never revisited

### Important Edge Cases

1. **All elements are the same**: `[1, 1, 1]` - Algorithm handles gracefully, mid advances through all
2. **Already sorted**: `[0, 0, 1, 1, 2, 2]` - Only moves mid pointer, minimal swaps
3. **Reverse sorted**: `[2, 2, 1, 1, 0, 0]` - Maximum swaps but still O(n)
4. **Empty array**: `[]` - Handles correctly with early return
5. **Single element**: `[1]` - No processing needed

### Limitations

- **Exactly 3 values**: Designed specifically for three distinct values
- **Not stable**: Swaps elements, doesn't preserve original order
- **Comparison-based**: Requires values to be comparable
- **In-place modification**: Modifies the original array

---

## Practice Problems

### Problem 1: Sort Colors

**Problem:** [LeetCode 75 - Sort Colors](https://leetcode.com/problems/sort-colors/)

**Description:** Given an array `nums` with `n` objects colored red, white, or blue, sort them in-place so that objects of the same color are adjacent, with the colors in the order red, white, and blue.

**How to Apply Dutch National Flag:**
- Use three pointers: low, mid, high
- Treat 0=red, 1=white, 2=blue
- Process each element exactly once
- Achieve O(n) time and O(1) space

**Solution:**
```python
def sortColors(nums):
    low = mid = 0
    high = len(nums) - 1
    
    while mid <= high:
        if nums[mid] == 0:
            nums[low], nums[mid] = nums[mid], nums[low]
            low += 1
            mid += 1
        elif nums[mid] == 1:
            mid += 1
        else:
            nums[mid], nums[high] = nums[high], nums[mid]
            high -= 1
```

---

### Problem 2: Move Zeroes

**Problem:** [LeetCode 283 - Move Zeroes](https://leetcode.com/problems/move-zeroes/)

**Description:** Given an integer array `nums`, move all 0's to the end of it while maintaining the relative order of the non-zero elements.

**How to Apply Dutch National Flag:**
- Treat 0 and non-zeros as two categories
- Similar to Dutch National Flag with 2 values (simplified)
- Single pass solution
- Time: O(n), Space: O(1)

---

### Problem 3: Sort Array By Parity

**Problem:** [LeetCode 905 - Sort Array By Parity](https://leetcode.com/problems/sort-array-by-parity/)

**Description:** Given an integer array `nums`, move all the even integers at the beginning of the array followed by all the odd integers.

**How to Apply Dutch National Flag:**
- Treat even and odd as two categories
- Two-way partition similar to DNF
- Single pass solution
- Time: O(n), Space: O(1)

---

### Problem 4: Wiggle Sort II

**Problem:** [LeetCode 324 - Wiggle Sort II](https://leetcode.com/problems/wiggle-sort-ii/)

**Description:** Given an unsorted array `nums`, reorder it in-place such that `nums[0] < nums[1] > nums[2] < nums[3]...`

**How to Apply Dutch National Flag:**
- First sort the array using Dutch National Flag (if 3 values)
- Then apply wiggle ordering
- Can be done in O(n) for specific value ranges
- Time: O(n log n) for general case

---

### Problem 5: Kth Largest Element in an Array

**Problem:** [LeetCode 215 - Kth Largest Element in an Array](https://leetcode.com/problems/kth-largest-element-in-an-array/)

**Description:** Given an integer array `nums` and an integer `k`, return the kth largest element in the array.

**How to Apply Dutch National Flag:**
- Use quickselect with 3-way partition
- Handle duplicates efficiently
- Average O(n) time complexity
- Better than standard quicksort for arrays with duplicates

---

### Problem 6: Wiggle Sort

**Problem:** [LeetCode 280 - Wiggle Sort](https://leetcode.com/problems/wiggle-sort/)

**Description:** Given an unsorted array `nums`, reorder it in-place such that `nums[0] <= nums[1] >= nums[2] <= nums[3]...`

**How to Apply Dutch National Flag:**
- Sort and then swap adjacent elements
- Or use one-pass with comparisons
- Time: O(n log n) or O(n)

---

### Problem 7: Relative Sort Array

**Problem:** [LeetCode 1122 - Relative Sort Array](https://leetcode.com/problems/relative-sort-array/)

**Description:** Given two arrays `arr1` and `arr2`, the elements of `arr2` are distinct, and all elements in `arr2` are also in `arr1`. Sort the elements of `arr1` such that the relative ordering of items in `arr1` are the same as in `arr2`.

**How to Apply Dutch National Flag:**
- Use counting approach (variant of DNF)
- Count occurrences and reorder based on `arr2` order
- Time: O(n + m), Space: O(m)

---

## Video Tutorial Links

### Fundamentals

- [Dutch National Flag Algorithm - Code Demo (Take U Forward)](https://www.youtube.com/watch?v=oa0B13VIvjE) - Comprehensive explanation
- [Sort Colors - LeetCode 75 (NeetCode)](https://www.youtube.com/watch?v=4xbWSRZHqac) - Problem walkthrough
- [3-Way Partition (WilliamFiset)](https://www.youtube.com/watch?v=XYFK4x3yGfU) - Visual explanation

### Advanced Topics

- [Quicksort with 3-way Partition](https://www.youtube.com/watch?v=S0ZOKG7KUrA) - Advanced application
- [Dutch National Flag in Different Languages](https://www.youtube.com/watch?v=2E67lG3D4eU) - Implementation variations
- [Interview Problem Discussion](https://www.youtube.com/watch?v=2F4r0N2u4vU) - Common interview questions

### Problem-Specific

- [Move Zeroes - LeetCode 283](https://www.youtube.com/watch?v=3PmQ0N857vs) - Two-pointer technique
- [Wiggle Sort II](https://www.youtube.com/watch?v=vGnk9UHwxn0) - Advanced sorting
- [Kth Largest Element](https://www.youtube.com/watch?v=XEmy13g1Qxc) - Quickselect with 3-way partition

---

## Follow-up Questions

### Q1: Why don't we increment mid after swapping with high?

**Answer:** When we swap `nums[mid]` with `nums[high]`, the element from position `high` (which could be 0, 1, or 2) moves to position `mid`. This element hasn't been processed yet, so we need to check it again. If we increment `mid`, we might skip processing this element incorrectly.

Example:
```
Before swap: [..., 2, ..., 0] (mid points to 2, high points to 0)
After swap:  [..., 0, ..., 2] (0 is now at mid, needs processing)
```

---

### Q2: Can Dutch National Flag handle more than 3 values?

**Answer:** The classic Dutch National Flag algorithm is specifically designed for exactly 3 values. For k values, you can either:
1. **Use counting sort**: O(n + k) time, O(k) space - simpler and more flexible
2. **Extend the algorithm**: With multiple partitions (complex, not recommended)
3. **Use quicksort**: With 3-way partition recursively

For k > 3, counting sort is usually preferred over extending DNF.

---

### Q3: What's the difference between Dutch National Flag and counting sort?

**Answer:**

| Aspect | Dutch National Flag | Counting Sort |
|--------|---------------------|---------------|
| **Time** | O(n) | O(n + k) where k is range |
| **Space** | O(1) | O(k) |
| **Passes** | Single pass | Two passes (count + write) |
| **Stability** | Not stable | Stable |
| **Values** | Exactly 3 | Any range |

---

### Q4: Is the algorithm stable? Does it preserve the relative order of equal elements?

**Answer:** The classic Dutch National Flag algorithm is **not stable** by default because it swaps elements arbitrarily. For example, if you have two 1s at different positions, their relative order might change.

If stability is required:
- Use counting sort (stable variant)
- Or use a modified approach that tracks original indices

---

### Q5: How does this relate to quicksort?

**Answer:** Dutch National Flag is essentially the partition step of quicksort, but specifically optimized for handling three distinct values. In quicksort's 3-way partition variant:
- Elements < pivot go to left
- Elements == pivot go to middle
- Elements > pivot go to right

This is exactly the DNF pattern! The 3-way quicksort is particularly effective when there are many duplicate values, as it avoids re-sorting equal elements.

---

### Q6: When should I choose counting sort over Dutch National Flag?

**Answer:** Choose counting sort when:
- You need **stability** (preserve original order of duplicates)
- You have **more than 3** distinct values
- You can afford **O(k) extra space**
- The **value range (k)** is small and known

Choose Dutch National Flag when:
- You have **exactly 3** distinct values
- You need **O(1) extra space**
- You want **single-pass** processing

---

### Q7: Can Dutch National Flag handle negative numbers?

**Answer:** Yes, if you map them appropriately. The algorithm works with any comparable values, not just 0, 1, 2. You just need to establish an ordering:

```python
def sort_three_categories(nums):
    # Example: negative, zero, positive
    low = mid = 0
    high = len(nums) - 1
    
    while mid <= high:
        if nums[mid] < 0:  # Negative category
            nums[low], nums[mid] = nums[mid], nums[low]
            low += 1
            mid += 1
        elif nums[mid] == 0:  # Zero category
            mid += 1
        else:  # Positive category
            nums[mid], nums[high] = nums[high], nums[mid]
            high -= 1
```

---

## Summary

The **Dutch National Flag** algorithm is an elegant solution for sorting arrays with exactly **three distinct values** in a **single pass**. Key takeaways:

- **Single pass**: O(n) time complexity, each element processed at most once
- **In-place**: O(1) extra space, no additional data structures needed
- **Three pointers**: low, mid, and high partition the array into four sections
- **Versatile**: The same technique applies to quicksort's 3-way partition
- **Elegant**: Simple logic that handles edge cases gracefully

When to use:
- ✅ Sorting arrays with exactly 3 distinct values
- ✅ Problems requiring single-pass partitioning
- ✅ Scenarios needing O(1) extra space

When not to use:
- ❌ More than 3 distinct values (use counting sort or quicksort)
- ❌ When stability is required (use counting sort)
- ❌ General-purpose sorting needs

This algorithm is a fundamental technique in competitive programming and technical interviews, frequently appearing in problems like "Sort Colors" (LeetCode 75). Understanding the three-pointer approach opens the door to solving many similar partitioning problems efficiently.
