# Unique Paths

## Problem Description

There is a robot on an `m x n` grid. The robot is initially located at the top-left corner (i.e., `grid[0][0]`). The robot tries to move to the bottom-right corner (i.e., `grid[m - 1][n - 1]`). The robot can only move either down or right at any point in time.

Given the two integers `m` and `n`, return the number of possible unique paths that the robot can take to reach the bottom-right corner.

The test cases are generated so that the answer will be less than or equal to `2 * 10^9`.

**LeetCode Link:** [LeetCode 62 - Unique Paths](https://leetcode.com/problems/unique-paths/)

## Examples

**Example 1:**

**Input:**
```python
m = 3, n = 7
```

**Output:**
```python
28
```

**Example 2:**

**Input:**
```python
m = 3, n = 2
```

**Output:**
```python
3
```

**Explanation:** From the top-left corner, there are a total of 3 ways to reach the bottom-right corner:
1. Right -> Down -> Down
2. Down -> Down -> Right
3. Down -> Right -> Down

## Constraints

- `1 <= m, n <= 100`

---

## Pattern: Dynamic Programming - 2D Grid

This problem demonstrates the **Dynamic Programming** pattern for grid path counting. The key is understanding that each cell's value depends on cells above and to the left.

### Core Concept

- **DP Table**: dp[i][j] = number of paths to reach cell (i,j)
- **Base Cases**: First row and column = 1 (only one way)
- **Transition**: dp[i][j] = dp[i-1][j] + dp[i][j-1]
- **Space Optimization**: Can use O(min(m,n)) space

### Why It Works

The algorithm works because:
1. Robot can only move right or down
2. To reach (i,j), must come from (i-1,j) or (i,j-1)
3. Sum of paths from both sources gives total paths

---

## Intuition

The key insight is that each cell's value represents the number of unique paths to reach that cell. Since the robot can only move right or down:

1. To reach any cell (i, j), the robot must first reach either:
   - The cell above (i-1, j), then move down, OR
   - The cell to the left (i, j-1), then move right

2. Therefore, the number of paths to reach (i, j) = paths to reach (i-1, j) + paths to reach (i, j-1)

3. Base cases:
   - First row (i=0): Only one way - move right all the way → 1 path each
   - First column (j=0): Only one way - move down all the way → 1 path each

This is a classic example of building a solution from smaller subproblems.

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **2D DP Table** - Standard DP approach
2. **1D DP Optimization** - Space optimized
3. **Combinatorics** - Mathematical solution using combinations

---

## Approach 1: 2D DP Table

### Why It Works

We build a 2D table where `dp[i][j]` represents the number of unique paths to reach cell (i,j). The first row and column are initialized to 1 because there's only one way to reach any cell in the first row (all rights) or first column (all downs).

### Code Implementation

````carousel
```python
class Solution:
    def uniquePaths(self, m: int, n: int) -> int:
        """
        Find number of unique paths using 2D DP.
        
        Args:
            m: Number of rows
            n: Number of columns
            
        Returns:
            Number of unique paths from top-left to bottom-right
        """
        # Create DP table initialized with 1s
        dp = [[1] * n for _ in range(m)]
        
        # Fill the table
        for i in range(1, m):
            for j in range(1, n):
                dp[i][j] = dp[i-1][j] + dp[i][j-1]
        
        return dp[m-1][n-1]
```

<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    int uniquePaths(int m, int n) {
        vector<vector<int>> dp(m, vector<int>(n, 1));
        
        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                dp[i][j] = dp[i-1][j] + dp[i][j-1];
            }
        }
        
        return dp[m-1][n-1];
    }
};
```

<!-- slide -->
```java
class Solution {
    public int uniquePaths(int m, int n) {
        int[][] dp = new int[m][n];
        
        // Initialize first row
        for (int j = 0; j < n; j++) {
            dp[0][j] = 1;
        }
        
        // Initialize first column
        for (int i = 0; i < m; i++) {
            dp[i][0] = 1;
        }
        
        // Fill the table
        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                dp[i][j] = dp[i-1][j] + dp[i][j-1];
            }
        }
        
        return dp[m-1][n-1];
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number} m
 * @param {number} n
 * @return {number}
 */
