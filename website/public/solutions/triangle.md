# Triangle

## Problem Description

Given a triangle array, return the minimum path sum from top to bottom.

For each step, you may move to an adjacent number of the row below. More formally, if you are on index `i` on the current row, you may move to either index `i` or index `i + 1` on the next row.

**LeetCode Link:** [Triangle - LeetCode 120](https://leetcode.com/problems/triangle/)

---

## Examples

### Example 1

**Input:**
```python
triangle = [[2],[3,4],[6,5,7],[4,1,8,3]]
```

**Output:**
```python
11
```

**Explanation:** The triangle looks like:
```
   2
  3 4
 6 5 7
4 1 8 3
```
The minimum path sum from top to bottom is `2 + 3 + 5 + 1 = 11`.

### Example 2

**Input:**
```python
triangle = [[-10]]
```

**Output:**
```python
-10
```

---

## Constraints

- `1 <= triangle.length <= 200`
- `triangle[0].length == 1`
- `triangle[i].length == triangle[i - 1].length + 1`
- `-10^4 <= triangle[i][j] <= 10^4`

**Follow up:** Could you do this using only O(n) extra space, where n is the total number of rows in the triangle?

---

## Pattern: Dynamic Programming (Bottom-Up, In-Place)

This problem uses **dynamic programming** with a bottom-up approach. Starting from the second-to-last row, each cell is updated to the minimum of the two cells below it plus its own value. This propagates the minimum path sum upward to the top. The algorithm modifies the triangle in-place for O(1) extra space.

---

## Intuition

The key insight for this problem is using dynamic programming to find the minimum path from top to bottom.

### Key Observations

1. **Bottom-Up DP**: Instead of going from top to bottom, we can work from bottom to top. At each cell, we choose the minimum of the two cells below.

2. **In-Place Modification**: We can modify the triangle directly since we only need the final result at the top.

3. **Optimal Substructure**: The minimum path to any cell is the minimum of the two paths to the cells below it, plus the cell's value.

4. **Adjacent Index**: At position (i, j), you can move to (i+1, j) or (i+1, j+1).

### Why It Works

The bottom-up approach works because:
- We calculate the minimum path to each cell in the row below
- By the time we reach the top, triangle[0][0] contains the minimum path sum
- Each cell is visited once, giving O(n²) time complexity

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **Bottom-Up DP (In-Place)** - O(1) space
2. **Top-Down DP with 1D array** - O(n) space
3. **Recursive with Memoization** - O(n²) time

---

## Approach 1: Bottom-Up DP (In-Place) - Optimal

### Algorithm Steps

1. Start from the second-to-last row (index n-2)
2. For each cell in current row, add the minimum of the two cells below
3. Continue until reaching the top
4. Return triangle[0][0]

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def minimumTotal(self, triangle: List[List[int]]) -> int:
        """
        Find minimum path sum from top to bottom using bottom-up DP.
        
        Args:
            triangle: List of lists representing triangle
            
        Returns:
            Minimum path sum
        """
        if not triangle:
            return 0
        
        # Start from second-to-last row, go up
        for i in range(len(triangle) - 2, -1, -1):
            for j in range(len(triangle[i])):
                # Add minimum of two cells below
                triangle[i][j] += min(triangle[i+1][j], triangle[i+1][j+1])
        
        return triangle[0][0]
```

<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    int minimumTotal(vector<vector<int>>& triangle) {
        if (triangle.empty()) return 0;
        
        // Start from second-to-last row
        for (int i = triangle.size() - 2; i >= 0; i--) {
            for (int j = 0; j <= i; j++) {
                triangle[i][j] += min(triangle[i+1][j], triangle[i+1][j+1]);
            }
        }
        
        return triangle[0][0];
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public int minimumTotal(List<List<Integer>> triangle) {
        if (triangle == null || triangle.isEmpty()) return 0;
        
        // Start from second-to-last row
        for (int i = triangle.size() - 2; i >= 0; i--) {
            List<Integer> current = triangle.get(i);
            List<Integer> below = triangle.get(i + 1);
            
            for (int j = 0; j < current.size(); j++) {
                current.set(j, current.get(j) + Math.min(below.get(j), below.get(j + 1)));
            }
        }
        
        return triangle.get(0).get(0);
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[][]} triangle
 * @return {number}
 */
var minimumTotal = function(triangle) {
    if (!triangle || triangle.length === 0) return 0;
    
    // Start from second-to-last row
    for (let i = triangle.length - 2; i >= 0; i--) {
        for (let j = 0; j < triangle[i].length; j++) {
            triangle[i][j] += Math.min(triangle[i+1][j], triangle[i+1][j+1]);
        }
    }
    
    return triangle[0][0];
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n²) - visit each cell once |
| **Space** | O(1) - in-place modification |

---

## Approach 2: Top-Down DP with 1D Array

### Algorithm Steps

1. Use a 1D array to store minimum path sums for each position
2. Start from the top, propagate minimum sums downward
3. At each position, add minimum from above row

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def minimumTotal(self, triangle: List[List[int]]) -> int:
        n = len(triangle)
        dp = triangle[-1]  # Start from last row
        
        # Work from second-to-last row up to first
        for i in range(n - 2, -1, -1):
            for j in range(i + 1):
                dp[j] = triangle[i][j] + min(dp[j], dp[j + 1])
        
        return dp[0]
```

<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    int minimumTotal(vector<vector<int>>& triangle) {
        int n = triangle.size();
        vector<int> dp(triangle.back());
        
        for (int i = n - 2; i >= 0; i--) {
            for (int j = 0; j <= i; j++) {
                dp[j] = triangle[i][j] + min(dp[j], dp[j + 1]);
            }
        }
        
        return dp[0];
    }
};
```

<!-- slide -->
```java
class Solution {
    public int minimumTotal(List<List<Integer>> triangle) {
        int n = triangle.size();
        int[] dp = new int[n];
        
        // Initialize with last row
        List<Integer> lastRow = triangle.get(n - 1);
        for (int i = 0; i < n; i++) {
            dp[i] = lastRow.get(i);
        }
        
        // Work from second-to-last row up
        for (int i = n - 2; i >= 0; i--) {
            for (int j = 0; j <= i; j++) {
                dp[j] = triangle.get(i).get(j) + Math.min(dp[j], dp[j + 1]);
            }
        }
        
        return dp[0];
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[][]} triangle
 * @return {number}
 */
var minimumTotal = function(triangle) {
    const n = triangle.length;
    let dp = [...triangle[n - 1]];
    
    for (let i = n - 2; i >= 0; i--) {
        for (let j = 0; j <= i; j++) {
            dp[j] = triangle[i][j] + Math.min(dp[j], dp[j + 1]);
        }
    }
    
    return dp[0];
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n²) |
| **Space** | O(n) |

---

## Approach 3: Recursive with Memoization

### Algorithm Steps

1. Use recursion to explore all paths
2. Cache results for each position
3. Return minimum of two recursive calls + current value

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def minimumTotal(self, triangle: List[List[int]]) -> int:
        memo = {}
        
