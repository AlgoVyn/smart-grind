# Cyclic Sort

## Category
Arrays & Strings

## Description

Cyclic Sort is an **in-place sorting algorithm** that works optimally for arrays containing numbers in a **specific range** (typically 1 to n or 0 to n-1). It places each element at its correct index by cycling through the array, achieving O(n) time complexity with O(1) space complexity - making it one of the most efficient sorting algorithms for constrained input ranges.

This pattern is fundamental in competitive programming and technical interviews for finding missing numbers, finding duplicates, and sorting constrained arrays efficiently.

---

## Concepts

The Cyclic Sort technique is built on several fundamental concepts that make it powerful for solving constrained array problems.

### 1. Index Mapping

Each element's value tells us exactly where it should be placed. For an array with n elements containing values from 1 to n:

| Value | Target Index | Formula |
|-------|--------------|---------|
| 1 | 0 | value - 1 |
| 2 | 1 | value - 1 |
| k | k - 1 | value - 1 |
| n | n - 1 | value - 1 |

This one-to-one mapping enables O(1) placement decisions.

### 2. Cycle Detection

The algorithm detects cycles when elements are already in place or when duplicates exist:

```
If arr[i] == arr[correct_idx]:
    - Element is already correct, OR
    - A duplicate exists at target position
```

### 3. In-Place Swapping

Elements are swapped directly to their target positions without extra storage:

```
New position = value - 1
Swap arr[i] with arr[new_position]
```

### 4. Incremental Progress

Each swap places at least one element correctly:

- **Best case**: Element already in correct position → move forward
- **Swap case**: Element moved to correct position → stay at same index
- **Worst case**: O(n) swaps total (each element moved at most once)

---

## Frameworks

Structured approaches for solving cyclic sort problems.

### Framework 1: Standard Cyclic Sort Template

```
┌─────────────────────────────────────────────────────┐
│  STANDARD CYCLIC SORT FRAMEWORK                     │
├─────────────────────────────────────────────────────┤
│  1. Initialize i = 0                                 │
│  2. While i < n:                                   │
│     a. Calculate correct_idx = arr[i] - 1          │
│     b. If arr[i] != arr[correct_idx]:              │
│        - Swap arr[i] with arr[correct_idx]         │
│        - Stay at i (check new element at i)        │
│     c. Else:                                         │
│        - Increment i (element in correct place)    │
│  3. Return sorted array                              │
└─────────────────────────────────────────────────────┘
```

**When to use**: Values in range [1, n], need to sort array in-place.

### Framework 2: Find Missing Number Template

```
┌─────────────────────────────────────────────────────┐
│  FIND MISSING NUMBER FRAMEWORK                      │
├─────────────────────────────────────────────────────┤
│  1. Apply cyclic sort to place elements              │
│     - Ignore values outside range [1, n]           │
│     - Skip duplicates (don't swap if equal)        │
│  2. Scan sorted array:                               │
│     - Find first index where arr[i] != i + 1       │
│  3. Missing number = index + 1                       │
│  4. If all match, missing number = n + 1           │
└─────────────────────────────────────────────────────┘
```

**When to use**: Array has n elements with values in [1, n+1], one number missing.

### Framework 3: Find Duplicates Template

```
┌─────────────────────────────────────────────────────┐
│  FIND DUPLICATES FRAMEWORK                          │
├─────────────────────────────────────────────────────┤
│  1. Apply cyclic sort                               │
│  2. During sorting, detect duplicates:              │
│     - If arr[i] == arr[correct_idx] AND i != correct │
│       → Found duplicate!                            │
│  3. Collect all duplicates found during process     │
│  4. Alternative: After sort, scan for arr[i]==arr[i+1]│
└─────────────────────────────────────────────────────┘
```

**When to use**: Need to find all duplicate numbers in constrained range.

---

## Forms

Different manifestations of the cyclic sort pattern.

### Form 1: Standard Range [1, n]

Array contains values from 1 to n, each appearing once.

