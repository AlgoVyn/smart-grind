# Count Inversions

## Category
Sorting & Divide and Conquer

## Description

An inversion is a pair of indices (i, j) such that i < j and arr[i] > arr[j]. Counting inversions measures how out of order an array is. This is done efficiently using a modified merge sort in O(n log n) time.

---

## Concepts

### 1. Modified Merge Sort

Count inversions during the merge step:
- When element from right half comes before left
- Count remaining left elements as inversions

### 2. Types of Inversions

| Type | Definition |
|------|------------|
| Global | Any i < j with arr[i] > arr[j] |
| Local | i < i+1 with arr[i] > arr[i+1] |

### 3. Alternative: Fenwick Tree

Use coordinate compression and BIT for online queries.

---

## Frameworks

### Framework 1: Merge Sort Count

```
┌─────────────────────────────────────────────────────────────┐
│  COUNT INVERSIONS - MERGE SORT                               │
├─────────────────────────────────────────────────────────────┤
│  1. sort_and_count(arr):                                     │
│     If len(arr) <= 1: return arr, 0                         │
│                                                              │
│     mid = len(arr) // 2                                      │
│     left, left_count = sort_and_count(arr[:mid])            │
│     right, right_count = sort_and_count(arr[mid:])           │
│     merged, split_count = merge_and_count(left, right)       │
│                                                              │
│     Return merged, left_count + right_count + split_count   │
│                                                              │
│  2. merge_and_count(left, right):                          │
│     While both arrays have elements:                         │
│       If left[i] <= right[j]:                                │
│         Add left[i] to result                                │
│       Else:                                                   │
│         Add right[j] to result                               │
│         count += len(left) - i  // Inversions!              │
└─────────────────────────────────────────────────────────────┘
```

---

## Forms

### Form 1: Merge Sort Count

O(n log n) divide and conquer approach.

| Aspect | Details |
|--------|---------|
| **Time** | O(n log n) |
| **Space** | O(n) auxiliary |
| **Method** | Modified merge sort |

### Form 2: Fenwick Tree

For online queries or multiple updates.

| Aspect | Details |
|--------|---------|
| **Time** | O(n log n) |
| **Space** | O(n) |
| **Method** | Coordinate compression + BIT |

---

## Tactics

### Tactic 1: Merge Sort Count

```python
def count_inversions(nums):
    def sort_and_count(arr):
        if len(arr) <= 1:
            return arr, 0
        
        mid = len(arr) // 2
        left, left_count = sort_and_count(arr[:mid])
        right, right_count = sort_and_count(arr[mid:])
        merged, split_count = merge_and_count(left, right)
        
        return merged, left_count + right_count + split_count
    
    def merge_and_count(left, right):
        result = []
        count = 0
        i = j = 0
        
        while i < len(left) and j < len(right):
            if left[i] <= right[j]:
                result.append(left[i])
                i += 1
            else:
                result.append(right[j])
                count += len(left) - i
                j += 1
        
        result.extend(left[i:])
        result.extend(right[j:])
        return result, count
    
    _, total = sort_and_count(nums)
    return total
```

---

## Python Templates

### Template 1: Merge Sort Count

```python
def count_inversions(nums):
    """
    Count inversions using modified merge sort.
    
    Time: O(n log n)
    Space: O(n)
    """
    def sort_and_count(arr):
        if len(arr) <= 1:
            return arr, 0
        
        mid = len(arr) // 2
        left, left_count = sort_and_count(arr[:mid])
        right, right_count = sort_and_count(arr[mid:])
        merged, split_count = merge_and_count(left, right)
        
        return merged, left_count + right_count + split_count
    
    def merge_and_count(left, right):
        result = []
        count = 0
        i = j = 0
        
        while i < len(left) and j < len(right):
            if left[i] <= right[j]:
                result.append(left[i])
                i += 1
            else:
                result.append(right[j])
                count += len(left) - i
                j += 1
        
        result.extend(left[i:])
        result.extend(right[j:])
        return result, count
    
    _, total = sort_and_count(nums)
    return total
```

---

## Practice Problems

### Problem 1: Global and Local Inversions
**Problem:** [LeetCode 775](https://leetcode.com/problems/global-and-local-inversions/)

### Problem 2: Reverse Pairs
**Problem:** [LeetCode 493](https://leetcode.com/problems/reverse-pairs/)

---

## Summary

Count inversions:
- O(n log n) using modified merge sort
- Count when right element precedes left during merge
- Fenwick tree alternative for online queries
- Measure of array sortedness
