## House Robber - Circular Houses

**Question:** How do you handle the circular dependency?

<!-- front -->

---

## House Robber: Circular Version

### The Problem
First and last houses are adjacent - cannot rob both.

### Solution: Two Cases
```python
def rob_circle(nums):
    n = len(nums)
    if n == 1:
        return nums[0]
    
    # Case 1: Exclude last house
    def rob_linear(houses):
        prev, curr = 0, 0
        for amount in houses:
            prev, curr = curr, max(curr, prev + amount)
        return curr
    
    return max(
        rob_linear(nums[:-1]),  # Exclude last
        rob_linear(nums[1:])    # Exclude first
    )
```

### Why Two Cases?
```
Houses: [1, 2, 3, 1]

Option 1: Skip last (house 1)
  → Can rob: 1, 3 = 4 ✓
  
Option 2: Skip first (house 1)
  → Can rob: 2, 1 = 3 ✓

Answer = max(4, 3) = 4
```

### Base Case
```python
if n == 0: return 0
if n == 1: return nums[0]
```

### Complexity: O(n) time, O(1) space

<!-- back -->
