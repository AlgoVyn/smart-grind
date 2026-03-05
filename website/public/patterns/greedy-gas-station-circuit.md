# Greedy - Gas Station Circuit

## Problem Description

The Gas Station Circuit pattern solves problems where you need to determine if it's possible to complete a circular route visiting all gas stations, and if so, find the optimal starting point. Each station has a certain amount of gas, and traveling between stations costs fuel. This pattern uses a greedy approach to find the starting point that allows completing the circuit.

### Key Characteristics

| Characteristic | Description |
|----------------|-------------|
| Time Complexity | O(n) where n is the number of stations |
| Space Complexity | O(1) - only a few variables |
| Input | Gas array and cost array |
| Output | Starting station index or -1 if impossible |
| Approach | Greedy with cumulative tracking |

### When to Use

- Circular route completion problems
- Finding starting point for complete circuit
- Problems with resource constraints between points
- When total feasibility must be checked first
- Resource balance and deficit tracking scenarios

## Intuition

The key insight is that if we can't reach from station A to station B, then no station between A and B can be the starting point.

The "aha!" moments:

1. **Total feasibility**: First check if total gas >= total cost
2. **Local deficits**: Track cumulative tank balance as we traverse
3. **Reset point**: When tank goes negative, next station is new candidate
4. **Greedy choice**: Starting point is where cumulative never goes negative
5. **Guaranteed solution**: If total feasible, there must be a valid start

## Solution Approaches

### Approach 1: Greedy Single Pass ✅ Recommended

#### Algorithm

1. Initialize total_gas, total_cost, current_tank, start_index to 0
2. Iterate through each station:
   - Add gas[i] to total_gas and cost[i] to total_cost
   - Add (gas[i] - cost[i]) to current_tank
   - If current_tank < 0:
     - Set start_index to i + 1
     - Reset current_tank to 0
3. If total_gas < total_cost, return -1
4. Return start_index

#### Implementation

````carousel
```python
def can_complete_circuit(gas: list[int], cost: list[int]) -> int:
    """
    Find starting gas station to complete circuit.
    LeetCode 134 - Gas Station
    Time: O(n), Space: O(1)
    """
    n = len(gas)
    total_gas = 0
    total_cost = 0
    current_tank = 0
    start = 0
    
    for i in range(n):
        total_gas += gas[i]
        total_cost += cost[i]
        current_tank += gas[i] - cost[i]
        
        # If current tank is negative, can't start from previous stations
        if current_tank < 0:
            start = i + 1
            current_tank = 0
    
    # If total gas < total cost, impossible to complete circuit
    return start if total_gas >= total_cost else -1


def can_complete_circuit_verbose(gas, cost):
    """
    Detailed version with clear separation of checks.
    """
    # First, check if total gas >= total cost
    if sum(gas) < sum(cost):
        return -1
    
    n = len(gas)
    current_tank = 0
    start = 0
    
    for i in range(n):
        current_tank += gas[i] - cost[i]
        if current_tank < 0:
            # Can't start from any station from 'start' to 'i'
            start = i + 1
            current_tank = 0
    
    return start


# Alternative: Two-pass simulation
def can_complete_circuit_simulation(gas, cost):
    """
    Simulate the journey to verify correctness.
    """
    n = len(gas)
    
    # First check feasibility
    if sum(gas) < sum(cost):
        return -1
    
    # Find candidate start
    current_tank = 0
    start = 0
    
    for i in range(n):
        current_tank += gas[i] - cost[i]
        if current_tank < 0:
            start = i + 1
            current_tank = 0
    
    # Verify by simulation
    tank = 0
    for i in range(n):
        idx = (start + i) % n
        tank += gas[idx] - cost[idx]
        if tank < 0:
            return -1  # Should not happen if logic is correct
    
    return start
```
<!-- slide -->
```cpp
class Solution {
public:
    int canCompleteCircuit(vector<int>& gas, vector<int>& cost) {
        int n = gas.size();
        int totalGas = 0, totalCost = 0;
        int currentTank = 0;
        int start = 0;
        
        for (int i = 0; i < n; i++) {
            totalGas += gas[i];
            totalCost += cost[i];
            currentTank += gas[i] - cost[i];
            
            if (currentTank < 0) {
                start = i + 1;
                currentTank = 0;
            }
        }
        
        return totalGas >= totalCost ? start : -1;
    }
};
```
<!-- slide -->
```java
class Solution {
    public int canCompleteCircuit(int[] gas, int[] cost) {
        int n = gas.length;
        int totalGas = 0, totalCost = 0;
        int currentTank = 0;
        int start = 0;
        
        for (int i = 0; i < n; i++) {
            totalGas += gas[i];
            totalCost += cost[i];
            currentTank += gas[i] - cost[i];
            
            if (currentTank < 0) {
                start = i + 1;
                currentTank = 0;
            }
        }
        
        return totalGas >= totalCost ? start : -1;
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {number[]} gas
 * @param {number[]} cost
 * @return {number}
 */
function canCompleteCircuit(gas, cost) {
    const n = gas.length;
    let totalGas = 0, totalCost = 0;
    let currentTank = 0;
    let start = 0;
    
    for (let i = 0; i < n; i++) {
        totalGas += gas[i];
        totalCost += cost[i];
        currentTank += gas[i] - cost[i];
        
        if (currentTank < 0) {
            start = i + 1;
            currentTank = 0;
        }
    }
    
    return totalGas >= totalCost ? start : -1;
}
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n) - Single pass through stations |
| Space | O(1) - Only a few variables |

### Approach 2: Two-Pass with Verification

More explicit version that separates concerns.

#### Implementation

````carousel
```python
def can_complete_circuit_two_pass(gas, cost):
    """
    Two-pass approach with explicit verification.
    """
    n = len(gas)
    
    # Pass 1: Check total feasibility
    if sum(gas) < sum(cost):
        return -1
    
    # Pass 2: Find valid starting point
    current_tank = 0
    start = 0
    
    for i in range(n):
        current_tank += gas[i] - cost[i]
        if current_tank < 0:
            start = i + 1
            current_tank = 0
    
    return start