| Step | Action | Time |
|------|--------|------|
| Place element | Swap to correct index | O(1) |
| Check placement | Verify arr[i] == i + 1 | O(1) |
| Complete sort | Each element moved at most once | O(n) |

### Form 2: Range [0, n-1]

Array contains values from 0 to n-1.

| Formula | Standard [1,n] | Zero-based [0,n-1] |
|---------|----------------|-------------------|
| Correct index | arr[i] - 1 | arr[i] |
| First element | goes to index 0 | stays at index 0 |

**Adjustment**: Remove the `- 1` from the index calculation.

### Form 3: With Missing Numbers

Array has values in range but some are missing.

```
Example: [4, 3, 2, 7, 8, 2, 3, 1]
After cyclic sort: [1, 2, 3, 4, 3, 2, 7, 8]
Index scan: position 4 has 3 (should be 5), position 5 has 2 (should be 6)
Missing: 5, 6
```

### Form 4: With Duplicates

Array has n+1 elements in range [1, n], one duplicate exists.

```
Example: [1, 3, 4, 2, 2]  (n=4, but 5 elements)
During sort: when trying to place second 2, find 2 already at position 1
Duplicate detected: 2
```

### Form 5: First Missing Positive

Handle arbitrary integers, find smallest missing positive.

```
Strategy:
1. Ignore non-positive numbers and numbers > n
2. Place valid numbers at correct indices
3. Scan for first position where arr[i] != i + 1
```

---

## Tactics

Specific techniques and optimizations.

### Tactic 1: Bounds Checking

Handle values outside the expected range:

```python
def cyclic_sort_with_bounds(nums):
    """Sort with bounds checking for first missing positive."""
    i = 0
    n = len(nums)
    while i < n:
        correct_idx = nums[i] - 1
        # Only place if in valid range and not already correct
        if 0 <= correct_idx < n and nums[i] != nums[correct_idx]:
            nums[i], nums[correct_idx] = nums[correct_idx], nums[i]
        else:
            i += 1
    return nums
```

### Tactic 2: Duplicate Detection During Sort

Detect duplicates without extra space:

```python
def find_duplicate(nums):
    """Find duplicate using cyclic sort principle."""
    i = 0
    while i < len(nums):
        correct_idx = nums[i] - 1
        if nums[i] != nums[correct_idx]:
            nums[i], nums[correct_idx] = nums[correct_idx], nums[i]
        else:
            if i != correct_idx:  # Duplicate found!
                return nums[i]
            i += 1
    return -1
```

### Tactic 3: Find All Missing Numbers

Scan after sorting to find all missing:

```python
def find_all_missing(nums):
    """Find all missing numbers in range [1, n]."""
    i = 0
    n = len(nums)
    while i < n:
        correct_idx = nums[i] - 1
        if 0 <= correct_idx < n and nums[i] != nums[correct_idx]:
            nums[i], nums[correct_idx] = nums[correct_idx], nums[i]
        else:
            i += 1
    
    # Collect missing numbers
    missing = []
    for i in range(n):
        if nums[i] != i + 1:
            missing.append(i + 1)
    return missing
```

### Tactic 4: Set Mismatch (Duplicate + Missing)

Find both duplicate and missing in one pass:

```python
def find_error_nums(nums):
    """Find [duplicate, missing]."""
    i = 0
    while i < len(nums):
        correct_idx = nums[i] - 1
        if nums[i] != nums[correct_idx]:
            nums[i], nums[correct_idx] = nums[correct_idx], nums[i]
        else:
            i += 1
    
    for i in range(len(nums)):
        if nums[i] != i + 1:
            return [nums[i], i + 1]  # [duplicate, missing]
    return [-1, -1]
```

### Tactic 5: Handling Negative Numbers

Ignore negatives when finding first missing positive:

