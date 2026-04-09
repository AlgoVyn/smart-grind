## Greedy - Jump Game Reachability/Minimization: Tactics

What are the key tactical moves and edge case handling for Jump Game solutions?

<!-- front -->

---

### Tactic 1: Early Termination

**For Jump Game I (Reachability):**

```python
def can_jump(nums):
    farthest = 0
    n = len(nums)
    
    for i in range(n):
        if i > farthest:
            return False
        
        farthest = max(farthest, i + nums[i])
        
        # Early termination: can already reach end
        if farthest >= n - 1:
            return True  # Exit early!
    
    return True
```

**Benefit:** Avoid unnecessary iterations when answer is already known.

---

### Tactic 2: Loop Bound Handling

**Critical for Jump Game II:**

```python
def jump(nums):
    n = len(nums)
    if n <= 1:
        return 0  # Edge case: already at end
    
    jumps = 0
    current_end = 0
    farthest = 0
    
    # Loop to n-2, NOT n-1!
    for i in range(n - 1):
        farthest = max(farthest, i + nums[i])
        
        if i == current_end:
            jumps += 1
            current_end = farthest
    
    return jumps
```

**Why n-2?** No need to jump FROM the last index - we're already there!

---

### Tactic 3: Detecting Impossibility

**Jump Game I unreachable check:**

```
Position:  0    1    2    3
nums:     [1,   1,   0,   0]

i=0: farthest = max(0, 0+1) = 1
i=1: farthest = max(1, 1+1) = 2
i=2: farthest = max(2, 2+0) = 2
i=3: 3 > farthest(2) → RETURN FALSE
```

**Pattern:** When current index exceeds farthest, we're stuck.

---

### Tactic 4: Single Element Edge Case

```python
def jump(nums):
    n = len(nums)
    if n <= 1:
        return 0  # Already at destination
    # ... rest of algorithm

def can_jump(nums):
    if len(nums) <= 1:
        return True  # Trivially reachable
    # ... rest of algorithm
```

---

### Tactic 5: Concise One-Liner Pattern

```python
# Jump Game I - Concise version
def can_jump_concise(nums):
    farthest = 0
    for i, jump in enumerate(nums):
        if i > farthest:
            return False
        farthest = max(farthest, i + jump)
    return True

# Jump Game II - Alternative with early return
def jump_alternative(nums):
    n = len(nums)
    if n <= 1:
        return 0
    
    jumps, current_end, farthest = 0, 0, 0
    
    for i in range(n):
        farthest = max(farthest, i + nums[i])
        
        if farthest >= n - 1:
            return jumps + 1  # One more jump needed
        
        if i == current_end:
            jumps += 1
            current_end = farthest
    
    return jumps
```

---

### Common Pitfall Prevention

| Pitfall | Prevention |
|---------|------------|
| Off-by-one loop bounds | Use `range(n-1)` for min jumps |
| Not handling single element | Add `if n <= 1: return 0` check |
| Forgetting max() in update | Always `max(farthest, i + nums[i])` |
| Not updating current_end | Set to farthest when `i == current_end` |
| Using DP unnecessarily | Greedy is optimal at O(n) |

<!-- back -->
