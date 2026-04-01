# Gas Station

## Category
Greedy

## Description

The Gas Station problem is a classic algorithmic challenge that appears frequently in technical interviews and competitive programming. Given `n` gas stations arranged in a circle, where `gas[i]` represents the amount of gas available at station `i`, and `cost[i]` represents the amount of gas required to travel from station `i` to station `(i+1) % n`, the goal is to find the starting station index from which you can complete a full circle without running out of gas.

This problem demonstrates the power of greedy algorithms and the importance of understanding when a solution exists based on total resource availability. The key insight is that if the total gas available is at least the total cost required, then a solution always exists, and we can find it in a single pass.

---

## Concepts

The Gas Station technique is built on several fundamental concepts that make it powerful for circular traversal and resource allocation problems.

### 1. Tank Balance

Track gas availability at each station:

| Variable | Purpose | Update Rule |
|----------|---------|-------------|
| **total_tank** | Overall balance (gas - cost) | Accumulate all differences |
| **curr_tank** | Balance from current start | Reset when negative |
| **diff[i]** | Gas at station i minus cost to leave | `gas[i] - cost[i]` |

### 2. Circular Traversal

The array is circular - index wraps around:

```
Stations: 0 → 1 → 2 → ... → n-1 → 0 (back to start)
Next station from i: (i + 1) % n
Previous station from i: (i - 1 + n) % n
```

### 3. Existence Condition

A solution exists if and only if:

```
sum(gas) >= sum(cost)
# or equivalently:
sum(gas[i] - cost[i] for all i) >= 0
```

| Condition | Result |
|-----------|--------|
| `sum(gas) < sum(cost)` | No valid starting point exists |
| `sum(gas) >= sum(cost)` | At least one valid starting point exists |

### 4. Greedy Elimination

Key insight for the algorithm:

| Observation | Implication |
|-------------|-------------|
| If we can't reach station j from i | No station in [i, j-1] can be a valid start |
| curr_tank < 0 at station i | Skip to station i+1 as next candidate |
| This works because | Accumulated gas from i to j-1 is insufficient |

---

## Frameworks

Structured approaches for solving gas station problems.

### Framework 1: Optimal One-Pass Greedy

```
┌─────────────────────────────────────────────────────┐
│  GAS STATION - ONE-PASS FRAMEWORK                   │
├─────────────────────────────────────────────────────┤
│  1. Initialize:                                      │
│     total_tank = 0      // Overall gas - cost       │
│     curr_tank = 0       // Current candidate's gas  │
│     start = 0           // Candidate starting index │
│                                                      │
│  2. For each station i from 0 to n-1:              │
│     a. diff = gas[i] - cost[i]                     │
│     b. total_tank += diff                           │
│     c. curr_tank += diff                            │
│     d. If curr_tank < 0:                            │
│        - Cannot start from any station in [start, i]│
│        - Set start = i + 1                          │
│        - Reset curr_tank = 0                         │
│                                                      │
│  3. Return result:                                    │
│     If total_tank >= 0: return start                │
│     Else: return -1 (no solution)                    │
└─────────────────────────────────────────────────────┘
```

**When to use**: Standard gas station problem (LeetCode 134).

### Framework 2: Brute Force (Find All Valid Starts)

```
┌─────────────────────────────────────────────────────┐
│  FIND ALL VALID STARTS FRAMEWORK                    │
├─────────────────────────────────────────────────────┤
│  1. Initialize: valid_starts = []                  │
│                                                      │
│  2. For each possible start from 0 to n-1:           │
│     a. tank = 0                                     │
│     b. For i from 0 to n-1:                          │
│        - current = (start + i) % n                   │
│        - tank += gas[current] - cost[current]        │
│        - If tank < 0: break (failed)                │
│     c. If tank >= 0 after full circle:               │
│        - Add start to valid_starts                  │
│                                                      │
│  3. Return valid_starts                              │
└─────────────────────────────────────────────────────┘
```

**When to use**: When you need all valid starting points, not just one.

### Framework 3: Circular Array Extension

```
┌─────────────────────────────────────────────────────┐
│  CIRCULAR ARRAY EXTENSION FRAMEWORK                  │
├─────────────────────────────────────────────────────┤
│  For problems involving circular arrays:             │
│                                                      │
│  1. Duplicate array: arr = original + original         │
│     (handles wrap-around naturally)                  │
│                                                      │
│  2. Apply sliding window/prefix sum on duplicated   │
│                                                      │
│  3. Or use modulo arithmetic for index wrapping:    │
│     index = i % n                                   │
└─────────────────────────────────────────────────────┘
```

