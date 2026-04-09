## Greedy - Jump Game: Framework

What is the complete code template for Jump Game greedy solutions?

<!-- front -->

---

### Framework 1: Jump Game I (Can Reach)

```
┌─────────────────────────────────────────────────────┐
│  JUMP GAME I - GREEDY TEMPLATE                        │
├─────────────────────────────────────────────────────┤
│  1. Initialize max_reach = 0                          │
│  2. For i from 0 to n-1:                            │
│     a. If i > max_reach:                           │
│        - Return False (cannot reach this index)     │
│     b. Update max_reach = max(max_reach, i + nums[i])│
│     c. If max_reach >= n-1:                        │
│        - Return True (can reach end)               │
│  3. Return True (reached end)                       │
└─────────────────────────────────────────────────────┘
```

---

### Implementation: Jump Game I

```python
def can_jump(nums):
    """Return True if can reach last index."""
    max_reach = 0
    n = len(nums)
    
    for i in range(n):
        # Can't reach current position
        if i > max_reach:
            return False
        
        # Update farthest reachable
        max_reach = max(max_reach, i + nums[i])
        
        # Can already reach end
        if max_reach >= n - 1:
            return True
    
    return True
```

---

### Implementation: Jump Game II (Min Jumps)

```python
def jump(nums):
    """Return minimum number of jumps to reach last index."""
    if len(nums) <= 1:
        return 0
    
    jumps = 0
    current_end = 0  # End of current jump range
    max_reach = 0    # Farthest reachable
    
    for i in range(len(nums) - 1):
        max_reach = max(max_reach, i + nums[i])
        
        # Reached end of current jump range
        if i == current_end:
            jumps += 1
            current_end = max_reach
    
    return jumps
```

---

### Implementation: Gas Station

```python
def can_complete_circuit(gas, cost):
    """Find starting gas station to complete circuit."""
    if sum(gas) < sum(cost):
        return -1  # Not enough total gas
    
    start = 0
    tank = 0
    
    for i in range(len(gas)):
        tank += gas[i] - cost[i]
        
        if tank < 0:
            # Can't reach next station from start
            start = i + 1
            tank = 0
    
    return start
```

---

### Key Pattern Elements

| Element | Purpose | Update Rule |
|---------|---------|-------------|
| `max_reach` | Farthest index reachable | `max(max_reach, i + nums[i])` |
| `i > max_reach` | Detect failure | Cannot proceed further |
| `current_end` | Boundary of current jump | When reached, increment jumps |

<!-- back -->
