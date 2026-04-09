## Binary Search - On Sorted Array/List: Problem Forms

What are the common variations and problem forms for binary search on sorted arrays?

<!-- front -->

---

### Form 1: Classic Binary Search (LeetCode 704)

**Problem**: Return index of target, or -1 if not found.

```python
# Input: [-1,0,3,5,9,12], target = 9
# Output: 4
# Input: [-1,0,3,5,9,12], target = 2
# Output: -1

def search(nums, target):
    low, high = 0, len(nums) - 1
    
    while low <= high:
        mid = low + (high - low) // 2
        
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    
    return -1
```

**LeetCode**: 704 - Binary Search

---

### Form 2: Search Insert Position (LeetCode 35)

**Problem**: Return index where target should be inserted to maintain order.

```python
# Input: [1,3,5,6], target = 5
# Output: 2 (already at index 2)
# Input: [1,3,5,6], target = 2
# Output: 1 (insert between 1 and 3)
# Input: [1,3,5,6], target = 7
# Output: 4 (insert at end)

def search_insert(nums, target):
    low, high = 0, len(nums) - 1
    
    while low <= high:
        mid = low + (high - low) // 2
        
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    
    return low  # Insert position!
```

**LeetCode**: 35 - Search Insert Position

---

### Form 3: First Bad Version (LeetCode 278)

**Problem**: Find first occurrence of "bad" in boolean sequence.

```python
# Input: [G,G,G,G,B,B,B] (G=good, B=bad), n = 7
# Output: 4 (first bad version)

def first_bad_version(n):
    low, high = 1, n
    
    while low < high:
        mid = low + (high - low) // 2
        
        if isBadVersion(mid):
            high = mid  # First bad could be at or before mid
        else:
            low = mid + 1  # First bad must be after mid
    
    return low  # or high (they converge)
```

**Note**: Uses `low < high` loop variant for finding first true condition.

**LeetCode**: 278 - First Bad Version

---

### Form 4: Find Peak Element (LeetCode 162)

**Problem**: Find any peak (local maximum) in array.

```python
# Input: [1,2,3,1]
# Output: 2 (peak is 3 at index 2)
# Input: [1,2,1,3,5,6,4]
# Output: 5 (peak is 6 at index 5)

def find_peak_element(nums):
    low, high = 0, len(nums) - 1
    
    while low < high:
        mid = low + (high - low) // 2
        
        if nums[mid] < nums[mid + 1]:
            low = mid + 1  # Peak is to the right
        else:
            high = mid  # Peak is at mid or to the left
    
    return low  # or high (they converge)
```

**LeetCode**: 162 - Find Peak Element

---

### Form 5: Guess Number Higher or Lower (LeetCode 374)

**Problem**: Binary search with external API feedback.

```python
# Guess a number between 1 and n using guess(num) API
# Returns -1 if num > target, 1 if num < target, 0 if correct

def guess_number(n):
    low, high = 1, n
    
    while low <= high:
        mid = low + (high - low) // 2
        result = guess(mid)
        
        if result == 0:
            return mid
        elif result == -1:
            high = mid - 1  # Target is smaller
        else:
            low = mid + 1   # Target is larger
    
    return -1
```

**LeetCode**: 374 - Guess Number Higher or Lower

---

### Form 6: Find K Closest Elements (LeetCode 658)

**Problem**: Find k closest elements to target in sorted array.

```python
# Input: [1,2,3,4,5], k=4, target=3
# Output: [1,2,3,4]

def find_closest_elements(arr, k, x):
    # Binary search for starting point of window
    low, high = 0, len(arr) - k
    
    while low < high:
        mid = low + (high - low) // 2
        
        # Compare distance from x
        if x - arr[mid] > arr[mid + k] - x:
            low = mid + 1  # Window should start later
        else:
            high = mid  # Window can start here or earlier
    
    return arr[low:low + k]
```

**LeetCode**: 658 - Find K Closest Elements

---

### Form Variations Summary

| Form | Return Type | Key Modification |
|------|-------------|------------------|
| Classic Binary Search | `int` (index or -1) | Standard template |
| Search Insert Position | `int` (index) | Return `low` when not found |
| First Bad Version | `int` (first true) | `low < high` variant |
| Peak Element | `int` (any peak) | Compare with `mid + 1` |
| Guess Number | `int` (correct guess) | External API for comparison |
| K Closest Elements | `List[int]` | Binary search for window start |
| Lower Bound | `int` (first >=) | `nums[mid] >= target` condition |
| Upper Bound | `int` (first >) | `nums[mid] > target` condition |

<!-- back -->