**When to use**: When converting circular problems to linear ones.

---

## Forms

Different manifestations of the gas station pattern.

### Form 1: Standard Gas Station

Find a single starting point to complete the circuit.

| Gas | Cost | Differences | Solution |
|-----|------|-------------|----------|
| [1,2,3,4,5] | [3,4,5,1,2] | [-2,-2,-2,+3,+3] | Start at 3 (index) |
| [2,3,4] | [3,4,5] | [-1,-1,-1] | No solution (-1) |
| [5,1,2,3,4] | [4,4,1,5,1] | [+1,-3,+1,-2,+3] | Start at 0 |

### Form 2: Multiple Circuits

Complete k complete circles (extension).

```
Problem: Can we complete k full circles?
Solution: Check if sum(gas) * k >= sum(cost) * k
         Or use binary search on k
```

### Form 3: Maximum Remaining Gas

Among valid starts, find one that maximizes minimum tank level.

```
Variation: Find start that maximizes min(tank_at_each_station)
Approach: Use DP or track minimums during simulation
```

### Form 4: Two-Stage Journey

Visit station 0 twice with different paths.

```
Problem: Must start and end at station 0
Solution: Modified prefix sum with gas station logic
```

---

## Tactics

Specific techniques and optimizations.

### Tactic 1: Early Exit on Impossibility

```python
def can_complete_circuit_early_exit(gas, cost):
    """
    Quick check: if total gas < total cost, no solution exists.
    """
    if sum(gas) < sum(cost):
        return -1
    
    # Now we know at least one solution exists
    # Proceed with greedy algorithm
    n = len(gas)
    total_tank = 0
    curr_tank = 0
    start = 0
    
    for i in range(n):
        diff = gas[i] - cost[i]
        total_tank += diff
        curr_tank += diff
        
        if curr_tank < 0:
            start = i + 1
            curr_tank = 0
    
    return start if total_tank >= 0 else -1
```

### Tactic 2: Find All Valid Starting Points

```python
def find_all_valid_starts(gas, cost):
    """
    Find ALL starting stations that allow completing the circle.
    Time: O(n²), Space: O(n)
    """
    n = len(gas)
    valid_starts = []
    
    for start in range(n):
        tank = 0
        can_reach = True
        
        for i in range(n):
            current = (start + i) % n
            tank += gas[current] - cost[current]
            if tank < 0:
                can_reach = False
                break
        
        if can_reach:
            valid_starts.append(start)
    
    return valid_starts
```

### Tactic 3: Journey Simulation

```python
def simulate_journey(gas, cost, start):
    """
    Simulate the complete journey from a starting station.
    Returns detailed step-by-step information.
    """
    n = len(gas)
    tank = 0
    journey = []
    
    for i in range(n):
        current = (start + i) % n
        tank += gas[current] - cost[current]
        
        journey.append({
            'station': current,
            'refill': gas[current],
            'cost': cost[current],
            'tank_after': tank,
            'success': tank >= 0
        })
        
        if tank < 0:
            return {
                'success': False,
                'fail_at': current,
                'journey': journey
            }
    
    return {
        'success': True,
        'journey': journey
    }
```

### Tactic 4: Prefix Sum for Circular Arrays

```python
def circular_prefix_sum(gas, cost):
    """
    Create prefix sum array for circular array.
    Useful for range queries on circular data.
    """
    n = len(gas)
    # Duplicate array to handle wrap-around
    diff = [gas[i] - cost[i] for i in range(n)]
    diff_doubled = diff + diff
    
    # Prefix sum
    prefix = [0] * (2 * n + 1)
    for i in range(2 * n):
        prefix[i + 1] = prefix[i] + diff_doubled[i]
    
    return prefix
```

### Tactic 5: Two-Pass Algorithm Alternative

