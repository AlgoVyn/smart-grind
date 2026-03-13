# Two City Scheduling

## Problem Description

A company is planning to interview `2n` people. Given the array `costs` where `costs[i] = [aCost_i, bCost_i]`, the cost of flying the `i`-th person to city A is `aCost_i`, and the cost of flying the `i`-th person to city B is `bCost_i`.

Return the minimum cost to fly every person to a city such that exactly `n` people arrive in each city.

**Link to problem:** [Two City Scheduling - LeetCode 1029](https://leetcode.com/problems/two-city-scheduling/)

## Examples

**Example 1:**
- Input: `costs = [[10,20],[30,200],[400,50],[30,20]]`
- Output: `110`

**Explanation:**
The first person goes to city A for a cost of 10.
The second person goes to city A for a cost of 30.
The third person goes to city B for a cost of 50.
The fourth person goes to city B for a cost of 20.

The total minimum cost is `10 + 30 + 50 + 20 = 110` to have half the people interviewing in each city.

**Example 2:**
- Input: `costs = [[259,770],[448,54],[926,667],[184,139],[840,118],[577,469]]`
- Output: `1859`

**Example 3:**
- Input: `costs = [[515,563],[451,713],[537,709],[343,819],[855,779],[457,60],[650,359],[631,42]]`
- Output: `3086`

## Constraints

- `2 * n == costs.length`
- `2 <= costs.length <= 100`
- `costs.length` is even.
- `1 <= aCost_i, bCost_i <= 1000`

---

## Pattern: Greedy - Cost Difference Sorting

This problem is a classic example of the **Greedy - Cost Difference Sorting** pattern. The key insight is to sort by the relative cost difference between the two cities.

### Core Concept

The fundamental idea is to identify who should go to which city based on the **cost difference**:
- **Cost Difference**: `aCost - bCost` (negative means B is cheaper, positive means A is cheaper)
- **Sort by Difference**: People with the most negative difference (cheaper for B) go to B first
- **First n to A**: After sorting, first n people go to A, remaining go to B

---

## Intuition

The key insight is that we need to minimize the total cost while sending exactly n people to each city. 

By sorting based on the difference `aCost - bCost`:
- People with **negative** difference: A is more expensive, B is cheaper → send to B
- People with **positive** difference: A is cheaper, B is more expensive → send to A

This greedy approach works because we're essentially finding the optimal assignment by prioritizing those who have the strongest preference for one city over the other.

### Why Greedy Works

Consider that:
1. The difference tells us how much "worse" it is to send someone to the non-preferred city
2. By sorting by this difference, we pick the n people who would "lose" the least by going to their non-preferred city
3. This minimizes the total opportunity cost

---

## Multiple Approaches with Code

We'll cover two main approaches:

1. **Greedy with Sorting** - Optimal O(n log n) approach
2. **Dynamic Programming** - Alternative O(n²) approach

---

## Approach 1: Greedy with Sorting (Optimal)

This is the optimal solution using greedy approach with sorting by cost difference.

### Algorithm Steps

1. **Calculate difference**: For each person, compute `diff = aCost - bCost`
2. **Sort by difference**: Sort the array by this difference (ascending)
3. **Assign first n to A**: Send first n people to city A
4. **Assign remaining to B**: Send remaining n people to city B
5. **Calculate total**: Sum up all the costs

### Why It Works

The greedy approach works because:
- People with large negative diff strongly prefer B (B is much cheaper)
- People with large positive diff strongly prefer A (A is much cheaper)
- By assigning first n to A (after sorting by ascending diff), we minimize the total "sacrifice"

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def twoCitySchedCost(self, costs: List[List[int]]) -> int:
        """
        Find minimum cost to send n people to each city.
        
        Args:
            costs: List of [aCost, bCost] pairs
            
        Returns:
            Minimum total cost
        """
        # Sort by the difference (aCost - bCost)
        # This ensures we prioritize people who have the most preference
        costs.sort(key=lambda x: x[0] - x[1])
        
        total = 0
        n = len(costs) // 2
        
        # First n go to city A
        for i in range(n):
            total += costs[i][0]
        
        # Remaining n go to city B
        for i in range(n, len(costs)):
            total += costs[i][1]
        
        return total
```

<!-- slide -->
```cpp
class Solution {
public:
    int twoCitySchedCost(vector<vector<int>>& costs) {
        /**
         * Find minimum cost to send n people to each city.
         * 
         * Args:
         *     costs: Vector of [aCost, bCost] pairs
         * 
         * Returns:
         *     Minimum total cost
         */
        // Sort by the difference (aCost - bCost)
        sort(costs.begin(), costs.end(), 
             [](const vector<int>& a, const vector<int>& b) {
                 return (a[0] - a[1]) < (b[0] - b[1]);
             });
        
        int total = 0;
        int n = costs.size() / 2;
        
        // First n go to city A
        for (int i = 0; i < n; i++) {
            total += costs[i][0];
        }
        
        // Remaining n go to city B
        for (int i = n; i < costs.size(); i++) {
            total += costs[i][1];
        }
        
        return total;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int twoCitySchedCost(int[][] costs) {
        /**
         * Find minimum cost to send n people to each city.
         * 
         * Args:
         *     costs: 2D array of [aCost, bCost] pairs
         * 
         * Returns:
         *     Minimum total cost
         */
        // Sort by the difference (aCost - bCost)
        Arrays.sort(costs, (a, b) -> (a[0] - a[1]) - (b[0] - b[1]));
        
        int total = 0;
        int n = costs.length / 2;
        
        // First n go to city A
        for (int i = 0; i < n; i++) {
            total += costs[i][0];
        }
        
        // Remaining n go to city B
        for (int i = n; i < costs.length; i++) {
            total += costs[i][1];
        }
        
        return total;
    }
}
```

<!-- slide -->
```javascript
/**
 * Find minimum cost to send n people to each city.
 * 
 * @param {number[][]} costs - Array of [aCost, bCost] pairs
 * @return {number} - Minimum total cost
 */
var twoCitySchedCost = function(costs) {
    // Sort by the difference (aCost - bCost)
    costs.sort((a, b) => (a[0] - a[1]) - (b[0] - b[1]));
    
    let total = 0;
    const n = costs.length / 2;
    
    // First n go to city A
    for (let i = 0; i < n; i++) {
        total += costs[i][0];
    }
    
    // Remaining n go to city B
    for (let i = n; i < costs.length; i++) {
        total += costs[i][1];
    }
    
    return total;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n log n) - Sorting the costs array |
| **Space** | O(1) - Sorting in place (or O(n) for some languages) |

---

## Approach 2: Dynamic Programming (Alternative)

This is an alternative O(n²) DP approach that considers all possibilities.

### Algorithm Steps

1. **Define DP state**: `dp[i][j]` = minimum cost considering first i people with j sent to city A
2. **Initialize**: `dp[0][0] = 0`, others as infinity
3. **Transition**: For each person i:
   - Send to A: `dp[i+1][j+1] = min(dp[i+1][j+1], dp[i][j] + costs[i][0])`
   - Send to B: `dp[i+1][j] = min(dp[i+1][j], dp[i][j] + costs[i][1])`
4. **Result**: `dp[n*2][n]`

### Why It Works

The DP approach explores all possible assignments, guaranteeing an optimal solution by considering every combination of sending people to either city.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def twoCitySchedCost_dp(self, costs: List[List[int]]) -> int:
        """
        Find minimum cost using dynamic programming.
        
        Args:
            costs: List of [aCost, bCost] pairs
            
        Returns:
            Minimum total cost
        """
        n = len(costs) // 2
        
        # dp[i][j] = min cost considering first i people with j sent to A
        dp = [[float('inf')] * (n + 1) for _ in range(2 * n + 1)]
        dp[0][0] = 0
        
        for i in range(2 * n):
            for j in range(n + 1):
                if dp[i][j] == float('inf'):
                    continue
                # Send to A
                if j + 1 <= n:
                    dp[i + 1][j + 1] = min(dp[i + 1][j + 1], 
                                           dp[i][j] + costs[i][0])
                # Send to B
                dp[i + 1][j] = min(dp[i + 1][j], 
                                   dp[i][j] + costs[i][1])
        
        return dp[2 * n][n]
```

<!-- slide -->
```cpp
class Solution {
public:
    int twoCitySchedCost(vector<vector<int>>& costs) {
        /**
         * Find minimum cost using dynamic programming.
         * 
         * Args:
         *     costs: Vector of [aCost, bCost] pairs
         * 
         * Returns:
         *     Minimum total cost
         */
        int n = costs.size() / 2;
        int m = costs.size();
        
        // dp[i][j] = min cost considering first i people with j sent to A
        vector<vector<int>> dp(m + 1, vector<int>(n + 1, INT_MAX));
        dp[0][0] = 0;
        
        for (int i = 0; i < m; i++) {
            for (int j = 0; j <= n; j++) {
                if (dp[i][j] == INT_MAX) continue;
                
                // Send to A
                if (j + 1 <= n) {
                    dp[i + 1][j + 1] = min(dp[i + 1][j + 1], 
                                           dp[i][j] + costs[i][0]);
                }
                // Send to B
                dp[i + 1][j] = min(dp[i + 1][j], 
                                   dp[i][j] + costs[i][1]);
            }
        }
        
        return dp[m][n];
    }
};
```

<!-- slide -->
```java
class Solution {
    public int twoCitySchedCost(int[][] costs) {
        /**
         * Find minimum cost using dynamic programming.
         * 
         * Args:
         *     costs: 2D array of [aCost, bCost] pairs
         * 
         * Returns:
         *     Minimum total cost
         */
        int n = costs.length / 2;
        int m = costs.length;
        
        // dp[i][j] = min cost considering first i people with j sent to A
        int[][] dp = new int[m + 1][n + 1];
        for (int[] row : dp) {
            Arrays.fill(row, Integer.MAX_VALUE);
        }
        dp[0][0] = 0;
        
        for (int i = 0; i < m; i++) {
            for (int j = 0; j <= n; j++) {
                if (dp[i][j] == Integer.MAX_VALUE) continue;
                
                // Send to A
                if (j + 1 <= n) {
                    dp[i + 1][j + 1] = Math.min(dp[i + 1][j + 1], 
                                               dp[i][j] + costs[i][0]);
                }
                // Send to B
                dp[i + 1][j] = Math.min(dp[i + 1][j], 
                                        dp[i][j] + costs[i][1]);
            }
        }
        
        return dp[m][n];
    }
}
```

<!-- slide -->
```javascript
/**
 * Find minimum cost using dynamic programming.
 * 
 * @param {number[][]} costs - Array of [aCost, bCost] pairs
 * @return {number} - Minimum total cost
 */
var twoCitySchedCost = function(costs) {
    const n = costs.length / 2;
    const m = costs.length;
    
    // dp[i][j] = min cost considering first i people with j sent to A
    const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(Infinity));
    dp[0][0] = 0;
    
    for (let i = 0; i < m; i++) {
        for (let j = 0; j <= n; j++) {
            if (dp[i][j] === Infinity) continue;
            
            // Send to A
            if (j + 1 <= n) {
                dp[i + 1][j + 1] = Math.min(dp[i + 1][j + 1], 
                                           dp[i][j] + costs[i][0]);
            }
            // Send to B
            dp[i + 1][j] = Math.min(dp[i + 1][j], 
                                    dp[i][j] + costs[i][1]);
        }
    }
    
    return dp[m][n];
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n²) - DP table has n² states |
| **Space** | O(n²) - For the DP table |

---

## Comparison of Approaches

| Aspect | Greedy Sorting | Dynamic Programming |
|--------|----------------|---------------------|
| **Time Complexity** | O(n log n) | O(n²) |
| **Space Complexity** | O(1) | O(n²) |
| **Implementation** | Simple | Complex |
| **Optimality** | ✅ Always optimal | ✅ Always optimal |
| **LeetCode Optimal** | ✅ Yes | ❌ No |
| **Best For** | Most cases | Understanding DP |

**Best Approach:** The greedy sorting approach is optimal with O(n log n) time complexity and is the preferred solution for this problem.

---

## Why This Problem is Important

The two city scheduling problem demonstrates:

1. **Greedy Algorithm Design**: Understanding when greedy works vs. when it doesn't
2. **Cost-Benefit Analysis**: Making decisions based on relative differences
3. **Sorting as Optimization**: Using sorting to simplify complex decisions
4. **Real-world Applications**: Resource allocation, task scheduling

---

## Related Problems

Based on similar themes (greedy algorithms, optimization, sorting):

### Related Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Minimum Cost to Hire K Workers | [Link](https://leetcode.com/problems/minimum-cost-to-hire-k-workers/) | Similar greedy with quality ratio |
| Best Time to Buy and Sell Stock II | [Link](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/) | Greedy profit maximization |
| Assign Cookies | [Link](https://leetcode.com/problems/assign-cookies/) | Greedy matching |
| Meeting Rooms II | [Link](https://leetcode.com/problems/meeting-rooms-ii/) | Interval scheduling |

### Pattern Reference

For more detailed explanations of the Greedy pattern and its variations, see:
- **[Greedy - Buy and Sell Stock](/patterns/greedy-buy-sell-stock)**
- **[Greedy - Gas Station](/patterns/greedy-gas-station-circuit)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Greedy Algorithm Explanation

- [NeetCode - Two City Scheduling](https://www.youtube.com/watch?v=kShkQLQ6Msw) - Clear explanation with visual examples
- [Greedy Algorithm Explained](https://www.youtube.com/watch?v=0v4mtkAPN7w) - Understanding greedy approach
- [LeetCode 1029 Official Solution](https://www.youtube.com/watch?v=Ew7pWcpqGvU) - Official problem solution

### Related Problem Solutions

- [Minimum Cost to Hire K Workers](https://www.youtube.com/watch?v=lLhaFp8EB_0) - Similar greedy pattern
- [Meeting Rooms II](https://www.youtube.com/watch?v=5l68vNBocom) - Interval greedy scheduling

---

## Follow-up Questions

### Q1: Why does sorting by (aCost - bCost) work?

**Answer:** The difference tells us how much "worse" it is to send someone to their non-preferred city. By sorting in ascending order, we ensure that people who strongly prefer B (large negative diff) go to B first, and those who prefer A (large positive diff) go to A. When we take the first n for A and rest for B, we minimize the total "sacrifice".

---

### Q2: What if we need to send different numbers to each city?

**Answer:** You would sort by difference and then simply take the first k people to city A and the rest to city B, where k is the number of people to send to city A.

---

### Q3: Can this be solved with DP for verification?

**Answer:** Yes! The DP approach (Approach 2) explores all possibilities and can verify the greedy solution. It's particularly useful for understanding why greedy works here.

---

### Q4: What if costs can be negative?

**Answer:** The problem states costs are positive (1-1000), so negative costs aren't considered. With negative costs, the problem becomes more complex as you could potentially get infinite negative cost by cycling.

---

### Q5: How would you handle ties in the difference?

**Answer:** Ties don't affect the optimal solution because any ordering among people with the same difference produces the same total cost. However, you could break ties by preferring lower aCost or bCost.

---

### Q6: What is the time complexity of the DP approach?

**Answer:** O(n²) time and space, where n is half the number of people. For 100 people (50 each), this is manageable but less efficient than O(n log n) greedy.

---

### Q7: How would you extend this to 3 cities?

**Answer:** For 3+ cities, the greedy approach becomes more complex. You would need to use a priority queue or more sophisticated algorithm. The DP approach extends to multi-dimensional but becomes O(n^k) where k is number of cities.

---

### Q8: What real-world applications does this have?

**Answer:**
- Employee relocation assignments
- Conference speaker scheduling
- Resource distribution between locations
- Supply chain optimization

---

### Q9: How does this relate to the assignment problem?

**Answer:** This is a simplified version of the assignment problem where exactly n must go to each location. The full assignment problem is more complex (Hungarian algorithm O(n³)), but the greedy works here due to the equal split constraint.

---

### Q10: What edge cases should be tested?

**Answer:**
- Equal costs for both cities for all people
- All people cheaper for city A
- All people cheaper for city B
- Costs where greedy might seem counterintuitive
- Minimum input size (2 people)
- Maximum input size (100 people)

---

## Common Pitfalls

### 1. Sorting Direction
**Issue**: Sorting in the wrong direction.

**Solution**: Remember to sort by (aCost - bCost) in ascending order. Negative diff means B is cheaper, positive means A is cheaper.

### 2. Off-by-One in Split
**Issue**: Taking wrong number of people to each city.

**Solution:** Remember n = costs.length / 2, and first n go to A, rest to B.

### 3. Forgetting Integer Division
**Issue**: Not dividing by 2 to get n.

**Solution:** Always compute n = len(costs) // 2 since we need exactly n people per city.

### 4. Not Using Infinity in DP
**Issue:** Not initializing DP with infinity properly.

**Solution:** Use a large value like Float('inf') or INT_MAX to represent unreachable states.

---

## Summary

The **Two City Scheduling** problem demonstrates the power of greedy algorithms:

- **Greedy approach**: Sort by cost difference, assign first n to A, rest to B
- **Time Complexity**: O(n log n) for greedy, O(n²) for DP
- **Space Complexity**: O(1) for greedy, O(n²) for DP
- **Key insight**: The relative cost (difference) determines optimal assignment

The key insight is that by sorting based on the difference between costs, we naturally prioritize those who have the strongest preference for one city over the other, minimizing the total cost.

This problem is an excellent demonstration of how understanding the problem constraints and properties can lead to an elegant greedy solution.

### Pattern Summary

This problem exemplifies the **Greedy - Cost Difference Sorting** pattern, characterized by:
- Sorting by relative cost/benefit
- Making locally optimal decisions
- Achieving global optimality through careful ordering
- Simple implementation with excellent performance

For more details on this pattern and its variations, see the **[Greedy - Buy and Sell Stock Pattern](/patterns/greedy-buy-sell-stock)**.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/two-city-scheduling/discuss/) - Community solutions and explanations
- [Greedy Algorithm - GeeksforGeeks](https://www.geeksforgeeks.org/greedy-algorithms/) - Detailed greedy explanation
- [Assignment Problem - Wikipedia](https://en.wikipedia.org/wiki/Assignment_problem) - Broader context
- [Sorting Algorithms - GeeksforGeeks](https://www.geeksforgeeks.org/sorting-algorithms/) - Understanding sorting
