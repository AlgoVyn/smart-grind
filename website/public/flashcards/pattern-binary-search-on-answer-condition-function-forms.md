## Binary Search on Answer: Forms

What are the different variations of binary search on answer?

<!-- front -->

---

### Form 1: Minimization (Lower Bound)

Find the smallest value that satisfies the condition.

```python
def minimize_answer(nums, constraint):
    """
    Find minimum feasible answer.
    Pattern: high = mid when condition is True
    """
    def condition(mid):
        """Returns True if mid is feasible."""
        # Greedy check - problem dependent
        usage = 1
        current = 0
        for num in nums:
            if current + num > mid:
                usage += 1
                current = num
                if usage > constraint:
                    return False
            else:
                current += num
        return True
    
    low = max(nums)   # Minimum possible
    high = sum(nums)  # Maximum possible
    
    while low < high:
        mid = (low + high) // 2
        if condition(mid):
            high = mid      # Can go lower
        else:
            low = mid + 1   # Need to go higher
    
    return low

# Examples: Split Array Largest Sum, Capacity to Ship, Koko Eating
```

---

### Form 2: Maximization (Upper Bound)

Find the largest value that satisfies the condition.

```python
def maximize_answer(nums, constraint):
    """
    Find maximum feasible answer.
    Pattern: Use UPPER mid, low = mid when condition is True
    """
    def condition(mid):
        """Returns True if mid is feasible."""
        # Problem dependent check
        # Example: Can place all cows with at least 'mid' distance?
        count = 1
        last_pos = nums[0]
        
        for pos in nums[1:]:
            if pos - last_pos >= mid:
                count += 1
                last_pos = pos
                if count >= constraint:
                    return True
        
        return False
    
    low = 0           # Minimum possible
    high = max(nums)  # Maximum possible
    
    while low < high:
        mid = (low + high + 1) // 2  # Upper mid!
        if condition(mid):
            low = mid       # Can go higher
        else:
            high = mid - 1  # Need to go lower
    
    return low

# Examples: Aggressive Cows, Magnetic Force Between Balls
```

---

### Form 3: Floating Point Precision

Find answer with floating point precision requirement.

```python
def floating_point_answer(nums, constraint, precision=1e-6):
    """
    Find answer with floating point precision.
    Pattern: Loop while high - low > epsilon
    """
    def condition(mid):
        """Returns True if mid is feasible."""
        # Sum calculation with floating point
        total = 0.0
        for num in nums:
            total += num / mid  # or similar operation
            if total > constraint:
                return False
        return True
    
    low = 0.0
    high = max(nums)
    
    # Search until precision reached
    while high - low > precision:
        mid = (low + high) / 2.0
        if condition(mid):
            high = mid
        else:
            low = mid
    
    return high  # or (low + high) / 2

# Examples: Koko Eating Bananas (fractional), Gas Station optimization
```

---

### Form 4: Multi-Constraint Check

Condition function checks multiple constraints.

```python
def multi_constraint_answer(nums, max_ops, max_groups):
    """
    Binary search with complex condition checking multiple constraints.
    """
    def condition(mid):
        """Returns True if mid satisfies ALL constraints."""
        groups = 1
        ops = 0
        current = 0
        
        for num in nums:
            if current + num > mid:
                # Check operations needed to reduce
                needed_ops = calculate_ops(num, mid)
                if ops + needed_ops > max_ops:
                    groups += 1
                    ops = 0
                    current = num
                    if groups > max_groups:
                        return False
                else:
                    ops += needed_ops
                    current = 0  # Start fresh
            else:
                current += num
        
        return True
    
    low = max(nums)
    high = sum(nums)
    
    while low < high:
        mid = (low + high) // 2
        if condition(mid):
            high = mid
        else:
            low = mid + 1
    
    return low
```

---

### Form 5: Count-Based Binary Search

Binary search on count/number of elements.

```python
def count_based_answer(arr, k):
    """
    Binary search on count of elements satisfying property.
    """
    arr.sort()
    
    def condition(count):
        """
        Returns True if we can select 'count' elements
        satisfying some property.
        """
        # Example: Can we select 'count' elements with
        # min difference >= some value?
        selected = 1
        last = arr[0]
        
        for i in range(1, len(arr)):
            if arr[i] - last >= count:  # 'count' is the gap here
                selected += 1
                last = arr[i]
                if selected >= k:
                    return True
        
        return False
    
    low = 1
    high = len(arr)
    
    while low < high:
        mid = (low + high + 1) // 2
        if condition(mid):
            low = mid
        else:
            high = mid - 1
    
    return low
```

---

### Form Comparison

| Form | Search Space | Mid Calculation | Update Pattern | Return Value |
|------|--------------|-----------------|----------------|--------------|
| **Minimization** | [min, max] | `(low + high) // 2` | `high = mid` / `low = mid + 1` | `low` (smallest feasible) |
| **Maximization** | [min, max] | `(low + high + 1) // 2` | `low = mid` / `high = mid - 1` | `low` (largest feasible) |
| **Floating Point** | [0.0, max] | `(low + high) / 2` | `high = mid` / `low = mid` | `high` or average |
| **Multi-Constraint** | [min, max] | Standard | Standard | `low` |
| **Count-Based** | [1, n] | Upper/lower mid | Depends on problem | `low` |

---

### Pattern Quick Reference

```python
# Minimization Template
while low < high:
    mid = (low + high) // 2
    if condition(mid):   high = mid
    else:                low = mid + 1
return low

# Maximization Template  
while low < high:
    mid = (low + high + 1) // 2  # Upper mid!
    if condition(mid):   low = mid
    else:                high = mid - 1
return low

# Floating Point Template
while high - low > epsilon:
    mid = (low + high) / 2
    if condition(mid):   high = mid
    else:                low = mid
return high
```

<!-- back -->