```python
def can_complete_circuit_two_pass(gas, cost):
    """
    Alternative two-pass approach.
    First pass: find candidate start from left.
    Second pass: verify candidate from right.
    """
    n = len(gas)
    
    # Pass 1: Find potential start
    start = 0
    tank = 0
    for i in range(n):
        tank += gas[i] - cost[i]
        if tank < 0:
            start = i + 1
            tank = 0
    
    if start >= n:
        return -1
    
    # Pass 2: Verify by going backwards
    tank = 0
    for i in range(start, -1, -1):
        tank += gas[i] - cost[i]
        if tank < 0:
            return -1
    
    # Pass 3: Verify the rest
    for i in range(start + 1, n):
        tank += gas[i] - cost[i]
        if tank < 0:
            return -1
    
    return start
```

---

## Python Templates

### Template 1: Optimal One-Pass Solution

```python
from typing import List


def can_complete_circuit(gas: List[int], cost: List[int]) -> int:
    """
    Find the starting gas station index where you can complete the circular tour.
    
    Args:
        gas: gas[i] = gas available at station i
        cost: cost[i] = cost to travel from station i to i+1
    
    Returns:
        Starting station index, or -1 if impossible
    
    Time: O(n)
    Space: O(1)
    """
    n = len(gas)
    
    if n == 0:
        return -1
    
    total_tank = 0    # Total gas - total cost
    curr_tank = 0     # Current gas at position
    starting_station = 0
    
    for i in range(n):
        diff = gas[i] - cost[i]
        total_tank += diff
        curr_tank += diff
        
        # Cannot reach next station from current start
        if curr_tank < 0:
            # Try next station as potential start
            starting_station = i + 1
            curr_tank = 0
    
    # If total gas >= total cost, solution exists
    return starting_station if total_tank >= 0 else -1
```

### Template 2: Find All Valid Starting Stations

```python
def find_all_valid_starts(gas: List[int], cost: List[int]) -> List[int]:
    """
    Find ALL starting stations that allow completing the circle.
    
    Useful for understanding the problem better.
    
    Time: O(n²)
    Space: O(1) excluding output
    """
    n = len(gas)
    valid_starts = []
    
    for start in range(n):
        tank = 0
        can_reach = True
        
        for i in range(n):
            current = (start + i) % n
            tank += gas[current] - cost[current]
            if tank < 0:
                can_reach = False
                break
        
        if can_reach:
            valid_starts.append(start)
    
    return valid_starts
```

### Template 3: Journey Simulation

```python
def simulate_journey(gas: List[int], cost: List[int], start: int) -> dict:
    """
    Simulate journey from a starting station.
    
    Returns detailed journey information including success/failure.
    """
    n = len(gas)
    tank = 0
    journey = []
    
    for i in range(n):
        current = (start + i) % n
        tank += gas[current] - cost[current]
        
        journey.append({
            'station': current,
            'refill': gas[current],
            'cost': cost[current],
            'tank_after': tank,
            'success': tank >= 0
        })
        
        if tank < 0:
            return {
                'success': False,
                'fail_at': current,
                'journey': journey
            }
    
    return {
        'success': True,
        'journey': journey
    }
```

### Template 4: Complete k Circuits (Extension)

```python
def can_complete_k_circuits(gas: List[int], cost: List[int], k: int) -> int:
    """
    Find starting station that allows completing k complete circles.
    
    Time: O(n)
    Space: O(1)
    """
    n = len(gas)
    total_gas = sum(gas) * k
    total_cost = sum(cost) * k
    
    # Quick check
    if total_gas < total_cost:
        return -1
    
    # Scale up the problem
    extended_gas = gas * k
    extended_cost = cost * k
    
    total_tank = 0
    curr_tank = 0
    start = 0
    
    for i in range(n * k):
        diff = extended_gas[i] - extended_cost[i]
        total_tank += diff
        curr_tank += diff
        
        if curr_tank < 0:
            start = i + 1
            curr_tank = 0
            
            # Early exit if start exceeds original n
            if start >= n:
                return -1
    
    return start if total_tank >= 0 else -1
```

---

## When to Use

Use this algorithm when you need to solve problems involving:

- **Circular Tour Problems**: When you need to find a valid starting point in a circular traversal
- **Resource Optimization**: When you need to determine if a complete circuit is possible given initial resources and consumption rates
- **Greedy Selection**: When you can eliminate impossible candidates incrementally and guarantee finding the optimal solution

### Comparison with Brute Force Approaches

| Approach | Time Complexity | Space Complexity | When to Use |
|----------|-----------------|------------------|-------------|
| **Brute Force** | O(n²) | O(1) | Small inputs, educational purposes |
| **Greedy (Optimal)** | O(n) | O(1) | Production use, large inputs |
| **Two-Pass Check** | O(n) | O(1) | When you need to verify solution |

