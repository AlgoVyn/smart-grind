## Gas Station: Core Concepts

What is the Gas Station problem and what are the key solution strategies?

<!-- front -->

---

### Fundamental Definition

**Problem:** Given gas stations arranged in a circle with `gas[i]` fuel and `cost[i]` to reach next station, find starting station to complete circuit.

| Variant | Constraint | Solution |
|---------|------------|----------|
| **Circular** | Must complete full circle | O(n) greedy |
| **Linear** | Reach end from start | DP or greedy |
| **Multiple stops** | Any subset of stations | Greedy / DP |

---

### Key Insight: Net Fuel Balance

```
For each station i:
  net[i] = gas[i] - cost[i]

Circuit possible iff sum(net) >= 0

Starting position: track cumulative sum, reset at negative
```

**Critical observation:** If cumulative tank goes negative at station i, no station between start and i can be valid start.

---

### Greedy Strategy

```
Algorithm:
1. If total_gas < total_cost: return -1 (impossible)
2. Start at station 0, tank = 0
3. For each station i:
   - tank += gas[i] - cost[i]
   - If tank < 0: start = i+1, tank = 0
4. Return start

Why it works: If tank negative at i, any start in [0,i] 
would fail before reaching i+1 (insufficient cumulative gas)
```

---

### Complexity Analysis

| Approach | Time | Space | Proof |
|----------|------|-------|-------|
| **Brute force** | O(n²) | O(1) | Try each start |
| **Greedy** | O(n) | O(1) | Reset on negative |

**Key proof:** Resetting to i+1 after failure at i is safe because all intermediate starts would also fail.

<!-- back -->
