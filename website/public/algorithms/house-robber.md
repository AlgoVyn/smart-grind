# House Robber

## Category
Dynamic Programming

## Description

The House Robber is a classic dynamic programming problem where you need to find the maximum amount of money you can rob from a linear arrangement of houses without robbing two adjacent houses. Each house contains a certain amount of money, and if you rob one house, you cannot rob its immediate neighbor.

The key insight is that at each house, you have two choices:
1. **Skip the current house**: The maximum amount is the same as what you could get from houses up to the previous house.
2. **Rob the current house**: The maximum amount is the current house's value plus the maximum amount from houses up to two houses back.

This leads to the recurrence: `dp[i] = max(dp[i-1], dp[i-2] + nums[i])`

We can optimize space to O(1) by only keeping track of the previous two states.

---

## When to Use

Use this algorithm when you need to solve problems involving:

- **Linear Sequence Selection**: Problems where you need to select elements from a sequence without selecting adjacent ones
- **Optimization with Constraints**: Maximize/minimize values while avoiding conflicts between adjacent selections
- **Dependency Resolution**: When current decision depends on the previous two states

### Comparison with Alternatives

| Approach | Time | Space | Best Use Case |
|----------|------|-------|---------------|
| **DP (Bottom-up)** | O(n) | O(n) | When you need to reconstruct the solution |
| **DP (Space-optimized)** | O(n) | O(1) | When only the maximum value is needed |
| **Recursion + Memoization** | O(n) | O(n) | When recursion is more intuitive |
| **Greedy** | O(n) | O(1) | Only works for specific variants |

### When to Choose House Robber DP

- **Choose House Robber DP** when:
  - Adjacent elements cannot be selected together
  - You need the global optimal solution
  - The problem has overlapping subproblems

- **Consider Alternative Approaches** when:
  - All houses have equal value (greedy works)
  - Circular houses (needs slight modification)
  - Multiple visits allowed (different variant)

---

## Algorithm Explanation

### Core Concept

The House Robber problem demonstrates the power of **dynamic programming** through **optimal substructure** and **overlapping subproblems**. The key insight is that the decision at each house only depends on two previous states.

### The Recurrence Relation

At each house `i`, you have two choices:

1. **Don't rob house `i`**: Your maximum money is the same as `dp[i-1]`
2. **Rob house `i`**: You take `nums[i]` plus the maximum from `dp[i-2]`

```
dp[i] = max(dp[i-1], dp[i-2] + nums[i])
```

### Visual Representation

For houses = [2, 7, 9, 3, 1]:

```
Index:     0    1    2    3    4
Value:     2    7    9    3    1

DP Table:
dp[0] = 2                    (rob house 0)
dp[1] = max(2, 7) = 7        (rob house 1)
dp[2] = max(7, 2+9) = 11     (rob houses 0, 2)
dp[3] = max(11, 7+3) = 11    (rob houses 0, 2)
dp[4] = max(11, 7+1) = 12    (rob houses 1, 3, or 0, 2, 4)

Answer: 12 (houses 0, 2, 4: 2 + 9 + 1 = 12)
```

### Why Space Optimization Works

Since `dp[i]` only depends on `dp[i-1]` and `dp[i-2]`, we only need to keep track of:
- `prev1` (representing `dp[i-1]`)
- `prev2` (representing `dp[i-2]`)

This reduces space from O(n) to O(1).

### Edge Cases

