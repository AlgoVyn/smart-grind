## Binary Search on Answer: Framework

What is the complete code template for binary search on answer problems?

<!-- front -->

---

### Framework: Binary Search on Answer (Minimization)

```
┌─────────────────────────────────────────────────────────┐
│  BINARY SEARCH ON ANSWER - MINIMIZATION TEMPLATE         │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  1. Define condition(mid) function:                    │
│     - Returns True if mid is feasible                    │
│     - Returns False otherwise                            │
│                                                          │
│  2. Set search bounds:                                   │
│     - low = minimum possible answer                      │
│     - high = maximum possible answer                     │
│                                                          │
│  3. Binary search loop:                                  │
│     while low < high:                                    │
│         mid = (low + high) // 2                          │
│         if condition(mid):                               │
│             high = mid    # Try smaller                  │
│         else:                                            │
│             low = mid + 1  # Need larger                 │
│                                                          │
│  4. Return low  # Smallest feasible value                │
└─────────────────────────────────────────────────────────┘
```

---

### Implementation: Minimization

```python
def binary_search_minimize(nums, k):
    """
    Find minimum feasible answer.
    Example: Split Array Largest Sum (LeetCode 410)
    Time: O(n * log(S)), Space: O(1)
    """
    def condition(mid):
        """Check if mid is a feasible answer."""
        count = 1
        current_sum = 0
        
        for num in nums:
            current_sum += num
            if current_sum > mid:
                count += 1
                current_sum = num
                if count > k:
                    return False
        
        return True
    
    # Define search bounds
    low = max(nums)   # Minimum possible answer
    high = sum(nums)  # Maximum possible answer
    
    # Binary search
    while low < high:
        mid = (low + high) // 2
        if condition(mid):
            high = mid
        else:
            low = mid + 1
    
    return low
```

---

### Framework: Binary Search on Answer (Maximization)

```
┌─────────────────────────────────────────────────────────┐
│  BINARY SEARCH ON ANSWER - MAXIMIZATION TEMPLATE         │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Key difference: Use UPPER mid to avoid infinite loop    │
│                                                          │
│  1. Define condition(mid) function                       │
│                                                          │
│  2. Set search bounds:                                   │
│     - low = minimum possible answer                      │
│     - high = maximum possible answer                     │
│                                                          │
│  3. Binary search loop:                                  │
│     while low < high:                                    │
│         mid = (low + high + 1) // 2   # Upper mid!       │
│         if condition(mid):                               │
│             low = mid      # Try larger                  │
│         else:                                            │
│             high = mid - 1  # Need smaller               │
│                                                          │
│  4. Return low  # Largest feasible value                 │
└─────────────────────────────────────────────────────────┘
```

---

### Implementation: Maximization

```python
def binary_search_maximize(nums, k):
    """
    Find maximum feasible answer.
    Time: O(n * log(S)), Space: O(1)
    """
    def condition(mid):
        """Check if mid is a feasible answer."""
        # Implementation depends on problem
        # Return True if mid is feasible
        pass
    
    low = 0
    high = max(nums)
    
    while low < high:
        mid = (low + high + 1) // 2  # Upper mid!
        if condition(mid):
            low = mid
        else:
            high = mid - 1
    
    return low
```

---

### Key Framework Elements

| Element | Purpose | Minimization | Maximization |
|---------|---------|--------------|--------------|
| `condition(mid)` | Feasibility check | Returns True if feasible | Returns True if feasible |
| `low` | Lower bound | `max(nums)` or min value | 0 or min value |
| `high` | Upper bound | `sum(nums)` or max value | `max(nums)` or max value |
| `mid` calculation | Avoid infinite loop | `(low + high) // 2` | `(low + high + 1) // 2` |
| Update when True | Shrink search space | `high = mid` | `low = mid` |
| Update when False | Expand search space | `low = mid + 1` | `high = mid - 1` |
| Return value | Optimal answer | `low` (smallest feasible) | `low` (largest feasible) |

<!-- back -->