```python
def first_missing_positive(nums):
    """Find smallest missing positive integer."""
    n = len(nums)
    i = 0
    while i < n:
        correct_idx = nums[i] - 1
        # Only place if positive, in range, and not already correct
        if (0 < nums[i] <= n and 
            nums[i] != nums[correct_idx]):
            nums[i], nums[correct_idx] = nums[correct_idx], nums[i]
        else:
            i += 1
    
    for i in range(n):
        if nums[i] != i + 1:
            return i + 1
    return n + 1
```

### Tactic 6: Zero-Based Index Adjustment

For arrays with values [0, n-1]:

```python
def cyclic_sort_zero_based(nums):
    """Cyclic sort for range [0, n-1]."""
    i = 0
    while i < len(nums):
        correct_idx = nums[i]  # No -1 needed
        if nums[i] != nums[correct_idx]:
            nums[i], nums[correct_idx] = nums[correct_idx], nums[i]
        else:
            i += 1
    return nums
```

---

## Python Templates

### Template 1: Standard Cyclic Sort

```python
def cyclic_sort(nums: list[int]) -> list[int]:
    """
    Template 1: Standard cyclic sort for range [1, n].
    Time: O(n), Space: O(1)
    """
    i = 0
    while i < len(nums):
        correct_idx = nums[i] - 1
        if nums[i] != nums[correct_idx]:
            nums[i], nums[correct_idx] = nums[correct_idx], nums[i]
        else:
            i += 1
    return nums
```

### Template 2: Find Missing Number

```python
def find_missing_number(nums: list[int]) -> int:
    """
    Template 2: Find missing number in range [0, n].
    Time: O(n), Space: O(1)
    """
    i = 0
    n = len(nums)
    while i < n:
        correct_idx = nums[i]
        if 0 <= correct_idx < n and nums[i] != nums[correct_idx]:
            nums[i], nums[correct_idx] = nums[correct_idx], nums[i]
        else:
            i += 1
    
    for i in range(n):
        if nums[i] != i:
            return i
    return n
```

### Template 3: Find All Missing Numbers

```python
def find_all_missing_numbers(nums: list[int]) -> list[int]:
    """
    Template 3: Find all missing numbers in range [1, n].
    Time: O(n), Space: O(1) excluding output
    """
    i = 0
    while i < len(nums):
        correct_idx = nums[i] - 1
        if 0 <= correct_idx < len(nums) and nums[i] != nums[correct_idx]:
            nums[i], nums[correct_idx] = nums[correct_idx], nums[i]
        else:
            i += 1
    
    missing = []
    for i in range(len(nums)):
        if nums[i] != i + 1:
            missing.append(i + 1)
    return missing
```

### Template 4: Find Duplicate Number

```python
def find_duplicate_number(nums: list[int]) -> int:
    """
    Template 4: Find duplicate in array of n+1 elements with values in [1, n].
    Time: O(n), Space: O(1)
    """
    i = 0
    while i < len(nums):
        if nums[i] != i + 1:
            correct_idx = nums[i] - 1
            if nums[i] == nums[correct_idx]:
                return nums[i]  # Found duplicate
            nums[i], nums[correct_idx] = nums[correct_idx], nums[i]
        else:
            i += 1
    return -1
```

### Template 5: First Missing Positive

```python
def first_missing_positive(nums: list[int]) -> int:
    """
    Template 5: Find first missing positive integer.
    Handles arbitrary integers including negatives.
    Time: O(n), Space: O(1)
    """
    n = len(nums)
    i = 0
    while i < n:
        correct_idx = nums[i] - 1
        if (0 < nums[i] <= n and 
            nums[i] != nums[correct_idx]):
            nums[i], nums[correct_idx] = nums[correct_idx], nums[i]
        else:
            i += 1
    
    for i in range(n):
        if nums[i] != i + 1:
            return i + 1
    return n + 1
```

### Template 6: Set Mismatch