1. **Empty array**: Return 0
2. **Single house**: Return that house's value
3. **Two houses**: Return max of both
4. **All zeros**: Return 0
5. **Negative values**: Problem typically assumes non-negative (money can't be negative)

---

## Algorithm Steps

### Step-by-Step Approach

1. **Handle Edge Cases**
   - If array is empty, return 0
   - If length is 1, return the single element

2. **Initialize Base Cases**
   - `prev2 = 0` (represents dp[-1], effectively)
   - `prev1 = nums[0]` (maximum for first house)

3. **Iterate Through Houses**
   - For each house `i` from 1 to n-1:
     - Calculate `current = max(prev1, prev2 + nums[i])`
     - Update: `prev2 = prev1`, `prev1 = current`

4. **Return the Result**
   - `prev1` contains the maximum amount

### Decision Tree Visualization

```
For each house i:
                    ┌─────────────────┐
                    │   House i       │
                    └────────┬────────┘
                             │
              ┌──────────────┴──────────────┐
              ▼                             ▼
    ┌─────────────────┐           ┌─────────────────┐
    │  Skip House i  │           │   Rob House i   │
    │   max = dp[i-1]│           │ max = dp[i-2]   │
    │                 │           │      + nums[i]  │
    └────────┬────────┘           └────────┬────────┘
             │                             │
             └──────────────┬──────────────┘
                            ▼
                    ┌─────────────────┐
                    │ dp[i] = max()   │
                    └─────────────────┘
```

---

## Implementation

### Template Code (House Robber)

````carousel
```python
def rob(nums: list[int]) -> int:
    """
    Calculate the maximum amount that can be robbed without robbing adjacent houses.
    
    Args:
        nums: List of non-negative integers representing money in each house
        
    Returns:
        Maximum amount that can be robbed
        
    Time: O(n)
    Space: O(1)
    """
    if not nums:
        return 0
    
    if len(nums) == 1:
        return nums[0]
    
    # Space-optimized DP - only need previous two values
    prev2 = 0  # Represents dp[i-2]
    prev1 = nums[0]  # Represents dp[i-1]
    
    for i in range(1, len(nums)):
        current = max(prev1, prev2 + nums[i])
        prev2 = prev1
        prev1 = current
    
    return prev1


# Example usage and demonstration
if __name__ == "__main__":
    # Test case 1
    houses = [1, 2, 3, 1]
    result = rob(houses)
    print(f"Maximum robbery from {houses}: {result}")  # Output: 4
    # Explanation: Rob house 0 (1) + house 2 (3) = 4
    
    # Test case 2
    houses = [2, 7, 9, 3, 1]
    result = rob(houses)
    print(f"Maximum robbery from {houses}: {result}")  # Output: 12
    # Explanation: Rob house 0 (2) + house 2 (9) + house 4 (1) = 12
    
    # Test case 3 - edge case with single house
    houses = [5]
    result = rob(houses)
    print(f"Maximum robbery from {houses}: {result}")  # Output: 5
    
    # Test case 4 - all zeros
    houses = [0, 0, 0]
    result = rob(houses)
    print(f"Maximum robbery from {houses}: {result}")  # Output: 0
```

<!-- slide -->
```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

/**
 * House Robber - Maximum amount that can be robbed without robbing adjacent houses.
 * 
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 * 
 * @param nums Vector of non-negative integers representing money in each house
 * @return Maximum amount that can be robbed
 */
int rob(vector<int>& nums) {
    if (nums.empty()) {
        return 0;
    }
    
    if (nums.size() == 1) {
        return nums[0];
    }
    
    // Space-optimized DP - only need previous two values
    int prev2 = 0;           // Represents dp[i-2]
    int prev1 = nums[0];     // Represents dp[i-1]
    
    for (int i = 1; i < nums.size(); i++) {
        int current = max(prev1, prev2 + nums[i]);
        prev2 = prev1;
        prev1 = current;
    }
    
    return prev1;
}

// For reconstructing the solution (which houses to rob)
vector<int> robWithPath(vector<int>& nums) {
    if (nums.empty()) {
        return {};
    }
    
    if (nums.size() == 1) {
        return {0};
    }
    
    int n = nums.size();
    vector<int> dp(n);
    dp[0] = nums[0];
    dp[1] = max(nums[0], nums[1]);
    
    for (int i = 2; i < n; i++) {
        dp[i] = max(dp[i-1], dp[i-2] + nums[i]);
    }
    
    // Backtrack to find which houses were robbed
    vector<int> result;
    int i = n - 1;
    while (i >= 0) {
        if (i == 0 || dp[i] != dp[i-1]) {
            result.push_back(i);
            i -= 2;
        } else {
            i--;
        }
    }
    
    reverse(result.begin(), result.end());
    return result;
}

int main() {
    // Test cases
    vector<int> houses1 = {1, 2, 3, 1};
    cout << "Maximum robbery from [1,2,3,1]: " << rob(houses1) << endl;  // Output: 4
    
    vector<int> houses2 = {2, 7, 9, 3, 1};
    cout << "Maximum robbery from [2,7,9,3,1]: " << rob(houses2) << endl;  // Output: 12
    
    vector<int> houses3 = {5};
    cout << "Maximum robbery from [5]: " << rob(houses3) << endl;  // Output: 5
    
    vector<int> houses4 = {0, 0, 0};
    cout << "Maximum robbery from [0,0,0]: " << rob(houses4) << endl;  // Output: 0
    
    // Test with path reconstruction
    vector<int> path = robWithPath(houses2);
    cout << "Houses to rob (indices): ";
    for (int idx : path) {
        cout << idx << " ";
    }
    cout << endl;
    
    return 0;
}
```

<!-- slide -->
```java
/**
 * House Robber - Maximum amount that can be robbed without robbing adjacent houses.
 * 
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
public class HouseRobber {
    
    /**
     * Calculate the maximum amount that can be robbed.
     * 
     * @param nums Array of non-negative integers representing money in each house
     * @return Maximum amount that can be robbed
     */
    public static int rob(int[] nums) {
        if (nums == null || nums.length == 0) {
            return 0;
        }
        
        if (nums.length == 1) {
            return nums[0];
        }
        
        // Space-optimized DP - only need previous two values
        int prev2 = 0;           // Represents dp[i-2]
        int prev1 = nums[0];     // Represents dp[i-1]
        
        for (int i = 1; i < nums.length; i++) {
            int current = Math.max(prev1, prev2 + nums[i]);
            prev2 = prev1;
            prev1 = current;
        }
        
        return prev1;
    }
    
    /**
     * Get the houses to rob (for solution reconstruction).
     * 
     * @param nums Array of non-negative integers
     * @return Array of indices representing which houses to rob
     */
    public static int[] robWithPath(int[] nums) {
        if (nums == null || nums.length == 0) {
            return new int[0];
        }
        
        if (nums.length == 1) {
            return new int[]{0};
        }
        
        int n = nums.length;
        int[] dp = new int[n];
        dp[0] = nums[0];
        dp[1] = Math.max(nums[0], nums[1]);
        
        for (int i = 2; i < n; i++) {
            dp[i] = Math.max(dp[i-1], dp[i-2] + nums[i]);
        }
        
        // Backtrack to find which houses were robbed
        java.util.List<Integer> result = new java.util.ArrayList<>();
        int i = n - 1;
        while (i >= 0) {
            if (i == 0 || dp[i] != dp[i-1]) {
                result.add(i);
                i -= 2;
            } else {
                i--;
            }
        }
        
        // Convert to array in reverse order
        int[] indices = new int[result.size()];
        for (int j = 0; j < result.size(); j++) {
            indices[j] = result.get(result.size() - 1 - j);
        }
        
        return indices;
    }
    
    public static void main(String[] args) {
        // Test cases
        int[] houses1 = {1, 2, 3, 1};
        System.out.println("Maximum robbery from [1,2,3,1]: " + rob(houses1));  // Output: 4
        
        int[] houses2 = {2, 7, 9, 3, 1};
        System.out.println("Maximum robbery from [2,7,9,3,1]: " + rob(houses2));  // Output: 12
        
        int[] houses3 = {5};
        System.out.println("Maximum robbery from [5]: " + rob(houses3));  // Output: 5
        
        int[] houses4 = {0, 0, 0};
        System.out.println("Maximum robbery from [0,0,0]: " + rob(houses4));  // Output: 0
        
        // Test with path reconstruction
        int[] path = robWithPath(houses2);
        System.out.print("Houses to rob (indices): ");
        for (int idx : path) {
            System.out.print(idx + " ");
        }
        System.out.println();
    }
}
```

<!-- slide -->
```javascript
/**
 * House Robber - Maximum amount that can be robbed without robbing adjacent houses.
 * 
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 * 
 * @param {number[]} nums - Array of non-negative integers representing money in each house
 * @returns {number} Maximum amount that can be robbed
 */
function rob(nums) {
    if (!nums || nums.length === 0) {
        return 0;
    }
    
    if (nums.length === 1) {
        return nums[0];
    }
    
    // Space-optimized DP - only need previous two values
    let prev2 = 0;           // Represents dp[i-2]
    let prev1 = nums[0];     // Represents dp[i-1]
    
    for (let i = 1; i < nums.length; i++) {
        const current = Math.max(prev1, prev2 + nums[i]);
        prev2 = prev1;
        prev1 = current;
    }
    
    return prev1;
}

/**
 * Get the houses to rob (for solution reconstruction).
 * 
 * @param {number[]} nums - Array of non-negative integers
 * @returns {number[]} Array of indices representing which houses to rob
 */
function robWithPath(nums) {
    if (!nums || nums.length === 0) {
        return [];
    }
    
    if (nums.length === 1) {
        return [0];
    }
    
    const n = nums.length;
    const dp = new Array(n);
    dp[0] = nums[0];
    dp[1] = Math.max(nums[0], nums[1]);
    
    for (let i = 2; i < n; i++) {
        dp[i] = Math.max(dp[i-1], dp[i-2] + nums[i]);
    }
    
    // Backtrack to find which houses were robbed
    const result = [];
    let i = n - 1;
    while (i >= 0) {
        if (i === 0 || dp[i] !== dp[i-1]) {
            result.push(i);
            i -= 2;
        } else {
            i--;
        }
    }
    
    return result.reverse();
}

// Example usage and demonstration
const houses1 = [1, 2, 3, 1];
console.log(`Maximum robbery from [${houses1}]: ${rob(houses1)}`);  // Output: 4

const houses2 = [2, 7, 9, 3, 1];
console.log(`Maximum robbery from [${houses2}]: ${rob(houses2)}`);  // Output: 12

const houses3 = [5];
console.log(`Maximum robbery from [${houses3}]: ${rob(houses3)}`);  // Output: 5

const houses4 = [0, 0, 0];
console.log(`Maximum robbery from [${houses4}]: ${rob(houses4)}`);  // Output: 0

// Test with path reconstruction
const path = robWithPath(houses2);
console.log(`Houses to rob (indices): ${path.join(' ')}`);  // Output: 0 2 4
```
````

---

## Example

**Input:**
```
houses = [1, 2, 3, 1]
```

**Output:**
```
Maximum robbery: 4
Explanation: Rob house at index 0 (value 1) + house at index 2 (value 3) = 4
```

**Input:**
```
houses = [2, 7, 9, 3, 1]
```

**Output:**
```
Maximum robbery: 12
Explanation: Rob house at index 0 (2) + index 2 (9) + index 4 (1) = 12
```

---

## Time Complexity Analysis

| Operation | Time Complexity | Description |
|-----------|----------------|-------------|
| **Single Pass** | O(n) | Iterate through all houses once |
| **Space-Optimized** | O(n) | O(n) time, O(1) space |
| **With Path Reconstruction** | O(n) | O(n) time, O(n) space for dp array |

### Detailed Breakdown

- **Iterating through houses**: O(n) - single pass through the array
- **Each iteration**: O(1) - just a max operation and some assignments
- **Total**: O(n) time

---

## Space Complexity Analysis

| Approach | Space Complexity | Description |
|----------|-----------------|-------------|
| **Space-Optimized** | O(1) | Only stores two variables |
| **Standard DP** | O(n) | Stores full dp array |
| **With Path** | O(n) | Stores dp array + result |

### Space Optimization Explanation

The key insight is that we only need to remember:
- The maximum amount up to the previous house (`prev1`)
- The maximum amount up to two houses back (`prev2`)

This reduces space from O(n) to O(1).

---

## Common Variations

### 1. House Robber II (Circular Houses)

Houses are arranged in a circle. You cannot rob house 0 and house n-1 together.

````carousel
```python
def rob(nums):
    """House Robber II - Houses in a circle."""
    if not nums:
        return 0
    if len(nums) == 1:
        return nums[0]
    
    # Either exclude first house or exclude last house
    def rob_linear(houses):
        prev2, prev1 = 0, houses[0]
        for val in houses[1:]:
            prev2, prev1 = prev1, max(prev1, prev2 + val)
        return prev1
    
    return max(rob_linear(nums[:-1]), rob_linear(nums[1:]))
```

<!-- slide -->
```cpp
int robII(vector<int>& nums) {
    if (nums.empty()) return 0;
    if (nums.size() == 1) return nums[0];
    
    auto robLinear = [](vector<int>& houses) {
        int prev2 = 0, prev1 = houses[0];
        for (int i = 1; i < houses.size(); i++) {
            int curr = max(prev1, prev2 + houses[i]);
            prev2 = prev1;
            prev1 = curr;
        }
        return prev1;
    };
    
    return max(robLinear(vector<int>(nums.begin(), nums.end()-1)),
               robLinear(vector<int>(nums.begin()+1, nums.end())));
}
```

<!-- slide -->
```java
public int robII(int[] nums) {
    if (nums == null || nums.length == 0) return 0;
    if (nums.length == 1) return nums[0];
    
    return Math.max(
        robLinear(nums, 0, nums.length - 2),
        robLinear(nums, 1, nums.length - 1)
    );
}

private int robLinear(int[] nums, int start, int end) {
    int prev2 = 0, prev1 = nums[start];
    for (int i = start + 1; i <= end; i++) {
        int curr = Math.max(prev1, prev2 + nums[i]);
        prev2 = prev1;
        prev1 = curr;
    }
    return prev1;
}
```

<!-- slide -->
```javascript
function robII(nums) {
    if (!nums || nums.length === 0) return 0;
    if (nums.length === 1) return nums[0];
    
    const robLinear = (houses) => {
        let prev2 = 0, prev1 = houses[0];
        for (let i = 1; i < houses.length; i++) {
            const curr = Math.max(prev1, prev2 + houses[i]);
            prev2 = prev1;
            prev1 = curr;
        }
        return prev1;
    };
    
    return Math.max(
        robLinear(nums.slice(0, -1)),
        robLinear(nums.slice(1))
    );
}
```
````

### 2. House Robber III (Binary Tree)

Houses are arranged in a binary tree. You cannot rob two directly connected houses.

````carousel
```python
def rob(root):
    """House Robber III - Houses in a binary tree."""
    def dfs(node):
        if not node:
            return (0, 0)  # (rob, not_rob)
        
        left = dfs(node.left)
        right = dfs(node.right)
        
        # Rob this node: cannot rob children
        rob_this = node.val + left[1] + right[1]
        # Don't rob this node: take max of children states
        not_rob = max(left) + max(right)
        
        return (rob_this, not_rob)
    
    return max(dfs(root))
```
````

### 3. Maximum Non-Adjacent Sum

Generic version - find maximum sum of non-adjacent elements.

````carousel
```python
def max_non_adjacent_sum(nums):
    """Maximum sum of non-adjacent elements."""
    if not nums:
        return 0
    
    prev2, prev1 = 0, nums[0]
    
    for i in range(1, len(nums)):
        prev2, prev1 = prev1, max(prev1, prev2 + nums[i])
    
    return prev1
```
````

### 4. Paint House (Related Problem)

Minimum cost to paint houses with no adjacent houses having the same color - uses similar DP.

````carousel
```python
def min_cost(costs):
    """Paint House - minimum cost to paint all houses."""
    if not costs:
        return 0
    
    n = len(costs)
    # dp[i][c] = min cost to paint house i with color c
    for i in range(1, n):
        costs[i][0] += min(costs[i-1][1], costs[i-1][2])
        costs[i][1] += min(costs[i-1][0], costs[i-1][2])
        costs[i][2] += min(costs[i-1][0], costs[i-1][1])
    
    return min(costs[n-1])
```
````

---

## Practice Problems

### Problem 1: House Robber

**Problem:** [LeetCode 198 - House Robber](https://leetcode.com/problems/house-robber/)

**Description:** You are a professional robber planning to rob houses along a street. Each house has a certain amount of money, and you cannot rob two adjacent houses. Find the maximum amount you can rob.

**How to Apply the Technique:**
- Use the standard House Robber DP formula: `dp[i] = max(dp[i-1], dp[i-2] + nums[i])`
- Optimize space to O(1) by tracking only the previous two values

---

### Problem 2: House Robber II

**Problem:** [LeetCode 213 - House Robber II](https://leetcode.com/problems/house-robber-ii/)

**Description:** The houses are now arranged in a circle, meaning house 0 and house n-1 are adjacent. You cannot rob both of them.

**How to Apply the Technique:**
- Break the circle by considering two cases: rob first house or rob last house
- Apply standard House Robber to both linear arrays
- Return the maximum of both results

---

### Problem 3: House Robber III

**Problem:** [LeetCode 337 - House Robber III](https://leetcode.com/problems/house-robber-iii/)

**Description:** The houses form a binary tree. You cannot rob two houses that are directly connected (parent-child relationship).

**How to Apply the Technique:**
- Use DFS to traverse the tree
- At each node, return two values: (rob this house, don't rob this house)
- Recursively combine child results

---

### Problem 4: Delete and Earn

**Problem:** [LeetCode 740 - Delete and Earn](https://leetcode.com/problems/delete-and-earn/)

**Description:** Given an array of integers, you can gain points equal to the value of each number. When you take number x, you must delete all occurrences of x-1 and x+1.

**How to Apply the Technique:**
- Transform the problem into House Robber format
- Create a new array where index i represents the total value of all occurrences of i
- Apply the same DP approach

---

### Problem 5: Paint House

**Problem:** [LeetCode 256 - Paint House](https://leetcode.com/problems/paint-house/)

**Description:** Paint houses with minimum cost such that no two adjacent houses have the same color.

**How to Apply the Technique:**
- Similar DP structure: at each house, choose the minimum cost that doesn't conflict with previous choice
- Track minimum costs for each color option

---

## Video Tutorial Links

### Fundamentals

- [House Robber - Dynamic Programming (Take U Forward)](https://www.youtube.com/watch?v=grxZ2HgubBM) - Comprehensive introduction to House Robber
- [House Robber Explanation (NeetCode)](https://www.youtube.com/watch?v=r0-cH5D2f9Q) - Clear explanation with examples

### Variations

- [House Robber II (Circular)](https://www.youtube.com/watch?v=2xSTw2HlZYY) - Handling circular houses
- [House Robber III (Tree)](https://www.youtube.com/watch?v=nHRQ8C3s6pI) - Binary tree version

### Related Problems

- [Delete and Earn](https://www.youtube.com/watch?v=7FC9Hbgoeq4) - House Robber variant
- [Paint House](https://www.youtube.com/watch?v=-L6g8G3i24U) - Related DP problem

---

## Follow-up Questions

### Q1: Why does the greedy approach not work for House Robber?

**Answer:** Greedy (always picking the largest house) fails because:
- Picking a large house might prevent robbing two adjacent smaller houses
- Example: [10, 1, 1, 10] - Greedy picks 10 (index 0), then can't pick 10 (index 3), total = 10
- Optimal: pick both 1's = 12

The DP approach considers all possibilities and guarantees the optimal solution.

### Q2: Can House Robber be solved with recursion?

**Answer:** Yes, using memoization (top-down DP):
```python
def rob(nums):
    memo = {}
    def dfs(i):
        if i >= len(nums):
            return 0
        if i in memo:
            return memo[i]
        memo[i] = max(dfs(i+1), dfs(i+2) + nums[i])
        return memo[i]
    return dfs(0)
```
Time: O(n), Space: O(n) for recursion stack + memo

### Q3: How do you reconstruct which houses were robbed?

**Answer:** Use the standard DP array (not space-optimized), then backtrack:
1. Start from the last house
2. If `dp[i] != dp[i-1]`, we robbed house i (go to i-2)
3. Otherwise, we skipped house i (go to i-1)

### Q4: What if house values can be negative?

**Answer:** The problem typically assumes non-negative values. With negative values:
- If all values are negative, you'd want to rob no houses (return 0)
- The recurrence still works but needs careful initialization

### Q5: How does House Robber relate to other DP problems?

**Answer:** House Robber is the foundation for many DP problems:
- **Climbing Stairs**: Same recurrence, different interpretation
- **Maximum Subarray**: Similar optimal substructure
- **Coin Change**: Similar but different constraint structure

The key concept (deciding whether to include current element based on previous states) appears in many problems.

---

## Summary

The House Robber problem is a fundamental dynamic programming problem that demonstrates:

- **Optimal Substructure**: The solution to the whole problem depends on solutions to subproblems
- **Overlapping Subproblems**: The same subproblems are solved multiple times
- **Space Optimization**: Only need to track previous two states

Key takeaways:

- **Core Formula**: `dp[i] = max(dp[i-1], dp[i-2] + nums[i])`
- **Time Complexity**: O(n) - single pass through the array
- **Space Complexity**: O(1) with optimization
- **Variations**: Circular (II), Tree (III), Delete and Earn all use similar logic

When to use:
- ✅ Linear sequence selection without adjacent elements
- ✅ Problems with "take it or leave it" decisions
- ✅ Foundation for more complex DP problems
- ❌ When elements can be revisited (different problem)

This problem is essential for understanding dynamic programming and is frequently asked in technical interviews.

---

## Related Algorithms

- [Climbing Stairs](./climbing-stairs.md) - Similar DP foundation
- [Maximum Subarray](./maximum-subarray.md) - Related optimization problem
- [Knapsack 0/1](./knapsack-01.md) - Generalization of selection with constraints
- [Longest Increasing Subsequence](./lis.md) - Another classic DP problem
