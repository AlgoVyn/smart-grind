# Pattern: Greedy - Gas Station Circuit (Forms/Variants)

---

## Front
What is the **classic form** of the Gas Station Circuit problem?

## Back
**Problem**: Given `gas[i]` (fuel at station i) and `cost[i]` (fuel to reach i+1), find the starting station to complete the circuit.

**Signature**:
```python
def can_complete_circuit(gas: list[int], cost: list[int]) -> int:
    # Return starting index or -1
```

**Example**: LeetCode 134 - Gas Station

**Key constraint**: Return any valid starting index (unique solution guaranteed if total_gas >= total_cost).

---

## Front
What is the **find-all-starts** variant?

## Back
**Problem**: Find **all** valid starting points, not just one.

**Approach**: 
1. Find one valid start using greedy
2. Verify all stations with same cumulative logic
3. Or: Double the array and check all positions where cumulative stays non-negative for n steps

**Complexity**: O(n²) worst case, O(n) best case with optimizations.

**Use when**: Problem asks for count of valid starts or list of all starts.

---

## Front
What is the **minimum-tank** variant?

## Back
**Problem**: Find starting point that **minimizes the maximum tank deficit** (most robust route).

**Approach**: Use prefix sum tracking:

```python
# Find start that maximizes the minimum cumulative sum
prefix = 0
min_prefix = float('inf')
best_start = 0

for i in range(n):
    prefix += net[i]
    if prefix < min_prefix:
        min_prefix = prefix
        best_start = (i + 1) % n
```

**Difference**: Same start point as classic, but reasoning focuses on "least risky" path.

---

## Front
What is the **multiple-cars** variant?

## Back
**Problem**: Multiple cars start at different stations. Determine which can complete the circuit.

**Approach**: 
1. Precompute valid starting points using greedy
2. Binary search or range check for each car's start position

**Optimization**: 
- Precompute valid segments in O(n)
- Answer each query in O(1) or O(log n)

**Complexity**: O(n + q) for q queries.

---

## Front
What is the **limited-capacity** variant?

## Back
**Problem**: Car has **fuel tank capacity C**. Can it complete the circuit without overflowing or running out?

**Additional constraint**: `tank + gas[i] <= C` (can't take all gas if tank full).

**Approach**: Modified greedy with capacity check:

```python
tank = min(tank + gas[i], C)  # Cap at capacity
tank -= cost[i]
if tank < 0:  # Can't proceed
    # ... reset logic
```

**Complexity**: Remains O(n), but adds edge cases.

---

## Front
What is the **variable-cost** variant?

## Back
**Problem**: Cost depends on current fuel level or other factors.

**Example**: Cost = `base_cost[i] + penalty if tank < threshold`

**Approach**: 
- Greedy may not work (local choices affect future costs)
- May require **DP or Dijkstra** (state: position + fuel level)

**Complexity**: O(n × C) where C is max fuel capacity (pseudo-polynomial).

**When greedy fails**: Costs are non-linear or path-dependent.

---

## Front
What is the **partial-circuit** variant?

## Back
**Problem**: Find start to reach a **specific destination** (not full circuit), or maximize distance traveled.

**Approach**: Modified greedy:
- Stop when destination reached
- Or: Track maximum reachable distance from each start

**Variant**: "Can reach station k from some start?"
- Use sliding window or two-pointer on cumulative sums

---

## Front
What is the **continuous-fuel** variant?

## Back
**Problem**: Gas stations are at real-number positions (not discrete indices), with varying distances.

**Approach**: 
- Same greedy logic applies
- Track position instead of index: `position[i]` instead of `i`
- Distance = `position[i+1] - position[i]` (with circular wrap)

**Key difference**: Still O(n) but with floating point arithmetic considerations.

---
