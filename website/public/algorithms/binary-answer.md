# Binary Answer (Binary Search on Answer)

## Category
Binary Search & Optimization

## Description

Binary Answer is a technique where we binary search on the possible answer values rather than array indices. This is useful for optimization problems where we need to find the minimum or maximum value satisfying a condition. The key insight is that the search space is a range of possible answers, and we can use a monotonic predicate function to determine if a given value is feasible.

This pattern is commonly used for problems involving minimization, maximization, or feasibility checks where the predicate function is monotonic. Examples include finding minimum eating speed, ship capacity, or maximizing minimum distance between aggressive cows.

---

## Concepts

The binary answer technique relies on several fundamental concepts.

### 1. Monotonic Predicate

The feasibility function must be monotonic - if x works, then:
- All values > x also work (for minimization)
- All values < x also work (for maximization)

| Condition | Search Direction |
|-----------|------------------|
| If valid(x), then valid(x+1) | Find minimum valid |
| If valid(x), then valid(x-1) | Find maximum valid |

### 2. Search Range

Identify clear lower and upper bounds:
- Lower bound: minimum possible answer
- Upper bound: maximum possible answer

### 3. Feasibility Check

Write a function `is_valid(x)` that returns True if x is a feasible solution.

### 4. Binary Search Pattern

For finding minimum valid:
```python
if is_valid(mid):
    answer = mid
    right = mid - 1  # Try smaller
else:
    left = mid + 1   # Need larger
```

---

## Frameworks

### Framework 1: Find Minimum Valid

```
┌─────────────────────────────────────────────────────────────┐
│  BINARY SEARCH FOR MINIMUM VALID                             │
├─────────────────────────────────────────────────────────────┤
│  Input: search range [left, right], is_valid function      │
│  Output: minimum valid value                                 │
│                                                              │
│  1. answer = -1 (or invalid marker)                          │
│                                                              │
│  2. While left <= right:                                     │
│     a) mid = left + (right - left) // 2                    │
│     b) If is_valid(mid):                                     │
│          answer = mid                                        │
│          right = mid - 1  // Try to find smaller             │
│        Else:                                                  │
│          left = mid + 1    // Need larger value              │
│                                                              │
│  3. Return answer                                            │
└─────────────────────────────────────────────────────────────┘
```

### Framework 2: Find Maximum Valid

```
┌─────────────────────────────────────────────────────────────┐
│  BINARY SEARCH FOR MAXIMUM VALID                             │
├─────────────────────────────────────────────────────────────┤
│  Input: search range [left, right], is_valid function      │
│  Output: maximum valid value                                 │
│                                                              │
│  1. answer = -1                                              │
│                                                              │
│  2. While left <= right:                                     │
│     a) mid = left + (right - left) // 2                    │
│     b) If is_valid(mid):                                     │
│          answer = mid                                        │
│          left = mid + 1    // Try to find larger             │
│        Else:                                                  │
│          right = mid - 1   // Need smaller value             │
│                                                              │
│  3. Return answer                                            │
└─────────────────────────────────────────────────────────────┘
```

---

## Forms

### Form 1: Minimization Problems

Find minimum value that satisfies condition.

| Example | Problem |
|---------|---------|
| Minimum eating speed | Koko Eating Bananas |
| Minimum ship capacity | Capacity To Ship |
| Minimum valid value | General pattern |

### Form 2: Maximization Problems

Find maximum value that satisfies condition.

| Example | Problem |
|---------|---------|
| Maximum minimum distance | Aggressive Cows |
| Maximum valid value | General pattern |

### Form 3: Floating Point Binary Search

For continuous ranges requiring precision.

| Aspect | Details |
|--------|---------|
| **Termination** | while right - left > epsilon |
| **Precision** | Typically 1e-9 |
| **Use Case** | Geometric problems |

---

## Tactics

### Tactic 1: Binary Search Min Template

```python
def binary_search_min(left, right, is_valid):
    """
    Find minimum value in [left, right] that satisfies is_valid.
    Assumes: is_valid is False for small values, True for large values.
    """
    answer = -1
    
    while left <= right:
        mid = left + (right - left) // 2
        
        if is_valid(mid):
            answer = mid
            right = mid - 1  # Try to find smaller valid value
        else:
            left = mid + 1   # Need larger value
    
    return answer
```

### Tactic 2: Binary Search Max Template

```python
def binary_search_max(left, right, is_valid):
    """
    Find maximum value in [left, right] that satisfies is_valid.
    Assumes: is_valid is True for small values, False for large values.
    """
    answer = -1
    
    while left <= right:
        mid = left + (right - left) // 2
        
        if is_valid(mid):
            answer = mid
            left = mid + 1   # Try to find larger valid value
        else:
            right = mid - 1  # Need smaller value
    
    return answer
```

### Tactic 3: Koko Eating Bananas

```python
def min_eating_speed(piles, h):
    """
    Find minimum speed to eat all bananas in h hours.
    """
    def can_finish(speed):
        hours = sum((pile + speed - 1) // speed for pile in piles)
        return hours <= h
    
    left, right = 1, max(piles)
    return binary_search_min(left, right, can_finish)
```

### Tactic 4: Ship Within Days

```python
def ship_within_days(weights, days):
    """
    Find minimum capacity to ship all packages within days.
    """
    def can_ship(capacity):
        current, required = 0, 1
        for w in weights:
            if current + w <= capacity:
                current += w
            else:
                required += 1
                current = w
                if required > days:
                    return False
        return True
    
    left, right = max(weights), sum(weights)
    return binary_search_min(left, right, can_ship)
```

