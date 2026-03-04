# Gas Station

## Category
Greedy

## Description

The Gas Station problem is a classic algorithmic challenge that appears frequently in technical interviews and competitive programming. Given `n` gas stations arranged in a circle, where `gas[i]` represents the amount of gas available at station `i`, and `cost[i]` represents the amount of gas required to travel from station `i` to station `(i+1) % n`, the goal is to find the starting station index from which you can complete a full circle without running out of gas.

This problem demonstrates the power of greedy algorithms and the importance of understanding when a solution exists based on total resource availability.

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

### The Greedy Principle

The algorithm works by exploiting a crucial property: if you start at station A and cannot reach station B, then **no station between A and B can be a valid starting point**. Here's why:

1. When you fail at station B (tank goes negative), it means the net gas from A to B is negative
2. Since you couldn't make it from A to B with any amount of gas at A, any station between A and B would have even less accumulated gas
3. Therefore, all stations from A to B-1 can be safely skipped

### How the One-Pass Solution Works

The algorithm maintains two variables:

1. **`total_tank`**: Accumulates the total gas - total cost across ALL stations. This tells us if a solution exists at all.

2. **`curr_tank`**: Tracks the gas available when attempting to start from the current candidate station. If this goes negative, we must abandon the current candidate and try the next station.

### Visual Walkthrough

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

## Algorithm Steps

### Step-by-Step Approach

1. **Initialize Variables**
   ```
   total_tank = 0      // Tracks overall gas - cost
   curr_tank = 0       // Tracks gas at current candidate start
   starting_station = 0
   ```

2. **Iterate Through All Stations**
   ```
   For each station i from 0 to n-1:
       diff = gas[i] - cost[i]
       total_tank += diff
       curr_tank += diff
   ```

3. **Handle Negative Tank**
   ```
   If curr_tank < 0:
       - This station cannot be the answer
       - Neither can any station between start and i
       - Set starting_station = i + 1
       - Reset curr_tank = 0
   ```

4. **Return Result**
   ```
   If total_tank >= 0: return starting_station
   Else: return -1 (no solution exists)
   ```

### Pseudocode

```
function canCompleteCircuit(gas, cost):
    n = length(gas)
    total_tank = 0
    curr_tank = 0
    start = 0
    
    for i = 0 to n-1:
        diff = gas[i] - cost[i]
        total_tank += diff
        curr_tank += diff
        
        if curr_tank < 0:
            start = i + 1
            curr_tank = 0
    
    if total_tank >= 0:
        return start
    else:
        return -1
```

---

## Implementation

### Optimal One-Pass Solution

````carousel
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
```

<!-- slide -->
```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

/**
 * Gas Station Problem - Optimal One-Pass Solution
 * 
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 * 
 * Find the starting gas station index where you can complete the circular tour.
 */
class GasStation {
public:
    /**
     * Find the starting station that allows completing the circular tour.
     * 
     * @param gas Vector where gas[i] = gas available at station i
     * @param cost Vector where cost[i] = cost to travel from station i to i+1
     * @return Starting station index, or -1 if impossible
     */
    static int canCompleteCircuit(const vector<int>& gas, const vector<int>& cost) {
        int n = gas.size();
        
        if (n == 0) {
            return -1;
        }
        
        int total_tank = 0;    // Total gas - total cost
        int curr_tank = 0;     // Current gas at position
        int starting_station = 0;
        
        for (int i = 0; i < n; i++) {
            int diff = gas[i] - cost[i];
            total_tank += diff;
            curr_tank += diff;
            
            // Cannot reach next station from current start
            if (curr_tank < 0) {
                // Try next station as potential start
                starting_station = i + 1;
                curr_tank = 0;
            }
        }
        
        // If total gas >= total cost, solution exists
        return (total_tank >= 0) ? starting_station : -1;
    }
    
    /**
     * Find ALL valid starting stations (brute force approach).
     * 
     * Time: O(n²)
     * Space: O(1) excluding output
     */
    static vector<int> findAllValidStarts(const vector<int>& gas, const vector<int>& cost) {
        int n = gas.size();
        vector<int> valid_starts;
        
        for (int start = 0; start < n; start++) {
            int tank = 0;
            bool can_reach = true;
            
            for (int i = 0; i < n; i++) {
                int current = (start + i) % n;
                tank += gas[current] - cost[current];
                if (tank < 0) {
                    can_reach = false;
                    break;
                }
            }
            
            if (can_reach) {
                valid_starts.push_back(start);
            }
        }
        
        return valid_starts;
    }
    
