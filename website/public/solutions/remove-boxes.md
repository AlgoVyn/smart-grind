# Remove Boxes

## Problem Description

You are given several boxes with different colors represented by different positive numbers.

You may experience several rounds to remove boxes until there is no box left. Each time you can choose some continuous boxes with the same color (i.e., composed of `k` boxes, `k >= 1`), remove them and get `k * k` points.

Return the maximum points you can get.

**Link to problem:** [Remove Boxes - LeetCode 546](https://leetcode.com/problems/remove-boxes/)

## Constraints
- `1 <= boxes.length <= 100`
- `1 <= boxes[i] <= 100`

---

## Pattern: DFS with Memoization (3D DP)

This problem uses **DFS with Memoization** where state is defined by (left, right, extra).

### Core Concept

- **State**: dp(l, r, k) = max points for boxes[l:r] with k extra boxes of same color as boxes[r]
- **Compression**: Merge consecutive same-color boxes to reduce state
- **Two Options**: Remove now or merge with earlier same-color boxes

---

## Examples

### Example

**Input:** boxes = [1,3,2,2,2,3,4,3,1]

**Output:** 23

**Explanation:** One optimal sequence: remove [3], then [1,3,1], then [2,2,2], then [3,4].

---

## Intuition

The key insight is:

1. **State Definition**: Track position and extra same-color boxes
2. **Compression**: Merge consecutive boxes to reduce state space
3. **Two Choices**: Either remove now or merge with earlier same colors

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **DFS with Memoization (Optimal)** - O(n³) time
2. **Bottom-up DP** - O(n³) time, O(n²) space

---

## Approach: DFS with Memoization

This is the standard and optimal solution.

### Algorithm Steps

1. Use memoization to cache results
2. For each state (l, r, k):
   - Compress consecutive same-color boxes at r
   - Option 1: Remove now → dp(l, r-1, 0) + (k+1)²
   - Option 2: Merge with earlier same-color → max over all i where boxes[i] == boxes[r]
3. Return maximum

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def removeBoxes(self, boxes: List[int]) -> int:
        n = len(boxes)
        memo = {}
        
        def dp(l, r, k):
            if l > r:
                return 0
            
            if (l, r, k) in memo:
                return memo[(l, r, k)]
            
            # Compress consecutive same-color boxes
            while r > l and boxes[r] == boxes[r - 1]:
                r -= 1
                k += 1
            
            # Option 1: Remove the group at r
            res = dp(l, r - 1, 0) + (k + 1) ** 2
            
            # Option 2: Merge with a previous box of same color
            for i in range(l, r):
                if boxes[i] == boxes[r]:
                    res = max(res, dp(l, i, k + 1) + dp(i + 1, r - 1, 0))
            
            memo[(l, r, k)] = res
            return res
        
        return dp(0, n - 1, 0)
```

<!-- slide -->
```cpp
class Solution {
public:
    int removeBoxes(vector<int>& boxes) {
        int n = boxes.size();
        memset(dp, 0, sizeof(dp));
        return dfs(boxes, 0, n - 1, 0);
    }
    
private:
    int dp[100][100][100];
    
    int dfs(vector<int>& boxes, int l, int r, int k) {
        if (l > r) return 0;
        if (dp[l][r][k]) return dp[l][r][k];
        
        // Compression
        while (r > l && boxes[r] == boxes[r - 1]) {
            r--;
            k++;
        }
        
        // Remove now
        int res = dfs(boxes, l, r - 1, 0) + (k + 1) * (k + 1);
        
        // Merge
        for (int i = l; i < r; i++) {
            if (boxes[i] == boxes[r]) {
                res = max(res, dfs(boxes, l, i, k + 1) + dfs(boxes, i + 1, r - 1, 0));
            }
        }
        
        return dp[l][r][k] = res;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int removeBoxes(int[] boxes) {
        int n = boxes.length;
        int[][][] dp = new int[100][100][100];
        return dfs(boxes, 0, n - 1, 0, dp);
    }
    
    private int dfs(int[] boxes, int l, int r, int k, int[][][] dp) {
        if (l > r) return 0;
        if (dp[l][r][k] != 0) return dp[l][r][k];
        
        // Compression
        while (r > l && boxes[r] == boxes[r - 1]) {
            r--;
            k++;
        }
        
        // Remove now
        int res = dfs(boxes, l, r - 1, 0, dp) + (k + 1) * (k + 1);
        
        // Merge
        for (int i = l; i < r; i++) {
            if (boxes[i] == boxes[r]) {
                res = Math.max(res, dfs(boxes, l, i, k + 1, dp) + 
                               dfs(boxes, i + 1, r - 1, 0, dp));
            }
        }
        
        return dp[l][r][k] = res;
    }
}
```

<!-- slide -->
```javascript
var removeBoxes = function(boxes) {
    const n = boxes.length;
    const memo = new Map();
    
    const dp = (l, r, k) => {
        if (l > r) return 0;
        const key = `${l},${r},${k}`;
        if (memo.has(key)) return memo.get(key);
        
        // Compression
        while (r > l && boxes[r] === boxes[r - 1]) {
            r--;
            k++;
        }
        
        // Remove now
        let res = dp(l, r - 1, 0) + (k + 1) * (k + 1);
        
        // Merge
        for (let i = l; i < r; i++) {
            if (boxes[i] === boxes[r]) {
                res = Math.max(res, dp(l, i, k + 1) + dp(i + 1, r - 1, 0));
            }
        }
        
        memo.set(key, res);
        return res;
    };
    
    return dp(0, n - 1, 0);
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n³) |
| **Space** | O(n³) |

---

## Approach 2: Bottom-up DP

This approach uses iterative dynamic programming instead of recursion. We build the solution from smaller subproblems to larger ones.

### Problem Description

Given the same problem of removing boxes to maximize points, solve it using bottom-up dynamic programming where we iteratively fill a DP table.

### Algorithm Steps

1. Preprocess the boxes array to compress consecutive same-color boxes
2. Create a 3D DP table `dp[l][r][k]` where:
   - `l` and `r` define the subarray range
   - `k` represents extra boxes of the same color as boxes[r] appended to the right
3. Fill the DP table for increasing subarray lengths
4. For each state, consider two options:
   - Remove the group at r immediately
   - Merge with earlier same-color boxes
5. Return `dp[0][n-1][0]`

### Why It Works

The bottom-up approach systematically builds solutions for all possible subproblems. By processing subarrays in increasing order of length, when we solve a larger subproblem, all smaller subproblems have already been computed. This ensures we have the necessary information to make optimal decisions.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def removeBoxes(self, boxes: List[int]) -> int:
        n = len(boxes)
        if n == 0:
            return 0
        
        # Preprocess: compress consecutive same-color boxes
        compressed = []
        for box in boxes:
            if compressed and compressed[-1] == box:
                compressed[-1] += 1
            else:
                compressed.append(box)
        
        n = len(compressed)
        colors = [0] * n
        counts = [0] * n
        
        j = 0
        for box in compressed:
            colors[j] = box if isinstance(box, int) else box[0] if isinstance(box, tuple) else box
            counts[j] = box if isinstance(box, int) else (box[1] if isinstance(box, tuple) else 1)
            j += 1
        
        # Recompress properly
        new_colors = []
        new_counts = []
        for i in range(n):
            if counts[i] > 0:
                new_colors.append(colors[i])
                new_counts.append(counts[i])
        
        colors = new_colors
        counts = new_counts
        n = len(colors)
        
        if n == 0:
            return 0
        
        # 3D DP: dp[l][r][k] = max points for boxes[l:r] with k extra boxes
        dp = [[[0] * (n + 1) for _ in range(n)] for _ in range(n)]
        
        # Fill DP table
        for length in range(1, n + 1):
            for l in range(n - length + 1):
                r = l + length - 1
                
                # Add counts[r] to k
                k = counts[r]
                
                # Option 1: Remove boxes[r] with its count
                dp[l][r][k] = dp[l][r-1][0] + counts[r] * counts[r]
                
                # Option 2: Try merging with earlier same-color boxes
                for i in range(l, r):
                    if colors[i] == colors[r]:
                        dp[l][r][k] = max(
                            dp[l][r][k],
                            dp[l][i][counts[r]] + dp[i+1][r-1][0]
                        )
        
        return dp[0][n-1][counts[n-1]]
```

<!-- slide -->
```cpp
class Solution {
public:
    int removeBoxes(vector<int>& boxes) {
        int n = boxes.size();
        if (n == 0) return 0;
        
        // Preprocess: compress consecutive same-color boxes
        vector<pair<int, int>> compressed;
        for (int box : boxes) {
            if (!compressed.empty() && compressed.back().first == box) {
                compressed.back().second++;
            } else {
                compressed.push_back({box, 1});
            }
        }
        
        int n2 = compressed.size();
        vector<int> colors(n2), counts(n2);
        for (int i = 0; i < n2; i++) {
            colors[i] = compressed[i].first;
            counts[i] = compressed[i].second;
        }
        
        // 3D DP
        vector<vector<vector<int>>> dp(n2, 
            vector<vector<int>>(n2, vector<int>(n2 + 1, 0)));
        
        for (int len = 1; len <= n2; len++) {
            for (int l = 0; l + len - 1 < n2; l++) {
                int r = l + len - 1;
                int k = counts[r];
                
                // Remove now
                dp[l][r][k] = (l <= r-1 ? dp[l][r-1][0] : 0) + counts[r] * counts[r];
                
                // Merge with earlier same colors
                for (int i = l; i < r; i++) {
                    if (colors[i] == colors[r]) {
                        dp[l][r][k] = max(dp[l][r][k], 
                            dp[l][i][counts[r]] + (i+1 <= r-1 ? dp[i+1][r-1][0] : 0));
                    }
                }
            }
        }
        
        return dp[0][n2-1][counts[n2-1]];
    }
};
```

<!-- slide -->
```java
class Solution {
    public int removeBoxes(int[] boxes) {
        int n = boxes.length;
        if (n == 0) return 0;
        
        // Preprocess: compress consecutive same-color boxes
        List<int[]> compressed = new ArrayList<>();
        for (int box : boxes) {
            if (!compressed.isEmpty() && compressed.get(compressed.size()-1)[0] == box) {
                compressed.get(compressed.size()-1)[1]++;
            } else {
                compressed.add(new int[]{box, 1});
            }
        }
        
        int n2 = compressed.size();
        int[] colors = new int[n2];
        int[] counts = new int[n2];
        for (int i = 0; i < n2; i++) {
            colors[i] = compressed.get(i)[0];
            counts[i] = compressed.get(i)[1];
        }
        
        // 3D DP
        int[][][] dp = new int[n2][n2][n2 + 1];
        
        for (int len = 1; len <= n2; len++) {
            for (int l = 0; l + len - 1 < n2; l++) {
                int r = l + len - 1;
                int k = counts[r];
                
                // Remove now
                dp[l][r][k] = (l <= r - 1 ? dp[l][r-1][0] : 0) + counts[r] * counts[r];
                
                // Merge with earlier same colors
                for (int i = l; i < r; i++) {
                    if (colors[i] == colors[r]) {
                        dp[l][r][k] = Math.max(dp[l][r][k], 
                            dp[l][i][counts[r]] + (i + 1 <= r - 1 ? dp[i+1][r-1][0] : 0));
                    }
                }
            }
        }
        
        return dp[0][n2-1][counts[n2-1]];
    }
}
```

<!-- slide -->
```javascript
var removeBoxes = function(boxes) {
    const n = boxes.length;
    if (n === 0) return 0;
    
    // Preprocess: compress consecutive same-color boxes
    const compressed = [];
    for (const box of boxes) {
        if (compressed.length > 0 && compressed[compressed.length - 1][0] === box) {
            compressed[compressed.length - 1][1]++;
        } else {
            compressed.push([box, 1]);
        }
    }
    
    const n2 = compressed.length;
    const colors = compressed.map(c => c[0]);
    const counts = compressed.map(c => c[1]);
    
    // 3D DP
    const dp = Array.from({ length: n2 }, () =>
        Array.from({ length: n2 }, () =>
            Array(n2 + 1).fill(0)
        )
    );
    
    for (let len = 1; len <= n2; len++) {
        for (let l = 0; l + len - 1 < n2; l++) {
            const r = l + len - 1;
            const k = counts[r];
            
            // Remove now
            dp[l][r][k] = (l <= r - 1 ? dp[l][r-1][0] : 0) + counts[r] * counts[r];
            
            // Merge with earlier same colors
            for (let i = l; i < r; i++) {
                if (colors[i] === colors[r]) {
                    dp[l][r][k] = Math.max(
                        dp[l][r][k],
                        dp[l][i][counts[r]] + (i + 1 <= r - 1 ? dp[i+1][r-1][0] : 0)
                    );
                }
            }
        }
    }
    
    return dp[0][n2-1][counts[n2-1]];
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n³) |
| **Space** | O(n³) |

---

## Comparison of Approaches

| Aspect | DFS with Memoization | Bottom-up DP |
|--------|---------------------|-------------|
| **Implementation** | Recursive | Iterative |
| **Time Complexity** | O(n³) | O(n³) |
| **Space Complexity** | O(n³) | O(n³) |
| **Stack Usage** | O(h) recursive stack | O(1) |
| **Cache Efficiency** | Lazy evaluation | Eager evaluation |

**Best Approach:** Both approaches have the same time complexity. DFS with Memoization is more commonly used due to its simplicity, but Bottom-up DP avoids recursion stack overhead.

## Why It Works

The 3D DP works because:

1. **State Captures All Info**: l, r define range, k captures extra same-color boxes
2. **Compression Reduces State**: Consecutive same colors merged
3. **Two Choices Cover All**: Either remove now or merge for future

---

## Related Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Minimum Cost to Remove Boxes | [Link](https://leetcode.com/problems/minimum-cost-to-remove-boxes/) | Similar DP |
| Strange Printer | [Link](https://leetcode.com/problems/strange-printer/) | Similar pattern |

---

## Video Tutorial Links

- [NeetCode - Remove Boxes](https://www.youtube.com/watch?v=7C_f7fD2p14) - Clear explanation

---

## Follow-up Questions

### Q1: Why use 3D DP?

**Answer:** Need to track (left, right, extra) to capture all state information.

### Q2: What does compression do?

**Answer:** Merges consecutive same-color boxes to reduce state space.

---

## Common Pitfalls

### 1. State Key Collision
**Issue**: Using wrong tuple as dictionary key in Python.

**Solution**: Use tuple `(l, r, k)` as key since it's hashable. Don't use list.

### 2. Compression Order
**Issue**: Compressing in wrong order or not at all.

**Solution**: Always compress consecutive same-color boxes at the right end before making recursive calls.

### 3. Off-by-One Errors
**Issue**: Incorrect range boundaries in recursion.

**Solution**: Be careful with l > r base case - should return 0 when l > r.

### 4. Large 3D Array
**Issue**: Memory issues with 100x100x100 array.

**Solution**: Use dictionary/memoization for sparse states, or ensure array fits in memory.

### 5. Integer Overflow
**Issue**: Not using appropriate types for large values.

**Solution**: In Python this is handled automatically, but in C++/Java use long for results.

---

## Summary

The **Remove Boxes** problem demonstrates **3D DP with Memoization**:
- Two approaches: DFS with Memoization and Bottom-up DP
- State: dp(l, r, k) with extra same-color boxes
- Compress consecutive boxes
- Two options: remove now or merge
- O(n³) time and space

Both approaches achieve the same complexity. DFS with Memoization is more intuitive, while Bottom-up DP avoids recursion overhead.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/remove-boxes/discuss/)
