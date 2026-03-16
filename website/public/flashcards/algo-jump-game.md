## Jump Game

**Question:** Can you reach the last index?

<!-- front -->

---

## Answer: Greedy

### Solution: Can Reach (I)
```python
def canJump(nums):
    max_reach = 0
    
    for i, jump in enumerate(nums):
        if i > max_reach:
            return False
        max_reach = max(max_reach, i + jump)
    
    return True
```

### Solution: Minimum Jumps (II)
```python
def jump(nums):
    if len(nums) <= 1:
        return 0
    
    jumps = 0
    current_end = 0
    max_reach = 0
    
    for i in range(len(nums) - 1):
        max_reach = max(max_reach, i + nums[i])
        
        if i == current_end:
            jumps += 1
            current_end = max_reach
    
    return jumps
```

### Visual: Greedy Logic
```
nums = [2, 3, 1, 1, 4]

Jump Game I:
i=0: max=2
i=1: max=4 (1+3)
i=2: max=4 (2+1), i<=max ✓
i=3: max=4 (3+1), i<=max ✓
i=4: max=4 (4+0), end ✓

Return True

Jump Game II:
i=0: current=0, max=2, jumps=1, end=2
i=1: max=4, current_end=2 (not reached)
i=2: current=2, max=4, jumps=2, end=4

Return 2
```

### ⚠️ Tricky Parts

#### 1. Jump Game I - Only Need to Check
```python
# Don't need to track exact path
# Just check if we can ever reach current position

# If i > max_reach → can't reach position i
# Return False
```

#### 2. Jump Game II - When to Increment
```python
# Increment jump when we REACH current_end
# This is the furthest we can go with current jumps

# Alternative interpretation:
# When i == current_end, we need new jump
# to go beyond current range
```

### Time & Space Complexity

| Problem | Time | Space |
|---------|------|-------|
| Jump I | O(n) | O(1) |
| Jump II | O(n) | O(1) |

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Using BFS | Greedy works |
| Wrong boundary | i > max_reach |
| Not checking end | For II, go to n-1 |

<!-- back -->
