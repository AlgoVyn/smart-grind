## Gas Station: Comparison with Alternatives

How does the greedy solution compare to other approaches for Gas Station?

<!-- front -->

---

### Greedy vs Brute Force vs DP

| Approach | Time | Space | Correctness | When to Use |
|----------|------|-------|-------------|-------------|
| **Greedy** | O(n) | O(1) | ✓ Correct | Standard problem |
| **Brute force** | O(n²) | O(1) | ✓ Correct | Small n, verification |
| **Prefix + RMQ** | O(n log n) prep, O(1) query | O(n) | ✓ Correct | Many queries |
| **Sliding window** | O(n) | O(n) | ✓ Correct | All valid starts |

```python
# Greedy: The standard solution
def greedy_solution(gas, cost):
    if sum(gas) < sum(cost):
        return -1
    start, tank = 0, 0
    for i in range(len(gas)):
        tank += gas[i] - cost[i]
        if tank < 0:
            start, tank = i + 1, 0
    return start

# Brute force: For verification
def brute_force(gas, cost):
    n = len(gas)
    for start in range(n):
        tank = 0
        valid = True
        for i in range(n):
            pos = (start + i) % n
            tank += gas[pos]
            if tank < cost[pos]:
                valid = False
                break
            tank -= cost[pos]
        if valid:
            return start
    return -1
```

---

### Greedy Correctness Proof

```
Theorem: The greedy algorithm returns a valid start if one exists.

Proof:
1. If total_gas < total_cost, no solution exists. ✓

2. Otherwise, let greedy return start = g.
   For any position i where tank went negative,
   no station in [previous_start, i] can reach i+1.
   
   Why? Cumulative gas from any intermediate start s
   is: tank_s = tank_g - tank_s_to_g >= tank_g (since we reset)
   If tank_g < 0 at i, then tank_s would be even more negative
   (since we had less gas at the start).

3. Therefore, we can safely discard all failed starts and 
   their subsequent positions up to the failure point.

4. Since total_gas >= total_cost, the greedy start must work.
```

---

### When Greedy Fails (Similar Problems)

| Problem | Greedy Works? | Correct Approach |
|---------|---------------|------------------|
| **Standard gas station** | ✓ Yes | Greedy O(n) |
| **Maximize distance with limited tank** | ✗ No | DP or BFS |
| **Minimize stops with choice** | ✗ No | Greedy (pick max when needed) |
| **Multiple vehicles** | ✗ No | Flow algorithms |
| **Variable tank capacity** | ✗ No | Modified Dijkstra |

```python
# Greedy fails: Maximum distance with fixed tank
def max_distance_greedy_fails(gas, cost, tank_capacity):
    """
    Greedy "always take when available" fails
    Correct: Plan ahead, might skip small stations
    """
    # This requires DP or graph approach
    # State: position, tank_level
    # Find reachable states
    pass
```

---

### Prefix Sum vs Two-Pass

| Variant | Method | Complexity |
|---------|--------|------------|
| **Single start** | One-pass greedy | O(n) |
| **All valid starts** | Prefix min + double array | O(n) or O(n log n) |
| **Best start (min initial)** | Two-pass prefix | O(n) |
| **With checkpoints** | Segment tree | O(n log n) |

```python
# Single pass: Fast, simple
def single_pass(gas, cost):
    return greedy_solution(gas, cost)

# All valid starts: Need more work
def all_starts(gas, cost):
    # Requires checking all positions
    # Can optimize with range minimum queries
    return all_valid_starts(gas, cost)
```

<!-- back -->
