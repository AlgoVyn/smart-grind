## Binary Search on Answer: Tactics

What are specific techniques for solving binary search on answer problems?

<!-- front -->

---

### Tactic 1: Overflow-Safe Midpoint Calculation

Always use safe midpoint calculation to prevent integer overflow:

```python
# Safe (use this)
mid = low + (high - low) // 2       # Lower mid for minimization
mid = low + (high - low + 1) // 2   # Upper mid for maximization

# Unsafe (can overflow in some languages)
mid = (low + high) // 2
```

**Why it matters:** In C++/Java with large values, `low + high` can overflow.

---

### Tactic 2: Upper Mid for Maximization

Use upper mid calculation in maximization to avoid infinite loops:

```python
# Maximization - Use upper mid!
while low < high:
    mid = (low + high + 1) // 2  # Upper mid
    if condition(mid):
        low = mid       # Move low up
    else:
        high = mid - 1  # Move high down

# Why upper mid?
# If low = 5, high = 6:
#   Lower mid = (5 + 6) // 2 = 5
#   If condition(5) is True: low = 5 (infinite loop!)
#   Upper mid = (5 + 6 + 1) // 2 = 6
#   If condition(6) is True: low = 6, loop ends
```

---

### Tactic 3: Floating Point Precision Search

For problems requiring floating point precision:

```python
def binary_search_float(nums, k, precision=1e-6):
    """
    Binary search with floating point precision.
    Time: O(n * log(S/precision))
    """
    def condition(mid):
        """Check feasibility."""
        count = 1
        current_sum = 0.0
        
        for num in nums:
            current_sum += num
            if current_sum > mid:
                count += 1
                current_sum = num
                if count > k:
                    return False
        
        return True
    
    low = max(nums)
    high = sum(nums)
    
    # Search until precision reached
    while high - low > precision:
        mid = (low + high) / 2
        if condition(mid):
            high = mid
        else:
            low = mid
    
    return high  # or low, they're very close
```

---

### Tactic 4: Greedy Feasibility Check

Most condition functions use greedy strategy:

```python
def condition(capacity):
    """
    Greedy: Pack as much as possible each day.
    LeetCode 1011: Capacity to Ship Packages
    """
    days = 1
    current_load = 0
    
    for weight in weights:
        if current_load + weight > capacity:
            days += 1           # Need new day
            current_load = 0    # Reset
        current_load += weight
    
    return days <= D  # Feasible if within D days
```

**Greedy works because:** We want to minimize resource usage (days, groups, etc.)

---

### Tactic 5: Boundary Setting for Different Problems

| Problem | low | high | Condition Check |
|---------|-----|------|-----------------|
| Split Array Largest Sum | `max(nums)` | `sum(nums)` | Can split into m subarrays? |
| Koko Eating Bananas | `1` | `max(piles)` | Can eat all in H hours? |
| Capacity to Ship | `max(weights)` | `sum(weights)` | Can ship in D days? |
| Magnetic Force | `1` | `max(position)` | Can place cows with min distance? |
| Smallest Divisor | `1` | `max(nums)` | Sum of divisions <= threshold? |

---

### Tactic 6: Debugging the Condition Function

Always test condition function independently:

```python
# Test your condition function first!
def test_condition():
    nums = [7, 2, 5, 10, 8]
    k = 2
    
    # Test known values
    assert condition(18) == True   # Can split with max sum 18
    assert condition(14) == False  # Cannot split with max sum 14
    
    print("Condition function tests passed!")

# Run tests before full binary search
test_condition()
```

---

### Tactic 7: Tracking Actual Split Points

To find where splits occur (not just the value):

```python
def find_split_points(nums, target_sum):
    """Find actual split indices after binary search."""
    splits = []
    current_sum = 0
    start = 0
    
    for i, num in enumerate(nums):
        if current_sum + num > target_sum:
            splits.append((start, i - 1))  # Record split
            start = i
            current_sum = num
        else:
            current_sum += num
    
    splits.append((start, len(nums) - 1))
    return splits
```

<!-- back -->
