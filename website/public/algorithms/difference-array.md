# Difference Array (Range Update Technique)

## Category
Arrays & Range Operations

## Description

The Difference Array pattern solves range update problems efficiently. Instead of updating each element in a range individually (O(n) per update), we use a difference array to achieve O(1) per update and O(n) for final reconstruction.

---

## Concepts

### 1. Range Addition

For update [l, r, val]:
- diff[l] += val
- diff[r+1] -= val

### 2. Prefix Sum Reconstruction

Take prefix sum of diff to get final array.

### 3. Complexity

| Operation | Complexity |
|-----------|------------|
| Range Update | O(1) |
| Final Array | O(n) |
| Total | O(n + q) |

---

## Frameworks

### Framework 1: Range Addition

```
┌─────────────────────────────────────────────────────────────┐
│  DIFFERENCE ARRAY - RANGE ADDITION                           │
├─────────────────────────────────────────────────────────────┤
│  1. Initialize diff array of size n+1                         │
│                                                              │
│  2. For each update [l, r, val]:                            │
│     diff[l] += val                                           │
│     If r+1 < n: diff[r+1] -= val                           │
│                                                              │
│  3. Build result:                                            │
│     current = 0                                              │
│     For i from 0 to n-1:                                     │
│       current += diff[i]                                     │
│       result[i] = current                                    │
└─────────────────────────────────────────────────────────────┘
```

---

## Forms

### Form 1: Range Addition

Add value to all elements in range.

| Aspect | Details |
|--------|---------|
| **Update** | O(1) |
| **Query** | O(n) for all |
| **Space** | O(n) |

### Form 2: Car Pooling

Check if capacity exceeded.

| Aspect | Details |
|--------|---------|
| **Use** | Interval overlap |
| **Check** | Max concurrent |

---

## Tactics

### Tactic 1: Range Addition

```python
def get_modified_array(length, updates):
    diff = [0] * (length + 1)
    
    for start, end, inc in updates:
        diff[start] += inc
        if end + 1 < length:
            diff[end + 1] -= inc
    
    result = []
    current = 0
    for i in range(length):
        current += diff[i]
        result.append(current)
    
    return result
```

### Tactic 2: Car Pooling

```python
def car_pooling(trips, capacity):
    diff = [0] * 1001
    
    for passengers, start, end in trips:
        diff[start] += passengers
        diff[end] -= passengers
    
    current = 0
    for i in range(1001):
        current += diff[i]
        if current > capacity:
            return False
    
    return True
```

---

## Python Templates

### Template 1: Range Addition

```python
def get_modified_array(length, updates):
    """
    Apply range updates using difference array.
    
    Time: O(n + q)
    Space: O(n)
    """
    diff = [0] * (length + 1)
    
    for start, end, inc in updates:
        diff[start] += inc
        if end + 1 < length:
            diff[end + 1] -= inc
    
    result = []
    current = 0
    for i in range(length):
        current += diff[i]
        result.append(current)
    
    return result
```

---

## Practice Problems

### Problem 1: Range Addition
**Problem:** [LeetCode 370](https://leetcode.com/problems/range-addition/)

### Problem 2: Car Pooling
**Problem:** [LeetCode 1094](https://leetcode.com/problems/car-pooling/)

### Problem 3: Corporate Flight Bookings
**Problem:** [LeetCode 1109](https://leetcode.com/problems/corporate-flight-bookings/)

---

## Summary

Difference array:
- O(1) range updates
- O(n) final reconstruction
- Mark boundaries only
- Best for many updates, few queries
- Can extend to 2D
