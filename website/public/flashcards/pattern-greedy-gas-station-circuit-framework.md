# Pattern: Greedy - Gas Station Circuit (Framework)

---

## Front
When should you use the **Greedy - Gas Station Circuit** pattern?

## Back
- **Circular route completion** problems where you need to find a valid starting point
- **Resource balance** tracking between consecutive points (gas, cost, balance)
- Problems with **net surplus/deficit** across a cycle
- When total feasibility must be checked first, then starting point found
- Any scenario requiring finding a **single valid starting position** in O(n)

---

## Front
What is the **core insight** that makes the greedy approach work for Gas Station Circuit?

## Back
**Key insight**: If you can't travel from station A to station B, then **no station between A and B** can be a valid starting point.

This allows us to greedily skip all stations in the failed segment and continue from the next station after the failure point.

---

## Front
What is the **framework/template** for solving Gas Station Circuit problems?

## Back
```python
def gas_station_circuit(gas, cost):
    # 1. Track cumulative totals
    total_gas = total_cost = current_tank = 0
    start = 0
    
    # 2. Single pass through all stations
    for i in range(len(gas)):
        total_gas += gas[i]
        total_cost += cost[i]
        current_tank += gas[i] - cost[i]  # net gain/loss
        
        # 3. Reset when tank goes negative
        if current_tank < 0:
            start = i + 1      # next station is candidate
            current_tank = 0   # reset tank
    
    # 4. Verify total feasibility
    return start if total_gas >= total_cost else -1
```

---

## Front
Why do we reset the starting index to **i + 1** (not i) when the tank goes negative?

## Back
When `current_tank < 0` at station `i`, it means we couldn't even reach station `i+1` starting from our candidate.

If we can't reach from station A to station B, then **no station between A and B** can be a valid starting point (they'd have even less fuel).

Therefore, the **earliest possible** new candidate is `i + 1`.

---

## Front
What are the **time and space complexity** of the Gas Station Circuit algorithm?

## Back
| Aspect | Complexity |
|--------|------------|
| **Time** | O(n) - Single pass through stations |
| **Space** | O(1) - Only 4-5 variables (total_gas, total_cost, current_tank, start) |

This is optimal - you must visit each station at least once, and you only need constant extra space.

---

## Front
What is the **mathematical proof** that a solution exists when total_gas >= total_cost?

## Back
If `sum(gas) >= sum(cost)`, then there exists at least one valid starting point.

**Proof sketch**:
- The total surplus across the entire circuit is non-negative
- At any point where we fail (negative tank), we have accumulated a deficit
- That deficit must be covered by surplus accumulated elsewhere in the circuit
- By skipping to the station after each failure, we eventually find a point where all prior deficits are covered
- Since total surplus >= 0, such a point must exist

---