    /**
     * Simulate journey from a starting station.
     */
    struct JourneyStep {
        int station;
        int refill;
        int cost;
        int tank_after;
        bool success;
    };
    
    static pair<bool, vector<JourneyStep>> simulateJourney(
        const vector<int>& gas, 
        const vector<int>& cost, 
        int start
    ) {
        int n = gas.size();
        int tank = 0;
        vector<JourneyStep> journey;
        
        for (int i = 0; i < n; i++) {
            int current = (start + i) % n;
            tank += gas[current] - cost[current];
            
            journey.push_back({
                current,
                gas[current],
                cost[current],
                tank,
                tank >= 0
            });
            
            if (tank < 0) {
                return {false, journey};
            }
        }
        
        return {true, journey};
    }
};


int main() {
    cout << "Gas Station Problem" << endl;
    cout << "====================" << endl;
    
    // Test case 1
    vector<int> gas1 = {1, 2, 3, 4, 5};
    vector<int> cost1 = {3, 4, 5, 1, 2};
    
    cout << "\nTest 1:" << endl;
    cout << "  Gas: ";
    for (int g : gas1) cout << g << " ";
    cout << endl;
    cout << "  Cost: ";
    for (int c : cost1) cout << c << " ";
    cout << endl;
    
    int result = GasStation::canCompleteCircuit(gas1, cost1);
    cout << "  Starting station: " << result << endl;
    
    if (result != -1) {
        auto [success, journey] = GasStation::simulateJourney(gas1, cost1, result);
        cout << "  Journey successful!" << endl;
        for (const auto& step : journey) {
            cout << "    Station " << step.station << ": +" << step.refill 
                 << " gas, -" << step.cost << " cost, tank=" << step.tank_after << endl;
        }
    }
    
    // Test case 2
    vector<int> gas2 = {2, 3, 4};
    vector<int> cost2 = {3, 4, 5};
    
    cout << "\nTest 2:" << endl;
    cout << "  Gas: ";
    for (int g : gas2) cout << g << " ";
    cout << endl;
    cout << "  Cost: ";
    for (int c : cost2) cout << c << " ";
    cout << endl;
    
    result = GasStation::canCompleteCircuit(gas2, cost2);
    cout << "  Starting station: " << result << endl;
    
    // Test case 3: No solution
    vector<int> gas3 = {1, 2, 3, 4, 5};
    vector<int> cost3 = {3, 4, 5, 6, 7};
    
    cout << "\nTest 3 (No solution):" << endl;
    cout << "  Gas: ";
    for (int g : gas3) cout << g << " ";
    cout << endl;
    cout << "  Cost: ";
    for (int c : cost3) cout << c << " ";
    cout << endl;
    
    result = GasStation::canCompleteCircuit(gas3, cost3);
    cout << "  Starting station: " << result << endl;
    
    return 0;
}
```

<!-- slide -->
```java
import java.util.ArrayList;
import java.util.List;

/**
 * Gas Station Problem - Optimal One-Pass Solution
 * 
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 * 
 * Find the starting gas station index where you can complete the circular tour.
 */
public class GasStation {
    
    /**
     * Find the starting station that allows completing the circular tour.
     * 
     * @param gas gas[i] = gas available at station i
     * @param cost cost[i] = cost to travel from station i to i+1
     * @return Starting station index, or -1 if impossible
     */
    public static int canCompleteCircuit(int[] gas, int[] cost) {
        int n = gas.length;
        
        if (n == 0) {
            return -1;
        }
        
        int totalTank = 0;    // Total gas - total cost
        int currTank = 0;     // Current gas at position
        int startingStation = 0;
        
        for (int i = 0; i < n; i++) {
            int diff = gas[i] - cost[i];
            totalTank += diff;
            currTank += diff;
            
            // Cannot reach next station from current start
            if (currTank < 0) {
                // Try next station as potential start
                startingStation = i + 1;
                currTank = 0;
            }
        }
        
        // If total gas >= total cost, solution exists
        return (totalTank >= 0) ? startingStation : -1;
    }
    
    /**
     * Find ALL valid starting stations (brute force approach).
     * 
     * Time: O(n²)
     * Space: O(1) excluding output
     */
    public static List<Integer> findAllValidStarts(int[] gas, int[] cost) {
        int n = gas.length;
        List<Integer> validStarts = new ArrayList<>();
        
        for (int start = 0; start < n; start++) {
            int tank = 0;
            boolean canReach = true;
            
            for (int i = 0; i < n; i++) {
                int current = (start + i) % n;
                tank += gas[current] - cost[current];
                if (tank < 0) {
                    canReach = false;
                    break;
                }
            }
            
            if (canReach) {
                validStarts.add(start);
            }
        }
        
        return validStarts;
    }
    
