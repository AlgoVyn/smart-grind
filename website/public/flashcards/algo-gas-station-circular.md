## Gas Station - Why Single Point Works?

**Question:** If total gas >= total cost, why does there always exist exactly one valid starting point?

<!-- front -->

---

## Gas Station: Single Solution

### Problem
Find starting station to complete circuit if possible.

### Key Observation
```python
def can_complete_circuit(gas, cost):
    total_tank = 0
    current_tank = 0
    start = 0
    
    for i in range(len(gas)):
        total_tank += gas[i] - cost[i]
        current_tank += gas[i] - cost[i]
        
        if current_tank < 0:
            start = i + 1
            current_tank = 0
    
    return start if total_tank >= 0 else -1
```

### Why It Works
1. **If total gas >= total cost**, solution exists
2. **If current tank < 0** at station i, **no station [0..i]** can be start
3. Start must be **after** the point where tank becomes negative

### Visual Proof
```
Tank: -2, -1, +3, +1, -1, +2
        ↑  
        Cannot start here (or before)
        
        Must start at index 2 → tank becomes positive
```

### Time: O(n), Space: O(1)

### ⚠️ Important
- Return `-1` if `total_tank < 0`
- Solution is unique if total > 0

<!-- back -->
