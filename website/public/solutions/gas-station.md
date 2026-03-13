# Gas Station

## Problem Description

There are n gas stations along a circular route, where the amount of gas at the ith station is gas[i].
You have a car with an unlimited gas tank and it costs cost[i] of gas to travel from the ith station to its next (i + 1)th station. You begin the journey with an empty tank at one of the gas stations.

Given two integer arrays gas and cost, return the starting gas station's index if you can travel around the circuit once in the clockwise direction, otherwise return -1. If there exists a solution, it is guaranteed to be unique.

**Link to problem:** [Gas Station - LeetCode 134](https://leetcode.com/problems/gas-station/)

---

## Examples

### Example 1

**Input:**
```python
gas = [1,2,3,4,5], cost = [3,4,5,1,2]
```

**Output:**
```python
3
```

**Explanation:**
Start at station 3 (index 3) and fill up with 4 unit of gas. Your tank = 0 + 4 = 4
Travel to station 4. Your tank = 4 - 1 + 5 = 8
Travel to station 0. Your tank = 8 - 2 + 1 = 7
Travel to station 1. Your tank = 7 - 3 + 2 = 6
Travel to station 2. Your tank = 6 - 4 + 3 = 5
Travel to station 3. The cost is 5. Your gas is just enough to travel back to station 3.
Therefore, return 3 as the starting index.

### Example 2

**Input:**
```python
gas = [2,3,4], cost = [3,4,3]
```

**Output:**
```python
-1
```

**Explanation:**
You can't start at station 0 or 1, as there is not enough gas to travel to the next station.
Let's start at station 2 and fill up with 4 unit of gas. Your tank = 0 + 4 = 4
Travel to station 0. Your tank = 4 - 3 + 2 = 3
Travel to station 1. Your tank = 3 - 3 + 3 = 3
You cannot travel back to station 2, as it requires 4 unit of gas but you only have 3.
Therefore, you can't travel around the circuit once no matter where you start.

---

## Constraints

- n == gas.length == cost.length
- 1 <= n <= 10^5
- 0 <= gas[i], cost[i] <= 10^4
- The input is generated such that the answer is unique.

---

## Pattern: Greedy - Cumulative Sum Tracking

This problem demonstrates the **Greedy** pattern with cumulative sum tracking. The key insight is that if you can't reach station i from station j, you can't start from any station between j and i.

---

## Intuition

The key insight for this problem is understanding why the greedy approach works:

> If starting at station A fails at station B (you run out of gas before reaching B), then no station between A and B can be a valid starting point.

### Key Observations

1. **Total Gas Check**: If total gas < total cost, it's impossible to complete the circuit regardless of where you start.

2. **Cumulative Sum**: Track running total of (gas[i] - cost[i]) as you iterate through stations.

3. **Reset Point**: When cumulative sum goes negative, the current starting point fails. The next station becomes the new candidate.

4. **Mathematical Proof**: 
   - If you start at A and fail at B, every station between A and B has less gas than needed to reach the next station
   - Therefore, none of them can be a valid starting point
   - Only stations after B need to be considered

### Algorithm Overview

1. First, check if total gas >= total cost (if not, return -1)
2. Initialize total = 0 and start = 0
3. Iterate through each station:
   - Add (gas[i] - cost[i]) to total
   - If total < 0, reset total to 0 and set start = i + 1
4. Return start

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Greedy Single Pass** - Optimal solution (O(n) time, O(1) space)
2. **Brute Force** - Check each starting point (O(n²) time)

---

## Approach 1: Greedy Single Pass (Optimal) ⭐

### Algorithm Steps

1. First check if total gas >= total cost; if not, return -1
2. Initialize `total` to 0 (running sum) and `start` to 0
3. Iterate through each station:
   - Add the difference (gas[i] - cost[i]) to total
   - If total becomes negative, reset to 0 and move start to next station
4. Return start index

### Why It Works

The greedy approach works because:
1. If starting at station A fails at station B, no station between A and B can work
2. The minimum cumulative sum indicates the worst starting point
3. Starting after the minimum guarantees success if a solution exists

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def canCompleteCircuit(self, gas: List[int], cost: List[int]) -> int:
        """
        Find the starting station index that allows complete circuit traversal.
        
        Uses greedy approach with cumulative sum tracking.
        
        Args:
            gas: List of gas available at each station
            cost: List of gas cost to travel to next station
            
        Returns:
            Starting station index, or -1 if impossible
        """
        # Step 1: Check if total gas is sufficient
        if sum(gas) < sum(cost):
            return -1
        
        total = 0
        start = 0
        
        # Step 2: Single pass through stations
        for i in range(len(gas)):
            total += gas[i] - cost[i]
            
            # Step 3: If we can't reach current station, reset
            if total < 0:
                total = 0
                start = i + 1
        
        return start
```

<!-- slide -->
```cpp
class Solution {
public:
    int canCompleteCircuit(vector<int>& gas, vector<int>& cost) {
        int n = gas.size();
        
        // Step 1: Check if total gas is sufficient
        long long totalGas = 0, totalCost = 0;
        for (int i = 0; i < n; i++) {
            totalGas += gas[i];
            totalCost += cost[i];
        }
        if (totalGas < totalCost) return -1;
        
        int total = 0;
        int start = 0;
        
        // Step 2: Single pass through stations
        for (int i = 0; i < n; i++) {
            total += gas[i] - cost[i];
            
            // Step 3: If we can't reach current station, reset
            if (total < 0) {
                total = 0;
                start = i + 1;
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
        
        // Step 1: Check if total gas is sufficient
        int totalGas = 0, totalCost = 0;
        for (int i = 0; i < n; i++) {
            totalGas += gas[i];
            totalCost += cost[i];
        }
        if (totalGas < totalCost) return -1;
        
        int total = 0;
        int start = 0;
        
        // Step 2: Single pass through stations
        for (int i = 0; i < n; i++) {
            total += gas[i] - cost[i];
            
            // Step 3: If we can't reach current station, reset
            if (total < 0) {
                total = 0;
                start = i + 1;
            }
        }
        
        return start;
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
var canCompleteCircuit = function(gas, cost) {
    const n = gas.length;
    
    // Step 1: Check if total gas is sufficient
    let totalGas = 0, totalCost = 0;
    for (let i = 0; i < n; i++) {
        totalGas += gas[i];
        totalCost += cost[i];
    }
    if (totalGas < totalCost) return -1;
    
    let total = 0;
    let start = 0;
    
    // Step 2: Single pass through stations
    for (let i = 0; i < n; i++) {
        total += gas[i] - cost[i];
        
        // Step 3: If we can't reach current station, reset
        if (total < 0) {
            total = 0;
            start = i + 1;
        }
    }
    
    return start;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - single pass through the array |
| **Space** | O(1) - constant extra space |

---

## Approach 2: Brute Force (For Understanding)

### Algorithm Steps

1. For each possible starting station (0 to n-1)
2. Try to complete the circuit from that starting point
3. Track current gas and return the starting point if successful

### Why It Works

This approach checks every possible starting point explicitly. While inefficient, it demonstrates the problem's requirements clearly.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def canCompleteCircuit(self, gas: List[int], cost: List[int]) -> int:
        """
        Brute force approach - check each starting point.
        Time: O(n²), Space: O(1)
        """
        n = len(gas)
        
        for start in range(n):
            current_gas = 0
            # Try to complete circuit from start
            for i in range(n):
                idx = (start + i) % n
                current_gas += gas[idx] - cost[idx]
                if current_gas < 0:
                    break
            else:
                # Successfully completed
                return start
        
        return -1
```

<!-- slide -->
```cpp
class Solution {
public:
    int canCompleteCircuit(vector<int>& gas, vector<int>& cost) {
        int n = gas.size();
        
        // Try each starting point
        for (int start = 0; start < n; start++) {
            int currentGas = 0;
            // Try to complete circuit from start
            for (int i = 0; i < n; i++) {
                int idx = (start + i) % n;
                currentGas += gas[idx] - cost[idx];
                if (currentGas < 0) break;
            }
            if (currentGas >= 0) return start;
        }
        
        return -1;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int canCompleteCircuit(int[] gas, int[] cost) {
        int n = gas.length;
        
        // Try each starting point
        for (int start = 0; start < n; start++) {
            int currentGas = 0;
            // Try to complete circuit from start
            for (int i = 0; i < n; i++) {
                int idx = (start + i) % n;
                currentGas += gas[idx] - cost[idx];
                if (currentGas < 0) break;
            }
            if (currentGas >= 0) return start;
        }
        
        return -1;
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
var canCompleteCircuit = function(gas, cost) {
    const n = gas.length;
    
    // Try each starting point
    for (let start = 0; start < n; start++) {
        let currentGas = 0;
        // Try to complete circuit from start
        for (let i = 0; i < n; i++) {
            const idx = (start + i) % n;
            currentGas += gas[idx] - cost[idx];
            if (currentGas < 0) break;
        }
        if (currentGas >= 0) return start;
    }
    
    return -1;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n²) - try each starting point |
| **Space** | O(1) - constant extra space |

---

## Comparison of Approaches

| Aspect | Greedy Single Pass | Brute Force |
|--------|-------------------|-------------|
| **Time Complexity** | O(n) | O(n²) |
| **Space Complexity** | O(1) | O(1) |
| **LeetCode Optimal** | ✅ | ❌ |
| **Difficulty** | Medium | Easy |

**Best Approach:** Use Approach 1 (Greedy Single Pass) for the optimal solution. It's elegant and efficient.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Commonly asked in technical interviews
- **Companies**: Amazon, Bloomberg, Uber, Microsoft
- **Difficulty**: Medium
- **Concepts Tested**: Greedy algorithms, array traversal, mathematical reasoning

### Learning Outcomes

1. **Greedy Algorithm Mastery**: Learn when greedy approaches work
2. **Mathematical Proof**: Understand why local optimal leads to global optimal
3. **Single Pass Optimization**: Reduce O(n²) to O(n)
4. **Edge Case Handling**: Deal with circular arrays

---

## Related Problems

Based on similar themes (greedy, array traversal, circular problems):

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Longest Substring Without Repeating Characters | [Link](https://leetcode.com/problems/longest-substring-without-repeating-characters/) | Sliding window greedy |
| Container With Most Water | [Link](https://leetcode.com/problems/container-with-most-water/) | Two pointer greedy |
| Jump Game | [Link](https://leetcode.com/problems/jump-game/) | Greedy reachability |
| Minimum Number of Swaps to Make the String Balanced | [Link](https://leetcode.com/problems/minimum-number-of-swaps-to-make-the-string-balanced/) | Similar greedy pattern |

### Pattern Reference

For more detailed explanations of the Greedy pattern, see:
- **[Greedy Pattern](/patterns/greedy-buy-sell-stock)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Recommended Tutorials

1. **[NeetCode - Gas Station](https://www.youtube.com/watch?v=sJ3XcG5j2MQ)** - Clear explanation with visual examples
2. **[Gas Station - LeetCode 134](https://www.youtube.com/watch?v=glJ0G2O6G6A)** - Detailed walkthrough
3. **[Greedy Algorithm Explanation](https://www.youtube.com/watch?v=xZL-QXb3zYs)** - Understanding greedy approach

### Related Concepts

- **[Two Pointers Technique](https://www.youtube.com/watch?v=4OQe3q5K6j8)** - Related pattern
- **[Cumulative Sum](https://www.youtube.com/watch?v=Ov9-LqDc5i4)** - Prefix sum technique

---

## Follow-up Questions

### Q1: What if we needed to find ALL possible starting stations?

**Answer:** You would need to track all positions where the cumulative sum is minimum. However, the problem states the answer is unique, so this doesn't apply here.

---

### Q2: How would you modify the solution to handle the case where multiple solutions exist?

**Answer:** Instead of returning immediately when total >= 0, continue tracking and collect all valid starting positions. You'd also need to track when the cumulative sum resets.

---

### Q3: What if we had to minimize the total cost spent on gas?

**Answer:** This becomes a different optimization problem. You might want to fill up at cheaper stations first, which requires a different greedy strategy similar to the "minimum cost to travel" problem.

---

### Q4: How does the solution change if the route is not circular?

**Answer:** If it's not circular (linear route), the problem becomes simpler - just check if gas is sufficient from start to end, and find the optimal stopping points.

---

### Q5: Can you solve this using Dynamic Programming?

**Answer:** Yes, you could use DP to track the maximum gas at each position, but it's overkill. The greedy solution is optimal and much simpler.

---

## Common Pitfalls

### 1. Not Checking Total Gas vs Total Cost
**Issue:** Starting to iterate without first checking if a solution is possible.

**Solution:** Always check `if sum(gas) < sum(cost): return -1` first.

### 2. Forgetting to Reset Cumulative Sum
**Issue:** Not resetting the running total to 0 when it becomes negative.

**Solution:** Set `total = 0` when `total < 0` to start fresh from the next station.

### 3. Incorrect Start Index Update
**Issue:** Setting start to `i` instead of `i + 1` when total goes negative.

**Solution:** Use `start = i + 1` to skip the current station and all stations before it.

### 4. Not Handling Single Station Case
**Issue:** Edge case where n = 1 might not be handled correctly.

**Solution:** The algorithm handles it correctly, but ensure loop covers all stations.

### 5. Integer Overflow
**Issue:** Not using appropriate data types for large inputs.

**Solution:** Use long long (C++) or check for overflow in other languages when summing.

---

## Summary

The **Gas Station** problem demonstrates the **Greedy** pattern with cumulative sum tracking. The key insight is that if you can't reach station i from station j, you can't start from any station between j and i.

### Key Takeaways

1. **Total Check First**: Always verify total gas >= total cost before attempting to find a starting point
2. **Cumulative Sum Tracking**: Use a running total to track gas minus cost
3. **Reset on Failure**: When cumulative sum goes negative, the next station becomes the new candidate
4. **Single Pass Solution**: The greedy approach solves this in O(n) time with O(1) space

### Pattern Summary

This problem exemplifies the **Greedy - Cumulative Sum** pattern, characterized by:
- Making locally optimal decisions (resetting when sum goes negative)
- Proving global optimality through the argument that if A fails at B, no station between A and B can succeed
- Single pass through data with constant space

For more details on this pattern, see the **[Greedy Pattern](/patterns/greedy)**.

---

## Additional Resources

- [LeetCode Problem 134](https://leetcode.com/problems/gas-station/) - Official problem page
- [Greedy Algorithms - GeeksforGeeks](https://www.geeksforgeeks.org/greedy-algorithms/) - Detailed greedy explanation
- [Kadane's Algorithm](https://en.wikipedia.org/wiki/Maximum_subarray_problem) - Related cumulative sum technique
- [Pattern: Greedy](/patterns/greedy-buy-sell-stock) - Comprehensive pattern guide