    /**
     * Journey step details
     */
    static class JourneyStep {
        int station;
        int refill;
        int cost;
        int tankAfter;
        boolean success;
        
        JourneyStep(int station, int refill, int cost, int tankAfter, boolean success) {
            this.station = station;
            this.refill = refill;
            this.cost = cost;
            this.tankAfter = tankAfter;
            this.success = success;
        }
    }
    
    /**
     * Simulate journey from a starting station.
     * 
     * @return array where index 0 = success (1/0), followed by journey steps
     */
    public static List<JourneyStep> simulateJourney(int[] gas, int[] cost, int start) {
        int n = gas.length;
        int tank = 0;
        List<JourneyStep> journey = new ArrayList<>();
        
        for (int i = 0; i < n; i++) {
            int current = (start + i) % n;
            tank += gas[current] - cost[current];
            
            journey.add(new JourneyStep(
                current,
                gas[current],
                cost[current],
                tank,
                tank >= 0
            ));
            
            if (tank < 0) {
                return journey;  // Journey failed
            }
        }
        
        return journey;
    }
    
    public static void main(String[] args) {
        System.out.println("Gas Station Problem");
        System.out.println("====================");
        
        // Test case 1
        int[] gas1 = {1, 2, 3, 4, 5};
        int[] cost1 = {3, 4, 5, 1, 2};
        
        System.out.println("\nTest 1:");
        System.out.print("  Gas: ");
        printArray(gas1);
        System.out.print("  Cost: ");
        printArray(cost1);
        
        int result = canCompleteCircuit(gas1, cost1);
        System.out.println("  Starting station: " + result);
        
        if (result != -1) {
            List<JourneyStep> journey = simulateJourney(gas1, cost1, result);
            System.out.println("  Journey successful!");
            for (JourneyStep step : journey) {
                System.out.println("    Station " + step.station + ": +" + step.refill + 
                                 " gas, -" + step.cost + " cost, tank=" + step.tankAfter);
            }
        }
        
        // Test case 2
        int[] gas2 = {2, 3, 4};
        int[] cost2 = {3, 4, 5};
        
        System.out.println("\nTest 2:");
        System.out.print("  Gas: ");
        printArray(gas2);
        System.out.print("  Cost: ");
        printArray(cost2);
        
        result = canCompleteCircuit(gas2, cost2);
        System.out.println("  Starting station: " + result);
        
        // Test case 3: No solution
        int[] gas3 = {1, 2, 3, 4, 5};
        int[] cost3 = {3, 4, 5, 6, 7};
        
        System.out.println("\nTest 3 (No solution):");
        System.out.print("  Gas: ");
        printArray(gas3);
        System.out.print("  Cost: ");
        printArray(cost3);
        
        result = canCompleteCircuit(gas3, cost3);
        System.out.println("  Starting station: " + result);
    }
    
    private static void printArray(int[] arr) {
        for (int x : arr) {
            System.out.print(x + " ");
        }
        System.out.println();
    }
}
```

<!-- slide -->
```javascript
/**
 * Gas Station Problem - Optimal One-Pass Solution
 * 
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 * 
 * Find the starting gas station index where you can complete the circular tour.
 */

/**
 * Find the starting station that allows completing the circular tour.
 * @param {number[]} gas - gas[i] = gas available at station i
 * @param {number[]} cost - cost[i] = cost to travel from station i to i+1
 * @returns {number} Starting station index, or -1 if impossible
 */
function canCompleteCircuit(gas, cost) {
    const n = gas.length;
    
    if (n === 0) {
        return -1;
    }
    
    let totalTank = 0;    // Total gas - total cost
    let currTank = 0;     // Current gas at position
    let startingStation = 0;
    
    for (let i = 0; i < n; i++) {
        const diff = gas[i] - cost[i];
        totalTank += diff;
        currTank += diff;
        
        // Cannot reach next station from current start
        if (currTank < 0) {
            // Try next station as potential start
            startingStation = i + 1;
            currTank = 0;
        }
    }
    
    // If total gas >= total cost, solution exists
    return totalTank >= 0 ? startingStation : -1;
}