var uniquePaths = function(m, n) {
    const dp = Array.from({ length: m }, () => Array(n).fill(1));
    
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            dp[i][j] = dp[i-1][j] + dp[i][j-1];
        }
    }
    
    return dp[m-1][n-1];
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(m × n) - Fill the entire DP table |
| **Space** | O(m × n) - DP table storage |

---

## Approach 2: 1D DP Optimization

### Why It Works

We can optimize space by noticing that we only need the previous row to compute the current row. We can use a single 1D array where each cell represents the number of paths to reach that column in the current row.

### Code Implementation

````carousel
```python
class Solution:
    def uniquePaths_1d(self, m: int, n: int) -> int:
        """
        Find number of unique paths using 1D DP (space optimized).
        """
        dp = [1] * n  # Initialize all to 1 (first row)
        
        for i in range(1, m):
            for j in range(1, n):
                dp[j] += dp[j-1]
        
        return dp[n-1]
```

<!-- slide -->
```cpp
class Solution {
public:
    int uniquePaths(int m, int n) {
        vector<int> dp(n, 1);
        
        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                dp[j] += dp[j-1];
            }
        }
        
        return dp[n-1];
    }
};
```

<!-- slide -->
```java
class Solution {
    public int uniquePaths(int m, int n) {
        int[] dp = new int[n];
        Arrays.fill(dp, 1);
        
        for (int i = 1; i < m; i++) {
            for (int j = 1; j < n; j++) {
                dp[j] += dp[j-1];
            }
        }
        
        return dp[n-1];
    }
}
```

<!-- slide -->
```javascript
var uniquePaths = function(m, n) {
    const dp = new Array(n).fill(1);
    
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            dp[j] += dp[j-1];
        }
    }
    
    return dp[n-1];
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(m × n) |
| **Space** | O(n) - Single row |

---

## Approach 3: Combinatorics (Mathematical)

### Why It Works

The robot must make exactly (m-1) down moves and (n-1) right moves. The total number of moves is (m + n - 2). We need to choose which positions among these moves are down (or right). This is a combinations problem: C(m+n-2, m-1) or C(m+n-2, n-1).

### Code Implementation

````carousel
```python
import math

class Solution:
    def uniquePaths_math(self, m: int, n: int) -> int:
        """
        Find number of unique paths using combinatorics.
        
        The answer is C(m+n-2, m-1) which equals (m+n-2)! / ((m-1)! * (n-1)!)
        """
        return math.comb(m + n - 2, m - 1)
