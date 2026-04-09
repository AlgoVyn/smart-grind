## Greedy - Jump Game Reachability/Minimization: Framework

What is the complete algorithm framework for Jump Game reachability and minimum jumps?

<!-- front -->

---

### Framework: Jump Game I (Can Reach)

```
┌─────────────────────────────────────────────────────┐
│  JUMP GAME I - REACHABILITY FRAMEWORK                 │
├─────────────────────────────────────────────────────┤
│  1. Initialize farthest = 0                           │
│  2. For i from 0 to n-1:                              │
│     a. If i > farthest:                              │
│        - Return False (cannot reach this index)      │
│     b. Update farthest = max(farthest, i + nums[i])   │
│     c. If farthest >= n-1:                           │
│        - Return True (can reach end)                │
│  3. Return True (reached end)                         │
└─────────────────────────────────────────────────────┘
```

---

### Framework: Jump Game II (Minimum Jumps)

```
┌─────────────────────────────────────────────────────┐
│  JUMP GAME II - MINIMIZATION FRAMEWORK                │
├─────────────────────────────────────────────────────┤
│  1. If n <= 1: return 0                               │
│  2. Initialize:                                      │
│     - jumps = 0                                      │
│     - current_end = 0  (end of current jump range)   │
│     - farthest = 0     (farthest reachable)          │
│  3. For i from 0 to n-2:                             │
│     a. Update farthest = max(farthest, i + nums[i])   │
│     b. If i == current_end:                          │
│        - jumps += 1                                  │
│        - current_end = farthest                      │
│        - If current_end >= n-1: break                 │
│  4. Return jumps                                      │
└─────────────────────────────────────────────────────┘
```

---

### Implementation: Jump Game I (Python)

```python
def can_jump(nums: list[int]) -> bool:
    """Check if you can reach the last index."""
    farthest = 0
    n = len(nums)
    
    for i in range(n):
        if i > farthest:
            return False
        
        farthest = max(farthest, i + nums[i])
        
        if farthest >= n - 1:
            return True
    
    return True
```

---

### Implementation: Jump Game II (Python)

```python
def jump(nums: list[int]) -> int:
    """Find minimum jumps to reach the last index."""
    n = len(nums)
    if n <= 1:
        return 0
    
    jumps = 0
    current_end = 0
    farthest = 0
    
    for i in range(n - 1):
        farthest = max(farthest, i + nums[i])
        
        if i == current_end:
            jumps += 1
            current_end = farthest
            
            if current_end >= n - 1:
                break
    
    return jumps
```

---

### Key Variables Reference

| Variable | Purpose | Update Rule |
|----------|---------|-------------|
| `farthest` | Maximum index reachable | `max(farthest, i + nums[i])` |
| `current_end` | Boundary of current jump range | Set to `farthest` when reached |
| `i > farthest` | Detect unreachable position | Return `False` immediately |
| `jumps` | Count of jumps made | Increment when `i == current_end` |

<!-- back -->
