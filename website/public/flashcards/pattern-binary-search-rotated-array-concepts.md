## Binary Search - Rotated Array: Core Concepts

What are the fundamental principles for searching rotated sorted arrays?

<!-- front -->

---

### Core Concept

**A rotated sorted array consists of two sorted subarrays. At any point in binary search, one half is always sorted.**

```
Original sorted: [1, 2, 3, 4, 5, 6, 7]
Rotated at 3:    [4, 5, 6, 7, 1, 2, 3]
                      ↑
                    pivot
                    
Two sorted halves:
- Left:  [4, 5, 6, 7]  (sorted)
- Right: [1, 2, 3]     (sorted)

Minimum is at pivot: 1
Maximum is right before pivot: 7
```

---

### The Pattern

```
Key insight: Compare nums[mid] with nums[right]

Case 1: nums[mid] > nums[right]
  [4, 5, 6, 7, 0, 1, 2]
       ↑        ↑
      mid     right
  6 > 2, so there's a "drop" somewhere after mid
  → Minimum is in RIGHT half
  
Case 2: nums[mid] < nums[right]
  [4, 5, 0, 1, 2]
       ↑     ↑
      mid  right  
  0 < 2, so right side is sorted
  → Minimum is at mid or in LEFT half
  
Case 3: nums[mid] == nums[right] (with duplicates)
  Can't determine, shrink right: right -= 1
```

---

### Common Applications

| Problem Type | Goal | Example |
|--------------|------|---------|
| Find minimum | Locate pivot | LeetCode 153 |
| Find maximum | Locate before pivot | Extended problem |
| Search target | Find element | LeetCode 33 |
| Rotation count | Index of minimum | Derived |
| Pivot index | Where rotation happened | Derived |

---

### Complexity

| Aspect | Complexity | Notes |
|--------|-----------|-------|
| Time | O(log n) | Binary search |
| Space | O(1) | Iterative |
| With duplicates | O(n) worst | Linear scan needed |

---

### Why Compare with Right?

```
Comparing with nums[right] is cleaner than nums[left]:

nums = [4, 5, 6, 7, 0, 1, 2]

Using nums[right]:
- nums[mid]=6 > nums[right]=2 → search right
  Clear: 6 > 2, there's a drop

Using nums[left]:
- nums[mid]=6 > nums[left]=4 → ?
  Both 6 and 4 are in sorted left half
  Can't determine which half has minimum

nums[right] comparison always tells us
if the "drop" (minimum) is to the right!
```

<!-- back -->
