# Gas Station

## Category
Greedy

## Description
Find starting gas station for a circular tour.

---

## When to Use
Use this algorithm when you need to solve problems involving:
- greedy related operations
- Efficient traversal or search operations
- Optimization problems where this pattern applies

---

## Algorithm Explanation
The Gas Station problem asks: Given gas stations around a circular route with certain amounts of gas and costs to travel to the next station, find the starting station index from which you can complete a full circle.

### How It Works:
The key insight is that if the total gas available is >= total cost required, a solution always exists. We can use a greedy approach to find which station works.

### Greedy Algorithm:
1. Calculate total gas minus total cost for all stations
2. If total < 0, no solution exists
3. If total >= 0, there must be a valid starting point

### The One-Pass Solution:
- Keep track of `total_tank` (cumulative gas - cost)
- Keep track of `curr_tank` (gas at current position)
- When `curr_tank` becomes negative, reset:
  - The current station can't be the answer
  - Neither can any station in between
  - Set next station as potential start

### Why This Works:
- If sum of gas - cost from station A to B is negative, then no station between A and B can be a valid starting point
- When total gas >= total cost, skipping these impossible starts guarantees finding the solution

### Key Properties:
- **Time Complexity**: O(n) - single pass
- **Space Complexity**: O(1)
- **Optimal**: Can prove this greedy approach always finds solution if one exists

---

## Algorithm Steps
1. Initialize `total_tank = 0` and `curr_tank = 0`
2. Initialize `starting_station = 0`
3. For each station i from 0 to n-1:
   - Calculate `diff = gas[i] - cost[i]`
   - Update `total_tank += diff`
   - Update `curr_tank += diff`
   - If `curr_tank < 0`:
     - Set `starting_station = i + 1`
     - Reset `curr_tank = 0`
4. After loop, if `total_tank >= 0`: return `starting_station`
5. Otherwise, return -1 (no solution)

---

## Implementation

```python
from typing import List


def canCompleteCircuit(gas: List[int], cost: List[int]) -> int:
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


def find_all_valid_starts(gas: List[int], cost: List[int]) -> List[int]:
    """
    Find ALL starting stations that allow completing the circle.
    
    Useful for understanding the problem better.
    
    Time: O(n²)
    Space: O(1)
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


def simulate_journey(gas: List[int], cost: List[int], start: int) -> dict:
    """
    Simulate journey from a starting station.
    
    Returns detailed journey information.
    """
    n = len(gas)
    tank = 0
    journey = []
    
    for i in range(n):
        current = (start + i) % n
        tank += gas[current] - cost[current]
        
        journey.append({
            'station': current,
            'gas_at_arrival': tank + cost[current] - gas[current],
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


# Example usage
if __name__ == "__main__":
    print("Gas Station Problem")
    print("=" * 40)
    
    # Test case 1
    gas1 = [1, 2, 3, 4, 5]
    cost1 = [3, 4, 5, 1, 2]
    
    print("\nTest 1:")
    print(f"  Gas: {gas1}")
    print(f"  Cost: {cost1}")
    result = canCompleteCircuit(gas1, cost1)
    print(f"  Starting station: {result}")
    
    if result != -1:
        journey = simulate_journey(gas1, cost1, result)
        print(f"  Journey successful!")
        for step in journey['journey']:
            print(f"    Station {step['station']}: +{step['refill']} gas, -{step['cost']} cost, tank={step['tank_after']}")
    
    # Test case 2
    gas2 = [2, 3, 4]
    cost2 = [3, 4, 5]
    
    print("\nTest 2:")
    print(f"  Gas: {gas2}")
    print(f"  Cost: {cost2}")
    result = canCompleteCircuit(gas2, cost2)
    print(f"  Starting station: {result}")
    
    # Test case 3: No solution
    gas3 = [1, 2, 3, 4, 5]
    cost3 = [3, 4, 5, 6, 7]
    
    print("\nTest 3 (No solution):")
    print(f"  Gas: {gas3}")
    print(f"  Cost: {cost3}")
    result = canCompleteCircuit(gas3, cost3)
    print(f"  Starting station: {result}")

```javascript
function gasStation() {
    // Gas Station implementation
    // Time: O(n)
    // Space: O(1)
}
```

---

## Example

**Input:**
```
Test 1: gas = [1, 2, 3, 4, 5], cost = [3, 4, 5, 1, 2]
Test 2: gas = [2, 3, 4], cost = [3, 4, 5]
Test 3: gas = [1, 2, 3, 4, 5], cost = [3, 4, 5, 6, 7]
```

**Output:**
```
Test 1:
  Gas: [1, 2, 3, 4, 5]
  Cost: [3, 4, 5, 1, 2]
  Starting station: 3
  Journey successful!
    Station 3: +4 gas, -1 cost, tank=3
    Station 4: +5 gas, -2 cost, tank=6
    Station 0: +1 gas, -3 cost, tank=4
    Station 1: +2 gas, -4 cost, tank=2
    Station 2: +3 gas, -5 cost, tank=0

Test 2:
  Gas: [2, 3, 4]
  Cost: [3, 4, 5]
  Starting station: -1 (No solution: total gas < total cost)

Test 3 (No solution):
  Gas: [1, 2, 3, 4, 5]
  Cost: [3, 4, 5, 6, 7]
  Starting station: -1

Explanation:
- Test 1: Start at station 3, complete full circle
- Test 2: Total gas (9) < total cost (12), impossible
- Test 3: Total gas (15) < total cost (25), impossible
```

---

## Time Complexity
**O(n)**

---

## Space Complexity
**O(1)**

---

## Common Variations
- Iterative vs Recursive implementation
- Space-optimized versions
- Modified versions for specific constraints

---

## Related Problems
- Practice problems that use this algorithm pattern
- Similar algorithms in the same category

---

## Tips
- Always consider edge cases
- Think about time vs space trade-offs
- Look for opportunities to optimize
