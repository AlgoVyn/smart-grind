## Greedy: Jump Game Reachability

**Question:** How do you determine if you can reach the end of an array with jumps?

<!-- front -->

---

## Answer: Track Maximum Reach

### Solution
```python
def canJump(nums):
    max_reach = 0
    
    for i, jump in enumerate(nums):
        # If current index is beyond max reach, can't continue
        if i > max_reach:
            return False
        max_reach = max(max_reach, i + jump)
    
    return True
```

### Jump Game II (Minimum Jumps)
```python
def jump(nums):
    if len(nums) <= 1:
        return 0
    
    jumps = 0
    current_end = 0
    max_reach = 0
    
    for i in range(len(nums) - 1):
        max_reach = max(max_reach, i + nums[i])
        
        # When we reach the end of current jump range
        if i == current_end:
            jumps += 1
            current_end = max_reach
    
    return jumps
```

### Visual: Maximum Reach
```
nums = [2, 3, 1, 1, 4]

Index:    0  1  2  3  4
Value:    2  3  1  1  4
Reach:    2  4  3  4  8

Step 1: i=0, max_reach=2
Step 2: i=1, max_reach=max(2,1+3)=4
Step 3: i=2, max_reach=max(4,2+1)=4
Step 4: i=3, max_reach=max(4,3+1)=4
Step 5: i=4, max_reach >= len-1 → True!
```

### Jump II Visual
```
nums = [2, 3, 1, 1, 4]

i=0: max_reach=2, current_end=0
     i==current_end: jumps=1, current_end=2
i=1: max_reach=4
i=2: max_reach=4
i=3: max_reach=4
     i==current_end: jumps=2, current_end=4

Result: 2 jumps (0→1→4)
```

### ⚠️ Tricky Parts

#### 1. When to Update Jumps
```python
# The key insight: when you reach the end of current "jump range"
# you must make a new jump

if i == current_end:
    jumps += 1
    current_end = max_reach
```

#### 2. Greedy Works Because
```python
# Always choose the jump that gets furthest
# This is optimal because:
# 1. More reach is always better
# 2. Making jump later never hurts

# Proof: Suppose optimal uses jump at position i
# Greedy also can reach position i (since we track max reach)
# Greedy's jump from i goes at least as far
```

#### 3. Edge Cases
```python
# Single element - already at end
if len(nums) <= 1:
    return 0

# Can't move from first position
if nums[0] == 0 and len(nums) > 1:
    return False  # Can't reach anywhere
```

### Comparison

| Problem | Return | Key Logic |
|---------|--------|-----------|
| Jump Game I | boolean | Can reach end? |
| Jump Game II | int | Minimum jumps |
| Can reach | boolean | Direct index check |

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Not tracking max_reach | Update at each step |
| Using BFS | Greedy is O(n) |
| Wrong current_end update | Update to max_reach |

### Time & Space Complexity

| Problem | Time | Space |
|---------|------|-------|
| Jump I | O(n) | O(1) |
| Jump II | O(n) | O(1) |

### Variation: Jump Game III
```python
def canReach(arr, start):
    n = len(arr)
    visited = set()
    stack = [start]
    
    while stack:
        i = stack.pop()
        
        if i < 0 or i >= n or i in visited:
            continue
        
        if arr[i] == 0:
            return True
        
        visited.add(i)
        stack.append(i + arr[i])
        stack.append(i - arr[i])
    
    return False
```

<!-- back -->