```python
def set_mismatch(nums: list[int]) -> list[int]:
    """
    Template 6: Find [duplicate, missing] in set 1..n with one error.
    Time: O(n), Space: O(1)
    """
    i = 0
    while i < len(nums):
        correct_idx = nums[i] - 1
        if nums[i] != nums[correct_idx]:
            nums[i], nums[correct_idx] = nums[correct_idx], nums[i]
        else:
            i += 1
    
    for i in range(len(nums)):
        if nums[i] != i + 1:
            return [nums[i], i + 1]
    return [-1, -1]
```

---

## When to Use

Use the Cyclic Sort algorithm when you need to solve problems involving:

- **Arrays with values in range [1, n] or [0, n-1]**: When elements are in a known, constrained range
- **Finding missing numbers**: Efficiently identify which numbers are missing from a sequence
- **Finding duplicate numbers**: Identify which numbers appear more than once
- **In-place sorting requirements**: When you need O(1) extra space and O(n) time complexity

### Comparison with Alternatives

| Algorithm | Time Complexity | Space Complexity | Best For |
|-----------|----------------|------------------|----------|
| **Cyclic Sort** | O(n) | O(1) | Arrays with values in range [1, n] |
| **Quicksort** | O(n log n) avg | O(log n) | General purpose sorting |
| **Merge Sort** | O(n log n) | O(n) | Stable sorting, linked lists |
| **Counting Sort** | O(n + k) | O(k) | Small range of integers |
| **Hash Set** | O(n) | O(n) | Finding duplicates with any range |

### When to Choose Cyclic Sort vs Other Approaches

- **Choose Cyclic Sort** when:
  - Array contains unique integers in range [1, n] or [0, n-1]
  - You need O(n) time with O(1) space
  - The problem involves finding missing/duplicate numbers

- **Choose Counting Sort** when:
  - Range of values (k) is small and known
  - Elements are not necessarily unique
  - You can afford O(k) extra space

- **Choose Hash Set** when:
  - Values are not in a constrained range
  - You need to find duplicates in arbitrary arrays
  - O(n) space is acceptable

---

## Algorithm Explanation

### Core Concept

The key insight behind Cyclic Sort is that **each element's value tells us exactly where it should be placed**. For an array with n elements containing values from 1 to n:

- Element with value `1` belongs at index `0`
- Element with value `2` belongs at index `1`
- Element with value `k` belongs at index `k - 1`

This one-to-one mapping allows us to place each element in its correct position by simply swapping it with the element currently at its target index.

### How It Works