        def dfs(row, col):
            if row == len(triangle):
                return 0
            
            if (row, col) in memo:
                return memo[(row, col)]
            
            # Minimum of two paths below + current value
            min_path = min(dfs(row + 1, col), dfs(row + 1, col + 1))
            memo[(row, col)] = triangle[row][col] + min_path
            
            return memo[(row, col)]
        
        return dfs(0, 0)
```

<!-- slide -->
```cpp
#include <vector>
#include <unordered_map>
using namespace std;

class Solution {
public:
    int minimumTotal(vector<vector<int>>& triangle) {
        unordered_map<int, int> memo;
        return dfs(triangle, 0, 0, memo);
    }
    
private:
    int dfs(vector<vector<int>>& triangle, int row, int col, 
            unordered_map<int, int>& memo) {
        if (row == triangle.size()) return 0;
        
        int key = row * triangle.size() + col;
        if (memo.find(key) != memo.end()) return memo[key];
        
        int minPath = min(dfs(triangle, row + 1, col, memo),
                         dfs(triangle, row + 1, col + 1, memo));
        
        memo[key] = triangle[row][col] + minPath;
        return memo[key];
    }
};
```

<!-- slide -->
```java
class Solution {
    public int minimumTotal(List<List<Integer>> triangle) {
        return dfs(triangle, 0, 0, new HashMap<>());
    }
    