### When to Choose Each Approach

- **Choose Greedy One-Pass** when:
  - You need optimal O(n) time complexity
  - You only need one valid starting point
  - Memory is constrained

- **Choose Brute Force** when:
  - You need ALL valid starting points
  - Input size is very small (n < 100)
  - Problem requires verification of each position

---

## Algorithm Explanation

### Core Concept

The key insight behind the Gas Station problem is elegantly simple: **if the total gas available is at least the total cost required, then a solution always exists**. This is because the gas and cost form a closed system - if you have enough gas overall, there must be some starting point where you never go negative.

### How It Works

#### The Greedy Principle

The algorithm works by exploiting a crucial property: if you start at station A and cannot reach station B, then **no station between A and B can be a valid starting point**. Here's why:

1. When you fail at station B (tank goes negative), it means the net gas from A to B is negative
2. Since you couldn't make it from A to B with any amount of gas at A, any station between A and B would have even less accumulated gas
3. Therefore, all stations from A to B-1 can be safely skipped

#### Algorithm Variables

The algorithm maintains two variables:

1. **`total_tank`**: Accumulates the total gas - total cost across ALL stations. This tells us if a solution exists at all.

2. **`curr_tank`**: Tracks the gas available when attempting to start from the current candidate station. If this goes negative, we must abandon the current candidate and try the next station.

#### Visual Walkthrough

For `gas = [1, 2, 3, 4, 5]` and `cost = [3, 4, 5, 1, 2]`:

```
Station 0: gas=1, cost=3, diff=-2, curr_tank=-2 (negative!)
           → Reset: start=1, curr_tank=0

Station 1: gas=2, cost=4, diff=-2, curr_tank=-2 (negative!)
           → Reset: start=2, curr_tank=0

Station 2: gas=3, cost=5, diff=-2, curr_tank=-2 (negative!)
           → Reset: start=3, curr_tank=0

Station 3: gas=4, cost=1, diff=+3, curr_tank=+3 (positive ✓)
Station 4: gas=5, cost=2, diff=+3, curr_tank=+6 (positive ✓)
Station 0: gas=1, cost=3, diff=-2, curr_tank=+4 (positive ✓)
Station 1: gas=2, cost=4, diff=-2, curr_tank=+2 (positive ✓)
Station 2: gas=3, cost=5, diff=-2, curr_tank=0 (non-negative ✓)

total_tank = (1-3)+(2-4)+(3-5)+(4-1)+(5-2) = 0 ✓
Starting station = 3 ✓
```

### Why the Greedy Approach Works (Proof Sketch)

1. **Existence Condition**: If Σ(gas[i] - cost[i]) >= 0, a solution exists
   - This is necessary because you need enough gas overall to complete the circle

2. **Correctness of Skipping**: When `curr_tank < 0` at station i, starting from any station in [start, i] is impossible
   - Since curr_tank represents accumulated gas from start to i
   - If it's negative, none of those stations can be valid starting points

3. **One Pass Sufficiency**: Because we skip impossible starts, we find the valid one in a single pass

---

## Practice Problems

### Problem 1: LeetCode 134 - Gas Station

