# Bubble Sort

## Category
Sorting

## Description

Bubble Sort is a simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order. The pass through the list is repeated until the list is sorted. While simple to understand, it is generally too slow for practical use on large datasets.

---

## Concepts

### 1. Time Complexity

| Case | Time |
|------|------|
| Best | O(n) with optimization |
| Average | O(n²) |
| Worst | O(n²) |

### 2. Properties

- **Stable**: Equal elements keep relative order
- **In-place**: O(1) extra space
- **Adaptive**: O(n) for nearly sorted data

### 3. Early Termination

Optimization: Stop if no swaps in a pass.

---

## Frameworks

### Framework 1: Standard Bubble Sort

```
┌─────────────────────────────────────────────────────────────┐
│  BUBBLE SORT                                                 │
├─────────────────────────────────────────────────────────────┤
│  1. For i from 0 to n-1:                                     │
│     a) swapped = False                                       │
│     b) For j from 0 to n-i-2:                               │
│        - If arr[j] > arr[j+1]:                               │
│            swap(arr[j], arr[j+1])                             │
│            swapped = True                                     │
│     c) If not swapped: break (already sorted)              │
│                                                              │
│  2. Return sorted array                                      │
└─────────────────────────────────────────────────────────────┘
```

---

## Forms

### Form 1: Standard Bubble Sort

Basic implementation.

| Aspect | Details |
|--------|---------|
| **Time** | O(n²) |
| **Space** | O(1) |
| **Stable** | Yes |

### Form 2: With Early Termination

Optimization to stop early if sorted.

| Aspect | Details |
|--------|---------|
| **Best Case** | O(n) |
| **Use** | Nearly sorted data |

---

## Tactics

### Tactic 1: Standard Bubble Sort

```python
def bubble_sort(nums):
    n = len(nums)
    for i in range(n):
        swapped = False
        for j in range(0, n - i - 1):
            if nums[j] > nums[j + 1]:
                nums[j], nums[j + 1] = nums[j + 1], nums[j]
                swapped = True
        if not swapped:
            break
    return nums
```

---

## Python Templates

### Template 1: Standard Bubble Sort

```python
def bubble_sort(nums):
    """
    Bubble sort with early termination.
    
    Time: O(n^2) average/worst, O(n) best
    Space: O(1)
    """
    n = len(nums)
    for i in range(n):
        swapped = False
        for j in range(0, n - i - 1):
            if nums[j] > nums[j + 1]:
                nums[j], nums[j + 1] = nums[j + 1], nums[j]
                swapped = True
        if not swapped:
            break
    return nums
```

---

## When to Use

Use Bubble Sort when:
- Educational purposes
- Nearly sorted data
- Small datasets
- Teaching sorting concepts

Do NOT use for:
- Large datasets
- Production code
- Performance-critical applications

---

## Summary

Bubble Sort:
- Simplest sorting algorithm
- O(n²) average/worst case
- O(n) best case with early termination
- Stable sort
- Good for educational purposes
- Not suitable for large datasets