    private int dfs(List<List<Integer>> triangle, int row, int col, 
                   HashMap<String, Integer> memo) {
        if (row == triangle.size()) return 0;
        
        String key = row + "," + col;
        if (memo.containsKey(key)) return memo.get(key);
        
        int minPath = Math.min(dfs(triangle, row + 1, col, memo),
                             dfs(triangle, row + 1, col + 1, memo));
        
        memo.put(key, triangle.get(row).get(col) + minPath);
        return memo.get(key);
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[][]} triangle
 * @return {number}
 */
var minimumTotal = function(triangle) {
    const memo = {};
    
    function dfs(row, col) {
        if (row === triangle.length) return 0;
        
        const key = row + ',' + col;
        if (key in memo) return memo[key];
        
        const minPath = Math.min(dfs(row + 1, col), dfs(row + 1, col + 1));
        memo[key] = triangle[row][col] + minPath;
        
        return memo[key];
    }
    
    return dfs(0, 0);
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n²) |
| **Space** | O(n²) for memoization |

---

## Comparison of Approaches

| Aspect | Bottom-Up In-Place | 1D DP | Memoization |
|--------|-------------------|-------|-------------|
| **Time Complexity** | O(n²) | O(n²) | O(n²) |
| **Space Complexity** | O(1) | O(n) | O(n²) |
| **Recommended** | ✅ | ✅ | |

**Best Approach:** Use Approach 1 (Bottom-Up In-Place) for optimal O(1) space.

---

## Common Pitfalls

### 1. Iteration Direction
**Issue**: Iterating from top to bottom instead of bottom to top.

**Solution**: Start from second-to-last row and work upward.

### 2. Adjacent Index
**Issue**: Using wrong indices for adjacent cells.

**Solution**: At (i, j), adjacent cells are (i+1, j) and (i+1, j+1).

### 3. In-Place Modification
**Issue**: Not realizing triangle is modified.

**Solution**: If you need original values, make a copy first.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Commonly asked in technical interviews
- **Companies**: Amazon, Google, Microsoft
- **Difficulty**: Medium
- **Concepts Tested**: Dynamic Programming, array manipulation

### Learning Outcomes

1. **DP Mastery**: Practice both top-down and bottom-up DP
2. **Space Optimization**: Learn to reduce space complexity
3. **Triangle Traversal**: Understand triangular data structures

---

## Related Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Minimum Path Sum | [Link](https://leetcode.com/problems/minimum-path-sum/) | Similar DP in grid |
| Cherry Pickup | [Link](https://leetcode.com/problems/cherry-pickup/) | Two paths DP |
| Triangle Path Sum | [Link](https://leetcode.com/problems/triangle-path-sum/) | Variation |

---

## Video Tutorial Links

1. **[NeetCode - Triangle](https://www.youtube.com/watch?v=2KTV-ikhV8s)** - Clear explanation
2. **[DP Pattern](https://www.youtube.com/watch?v=NY2yG3UnRxk)** - Dynamic programming

---

## Follow-up Questions

### Q1: How would you return the actual path?

**Answer**: Track the chosen direction (left or right) at each step when computing DP.

### Q2: How would you modify for maximum path sum?

**Answer**: Change `min` to `max` in the recurrence relation.

### Q3: What if you could start from any edge?

**Answer**: Compute minimum for each starting position and take the minimum.

---

## Summary

The **Triangle** problem demonstrates dynamic programming on a triangular data structure.

Key takeaways:
1. Use bottom-up DP for O(1) space solution
2. At each cell, add minimum of two cells below
3. Work from second-to-last row to top
4. Time complexity is O(n²)
5. Space can be optimized to O(1)

This problem is essential for understanding DP optimization and space reduction techniques.