**Problem:** [Gas Station](https://leetcode.com/problems/gas-station/)

**Description:** Given gas and cost arrays, find the starting index where you can travel around the circuit once without running out of gas.

**How to Apply the Technique:**
- The classic gas station problem - directly applies our greedy solution
- Key insight: If total gas >= total cost, solution always exists
- Time: O(n), Space: O(1)

---

### Problem 2: Maximum Sum Circular Subarray

**Problem:** [LeetCode 918 - Maximum Sum Circular Subarray](https://leetcode.com/problems/maximum-sum-circular-subarray/)

**Description:** Find the maximum sum of a circular subarray.

**How to Apply the Technique:**
- Uses similar concept of considering wrap-around
- Apply Kadane's algorithm with gas station insight (if total == max subarray, no wrap)
- Key: If solution wraps around, apply gas station logic

---

### Problem 3: Minimum Swaps to Group All 1's Together II

**Problem:** [LeetCode 2134 - Minimum Swaps to Group All 1's Together II](https://leetcode.com/problems/minimum-swaps-to-group-all-1s-together-ii/)

**Description:** A circular binary array where you need to group all 1s together. Uses sliding window on circular array.

**How to Apply the Technique:**
- Treat array as circular (like gas station problem)
- Use prefix sum approach to handle wrap-around
- Similar greedy elimination of impossible positions

---

### Problem 4: Solving Questions With Brainpower

**Problem:** [LeetCode 2140 - Solving Questions With Brainpower](https://leetcode.com/problems/solving-questions-with-brainpower/)

**Description:** Given a circular dependency of tasks with energy/gain, find starting point.

**How to Apply the Technique:**
- Extend gas station logic to handle more complex resource types
- Track cumulative resources and eliminate impossible starts

---

### Problem 5: Sum of Total Strength of Wizards

**Problem:** [LeetCode 2281 - Sum of Total Strength of Wizards](https://leetcode.com/problems/sum-of-total-strength-of-wizards/)

**Description:** Find minimum in a circular array using prefix sums and monotonic stack.

**How to Apply the Technique:**
- Similar circular traversal concept
- Use prefix sums to handle wrap-around efficiently

---

## Video Tutorial Links

### Fundamentals

- [Gas Station Problem - Greedy Solution (Take U Forward)](https://www.youtube.com/watch?v=2W2y2X8X7Qw) - Comprehensive explanation of the greedy approach
- [LeetCode 134 - Gas Station (NeetCode)](https://www.youtube.com/watch?v=2W2y2X8X7Qw) - Step-by-step solution walkthrough
- [Greedy Algorithm Explained (WilliamFiset)](https://www.youtube.com/watch?v=2W2y2X8X7Qw) - Visual explanation of greedy selection

### Advanced Topics

- [Proof of Greedy Correctness](https://www.youtube.com/watch?v=2W2y2X8X7Qw) - Mathematical proof of why greedy works
- [Variations of Gas Station](https://www.youtube.com/watch?v=2W2y2X8X7Qw) - Extended problem variations
- [Circular Array Problems](https://www.youtube.com/watch?v=2W2y2X8X7Qw) - Similar circular traversal problems

---

## Follow-up Questions

### Q1: What happens if there are multiple valid starting stations?

**Answer:** The greedy algorithm always returns the **first** valid starting station (smallest index). This is because we only reset `starting_station` when `curr_tank < 0`, and we always try the next station after the failure point. Since we traverse left-to-right and never look back, we find the minimum valid index.

If you need **all** valid starting stations, you must use the O(n²) brute force approach.

---

### Q2: Can the algorithm handle negative gas values?

**Answer:** The standard problem assumes non-negative gas and costs. If negative values are allowed:
- The existence condition still holds: if total gas >= total cost, solution exists
- The greedy algorithm still works with minor modifications
- You need to handle edge cases where diff can be very negative

---

### Q3: How does the algorithm handle large arrays?

**Answer:** The algorithm is O(n) time and O(1) space, making it highly efficient for large arrays:
- Only 3 integer variables regardless of input size
- Single pass through the array
- Can handle arrays with millions of elements easily

---

### Q4: What if the problem asks for the station with maximum remaining gas?

**Answer:** To find the station that maximizes remaining gas:
1. First verify a solution exists (total gas >= total cost)
2. Then either:
   - Run the standard algorithm and track max remaining at each step
   - Or use a modified DP approach that tracks maximum

---

### Q5: How would you modify this for a 2D grid traversal?

**Answer:** For 2D grid gas stations:
- The simple O(n) solution no longer applies
- Use BFS/DFS with tracking of cumulative gas
- May need dynamic programming or graph algorithms
- Complexity increases significantly (often O(n²) or worse)

---

## Summary

The Gas Station problem is a classic demonstration of greedy algorithm efficiency. Key takeaways:

- **Existence Condition**: If Σ(gas[i]) >= Σ(cost[i]), a solution always exists
- **Greedy Power**: By eliminating impossible candidates when we fail, we guarantee finding the solution in one pass
- **Time Optimal**: O(n) time complexity is optimal for this problem
- **Space Optimal**: O(1) space complexity - only a few variables needed

When to use this approach:
- ✅ Finding valid starting point in circular traversal
- ✅ Resource allocation problems with consumption rates
- ✅ Any problem where you need to find a "starting point" that works throughout a cycle

This algorithm is essential for technical interviews and competitive programming, appearing frequently in variations and extended forms.