```
<!-- slide -->
```cpp
class Solution {
public:
    int canCompleteCircuit(vector<int>& gas, vector<int>& cost) {
        int n = gas.size();
        
        // Check total feasibility
        int totalDiff = 0;
        for (int i = 0; i < n; i++) {
            totalDiff += gas[i] - cost[i];
        }
        if (totalDiff < 0) return -1;
        
        // Find valid starting point
        int currentTank = 0;
        int start = 0;
        
        for (int i = 0; i < n; i++) {
            currentTank += gas[i] - cost[i];
            if (currentTank < 0) {
                start = i + 1;
                currentTank = 0;
            }
        }
        
        return start;
    }
};
```
<!-- slide -->
```java
class Solution {
    public int canCompleteCircuit(int[] gas, int[] cost) {
        int n = gas.length;
        
        // Check total feasibility
        int totalDiff = 0;
        for (int i = 0; i < n; i++) {
            totalDiff += gas[i] - cost[i];
        }
        if (totalDiff < 0) return -1;
        
        // Find valid starting point
        int currentTank = 0;
        int start = 0;
        
        for (int i = 0; i < n; i++) {
            currentTank += gas[i] - cost[i];
            if (currentTank < 0) {
                start = i + 1;
                currentTank = 0;
            }
        }
        
        return start;
    }
}
```
<!-- slide -->
```javascript
/**
 * Two-pass approach
 * @param {number[]} gas
 * @param {number[]} cost
 * @return {number}
 */
function canCompleteCircuit(gas, cost) {
    const n = gas.length;
    
    // Check total feasibility
    let totalDiff = 0;
    for (let i = 0; i < n; i++) {
        totalDiff += gas[i] - cost[i];
    }
    if (totalDiff < 0) return -1;
    
    // Find valid starting point
    let currentTank = 0;
    let start = 0;
    
    for (let i = 0; i < n; i++) {
        currentTank += gas[i] - cost[i];
        if (currentTank < 0) {
            start = i + 1;
            currentTank = 0;
        }
    }
    
    return start;
}
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n) - Two linear passes (can be combined into one) |
| Space | O(1) - Constant extra space |

## Complexity Analysis

| Approach | Time | Space | When to Use |
|----------|------|-------|-------------|
| Single Pass | O(n) | O(1) | **Recommended** - Efficient and clean |
| Two Pass | O(n) | O(1) | When clarity is preferred over efficiency |
| Brute Force | O(n²) | O(1) | Never - for understanding only |

## Related Problems

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Gas Station](https://leetcode.com/problems/gas-station/) | 134 | Medium | Classic gas station circuit |
| [Container With Most Water](https://leetcode.com/problems/container-with-most-water/) | 11 | Medium | Two-pointer greedy |
| [Jump Game](https://leetcode.com/problems/jump-game/) | 55 | Medium | Reachability greedy |
| [Jump Game II](https://leetcode.com/problems/jump-game-ii/) | 45 | Medium | Minimum jumps |
| [Candy](https://leetcode.com/problems/candy/) | 135 | Hard | Distribution with constraints |

## Video Tutorial Links

1. **[NeetCode - Gas Station](https://www.youtube.com/watch?v=wDgKfXf3qAY)** - Greedy explanation
2. **[Kevin Naughton Jr. - Gas Station](https://www.youtube.com/watch?v=1TtAuH0JP4Q)** - Detailed walkthrough
3. **[Nick White - Gas Station](https://www.youtube.com/watch?v=wDgKfXf3qAY)** - Visual explanation
4. **[Back To Back SWE - Gas Station](https://www.youtube.com/watch?v=3wUa7I8qPD8)** - Proof of correctness

## Summary

### Key Takeaways

- **Check total first**: If total gas < total cost, impossible
- **Reset on negative**: When tank goes negative, next station is candidate
- **Greedy works**: The first valid starting point found is correct
- **Proof sketch**: If can't reach from i to j, no station between them works
- **Single pass**: Can combine total check and start finding in one loop

### Common Pitfalls

- Not checking total feasibility first
- Resetting start to i instead of i + 1 when tank goes negative
- Forgetting it's a circular route
- Not resetting current_tank to 0 after finding deficit
- Using O(n²) brute force approach unnecessarily
- Off-by-one errors with circular indexing

### Follow-up Questions

1. **Why does resetting to i + 1 work?**
   - If we can't reach from station i to j, any station between them also can't reach j

2. **How to prove there's always a solution when total gas >= total cost?**
   - The deficit at any point must be covered by surplus elsewhere

3. **What if we need to find all valid starting points?**
   - Run algorithm to find one, then verify all stations with same logic

4. **Can this be solved with DP?**
   - Yes but overkill; greedy is optimal at O(n)

## Pattern Source

[Greedy - Gas Station Circuit](patterns/greedy-gas-station-circuit.md)