1. **Iterate through the array** starting from index 0
2. **Calculate the correct index** for the current element: `correct_idx = arr[i] - 1`
3. **Check if the element is already at its correct position**:
   - If `arr[i] == arr[correct_idx]`, the element is already correctly placed (or it's a duplicate)
   - Move to the next index
4. **If not at correct position, swap**: Exchange `arr[i]` with `arr[correct_idx]`
5. **Repeat** for the current index (don't increment) until the element at index `i` is in its correct place

### Visual Representation

For array `[3, 1, 5, 4, 2]`:

```
Initial: [3, 1, 5, 4, 2]
            ↑
          i=0, val=3, correct_idx=2

Step 1:  Swap arr[0] and arr[2]
          [5, 1, 3, 4, 2]
           ↑
          i=0, val=5, correct_idx=4

Step 2:  Swap arr[0] and arr[4]
          [2, 1, 3, 4, 5]
           ↑
          i=0, val=2, correct_idx=1

Step 3:  Swap arr[0] and arr[1]
          [1, 2, 3, 4, 5]
           ↑
          i=0, val=1, correct_idx=0 ✓ (correct place)

Step 4:  Move to i=1
          [1, 2, 3, 4, 5]
              ↑
          i=1, val=2, correct_idx=1 ✓ (already correct)

Continue... all elements are now in correct positions!
```

### Why It Achieves O(n) Time

Each element is swapped at most once to reach its correct position. Even though we have nested logic (while loop inside for loop), each swap places at least one element correctly, and we never move an element out of its correct position once placed.

**Proof**: Each iteration either:
1. Places one element in its correct position (swap case), OR
2. Moves the pointer forward (element already in place)

Since we can place at most n elements correctly, and we move the pointer n times, total operations ≤ 2n = O(n).

### Limitations

- **Only works for specific ranges**: Values must be in range [1, n] or [0, n-1]
- **Requires unique values** (for the basic version): Duplicates need special handling
- **Modifies the original array**: Sorts in-place
- **Not a stable sort**: Relative order of equal elements is not preserved

---

## Practice Problems

### Problem 1: Missing Number

**Problem:** [LeetCode 268 - Missing Number](https://leetcode.com/problems/missing-number/)

**Description:** Given an array `nums` containing `n` distinct numbers in the range `[0, n]`, return the only number in the range that is missing from the array.

**How to Apply Cyclic Sort:**
- Use cyclic sort to place each number at its correct index (value goes to index = value)
- After sorting, the index where `nums[i] != i` reveals the missing number
- If all are in place, n is missing

---

### Problem 2: Find All Numbers Disappeared in an Array

**Problem:** [LeetCode 448 - Find All Numbers Disappeared in an Array](https://leetcode.com/problems/find-all-numbers-disappeared-in-an-array/)

**Description:** Given an array `nums` of `n` integers where `nums[i]` is in the range `[1, n]`, return an array of all the integers in the range `[1, n]` that do not appear in `nums`.

**How to Apply Cyclic Sort:**
- Apply cyclic sort to place all existing numbers at their correct indices
- Scan through the array to find indices where `nums[i] != i + 1`
- Those indices + 1 are the missing numbers

---

### Problem 3: Find the Duplicate Number

**Problem:** [LeetCode 287 - Find the Duplicate Number](https://leetcode.com/problems/find-the-duplicate-number/)

**Description:** Given an array of integers `nums` containing `n + 1` integers where each integer is in the range `[1, n]` inclusive, there is only one repeated number. Return this repeated number.

**How to Apply Cyclic Sort:**
- During cyclic sort, when we try to place a number at its correct index
- If that position already has the correct number, we've found the duplicate
- Return that number immediately

---

### Problem 4: First Missing Positive

**Problem:** [LeetCode 41 - First Missing Positive](https://leetcode.com/problems/first-missing-positive/)

**Description:** Given an unsorted integer array `nums`, return the smallest missing positive integer. You must implement an algorithm that runs in O(n) time and uses O(1) auxiliary space.

**How to Apply Cyclic Sort:**
- Ignore negative numbers and numbers larger than n
- Place valid numbers at their correct indices (index = value - 1)
- Scan to find first position where `nums[i] != i + 1`

---

### Problem 5: Set Mismatch

**Problem:** [LeetCode 645 - Set Mismatch](https://leetcode.com/problems/set-mismatch/)

**Description:** You have a set of integers `s` which originally contains all the numbers from `1` to `n`. Unfortunately, due to some error, one of the numbers in `s` got duplicated to another number in the set, which results in repetition of one number and loss of another number. Find the number that occurs twice and the number that is missing.

**How to Apply Cyclic Sort:**
- Apply cyclic sort to the array
- The index where `nums[i] != i + 1` tells us both:
  - `nums[i]` is the duplicate
  - `i + 1` is the missing number

---

## Video Tutorial Links

### Fundamentals

- [Cyclic Sort - Pattern for Arrays 1 to N (NeetCode)](https://www.youtube.com/watch?v=JfinxytTYFQ) - Introduction to cyclic sort pattern
- [Cyclic Sort Algorithm (JavaScript)](https://www.youtube.com/watch?v=J0kYJN5w8gw) - Step-by-step implementation
- [Sorting Algorithms: Cyclic Sort (Tech With Tim)](https://www.youtube.com/watch?v=JfinxytTYFQ) - Visual explanation with examples

### LeetCode Problem Solutions

- [Missing Number - LeetCode 268 (NeetCode)](https://www.youtube.com/watch?v=YMYvYSKG68g) - Applying cyclic sort to find missing number
- [Find the Duplicate Number - LeetCode 287 (Nick White)](https://www.youtube.com/watch?v=wjYnzkAhcNk) - Multiple approaches including cyclic sort
- [First Missing Positive - LeetCode 41 (Back To Back SWE)](https://www.youtube.com/watch?v=8DqewaFKK4k) - Hard problem using cyclic sort concept

### Pattern Recognition

- [Cyclic Sort Pattern - Blind 75 (Sean Prashad)](https://www.youtube.com/watch?v=9TlHvipP5yA) - How to recognize cyclic sort problems
- [15 Sorting Algorithms Visualized](https://www.youtube.com/watch?v=kPRA0W1kECg) - Cyclic sort among other sorting algorithms

---

## Follow-up Questions

### Q1: Can Cyclic Sort handle arrays with duplicate values?

**Answer:** The basic cyclic sort assumes unique values in range [1, n]. For duplicates:
- **Detection**: Cyclic sort can detect duplicates during the sorting process
- **Sorting with duplicates**: If `nums[i] == nums[correct_idx]` and `i != correct_idx`, it's a duplicate
- **Handling**: You can skip duplicates and continue, or collect them separately

---

### Q2: What happens if the array contains numbers outside the range [1, n]?

**Answer:** Cyclic sort only works for values in range [1, n] (or [0, n-1]). For values outside this range:
- **Invalid input**: The algorithm may access out-of-bounds indices
- **Solution**: Add bounds checking - ignore values outside the valid range
- **Alternative**: For finding first missing positive, we place only valid numbers and ignore others

---

### Q3: Is Cyclic Sort stable? Does it preserve the relative order of equal elements?

**Answer:** **No**, Cyclic Sort is not a stable sort:
- Elements are swapped to their correct positions regardless of original order
- Equal elements (if allowed) may end up in different relative positions
- For applications requiring stability, use Merge Sort or Insertion Sort instead

---

### Q4: How does Cyclic Sort compare to Counting Sort?

**Answer:**

| Aspect | Cyclic Sort | Counting Sort |
|--------|-------------|---------------|
| **Time** | O(n) | O(n + k) where k is range |
| **Space** | O(1) | O(k) |
| **Range** | [1, n] only | Any range [0, k] |
| **Duplicates** | Complex handling | Handles naturally |
| **Stability** | Not stable | Stable |

Choose Cyclic Sort when space is critical and range equals array length. Choose Counting Sort when you need stability or have a small, fixed range.

---

### Q5: Can Cyclic Sort be used for non-integer data?

**Answer:** Cyclic Sort relies on the property that `value - 1` gives the correct index:
- **Integers only**: Works directly with integers
- **Characters**: Can map 'a'-'z' to 0-25 and apply similar logic
- **Custom objects**: Would need a key function that maps to range [0, n-1]
- **General data**: Not suitable; use comparison-based sorts like Quicksort or Mergesort

---

## Summary

The Cyclic Sort algorithm is a powerful technique for sorting arrays with values in a constrained range [1, n] or [0, n-1]. Key takeaways:

- **O(n) time complexity**: Each element is moved to its correct position at most once
- **O(1) space complexity**: Sorts in-place with no extra memory needed
- **Optimal for constrained ranges**: When values match array indices, this is the most efficient approach
- **Pattern for array problems**: Essential for finding missing/duplicate numbers
- **Not a general-purpose sort**: Only works when values are in specific range

When to use:
- ✅ Array values are unique integers in range [1, n]
- ✅ Finding missing numbers in a sequence
- ✅ Finding duplicates in constrained range
- ✅ Need O(n) time with O(1) space

When NOT to use:
- ❌ Values outside range [1, n]
- ❌ Non-integer or complex data types
- ❌ Need stable sorting
- ❌ General-purpose sorting needs

This algorithm is essential for technical interviews and competitive programming, particularly for problems involving finding missing or duplicate elements in arrays.