/**
 * Find ALL valid starting stations (brute force approach).
 * @param {number[]} gas
 * @param {number[]} cost
 * @returns {number[]} Array of valid starting station indices
 * 
 * Time: O(n²)
 * Space: O(1) excluding output
 */
function findAllValidStarts(gas, cost) {
    const n = gas.length;
    const validStarts = [];
    
    for (let start = 0; start < n; start++) {
        let tank = 0;
        let canReach = true;
        
        for (let i = 0; i < n; i++) {
            const current = (start + i) % n;
            tank += gas[current] - cost[current];
            if (tank < 0) {
                canReach = false;
                break;
            }
        }
        
        if (canReach) {
            validStarts.push(start);
        }
    }
    
    return validStarts;
}

/**
 * Journey step details
 * @typedef {Object} JourneyStep
 * @property {number} station
 * @property {number} refill
 * @property {number} cost
 * @property {number} tankAfter
 * @property {boolean} success
 */

/**
 * Simulate journey from a starting station.
 * @param {number[]} gas
 * @param {number[]} cost
 * @param {number} start
 * @returns {{success: boolean, journey: JourneyStep[]}}
 */
function simulateJourney(gas, cost, start) {
    const n = gas.length;
    let tank = 0;
    const journey = [];
    
    for (let i = 0; i < n; i++) {
        const current = (start + i) % n;
        tank += gas[current] - cost[current];
        
        journey.push({
            station: current,
            refill: gas[current],
            cost: cost[current],
            tankAfter: tank,
            success: tank >= 0
        });
        
        if (tank < 0) {
            return { success: false, journey };
        }
    }
    
    return { success: true, journey };
}


// Example usage and demonstration
console.log("Gas Station Problem");
console.log("====================");

// Test case 1
const gas1 = [1, 2, 3, 4, 5];
const cost1 = [3, 4, 5, 1, 2];

console.log("\nTest 1:");
console.log(`  Gas: [${gas1.join(', ')}]`);
console.log(`  Cost: [${cost1.join(', ')}]`);

let result = canCompleteCircuit(gas1, cost1);
console.log(`  Starting station: ${result}`);

if (result !== -1) {
    const journeyData = simulateJourney(gas1, cost1, result);
    console.log("  Journey successful!");
    for (const step of journeyData.journey) {
        console.log(`    Station ${step.station}: +${step.refill} gas, -${step.cost} cost, tank=${step.tankAfter}`);
    }
}

// Test case 2
const gas2 = [2, 3, 4];
const cost2 = [3, 4, 5];

console.log("\nTest 2:");
console.log(`  Gas: [${gas2.join(', ')}]`);
console.log(`  Cost: [${cost2.join(', ')}]`);

result = canCompleteCircuit(gas2, cost2);
console.log(`  Starting station: ${result}`);

// Test case 3: No solution
const gas3 = [1, 2, 3, 4, 5];
const cost3 = [3, 4, 5, 6, 7];

console.log("\nTest 3 (No solution):");
console.log(`  Gas: [${gas3.join(', ')}]`);
console.log(`  Cost: [${cost3.join(', ')}]`);

result = canCompleteCircuit(gas3, cost3);
console.log(`  Starting station: ${result}`);
```
````

---

## Time Complexity Analysis

| Operation | Time Complexity | Description |
|-----------|-----------------|-------------|
| **Single Pass (Optimal)** | O(n) | One iteration through all stations |
| **Brute Force (All Starts)** | O(n²) | Check each station as potential start |
| **Space** | O(1) | Only constant extra variables used |

### Detailed Breakdown

- **Optimal Greedy Approach**: 
  - Single pass through n stations: O(n)
  - Each station processed once: O(1) per station
  - Total: O(n) time, O(1) space

- **Brute Force (Finding All Valid Starts)**:
  - For each of n starting positions, simulate journey of n steps: O(n × n)
  - Total: O(n²) time, O(1) space

---

## Space Complexity Analysis

- **Optimal Solution**: O(1) - only uses a few integer variables
- **Finding All Valid Starts**: O(1) excluding output array
- **Journey Simulation**: O(n) if storing detailed journey steps

### Why O(1) Space?

The greedy algorithm only needs to track:
- `total_tank`: Running sum of gas - cost
- `curr_tank`: Current accumulated tank
- `starting_station`: Candidate answer
- Loop index `i`

No additional data structures are required!

---

## Common Variations

### 1. Multiple Circuits

**Problem**: Can you complete k complete circles?

**Approach**: Apply the same algorithm but multiply total gas/cost by k, or use binary search on k.

````carousel
```python
def can_complete_k_circuits(gas: list, cost: list, k: int) -> int:
    """
    Find starting station that allows completing k complete circles.
    
    Time: O(n log k)
    Space: O(1)
    """
    n = len(gas)
    total_gas = sum(gas)
    total_cost = sum(cost)
    
    # Quick check: can we complete k circles?
    if total_gas < total_cost * k:
        return -1
    
    # Use binary search to find minimum valid k
    def can_complete(mid):
        tank = 0
        for i in range(n):
            tank += gas[i] * mid - cost[i] * mid
            if tank < 0:
                return False
        return True
    
    # Binary search for max k (or check specific k)
    # For specific k, simply use the algorithm with scaled costs
    return canCompleteCircuit(gas * k, cost * k) % n