---

## Python Templates

### Template 1: Find Minimum Valid

```python
def binary_search_min(left, right, is_valid):
    """
    Find minimum value in [left, right] that satisfies is_valid.
    
    Time: O(log(right - left)) * cost_of_is_valid
    """
    answer = -1
    
    while left <= right:
        mid = left + (right - left) // 2
        
        if is_valid(mid):
            answer = mid
            right = mid - 1  # Try to find smaller valid value
        else:
            left = mid + 1   # Need larger value
    
    return answer
```

### Template 2: Find Maximum Valid

```python
def binary_search_max(left, right, is_valid):
    """
    Find maximum value in [left, right] that satisfies is_valid.
    
    Time: O(log(right - left)) * cost_of_is_valid
    """
    answer = -1
    
    while left <= right:
        mid = left + (right - left) // 2
        
        if is_valid(mid):
            answer = mid
            left = mid + 1   # Try to find larger valid value
        else:
            right = mid - 1  # Need smaller value
    
    return answer
```

### Template 3: Koko Eating Bananas (LeetCode 875)

```python
def min_eating_speed(piles, h):
    """
    LeetCode 875: Koko Eating Bananas.
    Find minimum speed to eat all bananas in h hours.
    
    Time: O(n log(max(piles)))
    Space: O(1)
    """
    def can_finish(speed):
        """Check if Koko can finish at given speed."""
        hours = 0
        for pile in piles:
            hours += (pile + speed - 1) // speed  # Ceiling division
        return hours <= h
    
    left, right = 1, max(piles)
    answer = right
    
    while left <= right:
        mid = left + (right - left) // 2
        if can_finish(mid):
            answer = mid
            right = mid - 1
        else:
            left = mid + 1
    
    return answer
```

### Template 4: Capacity To Ship Packages (LeetCode 1011)

```python
def ship_within_days(weights, days):
    """
    LeetCode 1011: Capacity To Ship Packages Within D Days.
    
    Time: O(n log(sum(weights)))
    Space: O(1)
    """
    def can_ship(capacity):
        """Check if we can ship within days at given capacity."""
        current_load = 0
        required_days = 1
        
        for weight in weights:
            if current_load + weight <= capacity:
                current_load += weight
            else:
                required_days += 1
                current_load = weight
                if required_days > days:
                    return False
        return True
    
    left, right = max(weights), sum(weights)
    answer = right
    
    while left <= right:
        mid = left + (right - left) // 2
        if can_ship(mid):
            answer = mid
            right = mid - 1
        else:
            left = mid + 1
    
    return answer
```

### Template 5: Aggressive Cows (Maximize Minimum Distance)

```python
def aggressive_cows(stalls, cows):
    """
    Place cows in stalls to maximize minimum distance between any two.
    Classic maximization binary search problem.
    """
    stalls.sort()
    
    def can_place(min_dist):
        """Check if we can place all cows with at least min_dist apart."""
        count = 1
        last_pos = stalls[0]
        
        for i in range(1, len(stalls)):
            if stalls[i] - last_pos >= min_dist:
                count += 1
                last_pos = stalls[i]
                if count >= cows:
                    return True
        return False
    
    left, right = 1, stalls[-1] - stalls[0]
    answer = 0
    
    while left <= right:
        mid = left + (right - left) // 2
        if can_place(mid):
            answer = mid
            left = mid + 1
        else:
            right = mid - 1
    
    return answer
```

---

## When to Use

Use Binary Answer when:
- Minimization or maximization problem
- Can write is_valid() feasibility check
- Monotonic predicate property holds
- Search space can be bounded

| Use Case | Example |
|----------|---------|
| Minimize speed | Koko Eating Bananas |
| Minimize capacity | Ship Within Days |
| Maximize distance | Aggressive Cows |
| Find threshold | Split Array |

---

## Algorithm Explanation

### Core Concept

Binary search on answer values instead of array indices. The key is defining a proper is_valid() function that checks feasibility.

### How It Works

1. Define search range [low, high]
2. Write is_valid(x) function
3. Binary search:
   - If is_valid(mid): answer = mid, search better half
   - Else: search other half
4. Return best answer found

### Why It Works

The monotonic property ensures that valid values form a contiguous range, allowing binary search to find the boundary efficiently.

---

## Practice Problems

### Problem 1: Koko Eating Bananas
**Problem:** [LeetCode 875](https://leetcode.com/problems/koko-eating-bananas/)

### Problem 2: Capacity To Ship Packages
**Problem:** [LeetCode 1011](https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/)

### Problem 3: Split Array Largest Sum
**Problem:** [LeetCode 410](https://leetcode.com/problems/split-array-largest-sum/)

---

## Follow-up Questions

### Q1: How to identify binary search on answer problems?
**Answer:** Look for minimization/maximization with a feasibility condition that can be checked in O(n) or O(n log n).

### Q2: What if the predicate is not monotonic?
**Answer:** Binary search won't work. Consider other approaches like DP or greedy.

### Q3: How to handle floating point answers?
**Answer:** Use while right - left > epsilon, or run fixed number of iterations.

---

## Summary

Binary Answer:
- Binary search on answer values, not indices
- Requires monotonic predicate function
- Common for minimization/maximization problems
- Combine with feasibility check
- O(log(range)) iterations, each O(n) or better
