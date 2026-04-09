## Binary Search - Find First/Last Occurrence: Problem Forms

What are the common variations and problem forms for first/last occurrence binary search?

<!-- front -->

---

### Form 1: Find First and Last Position (Classic)

**Problem**: Return `[first, last]` positions of target.

```python
# Input: [5,7,7,8,8,10], target = 8
# Output: [3, 4]
# Input: [5,7,7,8,8,10], target = 6  
# Output: [-1, -1]

def search_range(nums, target):
    first = find_first(nums, target)
    if first == -1:
        return [-1, -1]
    last = find_last(nums, target)
    return [first, last]
```

**LeetCode**: 34 - Find First and Last Position

---

### Form 2: Count Occurrences

**Problem**: Return how many times target appears.

```python
# Input: [1,2,3,3,3,3,4,5], target = 3
# Output: 4 (appears at indices 2,3,4,5)

def count_occurrences(nums, target):
    first = find_first(nums, target)
    if first == -1:
        return 0
    last = find_last(nums, target)
    return last - first + 1
```

**Variation**: Count in O(log n) even with many duplicates.

---

### Form 3: Search Insert Position

**Problem**: Return index where target should be inserted to maintain sorted order.

```python
# Input: [1,3,5,6], target = 5
# Output: 2 (already exists at index 2)
# Input: [1,3,5,6], target = 2  
# Output: 1 (insert between 1 and 3)

def search_insert(nums, target):
    # This IS first occurrence / lower bound!
    low, high = 0, len(nums)
    while low < high:
        mid = low + (high - low) // 2
        if nums[mid] < target:
            low = mid + 1
        else:
            high = mid
    return low  # Same as lower_bound
```

**LeetCode**: 35 - Search Insert Position

---

### Form 4: First Bad Version

**Problem**: Find first occurrence of "bad" in boolean array.

```python
# Input: [G,G,G,G,B,B,B] (G=good, B=bad)
# Output: 4 (first bad version)

def first_bad_version(n):
    low, high = 1, n
    while low < high:
        mid = low + (high - low) // 2
        if isBadVersion(mid):
            high = mid      # Could be earlier bad version
        else:
            low = mid + 1   # First bad must be after
    return low
```

**LeetCode**: 278 - First Bad Version

---

### Form 5: Find Peak Element

**Problem**: Find any peak (local maximum) in array.

```python
# Input: [1,2,3,1]
# Output: 2 (peak is 3 at index 2)
# Input: [1,2,1,3,5,6,4]  
# Output: 5 (peak is 6 at index 5)

def find_peak(nums):
    low, high = 0, len(nums) - 1
    while low < high:
        mid = low + (high - low) // 2
        if nums[mid] < nums[mid + 1]:
            low = mid + 1   # Peak is to the right
        else:
            high = mid      # Peak is at mid or left
    return low  # or high (they converge)
```

**LeetCode**: 162 - Find Peak Element

---

### Form Variations Summary

| Form | Return Type | Key Modification |
|------|-------------|------------------|
| First/Last Range | `[int, int]` | Two separate searches |
| Count Occurrences | `int` | `last - first + 1` |
| Insert Position | `int` | Same as lower bound |
| First Bad Version | `int` | Binary search on boolean |
| Peak Element | `int` | Compare `mid` with `mid+1` |
| Lower Bound | `int` | First `>= target` |
| Upper Bound | `int` | First `> target` |

<!-- back -->