```
````

### 2. Minimum Starting Index

**Problem**: When multiple solutions exist, find the minimum index.

**Approach**: The greedy algorithm naturally finds the smallest valid index!

### 3. Maximum Remaining Gas

**Problem**: Among all valid starts, find one that maximizes gas remaining at each station.

**Approach**: Use dynamic programming or two-pass approach.

### 4. Cost Modifications

**Problem**: Each station has an additional fixed fee.

**Approach**: Subtract the fee from gas[i] before running the standard algorithm.

### 5. Two-Stage Journey

**Problem**: You must visit station 0 twice (start and end), but can choose different paths.

**Approach**: Use prefix sums and the greedy algorithm with modifications.

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

### Problem 2: Circular Array Traversal

**Problem:** [LeetCode 2134 - Minimum Swaps to Group All 1's Together II](https://leetcode.com/problems/minimum-swaps-to-group-all-1s-together-ii/)

**Description:** A circular binary array where you need to group all 1s together. Uses sliding window on circular array.

**How to Apply the Technique:**
- Treat array as circular (like gas station problem)
- Use prefix sum approach to handle wrap-around
- Similar greedy elimination of impossible positions

---

### Problem 3: Job Scheduling with Circular Dependencies

**Problem:** [LeetCode 2140 - Solving Questions With Brainpower](https://leetcode.com/problems/solving-questions-with-brainpower/)

**Description:** Given a circular dependency of tasks with energy/gain, find starting point.

**How to Apply the Technique:**
- Extend gas station logic to handle more complex resource types
- Track cumulative resources and eliminate impossible starts

---

### Problem 4: Circular Buffer Minimum

**Problem:** [LeetCode 2281 - Sum of Total Strength of Wizards](https://leetcode.com/problems/sum-of-total-strength-of-wizards/)

**Description:** Find minimum in a circular array using prefix sums and monotonic stack.

**How to Apply the Technique:**
- Similar circular traversal concept
- Use prefix sums to handle wrap-around efficiently

---

### Problem 5: Maximum Circular Subarray Sum

**Problem:** [LeetCode 918 - Maximum Sum Circular Subarray](https://leetcode.com/problems/maximum-sum-circular-subarray/)

**Description:** Find the maximum sum of a circular subarray.

**How to Apply the Technique:**
- Uses similar concept of considering wrap-around
- Apply Kadane's algorithm with gas station insight (if total == max subarray, no wrap)
- Key: If solution wraps around, apply gas station logic

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

### Q2: Can the algorithm handle negative gas values?

**Answer:** The standard problem assumes non-negative gas and costs. If negative values are allowed:
- The existence condition still holds: if total gas >= total cost, solution exists
- The greedy algorithm still works with minor modifications
- You need to handle edge cases where diff can be very negative

### Q3: How does the algorithm handle large arrays?

**Answer:** The algorithm is O(n) time and O(1) space, making it highly efficient for large arrays:
- Only 3 integer variables regardless of input size
- Single pass through the array
- Can handle arrays with millions of elements easily

### Q4: What if the problem asks for the station with maximum remaining gas?

**Answer:** To find the station that maximizes remaining gas:
1. First verify a solution exists (total gas >= total cost)
2. Then either:
   - Run the standard algorithm and track max remaining at each step
   - Or use a modified DP approach that tracks maximum

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

---

## Related Algorithms

- [Kadane's Algorithm](./kadanes-algorithm.md) - Maximum subarray (similar cumulative tracking)
- [Sliding Window](./sliding-window-maximum.md) - Circular array techniques
- [Monotonic Stack](./monotonic-stack.md) - Related to finding valid ranges
- [Prefix Sum](./prefix-sum.md) - Foundation for cumulative calculations
