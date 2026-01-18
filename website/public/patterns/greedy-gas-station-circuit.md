# Greedy - Gas Station Circuit

## Overview

The Greedy - Gas Station Circuit pattern is used for problems where you need to determine if it's possible to complete a circular route with gas stations, and if so, find the optimal starting point. Each station has a certain amount of gas and a cost to travel to the next station. This pattern uses a greedy approach to find the starting point that allows completing the circuit without running out of gas.

When to use this pattern:
- When dealing with circular routes where you must visit all stations
- For problems requiring the starting point for a complete circuit
- In scenarios with gas availability and travel costs between points

Benefits:
- Provides an efficient O(n) solution for circuit completion problems
- Handles the circular nature by checking total feasibility first
- Guarantees the correct starting point when a solution exists

## Key Concepts

- **Total Feasibility**: First check if total gas is greater than or equal to total cost
- **Cumulative Tank**: Track the gas remaining as you traverse the stations
- **Reset on Negative**: When the tank goes negative, reset the starting point to the next station
- **Greedy Start**: The starting point is where the cumulative tank never goes negative

## Template

```python
def can_complete_circuit(gas, cost):
    """
    Template for finding the starting gas station to complete the circuit.
    
    Args:
    gas (List[int]): Amount of gas at each station
    cost (List[int]): Cost to travel to the next station
    
    Returns:
    int: Starting station index, or -1 if impossible
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
    if total_gas < total_cost:
        return -1
    
    return start

def can_complete_circuit_alternative(gas, cost):
    """
    Alternative implementation with clearer separation of checks.
    
    Args:
    gas (List[int]): Amount of gas at each station
    cost (List[int]): Cost to travel to the next station
    
    Returns:
    int: Starting station index, or -1 if impossible
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
            start = i + 1
            current_tank = 0
    
    return start
```

## Example Problems

1. **Gas Station (LeetCode 134)**: There are n gas stations along a circular route, where the amount of gas at the ith station is gas[i]. You have a car with an unlimited gas tank and it costs cost[i] of gas to travel from the ith station to its next (i + 1)th station. You begin the journey with an empty tank at one of the gas stations. Return the starting gas station's index if you can travel around the circuit once in the clockwise direction, otherwise return -1.

2. **Gas Station Circuit Variant**: Similar problems involving circular travel with resource constraints.

3. **Minimum Starting Point**: Problems requiring the optimal starting position for circular traversals.

## Time and Space Complexity

- **Time Complexity**: O(n) where n is the number of gas stations, as we perform two linear passes (one for totals, one for finding start).
- **Space Complexity**: O(1), using only a few variables to track totals and current state.

## Common Pitfalls

- **Not Checking Total Feasibility**: Always verify that total gas >= total cost first; otherwise, it's impossible.
- **Incorrect Start Reset**: Reset the start to i+1 when tank goes negative, not to i.
- **Circular Nature**: Remember it's a circle, so the solution must work for the entire loop.
- **Edge Cases**: Handle single station, all zeros, and cases where gas equals cost.
- **Tank Reset**: When resetting, set current_tank to 0, not to the negative value.