```

<!-- slide -->
```cpp
class Solution {
public:
    int uniquePaths(int m, int n) {
        // Use long to avoid overflow
        long result = 1;
        int N = m + n - 2;
        int K = m - 1;
        
        // Calculate N choose K
        for (int i = 1; i <= K; i++) {
            result = result * (N - K + i) / i;
        }
        
        return (int)result;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int uniquePaths(int m, int n) {
        long result = 1;
        int N = m + n - 2;
        int K = m - 1;
        
        for (int i = 1; i <= K; i++) {
            result = result * (N - K + i) / i;
        }
        
        return (int)result;
    }
}
```

<!-- slide -->
```javascript
var uniquePaths = function(m, n) {
    let result = 1;
    const N = m + n - 2;
    const K = m - 1;
    
    for (let i = 1; i <= K; i++) {
        result = result * (N - K + i) / i;
    }
    
    return Math.floor(result);
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(min(m, n)) - Computing combinations |
| **Space** | O(1) - Constant space |

---

## Comparison of Approaches

| Aspect | 2D DP | 1D DP | Combinatorics |
|--------|-------|-------|---------------|
| **Time Complexity** | O(m × n) | O(m × n) | O(min(m,n)) |
| **Space Complexity** | O(m × n) | O(n) | O(1) |
| **Implementation** | Simple | Moderate | Moderate |
| **LeetCode Optimal** | ✅ | ✅ | ✅ |

**Best Approach:** Combinatorics is most efficient for large grids. 1D DP is commonly used in interviews.

---

## Related Problems

### Related Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Unique Paths II | [Link](https://leetcode.com/problems/unique-paths-ii/) | With obstacles |
| Minimum Path Sum | [Link](https://leetcode.com/problems/minimum-path-sum/) | With costs |
| Dungeon Game | [Link](https://leetcode.com/problems/dungeon-game/) | With health |
| Cherry Pickup | [Link](https://leetcode.com/problems/cherry-pickup/) | Two robots |

### Pattern Reference

For more detailed explanations of the Dynamic Programming pattern, see:
- **[Dynamic Programming Pattern](/patterns/dynamic-programming)**

---

## Video Tutorial Links

### Recommended Tutorials

1. **[NeetCode - Unique Paths](https://www.youtube.com/watch?v=2PlV16v3X8w)** - Clear explanation
2. **[Unique Paths - LeetCode 62](https://www.youtube.com/watch?v=oP2GqvMt6Jk)** - Detailed walkthrough
3. **[Combinatorics Explanation](https://www.youtube.com/watch?v=UVxJfl3-vXS)** - Math approach

---

## Follow-up Questions

### Q1: How would you handle obstacles in the grid?

**Answer:** Add obstacle handling - if a cell has an obstacle, set dp[i][j] = 0. When computing transitions, skip cells with obstacles.

---

### Q2: What's the maximum grid size this can handle?

**Answer:** For DP approaches, both m and n up to 100 are manageable. For combinatorics, Python's math.comb handles large values; other languages need careful overflow handling.

---

### Q3: Can you reconstruct the actual paths?

**Answer:** Yes, you would need to store parent pointers or use backtracking. The DP table gives you counts but not the actual paths.

---

### Q4: How does this relate to Pascal's Triangle?

**Answer:** The unique paths form Pascal's triangle! Row (m+n-2) contains the path counts, where column (m-1) or (n-1) gives our answer.

---

## Summary

The **Unique Paths** problem demonstrates the **Dynamic Programming** pattern for grid path counting. The key is understanding that each cell's value depends on cells above and to the left.

### Key Takeaways

1. **DP Table**: dp[i][j] = number of paths to reach cell (i,j)
2. **Base Cases**: First row and column = 1 (only one way)
3. **Transition**: dp[i][j] = dp[i-1][j] + dp[i][j-1]
4. **Space Optimization**: Can use O(min(m,n)) space with two arrays
5. **Combinatorics**: C(m+n-2, m-1) gives mathematical solution

### Pattern Summary

This problem exemplifies the **Dynamic Programming - 2D Grid** pattern, characterized by:
- Building solution from subproblems
- Using table to store intermediate results
- Optimizing space from 2D to 1D

For more details on this pattern, see the **[Dynamic Programming](/patterns/dynamic-programming)**.

---

## Common Pitfalls

### 1. Not Initializing Base Cases
**Issue:** Forgetting to initialize first row and column to 1.

**Solution:** Either initialize explicitly or use list comprehension with 1s.

### 2. Wrong Loop Range
**Issue:** Starting loop from 0 instead of 1.

**Solution:** Start from row 1, col 1 to avoid index out of bounds.

### 3. Space Complexity
**Issue:** Using full 2D array when 1D array suffices.

**Solution:** Use two rows or single row with optimization.

### 4. Integer Overflow
**Issue:** Not using appropriate data types for large paths.

**Solution:** Use Python's arbitrary precision integers (handles automatically).
